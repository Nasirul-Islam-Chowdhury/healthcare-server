import express, { NextFunction, Request, Response } from "express";
import { userController } from "./user.controller";
import { fileUploader } from "../../../helpers/uploadImage";
import { userValidation } from "./user.validation";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/create-admin",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    const data = userValidation.createAdmin.parse(JSON.parse(req.body.data));
    req.body = data;
    return userController.createAdmin(req, res, next);
  }
);

router.post(
  "/create-doctor",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createDoctor.parse(JSON.parse(req.body.data));
    return userController.createAdmin(req, res, next);
  }
);

router.post(
  "/create-patient",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createPatient.parse(JSON.parse(req.body.data));

    return userController.createAdmin(req, res, next);
  }
);


router.patch(
  '/:id/status',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  // validateRequest(userValidation.updateStatus),
  userController.changeProfileStatus
);

export const userRoutes = router;
