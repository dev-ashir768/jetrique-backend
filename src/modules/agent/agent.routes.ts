import { Router } from 'express';
import { agentController } from './agent.controller';
import { validate } from '@/middleware/validate.middleware';
import { authMiddleware } from '@/middleware/auth.middleware';
import { ValidationSource } from '@/types';
import { agentSchema } from './agent.schema';
import { UserRole } from '@prisma/client';

const router = Router();

// ─── All routes: Super Admin and PSA only ───
router.use(
  authMiddleware.verifyAccessToken,
  authMiddleware.authorize([UserRole.super_admin, UserRole.psa]),
);

// ─── Get all Agents ───
router.get(
  '/',
  validate(agentSchema.getAgentsSchema, ValidationSource.QUERY),
  agentController.getAgents,
);

// ─── Get Agent by Id ───
router.get('/:agentId', agentController.getAgentById);

// ─── Update Agent Status (Approve / Reject) ───
router.patch(
  '/status/:agentId',
  validate(agentSchema.updateAgentStatusSchema),
  agentController.updateAgentStatus,
);

// ─── Update Agent Finance ───
router.patch(
  '/finance/:agentId',
  validate(agentSchema.updateAgentFinanceSchema),
  agentController.updateAgentFinance,
);

// ─── Create Sub Agent ───
router.post(
  '/sub-agent',
  validate(agentSchema.createSubAgent),
  agentController.createSubAgent,
);

export default router;
