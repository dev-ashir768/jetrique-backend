import { Router } from 'express';
import { agentController } from './agent.controller';
import { validate } from '@/middleware/validate.middleware';
import { getAgentsSchema } from './agent.schema';
import { authMiddleware } from '@/middleware/auth.middleware';
import { ValidationSource } from '@/types';
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
  validate(getAgentsSchema, ValidationSource.QUERY),
  agentController.getAgents,
);

// ─── Get Agent by Id ───
router.get('/:agentId', agentController.getAgentById);

export default router;
