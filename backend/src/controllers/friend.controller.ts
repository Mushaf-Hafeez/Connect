import type { Request, Response, NextFunction } from "express";

import prisma from "../config/db.config.js";
import AppError from "../utils/AppError.js";

import {
  friendRequestValidation,
  sendRequestValidation,
} from "../validations/friend.validation.js";

// ======================================================
//             sendRequest contoller
// ======================================================
export const sendFriendRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // validation
    const result = sendRequestValidation.safeParse(req.params);

    // handling validation errors
    if (!result.success) {
      throw new AppError(400, "Validation failed.");
    }

    const { userId } = result.data;

    if (req.user.id === userId) {
      throw new AppError(400, "You cannot send a friend request to yourself.");
    }

    // throw error if no user exists with this id
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new AppError(404, "User not found.");
    }

    // check if request already exists in either direction
    const existing = await prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId: req.user.id, receiverId: userId },
          { requesterId: userId, receiverId: req.user.id },
        ],
      },
    });

    if (existing) {
      throw new AppError(400, "Friend request already exists.");
    }

    // create friendship
    await prisma.friendship.create({
      data: {
        requesterId: req.user.id,
        receiverId: userId,
      },
    });

    // return success response
    return res.status(201).json({
      success: true,
      message: "Request sent successfully.",
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
//             acceptFriendRequest contoller
// ======================================================
export const acceptFriendRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // validation
    const result = friendRequestValidation.safeParse(req.params);

    // handling validation error
    if (!result.success) {
      throw new AppError(400, "Validation failed.");
    }

    const { friendshipId } = result.data;

    const friendship = await prisma.friendship.findUnique({
      where: {
        id: friendshipId,
      },
    });

    if (!friendship) {
      throw new AppError(404, "Friendship not found.");
    }

    if (friendship.receiverId !== req.user.id) {
      throw new AppError(403, "You are not authorized to accept this request.");
    }

    if (friendship.status !== "PENDING") {
      throw new AppError(400, "This request is no longer pending.");
    }

    await prisma.friendship.update({
      where: {
        id: friendshipId,
      },
      data: {
        status: "ACCEPTED",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Friend request has been accepted.",
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
//             rejectFriendRequest contoller
// ======================================================
export const rejectFriendRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = friendRequestValidation.safeParse(req.params);

    if (!result.success) {
      throw new AppError(400, "Validation failed.");
    }

    const { friendshipId } = result.data;

    const friendship = await prisma.friendship.findUnique({
      where: {
        id: friendshipId,
      },
    });

    if (!friendship) {
      throw new AppError(404, "Friendship not found.");
    }

    if (friendship.receiverId !== req.user.id) {
      throw new AppError(403, "You are not authorized to reject this request.");
    }

    if (friendship.status !== "PENDING") {
      throw new AppError(400, "This request is no longer pending.");
    }

    await prisma.friendship.delete({
      where: {
        id: friendshipId,
      },
    });
    return res.status(200).json({
      success: true,
      message: "Friend request has been rejected.",
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
//             cancelFriendRequest contoller
// ======================================================
export const cancelFriendRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = friendRequestValidation.safeParse(req.params);

    if (!result.success) {
      throw new AppError(400, "Validation failed.");
    }

    const { friendshipId } = result.data;

    const friendship = await prisma.friendship.findUnique({
      where: {
        id: friendshipId,
      },
    });

    if (!friendship) {
      throw new AppError(404, "Friendship not found.");
    }

    if (friendship.requesterId !== req.user.id) {
      throw new AppError(403, "You are not authorized to cancel this request.");
    }

    if (friendship.status !== "PENDING") {
      throw new AppError(400, "This request is no longer pending.");
    }

    await prisma.friendship.delete({
      where: {
        id: friendshipId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Friend request has been cancelled.",
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
//             removeExistingFriendRequest contoller
// ======================================================
export const removeExistingFriendRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = friendRequestValidation.safeParse(req.params);

    if (!result.success) {
      throw new AppError(400, "Validation failed.");
    }

    const { friendshipId } = result.data;

    const friendship = await prisma.friendship.findUnique({
      where: {
        id: friendshipId,
      },
    });

    if (!friendship) {
      throw new AppError(404, "Friendship not found.");
    }

    if (
      friendship.requesterId !== req.user.id &&
      friendship.receiverId !== req.user.id
    ) {
      throw new AppError(403, "You are not part of this friendship.");
    }

    if (friendship.status === "PENDING") {
      throw new AppError(
        400,
        "Cannot remove friend while the request is pending.",
      );
    }

    await prisma.friendship.delete({
      where: {
        id: friendshipId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Friend removed successfully.",
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
//             getFriends contoller
// ======================================================
export const getFriends = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const friendships = await prisma.friendship.findMany({
      where: {
        AND: [
          { status: "ACCEPTED" },
          {
            OR: [{ requesterId: req.user.id }, { receiverId: req.user.id }],
          },
        ],
      },
      select: {
        id: true,
        requester: {
          select: {
            id: true,
            displayName: true,
            username: true,
            profilePic: true,
          },
        },
        receiver: {
          select: {
            id: true,
            displayName: true,
            username: true,
            profilePic: true,
          },
        },
      },
    });

    const friends = friendships.map((f) => {
      const friendData =
        f.requester.id === req.user.id ? f.receiver : f.requester;
      return {
        friendshipId: f.id,
        ...friendData,
      };
    });

    return res.status(200).json({
      success: true,
      friends,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
//             pendingFriendRequests contoller
// ======================================================
export const pendingFriendRequests = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const friends = await prisma.friendship.findMany({
      where: {
        AND: [
          { status: "PENDING" },
          {
            receiverId: req.user.id,
          },
        ],
      },
      select: {
        id: true,
        requester: {
          select: {
            displayName: true,
            username: true,
            profilePic: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      friends,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
//             sentFriendRequests contoller
// ======================================================
export const sentFriendRequests = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const friends = await prisma.friendship.findMany({
      where: {
        AND: [
          { status: "PENDING" },
          {
            requesterId: req.user.id,
          },
        ],
      },
      select: {
        id: true,
        receiver: {
          select: {
            displayName: true,
            username: true,
            profilePic: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      friends,
    });
  } catch (error) {
    next(error);
  }
};
