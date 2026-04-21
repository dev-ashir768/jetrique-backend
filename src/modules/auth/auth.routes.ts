import { validate } from "@/middleware/validate.middleware";
import { authController } from "@/modules/auth/auth.controller";
import { Router } from "express";
import { loginSchema, registerSchema } from "./auth.schema";

const router = Router();

router.post("/login", validate(loginSchema), authController.login);
router.post("/refresh-access-token", authController.refreshAccessToken);
router.post(
  "/register",
  validate(registerSchema),
  authController.registerAgent,
);

export default router;
