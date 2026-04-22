import { Router } from 'express';
import { agentController } from './agent.controller';
import { authMiddleware } from '@/middleware/auth.middleware';

const router = Router();

router.get(
  '/:agentId',
  authMiddleware.verifyAccessToken,
  agentController.getAgentById,
);

export default router;
