import jwt from "jsonwebtoken";
import { UserModel } from "../user/user.model";
import { config } from "@/config/app.config";

// login
export const loginUser = async (email: string, password: string) => {
  // check user exists or not
  // if exists compare password and send result
  const user = await UserModel.findOne({ email }).select("+password");

  if (!user) return null;

  const isMatch = await UserModel.comparePassword(password);
  if (!isMatch) return null;

  // generate jsonwebtoken
  const token = jwt.sign(
    {
      userId: user._id,
      role: user.roles,
    },
    config.JWT_SECRET,
    { expiredIn: config.JWT_EXPIRES_IN },
  );

  return { user, token };
};
