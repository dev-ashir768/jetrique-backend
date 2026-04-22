import { prisma } from '@/config/db.config';
import { AgentStatusFormType } from './admin.agent.schema';
import { AppError } from '@/middleware/error.middleware';
import { userService } from '@/modules/user/user.service';

export const adminAgentService = {
  // approveAgent: async (
  //   agentId: number,
  //   payload: ApproveAgentFormType,
  //   superAdminId: number,
  // ) => {
  //   const { status } = payload;

  //   const superAdmin = await userService.getUserById(superAdminId);

  //   if (!superAdmin) throw new AppError("Super Admin not found", 404);
  //   if (superAdmin.role.slug !== "super_admin") {
  //     throw new AppError("Only super admin can approve agents", 403);
  //   }

  //   const result = await prisma.$transaction(async (tx) => {
  //     const agentToApprove = await tx.agent.findUnique({
  //       where: { id: agentId },
  //     });

  //     if (!agentToApprove) throw new AppError("Agent not found", 404);
  //     if (agentToApprove.status !== AccountStatus.PENDING) {
  //       throw new AppError("Only pending agents can be approved", 400);
  //     }

  //     const agent = await tx.agent.update({
  //       where: {
  //         id: agentId,
  //       },
  //       data: {
  //         status,
  //         approvedAt: new Date(),
  //         approvedBy: superAdmin.id,
  //       },
  //     });

  //     await tx.user.updateMany({
  //       where: { agentId },
  //       data: { status },
  //     });

  //     await tx.agentStatusLog.create({
  //       data: {
  //         agentId,
  //         status,
  //         changedBy: superAdmin.id,
  //         reason: "Approved by Super Admin",
  //       },
  //     });

  //     return agent;
  //   });

  //   return {
  //     agentId: result.id,
  //     status: result.status,
  //     approvedBy: superAdmin.id,
  //     approvedAt: new Date(),
  //     reason: "Approved by Super Admin",
  //   };
  // },
  // rejectAgent: async (
  //   agentId: number,
  //   payload: RejectAgentFormType,
  //   superAdminId: number,
  // ) => {
  //   const { status, reason } = payload;
  //   const superAdmin = await userService.getUserById(superAdminId);

  //   if (!superAdmin) throw new AppError("Super Admin not found", 404);
  //   if (superAdmin.role.slug !== "super_admin")
  //     throw new AppError("Only super admin can reject agents", 403);

  //   const result = await prisma.$transaction(async (tx) => {
  //     const agentToReject = await tx.agent.findUnique({
  //       where: { id: agentId },
  //     });

  //     if (!agentToReject) throw new AppError("Agent not found", 404);
  //     if (agentToReject.status !== AccountStatus.PENDING) {
  //       throw new AppError("Only pending agents can be reject", 400);
  //     }

  //     const agent = await tx.agent.update({
  //       where: { id: agentId },
  //       data: {
  //         status,
  //         approvedAt: new Date(),
  //         approvedBy: superAdmin.id,
  //       },
  //     });

  //     await tx.user.updateMany({
  //       where: { agentId },
  //       data: { status },
  //     });

  //     await tx.agentStatusLog.create({
  //       data: {
  //         status,
  //         reason,
  //         changedBy: superAdmin.id,
  //         agentId,
  //       },
  //     });

  //     return agent;
  //   });

  //   return {
  //     agentId: result.id,
  //     status: result.status,
  //     approvedBy: superAdmin.id,
  //     approvedAt: new Date(),
  //     reason,
  //   };
  // },
  // suspendAgent: async (
  //   agentId: number,
  //   payload: SuspendAgentFormType,
  //   superAdminId: number,
  // ) => {
  //   const { status, reason } = payload;
  //   const superAdmin = await userService.getUserById(superAdminId);

  //   if (!superAdmin) throw new AppError("Super Admin not found", 404);
  //   if (superAdmin.role.slug !== "super_admin")
  //     throw new AppError("Only super admin can suspend agents", 403);

  //   const result = await prisma.$transaction(async (tx) => {
  //     const agentToSuspend = await tx.agent.findUnique({
  //       where: { id: agentId },
  //     });

  //     if (!agentToSuspend) throw new AppError("Agent not found", 404);
  //     if (agentToSuspend.status !== AccountStatus.APPROVED)
  //       throw new AppError("Only approved agents can be suspended", 400);

  //     const agent = await tx.agent.update({
  //       where: { id: agentId },
  //       data: { status },
  //     });

  //     await tx.user.updateMany({
  //       where: { agentId },
  //       data: { status },
  //     });

  //     await tx.agentStatusLog.create({
  //       data: {
  //         status,
  //         reason,
  //         changedBy: superAdmin.id,
  //         agentId,
  //       },
  //     });

  //     return agent;
  //   });

  //   return {
  //     agentId: result.id,
  //     status: result.status,
  //     approvedBy: superAdmin.id,
  //     approvedAt: new Date(),
  //     reason,
  //   };
  // },
  agentStatusChange: async (
    agentId: number,
    payload: AgentStatusFormType,
    superAdminId: number,
  ) => {
    const { status, commission, reason } = payload;

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
      throw new AppError(`Agent is already ${status.toLowerCase()}`, 400);
    }
    if (agent.status === 'REJECTED' && status === 'APPROVED') {
      throw new AppError('Rejected agent cannot be approved directly', 400);
    }
    if (agent.status === 'PENDING' && status === 'REJECTED')
      throw new AppError('Pending agent cannot be rejected directly', 400);

    await prisma.$transaction(async (tx) => {
      await tx.agent.update({
        where: { id: agentId },
        data: {
          status,
          isActive: status === 'APPROVED',
          ...(status === 'APPROVED' && {
            commission,
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
      agentId,
      status,
      changedBy: superAdminId,
      ...(reason && { reason }),
    };
  },
};
