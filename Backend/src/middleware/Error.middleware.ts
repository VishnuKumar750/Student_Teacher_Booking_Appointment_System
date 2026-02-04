import { HTTP_STATUS } from "@/config/http.config";
import { Request, Response, NextFunction } from "express";

interface ErrorResponse {
  success: false;
  error: {
    statusCode: number;
    message: string;
    code?: string;
    details?: string;
    stack?: string;
  };
}

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";

  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  } else if (err.code === 11000) {
    ((statusCode = 409),
      (message = `Duplicate ${Object.keys(err.keyValue).join(", ")}`));
  } else if (err.name === "ValidationError") {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = "Invalid input data";
  }

  const response: ErrorResponse = {
    success: false,
    error: {
      statusCode,
      message,
    },
  };

  res.status(statusCode).json(response);
};

export default globalErrorHandler;
