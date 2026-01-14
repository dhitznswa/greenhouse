import express from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { initializeSocketService } from "./services/socket.service";
import { logger } from "./utils/logger";

import "./services/mqtt.service";
import "./jobs/cleanup-job";
import authRouter from "./api/auth/auth.route";
import { config } from "./config/app";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: config.frontendUrl,
    methods: ["GET", "POST"],
  },
});

initializeSocketService(io);

app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);

server.listen(config.port, () => {
  logger.info(`Server is running on port ${config.port}`);
});
