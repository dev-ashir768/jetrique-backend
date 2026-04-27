import { Router } from 'express';
import { auditTrailController } from './audit-trail.controller';
import { authMiddleware } from '@/middleware/auth.middleware';
import { validate } from '@/middleware/validate.middleware';
import {
  getAgentStatusLogsSchema,
  getCommissionLogsSchema,
  getPaymentTypeLogsSchema,
} from './audit-trail.schema';
import { ValidationSource } from '@/types';

const router = Router();

router.use(authMiddleware.verifyAccessToken);

router.get(
  '/get-commission-logs',
  validate(getCommissionLogsSchema, ValidationSource.QUERY),
  auditTrailController.getCommissionLogs,
);
router.get(
  '/get-payment-type-logs',
  validate(getPaymentTypeLogsSchema, ValidationSource.QUERY),
  auditTrailController.getPaymentTypeLogs,
);
router.get(
  '/get-agent-status-logs',
  validate(getAgentStatusLogsSchema, ValidationSource.QUERY),
  auditTrailController.getAgentStatusLogs,
);

export default router;
