import { Request, Response, NextFunction } from "express";
import { AppError } from "./error";

export function errorHandler(
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  let customError =
    err instanceof AppError
      ? err
      : new AppError(err.message || "Something went wrong", 500, false);

  const { statusCode, message, isOperational } = customError;

  if (!isOperational) {
    console.error(err);
  }

  res.status(statusCode).json({
    status: "error",
    message: message,
  });
}
