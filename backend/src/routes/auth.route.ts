import { Router } from "express";
const authRoutes = Router();

// importing controllers
import { signup, login, verifyEmail } from "../controllers/auth.controller.js";

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.put("/verify-email", verifyEmail);
authRoutes.put("/verify-email", verifyEmail);

export default authRoutes;
