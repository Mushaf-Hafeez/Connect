import type { Request, Response, NextFunction } from "express";

import prisma from "../config/db.config.js";
import AppError from "../utils/AppError.js";

import {
  conversationIdValidation,
  createConversationValidation,
} from "../validations/conversation.validation.js";
import { success } from "zod";

// ======================================================
//             conversation controller
// ======================================================
export const conversation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // validation
    const result = createConversationValidation.safeParse(req.params);

    // handling validation error
    if (!result.success) {
      throw new AppError(400, "Validation failed.");
    }

    const { userId } = result.data;

    if (userId === req.user.id) {
      throw new AppError(400, "Cannot start conversation with yourself.");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new AppError(404, "User not found.");
    }

    const friendship = await prisma.friendship.findFirst({
      where: {
        status: "ACCEPTED",
        OR: [
          { requesterId: req.user.id, receiverId: userId },
          { requesterId: userId, receiverId: req.user.id },
        ],
      },
    });

    if (!friendship) {
      throw new AppError(403, "You can only message your friends.");
    }

    const select = {
      id: true,
      type: true,
      createdAt: true,
      updatedAt: true,
      participants: {
        select: {
          userId: true,
          lastReadAt: true,
          joinedAt: true,
        },
      },
    };

    const conversation = await prisma.conversation.findFirst({
      where: {
        type: "DIRECT",
        AND: [
          { participants: { some: { userId: req.user.id } } },
          { participants: { some: { userId } } },
        ],
      },
      select,
    });

    if (conversation) {
      return res.status(200).json({
        success: true,
        conversation,
      });
    }

    const newConversation = await prisma.conversation.create({
      data: {
        type: "DIRECT",
        participants: {
          createMany: {
            data: [{ userId: req.user.id }, { userId }],
          },
        },
      },
      select,
    });

    return res.status(201).json({
      success: true,
      conversation: newConversation,
    });
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
    // validation
    const result = conversationIdValidation.safeParse(req.params);

    // handling validation error
    if (!result.success) {
      throw new AppError(400, "Validation failed.");
    }

    const { id } = result.data;
  } catch (error) {
    next(error);
  }
};
