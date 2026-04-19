import { z } from 'zod';

export const enquirySchema = z.object({
  name: z.string().min(1, 'Full name is required').max(100),
  email: z.string().email('Invalid email address'),
  phone: z
    .string()
    .min(7, 'Phone number is required')
    .max(20)
    .regex(/^[+\d\s\-()\\.]+$/, 'Invalid phone number'),
  message: z.string().min(1, 'Message is required').max(2000),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;
