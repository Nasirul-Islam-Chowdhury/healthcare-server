import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { ScheduleServices } from './schedule.service';



const insertIntoDb = catchAsync(async (req: Request, res: Response) => {

  const result = await ScheduleServices.insertIntoDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Schedule Created successfully',
    data: result,
  });
});




export const ScheduleController = {
  insertIntoDb,

};