import { Router } from "express";

import { isAuth } from "../middlewares/auth.middleware.js";
import { getCallHistory } from "../controllers/call.controller.js";

const callRoutes = Router();

callRoutes.get("/", isAuth, getCallHistory);

export default callRoutes;
