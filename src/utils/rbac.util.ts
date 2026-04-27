import { prisma } from '@/config/db.config';
import { JWTAccessTokenType } from '@/types';
import { UserRole } from '@prisma/client';

export const getAgentIdFilter = async (requestingUser: JWTAccessTokenType) => {
  const { roleSlug, agentId } = requestingUser;

  if (roleSlug === UserRole.super_admin) return {};

  if (roleSlug === UserRole.psa) {
    const subAgents = await prisma.agent.findMany({
      where: { psaId: agentId },
      select: { id: true },
    });

    const ids = [agentId, ...subAgents.map((a) => a.id)].filter(
      (item) => typeof item === 'number',
    );

    return {
      agentId: { in: ids },
    };
  }

  return { agentId: agentId ?? 0 };
};
