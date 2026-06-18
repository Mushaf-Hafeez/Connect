import type { Request, Response, NextFunction } from "express";
import prisma from "../config/db.config.js";
import AppError from "../utils/AppError.js";

// singup controller
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // get the data from the req
    // validate the data
    // handle validtion error
    // find the user in the database
    // check if the user exists and isVerified then throw error
    // if not verified generte the email verification token and send the mail to the user
  } catch (error) {
    next(error);
  }
};
