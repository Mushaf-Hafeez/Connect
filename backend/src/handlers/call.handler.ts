import type { Server, Socket } from "socket.io";
import prisma from "../config/db.config.js";

interface CallSession {
  callerId: string;
  receiverId: string;
  timeoutId: NodeJS.Timeout;
  connectedAt: number | null;
  persisted: boolean;
}

const usersInCall = new Set<string>();
const pendingCalls = new Map<string, CallSession>();
const receiverPending = new Map<string, string>();

async function persistCall(
  callerId: string,
  receiverId: string,
  status: "MISSED" | "RECEIVED",
  duration: number,
) {
  await prisma.call.create({
    data: {
      callerId,
      receiverId,
      status,
      duration,
    },
  });
}

function clearSession(callerId: string) {
  const session = pendingCalls.get(callerId);
  if (!session) return;

  clearTimeout(session.timeoutId);
  usersInCall.delete(session.callerId);
  usersInCall.delete(session.receiverId);
  receiverPending.delete(session.receiverId);
  pendingCalls.delete(callerId);
}

function resolveSession(
  callerId: string,
  receiverId: string,
): CallSession | undefined {
  const session = pendingCalls.get(callerId);
  if (!session || session.receiverId !== receiverId) return undefined;
  return session;
}

export function registerCallHandlers(io: Server, socket: Socket, userId: string) {
  socket.on(
    "call:ring",
    ({
      receiverId,
      caller,
      isVideo,
    }: {
      receiverId: string;
      caller: { id: string; displayName: string; profilePic: string | null };
      isVideo: boolean;
    }) => {
      if (!receiverId || receiverId === userId) return;

      if (usersInCall.has(receiverId) || receiverPending.has(receiverId)) {
        socket.emit("call:busy", { receiverId });
        return;
      }

      if (usersInCall.has(userId) || pendingCalls.has(userId)) {
        return;
      }

      const timeoutId = setTimeout(async () => {
        const session = pendingCalls.get(userId);
        if (!session || session.persisted) return;

        session.persisted = true;
        await persistCall(userId, receiverId, "MISSED", 0);
        io.to(userId).emit("call:timeout", { callerId: userId, receiverId });
        clearSession(userId);
      }, 30_000);

      pendingCalls.set(userId, {
        callerId: userId,
        receiverId,
        timeoutId,
        connectedAt: null,
        persisted: false,
      });
      receiverPending.set(receiverId, userId);

      io.to(receiverId).emit("call:ring", {
        callerId: userId,
        caller,
        isVideo,
        receiverId,
      });
    },
  );

  socket.on(
    "call:accept",
    ({ callerId, receiverId }: { callerId: string; receiverId: string }) => {
      const session = resolveSession(callerId, receiverId);
      if (!session || userId !== receiverId) return;

      clearTimeout(session.timeoutId);
      session.connectedAt = Date.now();
      usersInCall.add(callerId);
      usersInCall.add(receiverId);

      io.to(callerId).emit("call:accept", { callerId, receiverId });
    },
  );

  socket.on(
    "call:reject",
    async ({ callerId, receiverId }: { callerId: string; receiverId: string }) => {
      const session = resolveSession(callerId, receiverId);
      if (!session) return;

      if (!session.persisted) {
        session.persisted = true;
        await persistCall(callerId, receiverId, "MISSED", 0);
      }

      clearSession(callerId);
      io.to(callerId).emit("call:reject", { callerId, receiverId });
    },
  );

  socket.on(
    "call:offer",
    ({
      callerId,
      receiverId,
      sdp,
    }: {
      callerId: string;
      receiverId: string;
      sdp: unknown;
    }) => {
      if (userId !== callerId) return;
      io.to(receiverId).emit("call:offer", { callerId, receiverId, sdp });
    },
  );

  socket.on(
    "call:answer",
    ({
      callerId,
      receiverId,
      sdp,
    }: {
      callerId: string;
      receiverId: string;
      sdp: unknown;
    }) => {
      if (userId !== receiverId) return;
      io.to(callerId).emit("call:answer", { callerId, receiverId, sdp });
    },
  );

  socket.on(
    "call:ice-candidate",
    ({
      callerId,
      receiverId,
      candidate,
    }: {
      callerId: string;
      receiverId: string;
      candidate: unknown;
    }) => {
      const isParticipant = userId === callerId || userId === receiverId;
      if (!isParticipant) return;

      const otherId = userId === callerId ? receiverId : callerId;
      io.to(otherId).emit("call:ice-candidate", {
        callerId,
        receiverId,
        candidate,
      });
    },
  );

  socket.on(
    "call:end",
    async ({
      callerId,
      receiverId,
      duration = 0,
    }: {
      callerId: string;
      receiverId: string;
      duration?: number;
    }) => {
      if (userId !== callerId && userId !== receiverId) return;

      const session = pendingCalls.get(callerId);
      const otherId = userId === callerId ? receiverId : callerId;

      if (session && !session.persisted) {
        session.persisted = true;
        const wasConnected = session.connectedAt !== null;
        const computedDuration =
          wasConnected && session.connectedAt
            ? Math.floor((Date.now() - session.connectedAt) / 1000)
            : duration;

        await persistCall(
          callerId,
          receiverId,
          wasConnected ? "RECEIVED" : "MISSED",
          wasConnected ? computedDuration : 0,
        );
      } else if (!session && usersInCall.has(userId)) {
        await persistCall(callerId, receiverId, "RECEIVED", duration);
      }

      clearSession(callerId);
      io.to(otherId).emit("call:end", { callerId, receiverId, duration });
    },
  );

  socket.on("disconnect", async () => {
    for (const [callerId, session] of pendingCalls.entries()) {
      if (session.callerId !== userId && session.receiverId !== userId) {
        continue;
      }

      const otherId =
        session.callerId === userId ? session.receiverId : session.callerId;

      if (!session.persisted) {
        session.persisted = true;
        const wasConnected = session.connectedAt !== null;
        await persistCall(
          session.callerId,
          session.receiverId,
          wasConnected ? "RECEIVED" : "MISSED",
          wasConnected && session.connectedAt
            ? Math.floor((Date.now() - session.connectedAt) / 1000)
            : 0,
        );
      }

      io.to(otherId).emit("call:end", {
        callerId: session.callerId,
        receiverId: session.receiverId,
        duration: 0,
      });

      clearSession(callerId);
    }
  });
}
