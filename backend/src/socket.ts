import express from "express";
import type { Application } from "express";
import http from "http";

import { Server } from "socket.io";

import { config } from "dotenv";
config();

export const app: Application = express();
export const server = http.createServer(app);

export const connectedUsers: any = {};

// creating socket server
const io = new Server(server, {
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

  socket.on("disconnect", () => {
    delete connectedUsers[userId];
    console.log(`user disconnected: ${userId}`);
    io.emit("remove-online-user", userId);
  });
});
