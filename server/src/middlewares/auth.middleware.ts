import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/app";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies[config.cookieName];

  if (!token)
    return res.status(401).json({
      status: "fail",
      message: "Access denied. No token provided.",
    });

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded as jwt.JwtPayload;
    next();
  } catch (err) {
    return res.status(401).json({
      status: "fail",
      message: "Access denied. Invalid token.",
    });
  }
};
