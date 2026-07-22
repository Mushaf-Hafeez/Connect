import type { Request, Response, NextFunction } from "express";

import prisma from "../config/db.config.js";
import AppError from "../utils/AppError.js";

import jwt from "jsonwebtoken";

import { config } from "dotenv";
config();

import type { Payload } from "../types/index.js";

// ======================================================
//              isAuth middleware
// ======================================================
export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      throw new AppError(400, "Token is missing.");
    }

    const decode = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as Payload;

    if (typeof decode === "string") {
      throw new AppError(400, "Invalid token.");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: decode.id,
      },
      select: {
        id: true,
        displayName: true,
        username: true,
        email: true,
        isEmailVerified: true,
        profilePic: true,
        lastSeen: true,
      },
    });

    if (!user) {
      throw new AppError(404, "User not found.");
    }

    if (!user.isEmailVerified) {
      throw new AppError(401, "Please verify your email.");
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
