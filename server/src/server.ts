import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { initializeSocketService } from "./services/socket.service";
import { logger } from "./utils/logger";

import "dotenv/config";
import "./services/mqtt.service";
import "./jobs/cleanup-job";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

initializeSocketService(io);

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 2525;
server.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
