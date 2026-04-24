import { Router } from 'express';
import authRoutes from '@/modules/auth/auth.routes';
import roleRoutes from '@/modules/role/role.routes';
import adminAgentRoutes from '@/modules/admin/agent/admin.agent.routes';
import auditTrailRoutes from '@/modules/audit-trail/audit-trail.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/role', roleRoutes);
router.use('/admin/agent', adminAgentRoutes);
router.use('/audit-trail', auditTrailRoutes)

export default router;
