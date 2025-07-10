import {z} from 'zod';

/**
 * @fileOverview Shared types and schemas for the application.
 */

export const EarlyAccessRequestSchema = z.object({
  email: z.string().email({message: 'Please enter a valid email address.'}),
  company: z
    .string()
    .min(2, {message: 'Company name must be at least 2 characters.'}),
  intendedUse: z
    .string()
    .min(10, {message: 'Please describe your intended use case.'}),
  timeline: z
    .string()
    .nonempty({message: 'Please select an integration timeline.'}),
});

export type EarlyAccessRequest = z.infer<typeof EarlyAccessRequestSchema>;
