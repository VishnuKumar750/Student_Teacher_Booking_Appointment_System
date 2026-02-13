import { config } from "@/config/app.config";
import jwt, { SignOptions, Secret, JwtPayload } from "jsonwebtoken";
import ApiError from "./ApiError.utils";
import { HTTP_STATUS } from "@/config/http.config";

export interface IJWTPayload extends JwtPayload {
  id: string;
  role: string;
}

export const signToken = (payload: IJWTPayload): string => {
  if (!config.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  if (!config.JWT_EXPIRES_IN) {
    throw new Error("JWT_EXPIRES_IN is not defined");
  }

  const options: SignOptions = {
    expiresIn: 3 * 24 * 60 * 1000, //3d
  };

  return jwt.sign(payload, config.JWT_SECRET, options);
};

export const jwtVerify = (token: string): IJWTPayload => {
  if (!token) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "token is missing");
  }

  try {
    return jwt.verify(token, config.JWT_SECRET) as IJWTPayload;
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
