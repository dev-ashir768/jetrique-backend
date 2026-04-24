import { Prisma } from '@prisma/client';
import {
  GetCommissionLogsFormType,
  GetPaymentTypeLogsFormType,
} from './audit-trail.schema';
import { prisma } from '@/config/db.config';

export const auditTrailService = {
  // ─── Get Commission Logs ───
  getCommissionLogs: async (query: GetCommissionLogsFormType) => {
    const { search, page = '1', limit = '10' } = query;

    const take = parseInt(limit);
    const skip = (parseInt(page) - 1) * take;

    const searchNumber = search ? parseFloat(search) : undefined;

    const where: Prisma.CommissionLogsWhereInput = {
      ...(searchNumber !== undefined && { commission: searchNumber }),
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
    };

    const [commissionLogs, total] = await prisma.$transaction([
      prisma.commissionLogs.findMany({
        where,
        include: {
          agent: {
            select: {
              companyName: true,
              fullName: true,
              email: true,
              phone: true,
              cnic: true,
              createdBy: true,
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
  getPaymentTypeLogs: async (query: GetPaymentTypeLogsFormType) => {
    const { limit = '10', page = '1', search, status } = query;

    const take = parseInt(limit);
    const skip = (parseInt(page) - 1) * take;

    const where: Prisma.PaymentTypeLogsWhereInput = {
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
    };

     const [paymentTypeLogs, total] = await prisma.$transaction([
      prisma.paymentTypeLogs.findMany({
        where,
        include: {
          agent: {
            select: {
              companyName: true,
              fullName: true,
              email: true,
              phone: true,
              cnic: true,
              createdBy: true,
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
};
