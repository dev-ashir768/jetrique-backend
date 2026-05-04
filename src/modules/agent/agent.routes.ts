import { Router } from 'express';
import { agentController } from './agent.controller';
import { validate } from '@/middleware/validate.middleware';
import { authMiddleware } from '@/middleware/auth.middleware';
import { ValidationSource } from '@/types';
import { agentSchema } from './agent.schema';
import { UserRole } from '@prisma/client';

const router = Router();

// ─── Authorization Token Verification ───
router.use(authMiddleware.verifyAccessToken);

// ─── Get all Agents ───
router.get(
  '/',
  authMiddleware.authorize([UserRole.super_admin, UserRole.psa]),
  validate(agentSchema.getAgentsSchema, ValidationSource.QUERY),
  agentController.getAgents,
);

// ─── Get Agent by Id ───
router.get('/:agentId', authMiddleware.authorize([UserRole.super_admin, UserRole.psa]), agentController.getAgentById);

// ─── Update Agent Status (Approve / Reject) ───
router.patch(
  '/status/:agentId',
  authMiddleware.authorize([UserRole.super_admin]),
  validate(agentSchema.updateAgentStatusSchema),
  agentController.updateAgentStatus,
);

// ─── Update Agent Finance ───
router.patch(
  '/finance/:agentId',
  authMiddleware.authorize([UserRole.super_admin]),
  validate(agentSchema.updateAgentFinanceSchema),
  agentController.updateAgentFinance,
);

// ─── Create Sub Agent ───
router.post(
  '/sub-agent',
  authMiddleware.authorize([UserRole.psa]),
  validate(agentSchema.createSubAgent),
  agentController.createSubAgent,
);

export default router;
