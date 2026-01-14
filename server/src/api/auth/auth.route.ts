import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../../utils/prisma";
import { comparePassword, hashPassword } from "../../utils/hashing";
import { config } from "../../config/app";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { loggerMiddleware } from "../../middlewares/logger.middleware";

const authRouter = express.Router();

authRouter.use(loggerMiddleware);

authRouter.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({
      status: "fail",
      message: "Invalid email or password",
    });

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user)
    return res.status(400).json({
      status: "fail",
      message: "Invalid email or password",
    });

  const validatePassword = await comparePassword(password, user.password);
  if (!validatePassword)
    return res.status(400).json({
      status: "fail",
      message: "Invalid email or password",
    });

  const loginToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    config.jwtSecret,
    { expiresIn: "1d" }
  );

  res.cookie(config.cookieName, loginToken, {
    httpOnly: true,
    secure: config.env === "production",
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  res.status(200).json({
    status: "ok",
    message: "Login successful",
  });
});

authRouter.post("/register", async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name)
    return res.status(400).json({
      status: "fail",
      message: "Required fields are missing",
    });

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser)
    return res.status(409).json({
      status: "fail",
      message: "User with this email already exists",
    });

  const newUser = await prisma.user.create({
    data: { email, password: await hashPassword(password), name },
  });

  res.status(201).json({
    status: "ok",
    message: "User registered successfully",
    data: { id: newUser.id, email: newUser.email, name: newUser.name },
  });
});

authRouter.post("/logout", authMiddleware, (req: Request, res: Response) => {
  res.clearCookie(config.cookieName, {
    httpOnly: true,
    secure: config.env === "production",
    sameSite: "none",
  });
  res.json({
    status: "ok",
    message: "Logged out successfully",
  });
});

authRouter.get(
  "/session",
  authMiddleware,
  async (req: Request, res: Response) => {
    return res.status(200).json({
      status: "ok",
      message: "Session is valid",
      data: req.user,
    });
  }
);

export default authRouter;
