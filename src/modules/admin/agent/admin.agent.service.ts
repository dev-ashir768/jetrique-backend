import { prisma } from '@/config/db.config';
import { UpdateAgentStatusFormType } from './admin.agent.schema';
import { AppError } from '@/middleware/error.middleware';
import { userService } from '@/modules/user/user.service';
import { StatusCodes } from 'http-status-codes';

export const adminAgentService = {
  updateAgentStatus: async (
    agentId: number,
    payload: UpdateAgentStatusFormType,
    superAdminId: number,
  ) => {
    const { status, commission, reason, paymentType } = payload;

    const superAdmin = await userService.getUserById(superAdminId);

    if (!superAdmin) throw new AppError('Super Admin not found', 404);
    if (superAdmin.role.slug !== 'super_admin')
      throw new AppError('Only super admin can change agent status', 404);

    const agent = await prisma.agent.findUnique({
      where: { id: agentId, deletedAt: null, isActive: true },
    });

    //  Check agent
    if (!agent) throw new AppError('Agent not found', 404);

    //  Check status
    if (agent.status === status) {
      throw new AppError(`Agent is already ${status.toLowerCase()}`, StatusCodes.BAD_REQUEST);
    }
    if (agent.status === 'REJECTED' && status === 'APPROVED') {
      throw new AppError('Rejected agent cannot be approved directly', StatusCodes.BAD_REQUEST);
    }

    await prisma.$transaction(async (tx) => {
      await tx.agent.update({
        where: { id: agentId },
        data: {
          status,
          isActive: status === 'APPROVED',
          ...(status === 'APPROVED' && {
            commission,
            paymentType,
            approvedBy: superAdminId,
            approvedAt: new Date(),
          }),
        },
      });

      await tx.user.updateMany({
        where: { agentId },
        data: {
          status,
          isActive: status === 'APPROVED',
        },
      });

      if (status === 'REJECTED') {
        await tx.refreshToken.updateMany({
          where: { user: { agentId }, isRevoked: false },
          data: { isRevoked: true },
        });
      }

      await tx.agentStatusLog.create({
        data: {
          agentId,
          status,
          changedBy: superAdminId,
          ...(reason && { reason }),
        },
      });
    });

    return {
      message: `Agent ${status.toLowerCase()} successfully`,
    };
  },
};
