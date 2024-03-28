import express, { NextFunction, Request, Response } from "express";
import { userController } from "./user.controller";
import { fileUploader } from "../../../helpers/uploadImage";
import { userValidation } from "./user.validation";

const router = express.Router();

router.post("/",
 fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {

    const data =  userValidation.createAdmin.parse(JSON.parse(req.body.data))
  req.body = data
  return userController.createAdmin(req, res, next);
});

export const userRoutes = router;
