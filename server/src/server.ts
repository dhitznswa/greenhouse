import express from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { initializeSocketService } from "./services/socket.service";
import { logger } from "./utils/logger";

import "dotenv/config";
import "./services/mqtt.service";
import "./jobs/cleanup-job";
import authRouter from "./api/auth/auth.route";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

initializeSocketService(io);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);

const PORT = process.env.PORT || 2525;
server.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
