import express from "express";
import type { Application } from "express";
import http from "http";

import { Server } from "socket.io";

import { config } from "dotenv";
config();

export const app: Application = express();
export const server = http.createServer(app);

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

  socket.on("disconnect", () => {
    console.log("user disconnected.");
  });
});
