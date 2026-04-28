import { prisma } from '@/config/db.config';
import { GetAgentsFormType } from './agent.schema';
import { AppError } from '@/middleware/error.middleware';
import { StatusCodes } from 'http-status-codes';
import { Prisma } from '@prisma/client';
import { getAgentIdFilter } from '@/utils/rbac.util';
import { JWTAccessTokenType } from '@/types';

export const agentService = {
  // ─── Get Agents ───
  getAgents: async (
    query: GetAgentsFormType,
    requestingUser: JWTAccessTokenType,
  ) => {
    const { page = '1', limit = '10', search, status } = query;
    const { agentId: id } = await getAgentIdFilter(requestingUser);
    const { agentId: requestingAgentId } = requestingUser;

    const take = parseInt(limit);
    const skip = (parseInt(page) - 1) * take;

    const where: Prisma.AgentWhereInput = {
      deletedAt: null,
      AND: [
        { ...(id && { id }) },
        { ...(requestingAgentId && { id: { not: requestingAgentId } }) },
      ],
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
  getAgentById: async (agentId: number, requestingUser: JWTAccessTokenType) => {
    const { agentId: psaId } = await getAgentIdFilter(requestingUser);

    const agent = await prisma.agent.findUnique({
      where: { id: agentId, deletedAt: null, ...(psaId && { psaId }) },
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
