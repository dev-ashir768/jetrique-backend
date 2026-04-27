import { Prisma } from '@prisma/client';
import { GetPermissionsFormType } from './permission.schema';
import { endOfDay, startOfDay } from 'date-fns';
import { JWTAccessTokenType } from '@/types';
import { prisma } from '@/config/db.config';

export const PermissionService = {
  // ─── Get Permissions ───
  getPermissions: async (
    query: GetPermissionsFormType,
    requestingUser: JWTAccessTokenType,
  ) => {
    const { endDate, limit = '10', page = '1', startDate, status } = query;
    const { roleId } = requestingUser;

    const take = parseInt(limit);
    const skip = (parseInt(page) - 1) * take;

    const permissionFilter: Prisma.PermissionWhereInput = {
      isActive: true,
      parentId: null,
      ...(status && { type: status }),
      ...(startDate && { createdAt: { gte: startOfDay(startDate) } }),
      ...(endDate && { createdAt: { lte: endOfDay(endDate) } }),
    };

    const whereClause: Prisma.RolePermissionWhereInput = {
      roleId,
      permission: permissionFilter,
    };

    const [rolePermissions, total] = await prisma.$transaction([
      prisma.rolePermission.findMany({
        where: whereClause,
        select: {
          permission: {
            include: {
              children: {
                where: { isActive: true },
                orderBy: { createdAt: 'asc' },
              },
            },
          },
        },
        take,
        skip,
        orderBy: { permission: { createdAt: 'asc' } },
      }),

      prisma.rolePermission.count({ where: whereClause }),
    ]);

    return {
      permission: rolePermissions.map((item) => item.permission),
      meta: {
        total,
        page: Number(page),
        limit: Number(take),
        totalPages: Math.ceil(total / take),
      },
    };
  },
};
