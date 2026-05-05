import { validate } from '@/middleware/validate.middleware';
import { authController } from '@/modules/auth/auth.controller';
import { Router } from 'express';
import { changePasswordSchema, loginSchema, logoutSchema, registerSchema } from './auth.schema';
import { authMiddleware } from '@/middleware/auth.middleware';

const router = Router();

// Public Routes
router.post('/login', validate(loginSchema), authController.login);
router.post('/register', validate(registerSchema), authController.registerAgent);
router.post('/refresh-access-token', authController.refreshAccessToken);

// Protected Routes
router.use(authMiddleware.verifyAccessToken);

router.get('/me', authController.getMe);
router.post('/logout', validate(logoutSchema), authController.logout);
router.put('/change-password', validate(changePasswordSchema), authController.changePassword);

export default router;
