import { Router } from "express";
import authRoutes from "@/modules/auth/auth.routes";
import roleRoutes from "@/modules/role/role.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/role", roleRoutes);

export default router;
