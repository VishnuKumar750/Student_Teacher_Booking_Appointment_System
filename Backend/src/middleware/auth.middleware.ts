import { HTTP_STATUS } from "@/config/http.config";
import ApiError from "@/utils/ApiError.utils";
import { asyncHandler } from "@/utils/asyncHandler.utils";
import { jwtVerify } from "@/utils/jsonwebtoken.utils";

export const authenticated = asyncHandler(async (req: any, res, next) => {
  // token from cookies
  const token = req.cookies?.token;
  if (!token) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "autheNtication required");
  }

  const decoded = jwtVerify(token);

  req.user = decoded;
  next();
});
