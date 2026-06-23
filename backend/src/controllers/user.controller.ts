import type { Request, Response, NextFunction } from "express";

import AppError from "../utils/AppError.js";

import { searchUserValidation } from "../validations/user.validation.js";

import prisma from "../config/db.config.js";

// ======================================================
//             searchUser contoller
// ======================================================
export const searchUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // validation
    const result = searchUserValidation.safeParse(req.query);

    // handling validation errors
    if (!result.success) {
      throw new AppError(400, "Validation failed.");
    }

    const { username } = result.data;

    const user = await prisma.user.findMany({
      where: {
        AND: [
          {
            username: {
              contains: username,
              mode: "insensitive",
            },
          },
          {
            isEmailVerified: true,
          },
        ],
      },
      select: {
        id: true,
        displayName: true,
        username: true,
        profilePic: true,
      },
    });

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};
