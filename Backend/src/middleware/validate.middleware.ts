import { HTTP_STATUS } from "@/config/http.config";
import ApiError from "@/utils/ApiError.utils";
import { Request, Response, NextFunction } from "express";

import { ZodObject } from "zod";

export const validate =
  (schema: ZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (err: any) {
      const message = err.errors?.[0]?.message || "Invalid request data";
      next(new ApiError(HTTP_STATUS.BAD_REQUEST, message));
    }
  };
