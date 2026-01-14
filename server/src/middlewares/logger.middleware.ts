import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";

export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();

  res.on("close", () => {
    const duration = Date.now() - start;

    if (res.statusCode >= 400) {
      logger.error(
        `Request ${req.method} from ${req.ip} to ${req.originalUrl} ${res.statusCode} - ${duration}ms`
      );
    } else {
      logger.info(
        `Request ${req.method} from ${req.ip} to ${req.originalUrl} ${res.statusCode} - ${duration}ms`
      );
    }
  });

  next();
};
