import { prisma } from '@/config/db.config';

export const userService = {
  getUserByEmail: async (email: string) => {
    return prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        agent: true,
        role: true,
      },
    });
  },

  getUserById: async (userId: number) => {
    return prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        agent: true,
        role: true,
      },
    });
  },

  saveRefreshToken: async (userId: number, refreshToken: string) => {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt,
      },
    });
  },
};
