import express, { Request, Response } from "express";
import { userController } from "./user.controller";
import { fileUploader } from "../../../helpers/uploadImage";

const router = express.Router();

router.post("/", fileUploader.upload.single("file"), (req, res, next) => {
  console.log(req);
  req.body = userValidation.createAdmin.parse(JSON.parse(req.body.data))
  return userController.createAdmin(req, res, next);
});

export const userRoutes = router;
