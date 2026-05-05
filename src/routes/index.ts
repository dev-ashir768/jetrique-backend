import { Router } from 'express';
import authRoutes from '@/modules/auth/auth.routes';
import roleRoutes from '@/modules/role/role.routes';
import auditTrailRoutes from '@/modules/audit-trail/audit-trail.routes';
import permissionRoutes from '@/modules/permission/permission.routes';
import agentRoutes from '@/modules/agent/agent.routes';
import profileRoutes from '@/modules/profile/profile.routes';
import { ROUTES } from '@/utils/constants.util';

const router = Router();

// ─── Auth Routes ───
router.use(ROUTES.AUTH, authRoutes);

// ─── Role Routes ───
router.use(ROUTES.ROLE, roleRoutes);

// ─── Audit Trail Routes ───
router.use(ROUTES.AUDIT_TRAIL, auditTrailRoutes);

// ─── Permission Routes ───
router.use(ROUTES.PERMISSION, permissionRoutes);

// ─── Agent Routes ───
router.use(ROUTES.AGENT, agentRoutes);

// ─── Profile Routes ───
router.use(ROUTES.PROFILE, profileRoutes);

export default router;
