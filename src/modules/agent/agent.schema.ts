import { AgentStatus } from '@prisma/client';
import z from 'zod';

// ─── Get Agents ───
export const getAgentsSchema = z.object({
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
});

export type GetAgentsFormType = z.infer<typeof getAgentsSchema>;
