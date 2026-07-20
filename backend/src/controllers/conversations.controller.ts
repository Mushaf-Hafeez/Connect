import type { Request, Response, NextFunction } from "express";

import prisma from "../config/db.config.js";
import AppError from "../utils/AppError.js";

import {
  conversationIdValidation,
  createConversationValidation,
  deleteMessageValidation,
  updateMessageValidation,
} from "../validations/conversation.validation.js";
import { success } from "zod";
import { formatZodErrors } from "../utils/helper.js";
import { io } from "../socket.js";

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
          user: {
            select: {
              id: true,
              displayName: true,
              username: true,
              profilePic: true,
            },
          },
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
    const conversations = await prisma.conversation.findMany({
      where: {
        type: "DIRECT",
        participants: {
          some: {
            userId: req.user.id,
          },
        },
      },
      select: {
        id: true,
        type: true,
        participants: {
          where: { userId: { not: req.user.id } },
          select: {
            user: {
              select: {
                id: true,
                displayName: true,
                username: true,
                profilePic: true,
                lastSeen: true,
              },
            },
            lastReadAt: true,
            joinedAt: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          select: {
            id: true,
            text: true,
            attachments: true,
            sender: {
              select: {
                id: true,
                displayName: true,
                username: true,
                profilePic: true,
              },
            },
            statuses: {
              select: {
                id: true,
                userId: true,
                status: true,
              },
            },
            createdAt: true,
          },
        },
        _count: {
          select: {
            messages: {
              where: {
                statuses: {
                  some: {
                    userId: req.user.id,
                    status: {
                      not: "SEEN",
                    },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      conversations,
    });
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

    const { conversationId } = result.data;

    const page = Number(req.query.page) || 1;
    const take = Number(req.query.take) || 20;
    const skip = (page - 1) * take;

    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        userId_conversationId: {
          userId: req.user.id,
          conversationId,
        },
      },
    });

    if (!participant) {
      throw new AppError(403, "You are not part of this conversation.");
    }

    const messages = await prisma.message.findMany({
      where: {
        conversationId,
      },
      select: {
        id: true,
        text: true,
        attachments: true,
        createdAt: true,
        sender: {
          select: {
            id: true,
            displayName: true,
            username: true,
            profilePic: true,
          },
        },
        statuses: {
          select: {
            id: true,
            userId: true,
            status: true,
          },
        },
      },
      skip,
      take,
      orderBy: {
        createdAt: "desc",
      },
    });

    const totalMessages = await prisma.message.count({
      where: {
        conversationId,
      },
    });

    const hasMore = totalMessages > skip + take;

    return res.status(200).json({
      success: true,
      messages: messages.reverse(),
      hasMore,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
//             sendMessage controller
// ======================================================
export const sendMessage = async (
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

    const { conversationId } = result.data;

    if (req.files?.length === 0 && req.body.text.trim() === "") {
      throw new AppError(
        400,
        "Cannot send an empty text. Provide text or attachments.",
      );
    }

    const files = (req.files as Express.Multer.File[]) || [];
    let attachments: string[] = [];

    if (files.length > 0) {
      files.map((file) => attachments.push(file.path));
    }

    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        userId_conversationId: {
          conversationId,
          userId: req.user.id,
        },
      },
    });

    if (!participant) {
      throw new AppError(
        403,
        "You are not a participant of this conversation.",
      );
    }

    const receiver = await prisma.conversationParticipant.findFirst({
      where: {
        conversationId,
        userId: {
          not: req.user.id,
        },
      },
      select: {
        user: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!receiver) {
      throw new AppError(404, "Receipent does not exist");
    }

    const message = await prisma.message.create({
      data: {
        conversationId,
        text: req.body.text,
        attachments,
        senderId: req.user.id,
        statuses: {
          create: {
            userId: receiver.user.id,
            status: "SENT",
          },
        },
      },
      select: {
        id: true,
        text: true,
        attachments: true,
        createdAt: true,
        conversationId: true,
        sender: {
          select: {
            id: true,
            displayName: true,
            username: true,
            profilePic: true,
          },
        },
        statuses: {
          select: {
            id: true,
            userId: true,
            status: true,
          },
        },
      },
    });

    // send message to the user using sockets

    console.log(receiver.user.id);
    io.to(receiver.user.id).emit("new-message", message);

    return res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
//             updateMessage controller
// ======================================================
export const updateMessage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // validation
    const result = updateMessageValidation.safeParse({
      ...req.params,
      ...req.body,
    });

    // handling validation error
    if (!result.success) {
      throw new AppError(
        400,
        "Validation failed.",
        formatZodErrors(result.error),
      );
    }

    const { conversationId, messageId, text } = result.data;

    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        userId_conversationId: {
          conversationId,
          userId: req.user.id,
        },
      },
    });

    if (!participant) {
      throw new AppError(
        403,
        "You are not a participant of this conversation.",
      );
    }

    const message = await prisma.message.findUnique({
      where: {
        id: messageId,
      },
    });

    if (!message) {
      throw new AppError(404, "Message not found.");
    }

    if (message.senderId !== req.user.id) {
      throw new AppError(403, "You are not authorized to update the message.");
    }

    const updatedMessage = await prisma.message.update({
      where: {
        id: messageId,
      },
      data: {
        text,
      },
      select: {
        id: true,
        text: true,
        attachments: true,
        sender: {
          select: {
            id: true,
            displayName: true,
            username: true,
            profilePic: true,
          },
        },
        statuses: {
          select: {
            id: true,
            userId: true,
            status: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      updatedMessage,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
//             deleteMessage controller
// ======================================================
export const deleteMessage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // validation
    const result = deleteMessageValidation.safeParse(req.params);

    // handling validation error
    if (!result.success) {
      throw new AppError(
        400,
        "Validation failed.",
        formatZodErrors(result.error),
      );
    }

    const { conversationId, messageId } = result.data;

    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        userId_conversationId: {
          conversationId,
          userId: req.user.id,
        },
      },
    });

    if (!participant) {
      throw new AppError(
        403,
        "You are not a participant of this conversation.",
      );
    }

    const message = await prisma.message.findUnique({
      where: {
        id: messageId,
      },
      include: {
        sender: true,
      },
    });

    if (!message) {
      throw new AppError(404, "Message not found.");
    }

    if (message.sender.id !== req.user.id) {
      throw new AppError(403, "You are not authorized to delete the message.");
    }

    await prisma.message.delete({
      where: {
        id: messageId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Message deleted.",
    });
  } catch (error) {
    next(error);
  }
};
