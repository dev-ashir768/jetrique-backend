import { CreateSubAgentFormType } from './sub-agent.schema';
import { JWTAccessTokenType } from '@/types';
import { AppError } from '@/middleware/error.middleware';
import { StatusCodes } from 'http-status-codes';
import { prisma } from '@/config/db.config';
import { generatePassword, hashPassword } from '@/utils/password.util';
import { AgentStatus, UserRole } from '@prisma/client';

export const SubAgentService = {
  createSubAgent: async (
    payload: CreateSubAgentFormType,
    requestingUser: JWTAccessTokenType,
  ) => {
    const {
      cnic,
      email,
      fullName,
      companyName,
      phone,
      commission,
      paymentType,
    } = payload;
    const { userId } = requestingUser;

    const psaUser = await prisma.user.findUnique({
      where: { id: userId, deletedAt: null },
      select: { agentId: true },
    });

    if (!psaUser?.agentId)
      throw new AppError('PSA not found', StatusCodes.NOT_FOUND);

    const psaAgent = await prisma.agent.findUnique({
      where: { id: psaUser.agentId, deletedAt: null },
      include: { role: true },
    });

    if (!psaAgent)
      throw new AppError('PSA agent not found', StatusCodes.NOT_FOUND);
    if (psaAgent.status !== AgentStatus.APPROVED)
      throw new AppError('PSA is not approved', StatusCodes.NOT_FOUND);

    // ─── Check Email ───
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      throw new AppError('Email already registered', StatusCodes.FORBIDDEN);

    const existingAgent = await prisma.agent.findUnique({ where: { email } });
    if (existingAgent)
      throw new AppError('Email already registered', StatusCodes.FORBIDDEN);

    // ─── Get Sub Agent Role ───
    const subAgentRole = await prisma.role.findFirst({
      where: { slug: UserRole.sub_agent },
    });
    if (!subAgentRole)
      throw new AppError('Sub agent role not found', StatusCodes.NOT_FOUND);

    // ─── Generate Temp Password ───
    const tempPassword = generatePassword();
    const hashedPassword = await hashPassword(tempPassword);

    // ─── Create Agent + User ───
    const result = await prisma.$transaction(async (tx) => {
      const agent = await tx.agent.create({
        data: {
          fullName,
          email,
          companyName,
          phone,
          cnic,
          roleId: subAgentRole.id,
          status: AgentStatus.PENDING,
          psaId: psaAgent.id,
          commission,
          paymentType,
        },
      });

      const user = await tx.user.create({
        data: {
          fullName,
          email,
          phone,
          password: hashedPassword,
          roleId: subAgentRole.id,
          status: AgentStatus.PENDING,
        },
      });

      return { agent, user };
    });

    return {
      agentId: result.agent.id,
    };
  },
};
