import { Request, Response } from "express";
import { AuthServices } from "./auth.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { send } from "process";

const login = async (req: Request, res: Response) => {
  const result = await AuthServices.login(req.body);
  const { refreshToken } = result;
  res.cookie("refreshToken", refreshToken, {
    secure: false,
    httpOnly: true,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Login successful!",
    data: {
      accessToken: result.accessToken,
      needsPasswordChange: result.needsPasswordChange,
    },
  });
};
const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const data = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Refresh Token successful!",
    data: data,
  });
};

export const AuthControllers = {
  login,
  refreshToken,
};
