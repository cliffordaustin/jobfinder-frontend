import { z } from "zod";

export const LoginBodySchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const SignupBodySchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
  password1: z.string(),
  is_company: z.boolean(),
});

export type LoginBody = z.infer<typeof LoginBodySchema>;

export type SignupBody = z.infer<typeof SignupBodySchema>;
