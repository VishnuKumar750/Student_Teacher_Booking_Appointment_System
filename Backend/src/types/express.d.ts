import { Types } from "mongoose";
import { UserRole } from "./user.types";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: Types.ObjectId | string;
        role: UserRole;
      };
    }
    interface Response {}
  }
}
