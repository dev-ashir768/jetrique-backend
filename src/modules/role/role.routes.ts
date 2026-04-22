import { authMiddleware } from "@/middleware/auth.middleware";
import { Router } from "express";
import { roleController } from "./role.controller";

const router = Router();

router.get("/", authMiddleware.verifyAccessToken, roleController.getAllRoles);

export default router;
