import { Router } from 'express';
import { agentController } from './agent.controller';
import { validate } from '@/middleware/validate.middleware';
import {
  getAgentsSchema,
  updateAgentFinanceSchema,
  updateAgentStatusSchema,
} from './agent.schema';
import { authMiddleware } from '@/middleware/auth.middleware';
import { ValidationSource } from '@/types';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(
  authMiddleware.verifyAccessToken,
);

// ─── Get all Agents ───
router.get(
  '/',
  validate(getAgentsSchema, ValidationSource.QUERY),
  agentController.getAgents,
);

// ─── Get Agent by Id ───
router.get('/:agentId', agentController.getAgentById);

// ─── All routes: Super Admin only ───
router.use(authMiddleware.authorize([UserRole.super_admin]));

// ─── Update Agent Status (Approve / Reject) ───
router.patch(
  '/status/:agentId',
  validate(updateAgentStatusSchema),
  agentController.updateAgentStatus,
);

// ─── Update Agent Finance ───
router.patch(
  '/finance/:agentId',
  validate(updateAgentFinanceSchema),
  agentController.updateAgentFinance,
);

export default router;
