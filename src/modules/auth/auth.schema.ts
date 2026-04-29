import z from 'zod';
import { REGEX } from '@/utils/constants.util';

// ─── Register ───
export const registerSchema = z.object({
  fullName: z
    .string({
      error: (issue) => (issue.input === '' ? 'Full name is required' : 'Invalid full name'),
    })
    .min(3, 'Full name must be at least 3 characters'),
  email: z
    .email({
      error: (issue) => (issue.input === '' ? 'Email is required' : 'Invalid email address'),
    })
    .trim()
    .refine((val) => !REGEX.FORBIDDEN_CODE.test(val), {
      error: 'Invalid input: Code-like content is not allowed',
    }),
  password: z
    .string()
    .min(8, {
      error: (issue) => (issue.input === '' ? 'Password is required' : 'Password must be at least 8 characters long'),
    })
    .trim()
    .refine((val) => !REGEX.FORBIDDEN_CODE.test(val), {
      error: 'Invalid input: Code-like content is not allowed',
    }),
  phone: z
    .string()
    .trim()
    .refine((val) => REGEX.PHONE.test(val), {
      error: 'Invalid input: Phone number is not valid',
    })
    .refine((val) => !REGEX.FORBIDDEN_CODE.test(val), {
      error: 'Invalid input: Code-like content is not allowed',
    })
    .optional(),
  roleId: z.number().min(1, 'Role is required'),
  companyName: z.string().min(2, 'Company name is required').optional(),
  cnic: z
    .string()
    .min(13, 'CNIC must be at least 13 digits')
    .max(15, 'CNIC cannot exceed 15 characters')
    .trim()
    .refine((val) => REGEX.CNIC.test(val), {
      error: 'Invalid input: Format must be xxxxxxxxxxxxxx or xxxxx-xxxxxxx-x',
    })
    .refine((val) => !REGEX.FORBIDDEN_CODE.test(val), {
      error: 'Invalid input: Code-like content is not allowed',
    }),
});

// ─── Login ───
export const loginSchema = z.object({
  email: z
    .email({
      error: (issue) => (issue.input === '' ? 'Email is required' : 'Invalid email address'),
    })
    .trim()
    .refine((val) => !REGEX.FORBIDDEN_CODE.test(val), {
      error: 'Invalid input: Code-like content is not allowed',
    }),
  password: z
    .string()
    .min(8, {
      error: (issue) => (issue.input === '' ? 'Password is required' : 'Password must be at least 8 characters long'),
    })
    .trim()
    .refine((val) => !REGEX.FORBIDDEN_CODE.test(val), {
      error: 'Invalid input: Code-like content is not allowed',
    }),
});

// ─── Forgot Password ───
export const forgotPasswordSchema = z.object({
  email: z
    .email({
      error: (issue) => (issue.input === '' ? 'Email is required' : 'Invalid email address'),
    })
    .trim()
    .refine((val) => !REGEX.FORBIDDEN_CODE.test(val), {
      error: 'Invalid input: Code-like content is not allowed',
    }),
});

// ─── Reset Password ───
export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z
    .string()
    .min(8, {
      error: (issue) => (issue.input === '' ? 'Password is required' : 'Password must be at least 8 characters long'),
    })
    .trim()
    .refine((val) => !REGEX.FORBIDDEN_CODE.test(val), {
      error: 'Invalid input: Code-like content is not allowed',
    }),
});

// ─── Change Password ───
export const changePasswordSchema = z.object({
  oldPassword: z
    .string()
    .min(1, 'Old password is required')
    .trim()
    .refine((val) => !REGEX.FORBIDDEN_CODE.test(val), {
      error: 'Invalid input: Code-like content is not allowed',
    }),
  newPassword: z
    .string()
    .min(8, {
      error: (issue) =>
        issue.input === '' ? 'New Password is required' : 'New Password must be at least 8 characters long',
    })
    .trim()
    .refine((val) => !REGEX.FORBIDDEN_CODE.test(val), {
      error: 'Invalid input: Code-like content is not allowed',
    }),
});

// ─── Refresh Access Token ───
export const refreshAccessTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

// ─── Logout ───
export const logoutSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

// ─── Type Safety ───
export type RegisterFormType = z.infer<typeof registerSchema>;
export type LoginFormType = z.infer<typeof loginSchema>;
export type ForgotPasswordFormType = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormType = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordFormType = z.infer<typeof changePasswordSchema>;
export type RefreshAccessTokenFormType = z.infer<typeof refreshAccessTokenSchema>;
export type LogoutFormType = z.infer<typeof logoutSchema>;
