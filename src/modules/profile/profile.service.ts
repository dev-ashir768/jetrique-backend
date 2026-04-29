import { LoggedInUser } from '@/types';
import { UpdateProfileFormType } from './profile.schema';
import { prisma } from '@/config/db.config';
import { AppError } from '@/middleware/error.middleware';
import { StatusCodes } from 'http-status-codes';
import { tr } from 'zod/v4/locales';
import { Prisma } from '@prisma/client';

export const profileService = {
  // ─── Update Profile ───
  updateProfile: async (payload: UpdateProfileFormType, loggedInUser: LoggedInUser) => {
    const { companyName, fullName, phone } = payload;
    const { userId } = loggedInUser;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { agentId: true, role: { select: { slug: true } } },
    });

    if (!user) throw new AppError('User not found', StatusCodes.NOT_FOUND);

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { ...(fullName && { fullName }), ...(phone && { phone }) },
      });

      if (user?.agentId) {
        await tx.agent.update({
          where: { id: user?.agentId! },
          data: { ...(fullName && { fullName }), ...(phone && { phone }), ...(companyName && { companyName }) },
        });
      }
    });

    return { payload };
  },

  // ─── Get Current User Profile ───
  getProfile: async (loggedInUser: LoggedInUser) => {
    const { userId } = loggedInUser;

    const user = await prisma.user.findUnique({
      where: { id: userId, isActive: true, deletedAt: null },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        roleId: true,
        role: { select: { id: true, slug: true, name: true } },
        agent: {
          select: {
            id: true,
            fullName: true,
            companyName: true,
            phone: true,
            cnic: true,
            commission: true,
            paymentType: true,
            status: true,
            agentStatusLogs: {
              select: { status: true, createdAt: true, changedBy: true, reason: true, agentId: true },
            },
            psaId: true,
          },
        },
        status: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        createdBy: true,
        updatedBy: true,
        deletedBy: true,
        isActive: true,
      },
    });

    if (!user) throw new AppError('User not found.', StatusCodes.NOT_FOUND);

    const where: Prisma.RolePermissionWhereInput = {
      roleId: user.roleId,
      permission: {
        deletedAt: null,
        isActive: true,
        parentId: null,
      },
    };

    const rolePermissions = await prisma.rolePermission.findMany({
      where,
      select: {
        permission: {
          include: {
            children: {
              where: { deletedAt: null, isActive: true },
              orderBy: { createdAt: 'asc' },
            },
          },
        },
      },
      orderBy: { permission: { createdAt: 'asc' } },
    });

    if (!rolePermissions) {
      throw new AppError('Role permissions not found', 404);
    }

    const permissions = rolePermissions.map((rp) => rp.permission);

    return {
      message: 'Profile fetched successfully',
      data: {
        userInfo: {
          ...user,
        },
        permissions,
      },
    };
  },
};
