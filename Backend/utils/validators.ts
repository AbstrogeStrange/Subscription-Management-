import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string()
    .regex(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
    .or(z.string().regex(/^\+91[0-9]{10}$/, 'Invalid Indian phone number format')),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  plan: z.enum(['free', 'premium', 'lifetime']).default('free'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const billingAddressSchema = z.object({
  streetAddress: z.string().min(5, 'Street address must be at least 5 characters').max(200),
  city: z.string().min(2, 'City must be at least 2 characters').max(100),
  state: z.string().min(2, 'State must be at least 2 characters').max(100),
  postalCode: z.string()
    .regex(/^[0-9]{6}$/, 'Postal code must be exactly 6 digits'),
  country: z.string().default('India'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type BillingAddressInput = z.infer<typeof billingAddressSchema>;
// ...existing code...

export const SubscriptionInputSchema = z.object({
  name: z.string().min(1, "Subscription name is required"),
  category: z.string().optional(),
  amount: z.number().positive("Amount must be positive"),
  billingCycle: z.enum(["weekly", "monthly", "yearly", "custom"]),
  nextBillingDate: z.string().or(z.date()),
  paymentMethod: z.string().optional(),
  notes: z.string().optional(),
});

export const UpdateSubscriptionInputSchema = z.object({
  name: z.string().min(1).optional(),
  category: z.string().optional(),
  amount: z.number().positive().optional(),
  billingCycle: z.enum(["weekly", "monthly", "yearly", "custom"]).optional(),
  nextBillingDate: z.string().or(z.date()).optional(),
  paymentMethod: z.string().optional(),
  notes: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type SubscriptionInput = z.infer<typeof SubscriptionInputSchema>;
export type UpdateSubscriptionInput = z.infer<typeof UpdateSubscriptionInputSchema>;

// ...existing code...