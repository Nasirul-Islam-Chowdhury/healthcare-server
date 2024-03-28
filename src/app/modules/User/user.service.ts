import { UserRole } from "@prisma/client";
import * as bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";
import { fileUploader } from "../../../helpers/uploadImage";

const createAdmin = async (req: any) => {

  if (req.file) {
    const profilePhoto = await fileUploader.uploadToCloudinary(req.file);
    req.body.admin.profilePhoto = profilePhoto;
  }

  const hashedPassword: string = await bcrypt.hash(req.body.data.password, 12);

  const userData = {
    email: req.body.data.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createdAdminData = await transactionClient.admin.create({
      data: req.body.admin,
    });

    return createdAdminData;
  });

  return result;
};

export const userService = {
  createAdmin,
};
