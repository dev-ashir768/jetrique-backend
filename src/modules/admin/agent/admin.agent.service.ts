import { prisma } from '@/config/db.config';
import {
  GetAgentsFormType,
  UpdateAgentStatusFormType,
} from './admin.agent.schema';
import { AppError } from '@/middleware/error.middleware';
import { userService } from '@/modules/user/user.service';
import { StatusCodes } from 'http-status-codes';
import { Prisma } from '@prisma/client';

export const adminAgentService = {
  updateAgentStatus: async (
    agentId: number,
    payload: UpdateAgentStatusFormType,
    superAdminId: number,
  ) => {
    const { status, commission, reason, paymentType } = payload;

    const superAdmin = await userService.getUserById(superAdminId);

    if (!superAdmin)
      throw new AppError('Super Admin not found', StatusCodes.NOT_FOUND);
    if (superAdmin.role.slug !== 'super_admin')
      throw new AppError(
        'Only super admin can change agent status',
        StatusCodes.NOT_FOUND,
      );

    const agent = await prisma.agent.findUnique({
      where: { id: agentId, deletedAt: null, isActive: true },
    });

    //  Check agent
    if (!agent) throw new AppError('Agent not found', StatusCodes.NOT_FOUND);

    //  Check status
    if (agent.status === status) {
      throw new AppError(
        `Agent is already ${status.toLowerCase()}`,
        StatusCodes.BAD_REQUEST,
      );
    }
    if (agent.status === 'REJECTED' && status === 'APPROVED') {
      throw new AppError(
        'Rejected agent cannot be approved directly',
        StatusCodes.BAD_REQUEST,
      );
    }

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
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

  getAgents: async (query: GetAgentsFormType) => {
    const { page = '1', limit = '10', search, status } = query;

    const take = parseInt(limit);
    const skip = (parseInt(page) - 1) * take;

    const where: Prisma.AgentWhereInput = {
      deletedAt: null,
      ...(status && { status }),
      ...(search && {
        OR: [
          { fullName: { contains: search } },
          { email: { contains: search } },
          { companyName: { contains: search } },
          { cnic: { contains: search } },
        ],
      }),
    };

    const [agents, total] = await prisma.$transaction([
      prisma.agent.findMany({
        where,
        include: {
          role: { select: { id: true, name: true, slug: true } },
          psa: { select: { id: true, fullName: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),

      prisma.agent.count({ where }),
    ]);

    return {
      agents,
      meta: {
        total,
        page: Number(page),
        limit: Number(take),
        totalPages: Math.ceil(total / take),
      },
    };
  },

  getAgentById: async (agentId: number) => {
    const agent = await prisma.agent.findUnique({
      where: { id: agentId, deletedAt: null },
      include: {
        role: { select: { id: true, name: true, slug: true } },
        psa: { select: { id: true, fullName: true, email: true } },
        subAgents: {
          select: { id: true, fullName: true, email: true, status: true },
        },
        agentStatusLogs: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!agent) throw new AppError('Agent not found', StatusCodes.NOT_FOUND);

    return agent;
  },
};
