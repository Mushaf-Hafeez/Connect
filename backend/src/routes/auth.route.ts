import { Router } from "express";
const authRoutes = Router();

// importing controllers
import {
  signup,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.put("/verify-email", verifyEmail);
authRoutes.put("/forgot-password", forgotPassword);
authRoutes.put("/reset-password", resetPassword);

export default authRoutes;
