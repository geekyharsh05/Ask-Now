import { z } from "zod";

export const signUpInput = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .regex(/[a-zA-Z0-9]/, { message: 'Password must be alphanumeric' }),
  role: z.enum(["RESPONDENT", "CREATOR", ""]),
});

export const signInInput = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .regex(/[a-zA-Z0-9]/, { message: 'Password must be alphanumeric' }),
});

export type SignUpSchema = z.infer<typeof signUpInput>;
export type SignInSchema = z.infer<typeof signInInput>;