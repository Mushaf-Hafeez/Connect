import type { Request, Response, NextFunction } from "express";

import prisma from "../config/db.config.js";

export const getCallHistory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user.id;

    const calls = await prisma.call.findMany({
      where: {
        OR: [{ callerId: userId }, { receiverId: userId }],
      },
      orderBy: { createdAt: "desc" },
      include: {
        caller: {
          select: {
            id: true,
            displayName: true,
            profilePic: true,
          },
        },
        receiver: {
          select: {
            id: true,
            displayName: true,
            profilePic: true,
          },
        },
      },
    });

    const callHistory = calls.map((call) => {
      const isOutgoing = call.callerId === userId;

      return {
        id: call.id,
        status: call.status,
        duration: call.duration,
        createdAt: call.createdAt,
        direction: isOutgoing ? "outgoing" : "incoming",
        peer: isOutgoing ? call.receiver : call.caller,
      };
    });

    return res.status(200).json({
      success: true,
      calls: callHistory,
    });
  } catch (error) {
    next(error);
  }
};
