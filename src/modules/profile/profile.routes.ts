import { authMiddleware } from '@/middleware/auth.middleware';
import { Router } from 'express';
import { profileController } from './profile.controller';
import { validate } from '@/middleware/validate.middleware';
import { profileSchema } from './profile.schema';

const router = Router();

// ─── Authorization Token Verification ───
router.use(authMiddleware.verifyAccessToken);

// ─── Update Profile ───
router.put('/', validate(profileSchema.updateProfile), profileController.updateProfile);

export default router;
