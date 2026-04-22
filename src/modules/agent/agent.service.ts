import { prisma } from '@/config/db.config';

export const agentService = {
  getAgentById: async (agentId: number) => {
    return prisma.agent.findUnique({
      where: {
        id: agentId,
      },
    });
  },
};
