import { Router } from "express";
const userRoutes = Router();

// importing middlwares
import { isAuth } from "../middlewares/auth.middleware.js";

// importing controllers
import {
  searchUser,
  updateProfilePic,
  updateDisplayName,
} from "../controllers/user.controller.js";
import { upload } from "../config/multer.config.js";

userRoutes.get("/search", isAuth, searchUser);
userRoutes.put(
  "/update-profile",
  isAuth,
  upload.single("profile-pic"),
  updateProfilePic,
);
userRoutes.put("/", isAuth, updateDisplayName);

export default userRoutes;
