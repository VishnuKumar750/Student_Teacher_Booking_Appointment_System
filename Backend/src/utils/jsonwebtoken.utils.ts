import { config } from "@/config/app.config";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import ApiError from "./ApiError.utils";
import { HTTP_STATUS } from "@/config/http.config";

export interface IJWTPayload extends JwtPayload {
  id: string;
  role: string;
}

export const signToken = (
  payload: IJWTPayload,
  options: SignOptions = {},
): string => {
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
    ...options,
  });
};

export const jwtVerify = (token: string): IJWTPayload => {
  if (!token) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "token is missing");
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as IJWTPayload;
    return decoded;
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Token has expired");
    }

    if (error.name === "JsonWebTokenError") {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid token");
    }

    throw new ApiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Token verification failed",
    );
  }
};
