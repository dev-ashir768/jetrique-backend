import { PaymentType } from '@prisma/client';
import z from 'zod';

// ─── Get Commission Logs ───
export const getCommissionLogsSchema = z.object({
  search: z
    .string({
      error: (issue) =>
        issue?.input === undefined
          ? 'Search is required'
          : 'Search must be a string',
    })
    .optional(),
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
});

// ─── Get Payment Type Logs ───
export const getPaymentTypeLogsSchema = z.object({
  status: z
    .enum(PaymentType, {
      error: (issue) =>
        issue?.input === undefined
          ? 'Status is required'
          : `Status must be one of ${Object.values(PaymentType).join(', ')}`,
    })
    .optional(),
  search: z
    .string({
      error: (issue) =>
        issue?.input === undefined
          ? 'Search is required'
          : 'Search must be a string',
    })
    .optional(),
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
});

export type GetCommissionLogsFormType = z.infer<typeof getCommissionLogsSchema>;
export type GetPaymentTypeLogsFormType = z.infer<
  typeof getPaymentTypeLogsSchema
>;
