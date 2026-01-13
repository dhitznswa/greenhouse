import { Server } from "socket.io";
import { logger } from "../utils/logger";

let io: Server;

export const initializeSocketService = (socketServer: Server) => {
  io = socketServer;

  io.on("connection", (socket) => {
    logger.info(`New client connected ${socket.id}`);

    socket.on("disconnect", () => {
      logger.info(`Client disconnected ${socket.id}`);
    });
  });
};

export { io };
