import { authMiddleware } from '@/middleware/auth.middleware';
import { Router } from 'express';
import { roleController } from './role.controller';

const router = Router();

// ─── Get Roles (No Token Required) ───
router.get('/lookup', roleController.getRoleLookup);

// ─── Authorization Token Verification ───
router.use(authMiddleware.verifyAccessToken);

// ─── Get all Roles ───
router.get('/', roleController.getAllRoles);

export default router;
