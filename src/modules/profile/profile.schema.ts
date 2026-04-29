import { REGEX } from '@/utils/constants.util';
import z from 'zod';

export const profileSchema = {
  // ─── Update Profile ───
  updateProfile: z
    .object({
      fullName: z.string().min(3, 'Full name must be at least 3 characters').optional().or(z.literal('')),
      phone: z
        .string()
        .trim()
        .optional()
        .or(z.literal(''))
        .refine((val) => !val || REGEX.PHONE.test(val), {
          message: 'Invalid input: Phone number is not valid',
        })
        .refine((val) => !val || !REGEX.FORBIDDEN_CODE.test(val), {
          message: 'Invalid input: Code-like content is not allowed',
        }),
      companyName: z.string().trim().min(2, 'Company name is required').optional().or(z.literal('')),
    })
    .superRefine((data, ctx) => {
      const isFullNameEmpty = !data.fullName || data.fullName.trim() === '';
      const isPhoneEmpty = !data.phone || data.phone.trim() === '';
      const isCompanyNameEmpty = !data.companyName || data.companyName.trim() === '';

      if (isFullNameEmpty && isPhoneEmpty && isCompanyNameEmpty) {
        ctx.addIssue({
          code: 'custom',
          message: 'At least one field (Full Name, Phone, or Company Name) is required to update.',
          path: ['fullName'],
        });
      }
    }),
};

export type UpdateProfileFormType = z.infer<typeof profileSchema.updateProfile>;
