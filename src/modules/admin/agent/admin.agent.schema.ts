import { AccountStatus } from 'generated/prisma';
import z from 'zod';

// // ─── Approve Agent ───
// export const approveAgentSchema = z.object({
//   // commission: z
//   //   .number({
//   //     error: (issue) =>
//   //       issue.input === undefined
//   //         ? "Commission is required"
//   //         : "Commission must be a number",
//   //   })
//   //   .min(0, "Commission cannot be negative")
//   //   .max(100, "Commission cannot exceed 100%"),
//   status: z.enum([AccountStatus.APPROVED], {
//     error: (issue) =>
//       issue.input === undefined
//         ? "Status is required"
//         : `Status must be ${Object.values(AccountStatus).join(", ")}`,
//   }),
// });

// // ─── Reject Agent ───
// export const rejectAgentSchema = z.object({
//   reason: z
//     .string({
//       error: (issue) =>
//         issue.input === undefined
//           ? "Rejection reason is required"
//           : "Rejection reason must be a string",
//     })
//     .min(10, "Rejection reason must be at least 10 characters")
//     .max(500, "Rejection reason cannot exceed 500 characters"),

//   status: z.enum([AccountStatus.REJECTED], {
//     error: (issue) =>
//       issue.input === undefined
//         ? "Status is required"
//         : `Status must be ${Object.values(AccountStatus).join(", ")}`,
//   }),
// });

// // ─── Suspend Agent ───
// export const suspendAgentSchema = z.object({
//   reason: z
//     .string({
//       error: (issue) =>
//         issue.input === undefined
//           ? "Suspension reason is required"
//           : "Suspension reason must be a string",
//     })
//     .min(10, "Suspension reason must be at least 10 characters")
//     .max(500, "Suspension reason cannot exceed 500 characters"),

//   status: z.enum([AccountStatus.SUSPENDED], {
//     error: (issue) =>
//       issue.input === undefined
//         ? "Status is required"
//         : `Status must be ${Object.values(AccountStatus).join(", ")}`,
//   }),
// });

// ─── Agent Status ───
export const agentStatusSchema = z
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
    status: z.enum(AccountStatus, {
      error: (issue) =>
        issue.input === undefined
          ? 'Status is required'
          : `Status must be ${Object.values(AccountStatus).join(', ')}`,
    }),
    reason: z
      .string({
        error: (issue) =>
          issue.input === '' ? 'Reason is required' : 'Reason must be a string',
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
  });

// export type ApproveAgentFormType = z.infer<typeof approveAgentSchema>;
// export type RejectAgentFormType = z.infer<typeof rejectAgentSchema>;
// export type SuspendAgentFormType = z.infer<typeof suspendAgentSchema>;

export type AgentStatusFormType = z.infer<typeof agentStatusSchema>;
