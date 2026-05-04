import { prisma } from '@/config/db.config';
import { LoggedInUser } from '@/types';
import { Prisma, UserRole } from '@prisma/client';

export const roleService = {
  getRoleById: async (roleId: number) => {
    return prisma.role.findFirst({
      where: {
        id: roleId,
      },
    });
  },
  getAllRoles: async (loggedInUser: LoggedInUser) => {
    const { roleSlug } = loggedInUser;

    const where: Prisma.RoleWhereInput = {
      deletedAt: null,
      isActive: true,
      ...(roleSlug === UserRole.super_admin && {}),
      ...(roleSlug === UserRole.psa && {
        slug: { in: [UserRole.individual_agent] },
      }),
      ...(roleSlug !== UserRole.super_admin && roleSlug !== UserRole.psa && { id: 0 }),
    };

    const result = await prisma.role.findMany({
      where,
      orderBy: { createdBy: 'desc' },
    });

    return {
      message: 'Roles fetched successfully',
      data: result,
    };
  },
  getRoleLookup: async () => {
    const result = await prisma.role.findMany({
      where: {
        deletedAt: null,
        isActive: true,
        slug: { in: [UserRole.individual_agent, UserRole.psa] },
      },
    });

    return {
      message: 'Roles fetched successfully',
      data: result,
    };
  },
};
