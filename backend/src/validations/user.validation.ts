import z from "zod";

export const searchUserValidation = z.object({
  username: z
    .string({
      error: () => "Username is required.",
    })
    .trim()
    .min(1, {
      error: "Username must be at least 1 character.",
    })
    .max(30, {
      error: "Username cannot exceed 30 characters.",
    })
    .regex(/^[a-zA-Z0-9_]+$/, {
      error: "Username can only contain letters, numbers and underscores.",
    }),
});
