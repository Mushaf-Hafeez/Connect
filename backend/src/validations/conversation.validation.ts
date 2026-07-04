import z from "zod";

export const createConversationValidation = z.object({
  userId: z.uuid("Invalid user id."),
});

export const conversationIdValidation = z.object({
  conversationId: z.uuid("Invalid id."),
});

export const updateMessageValidation = z.object({
  conversationId: z.uuid("Invalid conversation id."),
  messageId: z.uuid("Invalid message id."),
  text: z.string().trim().min(1, "text cannot be empty."),
});

export const deleteMessageValidation = z.object({
  conversationId: z.uuid("Invalid conversation id."),
  messageId: z.uuid("Invalid message id."),
});
