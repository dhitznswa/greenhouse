import express, { Request, Response } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { prisma } from "../../utils/prisma";

const deviceRouter = express.Router();

deviceRouter.get("/", authMiddleware, async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (userId)
    return res.status(401).json({
      status: "fail",
      message: "User unauthorization",
    });

  const device = await prisma.device.findMany({
    where: {
      userId: userId,
    },
  });

  return res.json({
    status: "ok",
    message: "Fetched device succesful",
    device: device,
  });
});

deviceRouter.post(
  "/",
  authMiddleware,
  async (req: Request, res: Response) => {}
);

export default deviceRouter;
