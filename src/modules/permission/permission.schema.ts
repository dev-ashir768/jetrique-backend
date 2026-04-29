import { PermissionType } from '@prisma/client';
import z from 'zod';

export const permissionSchema = {
  // ─── Get Permissions ───
  getPermissions: z
    .object({
      status: z
        .enum(PermissionType, {
          error: (issue) =>
            issue.input === undefined
              ? 'Status is required'
              : `Status must be one of ${Object.values(PermissionType).join(', ')}`,
        })
        .optional(),
      page: z
        .string({
          error: (issue) => (issue.input === undefined ? 'Page is required' : 'Page must be a string'),
        })
        .optional(),
      limit: z
        .string({
          error: (issue) => (issue.input === undefined ? 'Limit is required' : 'Limit must be a string'),
        })
        .optional(),
      startDate: z.preprocess((arg) => (typeof arg === 'string' ? new Date(arg) : arg), z.date().optional()),
      endDate: z.preprocess((arg) => (typeof arg === 'string' ? new Date(arg) : arg), z.date().optional()),
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
    }),
};

export type GetPermissionsFormType = z.infer<typeof permissionSchema.getPermissions>;
