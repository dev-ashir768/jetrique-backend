import { Router } from 'express';
import { adminAgentController } from './admin.agent.controller';
import { validate } from '@/middleware/validate.middleware';
import { updateAgentStatusSchema } from './admin.agent.schema';
import { authMiddleware } from '@/middleware/auth.middleware';

const router = Router();

// Agent Status Change
router.patch(
  '/status/:agentId',
  authMiddleware.verifyAccessToken,
  authMiddleware.authorize(['super_admin']),
  validate(updateAgentStatusSchema),
  adminAgentController.updateAgentStatus,
);

export default router;
