import { Request, Response } from "express";
import { loginUser } from "./auth.service";
import { HTTP_STATUS } from "@/config/http.config";

// login controller
export const loginController = async (req: Request, res: Response) => {
  const result = await loginUser(req.body.email, req.body.password);

  if (!result) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: "Invalid email or passwrod",
    });
  }

  const { user, token } = result;

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: {
      user: user,
      token: token,
    },
    message: "login success",
  });
};
