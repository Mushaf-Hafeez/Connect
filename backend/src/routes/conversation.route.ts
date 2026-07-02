import { Router } from "express";
const conversationRoutes = Router();

// importing middlewares
import { isAuth } from "../middlewares/auth.middleware.js";

// importing controllers
import {
  conversation,
  getConversations,
  getMessages,
  sendMessage,
  updateMessage,
  deleteMessage,
} from "../controllers/conversations.controller.js";

conversationRoutes.post("/:userId", isAuth, conversation);
conversationRoutes.get("/", isAuth, getConversations);
conversationRoutes.get("/:conversationId/messages", isAuth, getMessages);
conversationRoutes.post("/:conversationId/messages", isAuth, sendMessage);
conversationRoutes.put(
  "/:conversationId/messages/:messageId",
  isAuth,
  updateMessage,
);
conversationRoutes.delete(
  "/:conversationId/messages/:messageId",
  isAuth,
  deleteMessage,
);

export default conversationRoutes;
