import { Router } from "express";
const friendRoutes = Router();

// importing middlewares
import { isAuth } from "../middlewares/auth.middleware.js";

// importing controllers
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
  removeExistingFriendRequest,
  getFriends,
  pendingFriendRequests,
  sentFriendRequests,
} from "../controllers/friend.controller.js";

friendRoutes.post("/request/:userId", isAuth, sendFriendRequest);
friendRoutes.put("/accept/:friendshipId", isAuth, acceptFriendRequest);
friendRoutes.delete("/reject/:friendshipId", isAuth, rejectFriendRequest);
friendRoutes.delete("/cancel/:friendshipId", isAuth, cancelFriendRequest);
friendRoutes.delete(
  "/remove/:friendshipId",
  isAuth,
  removeExistingFriendRequest,
);
friendRoutes.get("/", isAuth, getFriends);
friendRoutes.get("/pending", isAuth, pendingFriendRequests);
friendRoutes.get("/sent", isAuth, sentFriendRequests);

export default friendRoutes;
