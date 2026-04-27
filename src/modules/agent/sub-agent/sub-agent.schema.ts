import { REGEX } from '@/utils/constants.util';
import { PaymentType } from '@prisma/client';
import z from 'zod';

export const SubAgentSchema = {
  // ─── Create Sub Agent ───
  createSubAgent: z.object({
    fullName: z
      .string({
        error: (issue) =>
          issue.input === '' ? 'Full name is required' : 'Invalid full name',
      })
      .min(3, 'Full name must be at least 3 characters'),
    email: z
      .email({
        error: (issue) =>
          issue.input === '' ? 'Email is required' : 'Invalid email address',
      })
      .trim()
      .refine((val) => !REGEX.FORBIDDEN_CODE.test(val), {
        error: 'Invalid input: Code-like content is not allowed',
      }),
    phone: z
      .string()
      .trim()
      .refine((val) => REGEX.PHONE.test(val), {
        error: 'Invalid input: Phone number is not valid',
      })
      .refine((val) => !REGEX.FORBIDDEN_CODE.test(val), {
        error: 'Invalid input: Code-like content is not allowed',
      })
      .optional(),
    companyName: z.string().min(2, 'Company name is required').optional(),
    cnic: z
      .string()
      .min(13, 'CNIC must be at least 13 digits')
      .max(15, 'CNIC cannot exceed 15 characters')
      .trim()
      .refine((val) => REGEX.CNIC.test(val), {
        error:
          'Invalid input: Format must be xxxxxxxxxxxxxx or xxxxx-xxxxxxx-x',
      })
      .refine((val) => !REGEX.FORBIDDEN_CODE.test(val), {
        error: 'Invalid input: Code-like content is not allowed',
      }),
    commission: z
      .number({
        error: (issue) =>
          issue.input === undefined
            ? 'Commission is required'
            : 'Commission must be a number',
      })
      .min(0, 'Commission cannot be negative')
      .max(100, 'Commission cannot exceed 100%'),
    paymentType: z.enum(PaymentType, {
      error: (issue) =>
        issue.input === undefined
          ? 'Payment Type is required'
          : `Payment Type must be one of ${Object.values(PaymentType).join(
              ', ',
            )}`,
    }),
  }),

  // ─── Get Sub Agents ───
  getSubAgentsSchema: z.object({
    page: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? 'Page is required'
            : 'Page must be a string',
      })
      .optional(),
    limit: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? 'Limit is required'
            : 'Limit must be a string',
      })
      .optional(),
    startDate: z.preprocess(
      (arg) => (typeof arg === 'string' ? new Date(arg) : arg),
      z.date().optional(),
    ),
    endDate: z.preprocess(
      (arg) => (typeof arg === 'string' ? new Date(arg) : arg),
      z.date().optional(),
    ),
  }),
};

export type CreateSubAgentFormType = z.infer<
  typeof SubAgentSchema.createSubAgent
>;
export type GetSubAgentsFormType = z.infer<
  typeof SubAgentSchema.getSubAgentsSchema
>;
