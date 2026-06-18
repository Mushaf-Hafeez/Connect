import { Router } from "express";
const authRoutes = Router();

// importing controllers
import { signup } from "../controllers/auth.controller.js";

authRoutes.post("/signup", signup);

export default authRoutes;
