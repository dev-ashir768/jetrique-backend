import { Prisma } from '@prisma/client';
import {
  GetAgentStatusLogsFormType,
  GetCommissionLogsFormType,
  GetPaymentTypeLogsFormType,
} from './audit-trail.schema';
import { prisma } from '@/config/db.config';
import { startOfDay, endOfDay } from 'date-fns';
import { JWTAccessTokenType } from '@/types';
import { getAgentIdFilter } from '@/utils/rbac.util';

export const auditTrailService = {
  // ─── Get Commission Logs ───
  getCommissionLogs: async (
    query: GetCommissionLogsFormType,
    requestingUser: JWTAccessTokenType,
  ) => {
    const { search, page = '1', limit = '10', startDate, endDate } = query;
    const agentIdFilter = await getAgentIdFilter(requestingUser);

    const take = parseInt(limit);
    const skip = (parseInt(page) - 1) * take;

    const where: Prisma.CommissionLogsWhereInput = {
      ...agentIdFilter,
      ...(search && {
        OR: [
          {
            agent: {
              companyName: { contains: search },
              fullName: { contains: search },
              email: { contains: search },
              phone: { contains: search },
              cnic: { contains: search },
            },
          },
        ],
      }),
      ...(startDate && { createdAt: { gte: startOfDay(startDate) } }),
      ...(endDate && { createdAt: { lte: endOfDay(endDate) } }),
    };

    const [commissionLogs, total] = await prisma.$transaction([
      prisma.commissionLogs.findMany({
        where,
        include: {
          agent: {
            select: {
              id: true,
              companyName: true,
              fullName: true,
              email: true,
              phone: true,
              cnic: true,
              createdBy: true,
              role: {
                select: { id: true, name: true, slug: true },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),

      prisma.commissionLogs.count({ where }),
    ]);

    return {
      commissionLogs,
      meta: {
        total,
        page: Number(page),
        limit: Number(take),
        totalPages: Math.ceil(total / take),
      },
    };
  },

  // ─── Get Payment Type Logs ───
  getPaymentTypeLogs: async (
    query: GetPaymentTypeLogsFormType,
    requestingUser: JWTAccessTokenType,
  ) => {
    const {
      limit = '10',
      page = '1',
      search,
      status,
      startDate,
      endDate,
    } = query;
    const agentIdFilter = await getAgentIdFilter(requestingUser);

    const take = parseInt(limit);
    const skip = (parseInt(page) - 1) * take;

    const where: Prisma.PaymentTypeLogsWhereInput = {
      ...agentIdFilter,
      ...(status !== undefined && { status }),
      ...(search && {
        OR: [
          {
            agent: {
              companyName: { contains: search },
              fullName: { contains: search },
              email: { contains: search },
              phone: { contains: search },
              cnic: { contains: search },
            },
          },
        ],
      }),
      ...(startDate && { createdAt: { gte: startOfDay(startDate) } }),
      ...(endDate && { createdAt: { lte: endOfDay(endDate) } }),
    };

    const [paymentTypeLogs, total] = await prisma.$transaction([
      prisma.paymentTypeLogs.findMany({
        where,
        include: {
          agent: {
            select: {
              id: true,
              companyName: true,
              fullName: true,
              email: true,
              phone: true,
              cnic: true,
              createdBy: true,
              role: {
                select: { id: true, name: true, slug: true },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),

      prisma.paymentTypeLogs.count({ where }),
    ]);

    return {
      paymentTypeLogs,
      meta: {
        total,
        page: Number(page),
        limit: Number(take),
        totalPages: Math.ceil(total / take),
      },
    };
  },

  // ─── Get Agent Status Logs ───
  getAgentStatusLogs: async (
    query: GetAgentStatusLogsFormType,
    requestingUser: JWTAccessTokenType,
  ) => {
    const { limit = '10', page = '1', status, startDate, endDate } = query;
    const agentIdFilter = await getAgentIdFilter(requestingUser);

    const take = parseInt(limit);
    const skip = (parseInt(page) - 1) * take;

    const where: Prisma.AgentStatusLogWhereInput = {
      ...agentIdFilter,
      ...(status !== undefined && { status }),
      ...(startDate && { createdAt: { gte: startOfDay(startDate) } }),
      ...(endDate && { createdAt: { lte: endOfDay(endDate) } }),
    };

    const [agentStatusLogs, total] = await prisma.$transaction([
      prisma.agentStatusLog.findMany({
        where,
        include: {
          agent: {
            select: {
              id: true,
              companyName: true,
              fullName: true,
              email: true,
              phone: true,
              cnic: true,
              createdBy: true,
              role: {
                select: { id: true, name: true, slug: true },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),

      prisma.agentStatusLog.count({ where }),
    ]);

    return {
      agentStatusLogs,
      meta: {
        total,
        page: Number(page),
        limit: Number(take),
        totalPages: Math.ceil(total / take),
      },
    };
  },
};
