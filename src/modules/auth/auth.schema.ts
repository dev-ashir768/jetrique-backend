import { REGEX } from "@/utils/constants";
import z from "zod";
import { AgentType } from "generated/prisma";

// ─── Register ───
export const registerSchema = z.object({
  body: z.object({
    fullName: z.string().min(3, "Full name must be at least 3 characters"),
    email: z
      .email({
        error: (issue) =>
          issue.input === "" ? "Email is required" : "Invalid email address",
      })
      .trim()
      .refine((val) => !REGEX.FORBIDDEN_CODE.test(val), {
        error: "Invalid input: Code-like content is not allowed",
      }),
    password: z
      .string()
      .min(8, {
        error: (issue) =>
          issue.input === ""
            ? "Password is required"
            : "Password must be at least 8 characters long",
      })
      .trim()
      .refine((val) => !REGEX.FORBIDDEN_CODE.test(val), {
        error: "Invalid input: Code-like content is not allowed",
      }),
    phone: z
      .string()
      .trim()
      .refine((val) => REGEX.PHONE.test(val), {
        error: "Invalid input: Phone number is not valid",
      })
      .refine((val) => !REGEX.FORBIDDEN_CODE.test(val), {
        error: "Invalid input: Code-like content is not allowed",
      })
      .optional(),
    agentType: z.enum(AgentType, {
      error: (issue) =>
        issue.input === ""
          ? "Agent type is required"
          : `Agent Type must be ${Object.values(AgentType).join(", ")}`,
    }),
    companyName: z.string().min(2, "Company name is required").optional(),
    cnic: z
      .string()
      .min(13, "CNIC must be at least 13 digits")
      .max(15, "CNIC cannot exceed 15 characters")
      .trim()
      .refine((val) => REGEX.CNIC.test(val), {
        error:
          "Invalid input: Format must be xxxxxxxxxxxxxx or xxxxx-xxxxxxx-x",
      })
      .refine((val) => !REGEX.FORBIDDEN_CODE.test(val), {
        error: "Invalid input: Code-like content is not allowed",
      }),
  }),
});

// ─── Login ───
export const loginSchema = z.object({
  body: z.object({
    email: z
      .email({
        error: (issue) =>
          issue.input === "" ? "Email is required" : "Invalid email address",
      })
      .trim()
      .refine((val) => !REGEX.FORBIDDEN_CODE.test(val), {
        error: "Invalid input: Code-like content is not allowed",
      }),
    password: z
      .string()
      .min(8, {
        error: (issue) =>
          issue.input === ""
            ? "Password is required"
            : "Password must be at least 8 characters long",
      })
      .trim()
      .refine((val) => !REGEX.FORBIDDEN_CODE.test(val), {
        error: "Invalid input: Code-like content is not allowed",
      }),
  }),
});

// ─── Forgot Password ───
export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z
      .email({
        error: (issue) =>
          issue.input === "" ? "Email is required" : "Invalid email address",
      })
      .trim()
      .refine((val) => !REGEX.FORBIDDEN_CODE.test(val), {
        error: "Invalid input: Code-like content is not allowed",
      }),
  }),
});

// ─── Reset Password ───
export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, "Token is required"),
    password: z
      .string()
      .min(8, {
        error: (issue) =>
          issue.input === ""
            ? "Password is required"
            : "Password must be at least 8 characters long",
      })
      .trim()
      .refine((val) => !REGEX.FORBIDDEN_CODE.test(val), {
        error: "Invalid input: Code-like content is not allowed",
      }),
  }),
});

// ─── Change Password ───
export const changePasswordSchema = z.object({
  body: z.object({
    oldPassword: z
      .string()
      .min(1, "Old password is required")
      .trim()
      .refine((val) => !REGEX.FORBIDDEN_CODE.test(val), {
        error: "Invalid input: Code-like content is not allowed",
      }),
    newPassword: z
      .string()
      .min(8, {
        error: (issue) =>
          issue.input === ""
            ? "New Password is required"
            : "New Password must be at least 8 characters long",
      })
      .trim()
      .refine((val) => !REGEX.FORBIDDEN_CODE.test(val), {
        error: "Invalid input: Code-like content is not allowed",
      }),
  }),
});
