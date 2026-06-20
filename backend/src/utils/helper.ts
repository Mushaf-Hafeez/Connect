import { z } from "zod";

import type { Response } from "express";
import type { Payload } from "../types/index.js";

import jwt from "jsonwebtoken";

import { config } from "dotenv";
config();

// this function will return the arrays of formatted errors
export const formatZodErrors = (error: any) => {
  return error.issues.map((issue: any) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
};

// function to generate the jsonwebtoken
export const generateJWT = (payload: Payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: 7 * 24 * 60 * 60 * 1000,
  });
};

// function to set the cookie in the browser
export const setCookie = (token: string, res: Response) => {
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const createEmailVerificationLink = (
  emailVerificationToken: string,
  email: string,
) => {
  return `${process.env.FRONTEND_URL}/verify-email?emailVerificationToken=${emailVerificationToken}&email=${email}`;
};

export const createResetPasswordLink = (
  resetPasswordToken: string,
  email: string,
) => {
  return `${process.env.FRONTEND_URL}/reset-password?resetPasswordToken=${resetPasswordToken}&email=${email}`;
};
