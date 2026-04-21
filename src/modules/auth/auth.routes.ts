import { validate } from "@/middleware/validate.middleware";
import { authController } from "@/modules/auth/auth.controller";
import { Router } from "express";
import { loginSchema, logoutSchema, registerSchema } from "./auth.schema";
import { authMiddleware } from "@/middleware/auth.middleware";

const router = Router();

router.post("/login", validate(loginSchema), authController.login);
router.post("/refresh-access-token", authController.refreshAccessToken);
router.post(
  "/register",
  validate(registerSchema),
  authController.registerAgent,
);
router.post(
  "/logout",
  authMiddleware.verifyAccessToken,
  validate(logoutSchema),
  authController.logout,
);

export default router;
