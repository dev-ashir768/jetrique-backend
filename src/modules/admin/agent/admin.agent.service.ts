import { prisma } from '@/config/db.config';
import {
  GetAgentsFormType,
  UpdateAgentFinanceFormType,
  UpdateAgentStatusFormType,
} from './admin.agent.schema';
import { AppError } from '@/middleware/error.middleware';
import { userService } from '@/modules/user/user.service';
import { StatusCodes } from 'http-status-codes';
import { Prisma } from '@prisma/client';

export const adminAgentService = {
  // ─── Update Agent Status ───
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
    if (agent.status === 'APPROVED' && status === 'REJECTED') {
      throw new AppError(
        'Approved agent cannot be rejected.',
        StatusCodes.BAD_REQUEST,
      );
    }

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.agent.update({
        where: { id: agentId },
        data: {
          status,
          // isActive: status === 'APPROVED',
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
          // isActive: status === 'APPROVED',
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

      if (status === 'APPROVED') {
        if (commission !== undefined && commission !== agent.commission) {
          await tx.commissionLogs.create({
            data: {
              agentId,
              newCommission: commission,
              oldCommission: agent.commission || 0,
              changedBy: superAdminId,
              reason: `Commission has been changed from ${agent.commission} to ${commission}`,
            },
          });
        }

        if (paymentType !== undefined && paymentType !== agent.paymentType) {
          await tx.paymentTypeLogs.create({
            data: {
              agentId,
              newPaymentType: paymentType,
              oldPaymentType: agent.paymentType,
              changedBy: superAdminId,
              reason: `Payment type has been changed from ${agent.paymentType} to ${paymentType}`,
            },
          });
        }
      }
    });

    return {
      message: `Agent ${status.toLowerCase()} successfully`,
    };
  },

  // ─── Update Agent Finance ───
  updateAgentFinance: async (
    payload: UpdateAgentFinanceFormType,
    agentId: number,
    superAdminId: number,
  ) => {
    const { commission, paymentType, reason } = payload;

    const agent = await adminAgentService.getAgentById(agentId);

    if (!agent) throw new AppError('Agent not found', StatusCodes.NOT_FOUND);

    if (agent.status !== 'APPROVED') {
      throw new AppError(
        'Only approved agents can be updated',
        StatusCodes.BAD_REQUEST,
      );
    }

    if (agent.commission === commission && agent.paymentType === paymentType)
      throw new AppError(
        'No changes in agent finance',
        StatusCodes.BAD_REQUEST,
      );

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.agent.update({
        where: { id: agentId },
        data: {
          ...(commission !== undefined && { commission }),
          ...(paymentType !== undefined && { paymentType }),
        },
      });

      if (commission !== undefined && commission !== agent.commission) {
        await tx.commissionLogs.create({
          data: {
            agentId,
            newCommission: commission,
            oldCommission: agent.commission || 0,
            changedBy: superAdminId,
            reason: reason || 'Commission updated by Super Admin',
          },
        });
      }

      if (paymentType !== undefined && paymentType !== agent.paymentType) {
        await tx.paymentTypeLogs.create({
          data: {
            agentId,
            newPaymentType: paymentType,
            oldPaymentType: agent.paymentType,
            changedBy: superAdminId,
            reason: reason || 'Payment Type updated by Super Admin',
          },
        });
      }
    });

    return {}
  },

  // ─── Get Agents ───
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

  // ─── Get Agent by Id ───
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
