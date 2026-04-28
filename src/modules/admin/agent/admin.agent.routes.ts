import { Router } from 'express';
import { adminAgentController } from './admin.agent.controller';
import { validate } from '@/middleware/validate.middleware';
import { authMiddleware } from '@/middleware/auth.middleware';
import { UserRole } from '@prisma/client';
import { adminAgentSchema } from './admin.agent.schema';

const router = Router();

// ─── All routes: Super Admin only ───
router.use(authMiddleware.authorize([UserRole.super_admin]));

// ─── Update Agent Status (Approve / Reject) ───
router.patch(
  '/status/:agentId',
  validate(adminAgentSchema.updateAgentStatusSchema),
  adminAgentController.updateAgentStatus,
);

// ─── Update Agent Finance ───
router.patch(
  '/finance/:agentId',
  validate(adminAgentSchema.updateAgentFinanceSchema),
  adminAgentController.updateAgentFinance,
);


export default router;
