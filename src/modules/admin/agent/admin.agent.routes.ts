import { Router } from 'express';
import { adminAgentController } from './admin.agent.controller';
import { validate } from '@/middleware/validate.middleware';
import { agentStatusSchema } from './admin.agent.schema';
import { authMiddleware } from '@/middleware/auth.middleware';

const router = Router();

// Agent Status Change
router.patch(
  '/status/:agentId',
  authMiddleware.verifyAccessToken,
  authMiddleware.authorize(['super_admin']),
  validate(agentStatusSchema),
  adminAgentController.agentStatusChange,
);

export default router;
