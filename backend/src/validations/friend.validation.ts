import { email, z } from "zod";

export const sendRequestValidation = z.object({
  userId: z.uuid("Invalid user id."),
});

export const friendRequestValidation = z.object({
  friendshipId: z.uuid("Invalid friendship id."),
});
