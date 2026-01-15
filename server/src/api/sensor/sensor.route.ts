import express, { Request, Response } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { prisma } from "../../utils/prisma";
import { logger } from "../../utils/logger";
import deviceRouter from "./device.route";

const sensorRouter = express.Router();

sensorRouter.get(
  "/histories",
  authMiddleware,
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    if (!userId)
      return res.status(401).json({
        status: "fail",
        message: "User unauthorized",
      });

    try {
      const whereClause = {
        device: {
          userId: userId,
        },
      };

      const readings = await prisma.sensorReading.findMany({
        where: whereClause,
        orderBy: {
          timestamp: "desc",
        },
        skip: offset,
        take: limit,
        include: {
          device: {
            select: {
              id: true,
              code: true,
              description: true,
            },
          },
        },
      });

      const total = await prisma.sensorReading.count({
        where: whereClause,
      });

      return res.status(200).json({
        status: "ok",
        message: "Sensor readings fetched successfully",
        data: readings,
        total: total,
        limit: limit,
        offset: offset,
      });
    } catch (err) {
      logger.error("Error fetching sensor readings history", err);
      return res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }
);

sensorRouter.use("/device", deviceRouter);

export default sensorRouter;
