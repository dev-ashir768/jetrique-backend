import { Router } from 'express';
import { adminAgentController } from './admin.agent.controller';
import { validate } from '@/middleware/validate.middleware';
import {
  getAgentsSchema,
  updateAgentFinanceSchema,
  updateAgentStatusSchema,
} from './admin.agent.schema';
import { authMiddleware } from '@/middleware/auth.middleware';
import { ValidationSource } from '@/types';
import { UserRole } from '@prisma/client';

const router = Router();

// ─── All routes: Super Admin only ───
router.use(
  authMiddleware.verifyAccessToken,
  authMiddleware.authorize([UserRole.super_admin]),
);

// ─── Update Agent Status (Approve / Reject) ───
router.patch(
  '/status/:agentId',
  validate(updateAgentStatusSchema),
  adminAgentController.updateAgentStatus,
);

// ─── Update Agent Finance ───
router.patch(
  '/finance/:agentId',
  validate(updateAgentFinanceSchema),
  adminAgentController.updateAgentFinance,
);
// ─── Get all Agents ───
router.get(
  '/',
  validate(getAgentsSchema, ValidationSource.QUERY),
  adminAgentController.getAgents,
);

// ─── Get Agent by Id ───
router.get('/:agentId', adminAgentController.getAgentById);

export default router;
