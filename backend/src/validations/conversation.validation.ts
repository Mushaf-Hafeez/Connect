import z from "zod";

export const createConversationValidation = z.object({
  userId: z.uuid("Invalid user id."),
});

export const conversationIdValidation = z.object({
  id: z.uuid("Invalid id."),
});
