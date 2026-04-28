import { Router } from 'express';
import authRoutes from '@/modules/auth/auth.routes';
import roleRoutes from '@/modules/role/role.routes';
import auditTrailRoutes from '@/modules/audit-trail/audit-trail.routes';
import permissionRoutes from '@/modules/permission/permission.routes';
import agentRoutes from '@/modules/agent/agent.routes';

const router = Router();

// ─── Auth Routes ───
router.use('/auth', authRoutes);

// ─── Role Routes ───
router.use('/role', roleRoutes);

// ─── Audit Trail Routes ───
router.use('/audit-trail', auditTrailRoutes);

// ─── Permission Routes ───
router.use('/permissions', permissionRoutes);

// ─── Agent Routes ───
router.use('/agent', agentRoutes);

export default router;
