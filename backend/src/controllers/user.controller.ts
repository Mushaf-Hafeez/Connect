import type { Request, Response, NextFunction } from "express";

import AppError from "../utils/AppError.js";

import { searchUserValidation } from "../validations/user.validation.js";

import prisma from "../config/db.config.js";
import { displayNameValidation } from "../validations/auth.validation.js";

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

    const users = await prisma.user.findMany({
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
          {
            id: {
              not: {
                equals: req.user.id,
              },
            },
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
      users,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
//             updateProfilePic contoller
// ======================================================
export const updateProfilePic = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const profilePic = req.file as Express.Multer.File;

    if (!profilePic) {
      throw new AppError(400, "Profile pic is missing.");
    }

    await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        profilePic: profilePic.path,
      },
    });

    return res.status(200).json({
      sucess: true,
      profilePic: profilePic.path,
      message: "profile pic updated successfully.",
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
//             updateDisplayName contoller
// ======================================================
export const updateDisplayName = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // validation
    const result = displayNameValidation.safeParse(req.body);

    // handling validation error
    if (!result.success) {
      throw new AppError(400, "Validation failed.");
    }

    await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        displayName: result.data.displayName,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Name has been updated.",
    });
  } catch (error) {
    next(error);
  }
};
