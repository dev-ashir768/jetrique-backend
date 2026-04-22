import { prisma } from '@/config/db.config';

export const roleService = {
  getRoleById: async (roleId: number) => {
    return prisma.role.findFirst({
      where: {
        id: roleId,
      },
    });
  },
  getAllRoles: async () => {
    return prisma.role.findMany();
  },
};
