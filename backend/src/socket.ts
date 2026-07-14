import express from "express";
import type { Application } from "express";
import http from "http";

import { Server } from "socket.io";

import { config } from "dotenv";
import prisma from "./config/db.config.js";
config();

export const app: Application = express();
export const server = http.createServer(app);

export const connectedUsers: any = {};

// creating socket server
export const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// establish socket connection
io.on("connection", (socket) => {
  console.log(`user connected: ${socket.id}`);

  const { userId } = socket.handshake.auth;
  const { id: socketId } = socket;

  if (!userId) {
    socket.disconnect();
    return;
  }

  // join room
  socket.join(userId);
  // store the userId with socketId
  connectedUsers[userId] = socketId;
  // online user event
  io.emit("add-online-user", Object.keys(connectedUsers));

  socket.on(
    "typing-start",
    ({
      conversationId,
      recipientId,
    }: {
      conversationId: string;
      recipientId: string;
    }) => {
      if (!conversationId || !recipientId || recipientId === userId) return;

      io.to(recipientId).emit("user-typing", {
        conversationId,
        senderId: userId,
      });
    },
  );

  socket.on(
    "typing-stop",
    ({
      conversationId,
      recipientId,
    }: {
      conversationId: string;
      recipientId: string;
    }) => {
      if (!conversationId || !recipientId || recipientId === userId) return;

      io.to(recipientId).emit("user-stopped-typing", {
        conversationId,
        senderId: userId,
      });
    },
  );

  socket.on("message-delivered", async (statusId) => {
    const updatedStatus = await prisma.messageStatus.update({
      where: {
        id: statusId,
      },
      data: {
        status: "DELIVERED",
      },
      select: {
        id: true,
        userId: true,
        status: true,
        message: {
          select: {
            id: true,
            senderId: true,
          },
        },
      },
    });

    socket.to(updatedStatus.message.senderId).emit("message-status-updated", {
      messageId: updatedStatus.message.id,
      status: {
        id: updatedStatus.id,
        userId: updatedStatus.userId,
        status: updatedStatus.status,
      },
    });
  });

  socket.on("sync-missed-messages", async () => {
    const missed = await prisma.messageStatus.findMany({
      where: { userId, status: "SENT" },
      select: { id: true, message: { select: { id: true, senderId: true } } },
    });

    if (missed.length === 0) return;

    await prisma.messageStatus.updateMany({
      where: { id: { in: missed.map((m) => m.id) } },
      data: { status: "DELIVERED" },
    });

    // group by sender so each sender gets one batched notification
    const bySender = missed.reduce(
      (acc, m) => {
        (acc[m.message.senderId] ??= []).push(m.message.id);
        return acc;
      },
      {} as Record<string, string[]>,
    );

    for (const [senderId, messageIds] of Object.entries(bySender)) {
      socket.to(senderId).emit("messages-delivered-batch", {
        messageIds,
        userId,
      });
    }
  });

  socket.on("disconnect", async () => {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        lastSeen: new Date(),
      },
    });

    delete connectedUsers[userId];
    console.log(`user disconnected: ${userId}`);
    io.emit("remove-online-user", userId);
  });
});
