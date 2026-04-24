import { AgentStatus, PaymentType } from '@prisma/client';
import z from 'zod';

// ─── Get Commission Logs ───
export const getCommissionLogsSchema = z
  .object({
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
    startDate: z.preprocess(
      (arg) => (typeof arg === 'string' ? new Date(arg) : arg),
      z.date().optional(),
    ),
    endDate: z.preprocess(
      (arg) => (typeof arg === 'string' ? new Date(arg) : arg),
      z.date().optional(),
    ),
  })
  .superRefine((data, ctx) => {
    if (data.startDate && data.endDate) {
      if (data.startDate > data.endDate) {
        ctx.addIssue({
          code: 'custom',
          message: 'Start Date must be before End Date',
          path: ['startDate'],
        });
      }
    }
  });

// ─── Get Payment Type Logs ───
export const getPaymentTypeLogsSchema = z
  .object({
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
    startDate: z.preprocess(
      (arg) => (typeof arg === 'string' ? new Date(arg) : arg),
      z.date().optional(),
    ),
    endDate: z.preprocess(
      (arg) => (typeof arg === 'string' ? new Date(arg) : arg),
      z.date().optional(),
    ),
  })
  .superRefine((data, ctx) => {
    if (data.startDate && data.endDate) {
      if (data.startDate > data.endDate) {
        ctx.addIssue({
          code: 'custom',
          message: 'Start Date must be before End Date',
          path: ['startDate'],
        });
      }
    }
  });

// ─── Get Agent Status Logs ───
export const getAgentStatusLogsSchema = z
  .object({
    status: z
      .enum(AgentStatus, {
        error: (issue) =>
          issue.input === undefined
            ? 'Status is required'
            : `Status must be one of ${Object.values(AgentStatus).join(', ')}`,
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
    startDate: z.preprocess(
      (arg) => (typeof arg === 'string' ? new Date(arg) : arg),
      z.date().optional(),
    ),
    endDate: z.preprocess(
      (arg) => (typeof arg === 'string' ? new Date(arg) : arg),
      z.date().optional(),
    ),
  })
  .superRefine((data, ctx) => {
    if (data.startDate && data.endDate) {
      if (data.startDate > data.endDate) {
        ctx.addIssue({
          code: 'custom',
          message: 'Start Date must be before End Date',
          path: ['startDate'],
        });
      }
    }
  });

export type GetCommissionLogsFormType = z.infer<typeof getCommissionLogsSchema>;
export type GetPaymentTypeLogsFormType = z.infer<
  typeof getPaymentTypeLogsSchema
>;
export type GetAgentStatusLogsFormType = z.infer<
  typeof getAgentStatusLogsSchema
>;
