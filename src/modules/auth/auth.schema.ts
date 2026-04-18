import z from "zod";

// ─── Login ───
export const loginSchema = z.object({
  email: z.email("Valid email daalo"),
  password: z.string().min(8, "Password 8 characters ka hona chahiye"),
});

// ─── Register ───
