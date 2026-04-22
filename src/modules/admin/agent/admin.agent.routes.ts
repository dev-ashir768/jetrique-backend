import { Router } from 'express';
import { adminAgentController } from './admin.agent.controller';
import { validate } from '@/middleware/validate.middleware';
import { agentStatusSchema } from './admin.agent.schema';
import { authMiddleware } from '@/middleware/auth.middleware';

const router = Router();

// router.patch(
//   "/approve/:agentId",
//   authMiddleware.verifyAccessToken,
//   authMiddleware.authorize(["super_admin"]),
//   validate(approveAgentSchema),
//   adminAgentController.approveAgent,
// );

// router.patch(
//   "/reject/:agentId",
//   authMiddleware.verifyAccessToken,
//   authMiddleware.authorize(["super_admin"]),
//   validate(rejectAgentSchema),
//   adminAgentController.rejectAgent,
// );

// router.patch(
//   "/suspend/:agentId",
//   authMiddleware.verifyAccessToken,
//   authMiddleware.authorize(["super_admin"]),
//   validate(suspendAgentSchema),
//   adminAgentController.suspendAgent,
// );

router.patch(
  '/status/:agentId',
  authMiddleware.verifyAccessToken,
  authMiddleware.authorize(['super_admin']),
  validate(agentStatusSchema),
  adminAgentController.agentStatusChange,
);

export default router;
