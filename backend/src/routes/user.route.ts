import { Router } from "express";
const userRoutes = Router();

// importing middlwares
import { isAuth } from "../middlewares/auth.middleware.js";

// importing controllers
import { searchUser } from "../controllers/user.controller.js";

userRoutes.get("/search", isAuth, searchUser);

export default userRoutes;
