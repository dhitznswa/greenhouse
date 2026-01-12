import { Server } from "socket.io";

let io: Server;

export const initializeSocketService = (socketServer: Server) => {
  io = socketServer;

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};

export { io };
