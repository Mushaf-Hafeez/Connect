import express from "express";
import type { Application, Request, Response, NextFunction } from "express";

// importing types
import type { CustomError } from "./types/index.js";

// importing logger
import logger from "./utils/logger.js";
import httpLogger from "./utils/httpLogger.js";

import cookieParser from "cookie-parser";
import cors from "cors";

// importing routes
import authRoutes from "./routes/auth.route.js";
import friendRoutes from "./routes/friend.route.js";
import userRoutes from "./routes/user.route.js";

// environment variables
import { config } from "dotenv";
config();

const PORT = process.env.PORT || 3000;

// app instance
const app: Application = express();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(httpLogger);
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

// mounting routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/friends", friendRoutes);
app.use("/api/v1/users", userRoutes);

// global error handler
app.use(
  (error: CustomError, req: Request, res: Response, next: NextFunction) => {
    req.log.error({
      message: error.message,
      path: req.originalUrl,
      method: req.method,
      stack: error.stack,
    });

    const status = error.status || 500;

    return res.status(status).json({
      success: false,
      message: error.message || "Something went wrong.",
      errors: error.errors || null,
    });
  },
);

// default route
app.get("/", (req: Request, res: Response) => {
  res.send("server is working fine...");
});

// listen to the requests
app.listen(PORT, () => {
  logger.info(`http://localhost:${PORT}`);
});
