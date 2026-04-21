import { prisma } from "@/config/db.config";
import {
  ChangePasswordFormType,
  LoginFormType,
  LogoutFormType,
  RefreshAccessTokenFormType,
  RegisterFormType,
} from "./auth.schema";
import { comparePassword, hashPassword } from "@/utils/password.util";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "@/utils/jwt.util";
import { userService } from "../user/user.service";
import { roleService } from "../role/role.service";

export const authService = {
  registerAgent: async (payload: RegisterFormType) => {
    const { roleId, cnic, email, fullName, password, companyName, phone } =
      payload;

    const existingUser = await userService.getUserByEmail(email);
    const role = await roleService.getRoleById(roleId);

    if (existingUser) {
      throw new Error("Email already registered");
    }

    if (!role) {
      throw new Error("Role not found");
    }

    const hashedPassword = await hashPassword(password);

    const result = await prisma.$transaction(async (tx) => {
      const agent = await tx.agent.create({
        data: {
          fullName,
          email,
          companyName,
          phone,
          cnic,
          status: "PENDING",
          roleId: role.id,
        },
      });
      const user = await tx.user.create({
        data: {
          fullName,
          email,
          phone,
          password: hashedPassword,
          status: "PENDING",
          roleId: role.id,
          agentId: agent.id,
        },
      });
      return { agent, user };
    });

    return {
      agentId: result.agent.id,
    };
  },

  login: async (payload: LoginFormType) => {
    const { email, password } = payload;

    // Find user
    const user = await userService.getUserByEmail(email);
    if (!user) throw new Error("Invalid email or password");

    // Check password
    const isPasswordMatch = await comparePassword(password, user.password);
    if (!isPasswordMatch) throw new Error("Invalid email or password");

    // Check status
    if (user.status === "PENDING")
      throw new Error("Your account is pending admin approval");
    if (user.status === "REJECTED")
      throw new Error("Your account has been rejected. Contact support");
    if (user.status === "SUSPENDED")
      throw new Error("Your account has been suspended. Contact support");
    if (!user.isActive)
      throw new Error("Your account is inactive. Contact support");

    // Generate tokens
    const accessToken = generateAccessToken(
      user.id,
      user.role.id,
      user.role.slug,
      user.agentId,
    );
    const refreshToken = generateRefreshToken(user.id);

    // Save refresh token
    await userService.saveRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: {
          id: user.role.id,
          slug: user.role.slug,
          name: user.role.name,
        },
        status: user.status,
      },
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
      createdBy: user.createdBy,
      updatedBy: user.updatedBy,
      deletedBy: user.deletedBy,
      isActive: user.isActive,
    };
  },

  refreshAccessToken: async (payload: RefreshAccessTokenFormType) => {
    const { refreshToken } = payload;
    let decoded: { userId: number };

    try {
      decoded = verifyRefreshToken(refreshToken) as { userId: number };
    } catch (error) {
      throw new Error("Invalid refresh token");
    }

    // Check in DB
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: { include: { role: true } } },
    });

    if (!storedToken) throw new Error("Refresh token not found");
    if (storedToken.isRevoked)
      throw new Error("Refresh token has been revoked");
    if (storedToken.expiresAt < new Date())
      throw new Error("Refresh token has expired");
    if (!storedToken.user.isActive) throw new Error("Account is inactive");

    // Generate new access token
    const newAccessToken = generateAccessToken(
      decoded.userId,
      storedToken.user.role.id,
      storedToken.user.role.slug,
      storedToken.user.agentId,
    );

    return {
      accessToken: newAccessToken,
    };
  },

  logout: async (payload: LogoutFormType) => {
    const { refreshToken } = payload;
    await prisma.refreshToken.updateMany({
      where: { token: refreshToken },
      data: { isRevoked: true },
    });

    return {};
  },

  changePassword: async (
    payload: ChangePasswordFormType & { userId: number | undefined },
  ) => {
    const { newPassword, oldPassword, userId } = payload;

    // Find user
    const user = await userService.getUserById(userId!);
    if (!user) throw new Error("User not found.");

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Check password
    const isPasswordMatch = await comparePassword(oldPassword, user.password);
    if (!isPasswordMatch) throw new Error("Old password is incorrect");

    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });

    await prisma.refreshToken.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true },
    });

    return {};
  },
};
