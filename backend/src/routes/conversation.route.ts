import { Router } from "express";
const conversationRoutes = Router();

// importing middlewares
import { isAuth } from "../middlewares/auth.middleware.js";

// importing controllers
import {
  conversation,
  getConversations,
  getMessages,
} from "../controllers/conversations.controller.js";

conversationRoutes.post("/:userId", isAuth, conversation);
conversationRoutes.get("/", isAuth, getConversations);
conversationRoutes.get("/:id/messages", isAuth, getMessages);

export default conversationRoutes;
