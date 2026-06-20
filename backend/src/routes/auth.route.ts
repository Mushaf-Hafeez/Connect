import { Router } from "express";
const authRoutes = Router();

// importing controllers
import {
  signup,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  changePassword,
  checkAuth,
  logout,
} from "../controllers/auth.controller.js";

// importing middlwares
import { isAuth } from "../middlewares/auth.middleware.js";

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.put("/verify-email", verifyEmail);
authRoutes.put("/forgot-password", forgotPassword);
authRoutes.put("/reset-password", resetPassword);
authRoutes.put("/change-password", isAuth, changePassword);
authRoutes.get("/check-auth", isAuth, checkAuth);
authRoutes.get("/logout", isAuth, logout);

export default authRoutes;
