import { Router } from "express";
const conversationRoutes = Router();

import type { Request, Response, NextFunction } from "express";

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
import { upload } from "../config/multer.config.js";

conversationRoutes.post("/:userId", isAuth, conversation);
conversationRoutes.get("/", isAuth, getConversations);
conversationRoutes.get("/:conversationId/messages", isAuth, getMessages);
conversationRoutes.post(
  "/:conversationId/messages",
  isAuth,
  upload.array("attachments"),
  sendMessage,
);
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
