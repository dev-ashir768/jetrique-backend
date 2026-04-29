import { authMiddleware } from '@/middleware/auth.middleware';
import { validate } from '@/middleware/validate.middleware';
import { Router } from 'express';
import { permissionSchema } from './permission.schema';
import { PermissionController } from './permission.controller';
import { ValidationSource } from '@/types';

const router = Router();

// Protected Routes
router.use(authMiddleware.verifyAccessToken);

// Permission Routes
router.get('/', validate(permissionSchema.getPermissions, ValidationSource.QUERY), PermissionController.getPermissions);

export default router;
