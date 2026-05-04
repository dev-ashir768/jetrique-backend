import { prisma } from '@/config/db.config';
import {
  ChangePasswordFormType,
  LoginFormType,
  LogoutFormType,
  RefreshAccessTokenFormType,
  RegisterFormType,
} from './auth.schema';
import { comparePassword, hashPassword } from '@/utils/password.util';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '@/utils/jwt.util';
import { userService } from '../user/user.service';
import { roleService } from '../role/role.service';
import { JWTAccessTokenType, JWTRefreshTokenType, LoggedInUser } from '@/types';
import { AppError } from '@/middleware/error.middleware';
import { logger } from '@/config/logger.config';
import { Prisma } from '@prisma/client';
import { sendAgentCreationGreetings } from '@/utils/mailer.util';

export const authService = {
  // ─── Register Agent ───
  registerAgent: async (payload: RegisterFormType) => {
    const { roleId, cnic, email, fullName, password, companyName, phone } = payload;

    const existingUser = await userService.getUserByEmail(email);
    const role = await roleService.getRoleById(roleId);

    if (existingUser) {
      throw new AppError('Email already registered', 409);
    }

    if (!role) {
      throw new AppError('Role not found', 404);
    }

    const hashedPassword = await hashPassword(password);

    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const agent = await tx.agent.create({
        data: {
          fullName,
          email,
          companyName,
          phone,
          cnic,
          status: 'PENDING',
          roleId: role.id,
        },
      });
      const user = await tx.user.create({
        data: {
          fullName,
          email,
          phone,
          password: hashedPassword,
          status: 'PENDING',
          roleId: role.id,
          agentId: agent.id,
        },
      });
      return { agent, user };
    });

    await sendAgentCreationGreetings(email, fullName, role.name);

    return {
      agentId: result.agent.id,
    };
  },

  // ─── Login User ───
  login: async (payload: LoginFormType) => {
    const { email, password } = payload;

    // Find user
    const user = await userService.getUserByEmail(email);
    if (!user) throw new AppError('Invalid email or password', 400);

    // Check password
    const isPasswordMatch = await comparePassword(password, user.password);
    if (!isPasswordMatch) throw new AppError('Invalid email or password', 400);

    // Check status
    if (user.status === 'PENDING') throw new AppError('Your account is pending admin approval', 403);
    if (user.status === 'REJECTED') throw new AppError('Your account has been rejected. Contact support', 403);
    // if (user.status === "SUSPENDED")
    //   throw new AppError(
    //     "Your account has been suspended. Contact support",
    //     403,
    //   );
    if (!user.isActive) throw new AppError('Your account is inactive. Contact support', 403);

    // Generate tokens
    const accesssTokenPayload: JWTAccessTokenType = {
      userId: user.id,
      roleId: user.role.id,
      roleSlug: user.role.slug,
      agentId: user.agentId,
    };
    const refreshTokenPayload: JWTRefreshTokenType = {
      userId: user.id,
    };

    const accessToken = generateAccessToken(accesssTokenPayload);
    const refreshToken = generateRefreshToken(refreshTokenPayload);

    // Save refresh token
    await userService.saveRefreshToken(user.id, refreshToken);

    return {
      userInfo: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: {
          id: user.role.id,
          slug: user.role.slug,
          name: user.role.name,
        },
        agent: user.agent
          ? {
              id: user.agent?.id,
              companyName: user.agent?.companyName,
              phone: user.agent?.phone,
              cnic: user.agent?.cnic,
              commission: user.agent?.commission,
              paymentType: user.agent?.paymentType,
            }
          : null,
        status: user.status,
      },
      accessToken,
      refreshToken,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
      createdBy: user.createdBy,
      updatedBy: user.updatedBy,
      deletedBy: user.deletedBy,
      isActive: user.isActive,
    };
  },

  // ─── Get Current User ───
  getMe: async (loggedInUser: LoggedInUser) => {
    const { userId } = loggedInUser;

    const user = await userService.getUserById(userId);
    if (!user) throw new AppError('User not found.', 404);

    const where: Prisma.RolePermissionWhereInput = {
      roleId: user.roleId,
      permission: {
        deletedAt: null,
        isActive: true,
        parentId: null,
      },
    };

    const rolePermissions = await prisma.rolePermission.findMany({
      where,
      select: {
        permission: {
          include: {
            children: {
              where: { deletedAt: null, isActive: true },
              orderBy: { createdAt: 'asc' },
            },
          },
        },
      },
      orderBy: { permission: { createdAt: 'asc' } },
    });

    if (!rolePermissions) {
      throw new AppError('Role permissions not found', 404);
    }

    const permissions = rolePermissions.map((rp) => rp.permission);

    return {
      userInfo: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: {
          id: user.role.id,
          slug: user.role.slug,
          name: user.role.name,
        },
        agent: user.agent
          ? {
              id: user.agent?.id,
              companyName: user.agent?.companyName,
              phone: user.agent?.phone,
              cnic: user.agent?.cnic,
              commission: user.agent?.commission,
              paymentType: user.agent?.paymentType,
            }
          : null,
        status: user.status,
      },
      permissions,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
      createdBy: user.createdBy,
      updatedBy: user.updatedBy,
      deletedBy: user.deletedBy,
      isActive: user.isActive,
    };
  },

  // ─── Refresh Access Token ───
  refreshAccessToken: async (payload: RefreshAccessTokenFormType) => {
    const { refreshToken } = payload;
    let decoded: JWTRefreshTokenType;

    try {
      decoded = verifyRefreshToken(refreshToken) as JWTRefreshTokenType;
    } catch (error) {
      logger.error('Invalid refresh token', error);
      throw new AppError('Invalid refresh token', 401);
    }

    // Check in DB
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: { include: { role: true } } },
    });

    if (!storedToken) throw new AppError('Refresh token not found', 401);
    if (storedToken.isRevoked) throw new AppError('Refresh token has been revoked', 401);
    if (storedToken.expiresAt < new Date()) throw new AppError('Refresh token has expired', 401);
    if (!storedToken.user.isActive) throw new AppError('Account is inactive', 403);

    // Check user status
    if (storedToken.user.status === 'PENDING') throw new AppError('Your account is pending admin approval', 403);
    if (storedToken.user.status === 'REJECTED')
      throw new AppError('Your account has been rejected. Contact support', 403);
    // if (storedToken.user.status === "SUSPENDED")
    //   throw new AppError(
    //     "Your account has been suspended. Contact support",
    //     403,
    //   );

    // Generate new access token
    const accesssTokenPayload: JWTAccessTokenType = {
      userId: decoded.userId,
      roleId: storedToken.user.role.id,
      roleSlug: storedToken.user.role.slug,
      agentId: storedToken.user.agentId,
    };
    const newAccessToken = generateAccessToken(accesssTokenPayload);

    return {
      accessToken: newAccessToken,
    };
  },

  // ─── Logout User ───
  logout: async (payload: LogoutFormType) => {
    const { refreshToken } = payload;
    const result = await prisma.refreshToken.updateMany({
      where: { token: refreshToken, isRevoked: false },
      data: { isRevoked: true },
    });

    if (result.count === 0) {
      throw new AppError('Invalid token or already logged out', 400);
    }

    return null;
  },

  // ─── Change Password ───
  changePassword: async (payload: ChangePasswordFormType & { userId: number | undefined }) => {
    const { newPassword, oldPassword, userId } = payload;

    // Find user
    const user = await userService.getUserById(userId!);
    if (!user) throw new AppError('User not found.', 404);

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Check password
    const isPasswordMatch = await comparePassword(oldPassword, user.password);
    if (!isPasswordMatch) throw new AppError('Old password is incorrect', 400);

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

    return null;
  },
};
