import { authMiddleware } from '@/middleware/auth.middleware';
import { validate } from '@/middleware/validate.middleware';
import { Router } from 'express';
import { SubAgentSchema } from './sub-agent.schema';
import { SubAgentController } from './sub-agent.controller';

const router = Router();

router.use(authMiddleware.verifyAccessToken);
router.post(
  '/',
  validate(SubAgentSchema.createSubAgent),
  SubAgentController.createSubAgent,
);

export default router;
