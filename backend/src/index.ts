import express from "express";
import type { Application, Request, Response, NextFunction } from "express";

// importing types
import type { CustomError } from "./types/index.js";

// importing logger
import logger from "./utils/logger.js";
import httpLogger from "./utils/httpLogger.js";

// environment variables
import { config } from "dotenv";
config();

const PORT = process.env.PORT || 3000;

// app instance
const app: Application = express();

// middlewares
app.use(express.json());
app.use(httpLogger);

// global error handler
app.use(
  (error: CustomError, req: Request, res: Response, next: NextFunction) => {
    req.log.error({
      message: error.message,
      path: req.originalUrl,
      method: req.method,
    });

    const status = error.status || 500;
    const message = error.message || "Something went wrong.";

    return res.status(status).json({
      message,
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
