import { Request, Response } from "express";
import { AuthServices } from "./auth.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";

const login = catchAsync(async (req: Request, res: Response) => {
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
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const data = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Refresh Token successful!",
    data: data,
  });
});

const changePassword = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const user = req?.user;
  await AuthServices.changePassword(user, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Password Changed successful!",
    data: null,
  });
});

const forgetPassword = catchAsync(async (req: Request, res: Response) => {
  await AuthServices.forgetPassword(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Check you email",
    data: null,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization || "";

  await AuthServices.resetPassword(token, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password Reset!",
    data: null,
  });
});

export const AuthControllers = {
  login,
  refreshToken,
  changePassword,
  forgetPassword,
  resetPassword, 
};
