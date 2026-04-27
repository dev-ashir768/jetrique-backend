import { Router } from 'express';
import authRoutes from '@/modules/auth/auth.routes';
import roleRoutes from '@/modules/role/role.routes';
import adminAgentRoutes from '@/modules/admin/agent/admin.agent.routes';
import auditTrailRoutes from '@/modules/audit-trail/audit-trail.routes';
import permissionRoutes from '@/modules/permission/permission.routes';
import subAgentRoutes from '@/modules/agent/sub-agent/sub-agent.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/role', roleRoutes);
router.use('/admin/agent', adminAgentRoutes);
router.use('/audit-trail', auditTrailRoutes);
router.use('/permissions', permissionRoutes);
router.use('/agent/sub-agent', subAgentRoutes);

export default router;
