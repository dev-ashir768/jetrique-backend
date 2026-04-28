import { AgentStatus, PaymentType } from '@prisma/client';
import z from 'zod';

export const adminAgentSchema = {
  // ─── Update Agent Status ───
  updateAgentStatusSchema: z
    .object({
      commission: z
        .number({
          error: (issue) =>
            issue.input === undefined
              ? 'Commission is required'
              : 'Commission must be a number',
        })
        .min(0, 'Commission cannot be negative')
        .max(100, 'Commission cannot exceed 100%')
        .optional(),
      paymentType: z
        .enum(PaymentType, {
          error: (issue) =>
            issue.input === undefined
              ? 'Payment Type is required'
              : `Payment Type must be one of ${Object.values(PaymentType).join(
                  ', ',
                )}`,
        })
        .optional(),
      status: z.enum(AgentStatus, {
        error: (issue) =>
          issue.input === undefined
            ? 'Status is required'
            : `Status must be one of ${Object.values(AgentStatus).join(', ')}`,
      }),
      reason: z
        .string({
          error: (issue) =>
            issue.input === ''
              ? 'Reason is required'
              : 'Reason must be a string',
        })
        .min(10, 'Reason must be at least 10 characters')
        .max(500, 'Reason cannot exceed 500 characters')
        .optional(),
    })
    .superRefine((data, ctx) => {
      if (data.status === 'APPROVED' && data.commission === undefined) {
        ctx.addIssue({
          code: 'custom',
          path: ['commission'],
          message: 'Commission is required when approving agent',
        });
      }
      if (data.status === 'REJECTED' && !data.reason) {
        ctx.addIssue({
          code: 'custom',
          path: ['reason'],
          message: 'Reason is required when rejecting agent',
        });
      }
      if (data.status === 'APPROVED' && data.paymentType === undefined) {
        ctx.addIssue({
          code: 'custom',
          path: ['paymentType'],
          message: 'Payment type is required when approving agent',
        });
      }
      if (data.status === 'REJECTED' && data.paymentType !== undefined) {
        ctx.addIssue({
          code: 'custom',
          path: ['paymentType'],
          message: 'Payment type is not required when rejecting agent',
        });
      }
      if (data.status === 'REJECTED' && data.commission !== undefined) {
        ctx.addIssue({
          code: 'custom',
          path: ['commission'],
          message: 'Commission is not required when rejecting agent',
        });
      }
    }),

  // ─── Update Agent Finance ───
  updateAgentFinanceSchema: z.object({
    commission: z
      .number({
        error: (issue) =>
          issue.input === undefined
            ? 'Commission is required'
            : 'Commission must be a number',
      })
      .min(0, 'Commission cannot be negative')
      .max(100, 'Commission cannot exceed 100%')
      .optional(),
    paymentType: z
      .enum(PaymentType, {
        error: (issue) =>
          issue.input === undefined
            ? 'Payment Type is required'
            : `Payment Type must be one of ${Object.values(PaymentType).join(
                ', ',
              )}`,
      })
      .optional(),
    reason: z
      .string({
        error: (issue) =>
          issue.input === '' ? 'Reason is required' : 'Reason must be a string',
      })
      .min(10, 'Reason must be at least 10 characters')
      .max(500, 'Reason cannot exceed 500 characters'),
  }),
};

export type UpdateAgentStatusFormType = z.infer<
  typeof adminAgentSchema.updateAgentStatusSchema
>;
export type UpdateAgentFinanceFormType = z.infer<
  typeof adminAgentSchema.updateAgentFinanceSchema
>;
