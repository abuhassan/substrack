// lib/validators/subscription.ts
import { z } from 'zod';

export const subscriptionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be a positive number'),
  currency: z.string().default('MYR'),
  billingCycle: z.enum(['MONTHLY', 'QUARTERLY', 'BIANNUAL', 'ANNUAL', 'CUSTOM']),
  startDate: z.date(),
  nextBillingDate: z.date(),
  category: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  logo: z.string().optional(),
  status: z.enum(['ACTIVE', 'PAUSED', 'CANCELED', 'TRIAL']).default('ACTIVE'),
});

export type SubscriptionInput = z.infer<typeof subscriptionSchema>;