import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";
import { Request, Response } from "express";
import { PaymentService } from "./payment.service";

const initPayment = catchAsync(async (req: Request, res: Response) => {
  const result = PaymentService.initPayment(req.params.appointmentId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Payment Success",
    data: result,
  });
});

export const PaymentController = {
  initPayment,
};
