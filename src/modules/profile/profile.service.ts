import { LoggedInUser } from '@/types';
import { UpdateProfileFormType } from './profile.schema';
import { prisma } from '@/config/db.config';
import { AppError } from '@/middleware/error.middleware';
import { StatusCodes } from 'http-status-codes';

export const profileService = {
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
};
