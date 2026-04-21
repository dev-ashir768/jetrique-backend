import { validate } from "@/middleware/validate.middleware";
import { authController } from "@/modules/auth/auth.controller";
import { Router } from "express";
import { loginSchema } from "./auth.schema";

const router = Router();

router.post("/login", validate(loginSchema), authController.login);

export default router;
