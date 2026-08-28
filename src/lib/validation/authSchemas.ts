import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Please provide a valid email address').min(5),
  password: z.string().min(6, 'Password must be at least 6 characters long')
});

export const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long').max(70),
  email: z.string().email('Please provide a valid email address').min(5),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  phone: z.string().min(7, 'Please enter a valid mobile number').max(25).optional().or(z.literal('')),
  handle: z.string().min(2, 'Handle must be at least 2 characters long').max(40).optional(),
  dateOfBirth: z.string().optional(),
  timeOfBirth: z.string().optional(),
  placeOfBirth: z.string().optional(),
  gender: z.enum(['Male', 'Female', 'Non-Binary', 'Other', 'Prefer not to say']).optional(),
  zodiacSign: z.string().optional(),
  avatar: z.string().url().or(z.string().startsWith('data:image/')).or(z.literal('')).optional(),
  location: z.string().optional(),
  bio: z.string().max(300).optional()
});

export const PasswordResetSchema = z.object({
  email: z.string().email('Please provide a valid email address')
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type PasswordResetInput = z.infer<typeof PasswordResetSchema>;
