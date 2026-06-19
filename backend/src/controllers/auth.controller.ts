import type { Request, Response, NextFunction } from "express";

import prisma from "../config/db.config.js";
import AppError from "../utils/AppError.js";

import { createAccountValidation } from "../validations/auth.validation.js";
import {
  createEmailVerificationLink,
  formatZodErrors,
} from "../utils/helper.js";

import bcrypt from "bcryptjs";
import { sendEmailVerificationLink } from "../utils/mail.js";

// singup controller
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // validate the data
    const result = createAccountValidation.safeParse(req.body);

    // handle validtion error
    if (!result.success) {
      throw new AppError(
        400,
        "Validation failed.",
        formatZodErrors(result.error),
      );
    }

    // get the data
    const { displayName, username, email, password } = result.data;

    // find the user in the database
    let user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    // check if the user exists and isVerified then throw error
    if (!user) {
      // hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword: string = await bcrypt.hash(password, salt);

      // create user
      user = await prisma.user.create({
        data: {
          displayName,
          username,
          email,
          password: hashedPassword,
        },
      });

      const emailVerificationToken = crypto.randomUUID();
      const emailVerificationTokenExpiresAt = new Date(
        Date.now() + 5 * 60 * 1000,
      );

      // set the emailVerification token
      const updatedUser = await prisma.user.update({
        where: {
          email: user.email,
        },
        data: {
          emailVerificationToken,
          emailVerificationTokenExpiresAt,
        },
      });

      const emailVerificationLink = createEmailVerificationLink(
        emailVerificationToken,
        user.email,
      );

      // send the link to the user's email
      await sendEmailVerificationLink(user.email, emailVerificationLink);

      // return success response with user's data
      return res.status(201).json({
        success: true,
        message: "Verify your email.",
      });
    } else if (user && !user.isEmailVerified) {
      // generate email verification token and send the mail to the user
      const emailVerificationToken = crypto.randomUUID();
      const emailVerificationTokenExpiresAt = new Date(
        Date.now() + 5 * 60 * 1000,
      );

      const updatedUser = await prisma.user.update({
        where: {
          email: user.email,
        },
        data: {
          emailVerificationToken,
          emailVerificationTokenExpiresAt,
        },
      });

      const emailVerificationLink = createEmailVerificationLink(
        emailVerificationToken,
        user.email,
      );

      // send the link to the user's email
      await sendEmailVerificationLink(user.email, emailVerificationLink);

      // send the response
      return res.status(200).json({
        success: true,
        message: "Verify your email.",
      });
    } else {
      // if user exists and also email is verified then throw error
      throw new AppError(400, "User already exists.");
    }
  } catch (error) {
    next(error);
  }
};
