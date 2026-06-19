import type { Request, Response, NextFunction } from "express";

import prisma from "../config/db.config.js";
import AppError from "../utils/AppError.js";

import {
  createAccountValidation,
  emailValidation,
  loginValidation,
  resetPasswordValidation,
  verifyEmailValidation,
} from "../validations/auth.validation.js";
import {
  createEmailVerificationLink,
  createResetPasswordLink,
  formatZodErrors,
  generateJWT,
  setCookie,
} from "../utils/helper.js";

import bcrypt from "bcryptjs";
import {
  sendEmailVerificationLink,
  sendResetPasswordLink,
} from "../utils/mail.js";

// ======================================================
//             signup contoller
// ======================================================
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // validate the data
    const result = createAccountValidation.safeParse(req.body);

    // handle validation error
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

// ======================================================
//             login contoller
// ======================================================
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // validation
    const result = loginValidation.safeParse(req.body);

    // handle validation error
    if (!result.success) {
      throw new AppError(
        400,
        "Validation failed.",
        formatZodErrors(result.error),
      );
    }

    const { email, password } = result.data;

    // throw error if user not exists
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new AppError(404, "User not found.");
    }

    if (user && !user.isEmailVerified) {
      throw new AppError(401, "First verify your email.");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new AppError(400, "Invalid password.");
    } else {
      const payload = {
        id: user.id,
        username: user.username,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      };

      const token: string = generateJWT(payload);

      setCookie(token, res);

      // get non-confidential information from the user's object
      const {
        password,
        resetPasswordToken,
        resetPasswordTokenExpiresAt,
        emailVerificationToken,
        emailVerificationTokenExpiresAt,
        ...safeUser
      } = user;

      return res.status(200).json({
        success: true,
        user: safeUser,
        message: "Login successful.",
      });
    }
  } catch (error) {
    next(error);
  }
};

// ======================================================
//             verifyEmail contoller
// ======================================================
export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // validaiton
    const result = verifyEmailValidation.safeParse(req.body);

    // handle validation error
    if (!result.success) {
      throw new AppError(
        400,
        "Validation failed.",
        formatZodErrors(result.error),
      );
    }

    const { email, emailVerificationToken } = result.data;

    const user = await prisma.user.findFirst({
      where: {
        AND: [{ email }, { emailVerificationToken }],
      },
    });

    if (!user) {
      throw new AppError(404, "User not found.");
    }

    if (user && user.emailVerificationTokenExpiresAt) {
      if (user.emailVerificationTokenExpiresAt <= new Date(Date.now())) {
        throw new AppError(400, "Token expired.");
      } else {
        const updatedUser = await prisma.user.update({
          where: {
            email,
          },
          data: {
            emailVerificationToken: null,
            emailVerificationTokenExpiresAt: null,
            isEmailVerified: true,
          },
        });

        const {
          password,
          emailVerificationToken,
          emailVerificationTokenExpiresAt,
          resetPasswordToken,
          resetPasswordTokenExpiresAt,
          ...safeUser
        } = updatedUser;

        const payload = {
          id: updatedUser.id,
          username: updatedUser.username,
          email: updatedUser.email,
          isEmailVerified: updatedUser.isEmailVerified,
        };

        // create token
        const token = generateJWT(payload);

        // set cookie
        setCookie(token, res);

        return res.status(200).json({
          success: true,
          user: safeUser,
          message: "Email verified.",
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

// ======================================================
//             Forgot password contoller
// ======================================================
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // validation
    const result = emailValidation.safeParse(req.body);

    // handle validation error
    if (!result.success) {
      throw new AppError(
        400,
        "Validation failed.",
        formatZodErrors(result.error),
      );
    }

    const { email } = result.data;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new AppError(404, "User not found.");
    }

    // generate reset password token and send the mail to the user
    const resetPasswordToken = crypto.randomUUID();
    const resetPasswordTokenExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const updatedUser = await prisma.user.update({
      where: {
        email,
      },
      data: {
        resetPasswordToken,
        resetPasswordTokenExpiresAt,
      },
    });

    const resetPasswordLink = createResetPasswordLink(
      resetPasswordToken,
      user.email,
    );

    // send the link to the user's email
    await sendResetPasswordLink(user.email, resetPasswordLink);

    // send the response
    return res.status(200).json({
      success: true,
      message: "Check your email.",
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // validation
    const result = resetPasswordValidation.safeParse(req.body);

    // hanlde validation error
    if (!result.success) {
      throw new AppError(
        400,
        "Validation failed.",
        formatZodErrors(result.error),
      );
    }

    const { email, resetPasswordToken, password, confirmPassword } =
      result.data;

    const user = await prisma.user.findFirst({
      where: {
        AND: [{ email }, { resetPasswordToken }],
      },
    });

    if (!user) {
      throw new AppError(404, "User not found.");
    }

    if (user && user.resetPasswordTokenExpiresAt) {
      if (user.resetPasswordTokenExpiresAt <= new Date(Date.now())) {
        throw new AppError(400, "Token expired.");
      } else {
        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const updatedUser = await prisma.user.update({
          where: {
            email,
          },
          data: {
            resetPasswordToken: null,
            resetPasswordTokenExpiresAt: null,
            password: hashedPassword,
          },
        });

        return res.status(200).json({
          success: true,
          message: "Password has been reset. Please login.",
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

// ======================================================
//             checkAuth contoller
// ======================================================
export const checkAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
//             logout contoller
// ======================================================
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.clearCookie("token");

    return res.status(200).json({
      success: true,
      message: "Logout successful.",
    });
  } catch (error) {
    next(error);
  }
};
