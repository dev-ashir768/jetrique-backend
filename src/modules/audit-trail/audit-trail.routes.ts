import { Router } from 'express';
import { auditTrailController } from './audit-trail.controller';
import { authMiddleware } from '@/middleware/auth.middleware';

const router = Router();

router.use(authMiddleware.verifyAccessToken);

router.get('/get-commission-logs', auditTrailController.getCommissionLogs);
router.get('/get-payment-type-logs', auditTrailController.getPaymentTypeLogs);

export default router;
