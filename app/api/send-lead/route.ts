import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

const leadSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  context: z.string().optional(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
  }

  const result = leadSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { success: false, error: 'Invalid fields provided.' },
      { status: 400 }
    );
  }

  const { name, email, phone, context } = result.data;

  try {
    if (!process.env.RESEND_API_KEY || !process.env.ADMIN_EMAIL) {
      console.warn('--- LEAD CAPTURED (Email Service Not Configured) ---');
      console.warn(`Source: ${context || 'Website Form'}`);
      console.warn(`Name: ${name}`);
      console.warn(`Email: ${email}`);
      console.warn(`Phone: ${phone}`);
      console.warn('----------------------------------------------------');
      return NextResponse.json({ success: true, warning: 'Email not configured. Lead logged to console.' });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'LODHA SADAHALLI Lead Capture <onboarding@resend.dev>',
      to: process.env.ADMIN_EMAIL,
      subject: `New Lead: ${context || 'Website Form'} — LODHA SADAHALLI`,
      html: `
        <h2>New Lead Capture — LODHA SADAHALLI</h2>
        <p><strong>Source / Context:</strong> ${context || 'Website Form'}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
      `,
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Resend error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to save lead. Please try again or contact us via WhatsApp.' },
      { status: 500 }
    );
  }
}
