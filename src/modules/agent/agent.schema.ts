import { REGEX } from '@/utils/constants.util';
import { AgentStatus, PaymentType } from '@prisma/client';
import z from 'zod';

export const agentSchema = {
  // ─── Get Agents ───
  getAgentsSchema: z.object({
    status: z
      .enum(AgentStatus, {
        error: (issue) =>
          issue.input === undefined
            ? 'Status is required'
            : `Status must be one of ${Object.values(AgentStatus).join(', ')}`,
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
          issue?.input === undefined
            ? 'Page is required'
            : 'Page must be a string',
      })
      .optional(),
    limit: z
      .string({
        error: (issue) =>
          issue?.input === undefined
            ? 'Limit is required'
            : 'Limit must be a string',
      })
      .optional(),
  }),
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
};

export type GetAgentsFormType = z.infer<typeof agentSchema.getAgentsSchema>;
export type UpdateAgentStatusFormType = z.infer<
  typeof agentSchema.updateAgentStatusSchema
>;
export type UpdateAgentFinanceFormType = z.infer<
  typeof agentSchema.updateAgentFinanceSchema
>;
export type CreateSubAgentFormType = z.infer<typeof agentSchema.createSubAgent>;
