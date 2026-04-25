import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { enquirySchema } from '@/lib/validation';

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
  }

  const result = enquirySchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { success: false, errors: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { name, email, phone, message } = result.data;

  try {
    if (!process.env.RESEND_API_KEY || !process.env.ADMIN_EMAIL) {
      console.warn('--- ENQUIRY RECEIVED (Email Service Not Configured) ---');
      console.warn(`Name: ${name}`);
      console.warn(`Email: ${email}`);
      console.warn(`Phone: ${phone}`);
      console.warn(`Message: ${message}`);
      console.warn('-------------------------------------------------------');
      return NextResponse.json({ success: true, warning: 'Email not configured. Lead logged to console.' });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'LODHA SADAHALLI Enquiry <onboarding@resend.dev>',
      to: process.env.ADMIN_EMAIL,
      subject: `New Enquiry from ${name} — LODHA SADAHALLI`,
      html: `
        <h2>New Enquiry — LODHA SADAHALLI</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br/>')}</p>
      `,
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Resend error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to send enquiry. Please try again or contact us via WhatsApp.' },
      { status: 500 }
    );
  }
}
