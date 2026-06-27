import type { Request, Response, NextFunction } from "express";

import prisma from "../config/db.config.js";
import AppError from "../utils/AppError.js";

// ======================================================
//             conversation controller
// ======================================================
export const conversation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
  } catch (error) {
    next(error);
  }
};

// ======================================================
//             getConversations controller
// ======================================================
export const getConversations = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
  } catch (error) {
    next(error);
  }
};

// ======================================================
//             getMessages controller
// ======================================================
export const getMessages = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
  } catch (error) {
    next(error);
  }
};
