import { z } from "zod";

export const passwordSchema = z
  .string({
    error: (iss) =>
      iss.input === undefined ? "Password is required." : "Invalid password.",
  })
  .min(8, { error: "Password must be at least 8 characters" })
  .max(100, { error: "Password is too long" })
  .regex(/[a-z]/, { error: "Must contain at least one lowercase letter" })
  .regex(/[A-Z]/, { error: "Must contain at least one uppercase letter" })
  .regex(/\d/, { error: "Must contain at least one number" })
  .regex(/[^a-zA-Z0-9]/, {
    error: "Must contain at least one special character",
  });

// validation to create account
export const createAccountValidation = z
  .object({
    displayName: z
      .string({
        error: () => "Display name is required.",
      })
      .trim()
      .min(2, {
        error: "Display name must be at least 2 characters.",
      })
      .max(50, {
        error: "Display name cannot exceed 50 characters.",
      }),

    username: z
      .string({
        error: () => "Username is required.",
      })
      .trim()
      .min(3, {
        error: "Username must be at least 3 characters.",
      })
      .max(30, {
        error: "Username cannot exceed 30 characters.",
      })
      .regex(/^[a-zA-Z0-9_]+$/, {
        error: "Username can only contain letters, numbers and underscores.",
      }),

    email: z
      .string({
        error: () => "Email is required.",
      })
      .trim()
      .email({
        error: "Please provide a valid email address.",
      }),

    password: passwordSchema,

    confirmPassword: z
      .string({
        error: () => "Please confirm your password.",
      })
      .min(1, {
        error: "Please confirm your password.",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });
