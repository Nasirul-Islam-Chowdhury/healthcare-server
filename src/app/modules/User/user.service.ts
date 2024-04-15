import { UserRole, UserStatus } from "@prisma/client";
import * as bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";
import { fileUploader } from "../../../helpers/uploadImage";
import { IAuthUser } from "../../interfaces/common";

const createAdmin = async (req: any) => {

  if (req.file) {
    const photo = await fileUploader.uploadToCloudinary(req.file) as {secure_url:string};
    req.body.admin.profilePhoto = photo.secure_url;
  }
  console.log(req.body);
  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);

  const userData = {
    email: req.body.admin.email,
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









const changeProfileStatus = async (id: string, status: UserRole) => {
  const userData = await prisma.user.findUniqueOrThrow({
      where: {
          id
      }
  });

  const updateUserStatus = await prisma.user.update({
      where: {
          id
      },
      data: status
  });

  return updateUserStatus;
};



const getMyProfile = async (user: IAuthUser) => {

  const userInfo = await prisma.user.findUniqueOrThrow({
      where: {
          email: user?.email,
          status: UserStatus.ACTIVE
      },
      select: {
          id: true,
          email: true,
          needPasswordChange: true,
          role: true,
          status: true
      }
  });

  let profileInfo;

  if (userInfo.role === UserRole.SUPER_ADMIN) {
      profileInfo = await prisma.admin.findUnique({
          where: {
              email: userInfo.email
          }
      })
  }
  else if (userInfo.role === UserRole.ADMIN) {
      profileInfo = await prisma.admin.findUnique({
          where: {
              email: userInfo.email
          }
      })
  }
  else if (userInfo.role === UserRole.DOCTOR) {
      profileInfo = await prisma.doctor.findUnique({
          where: {
              email: userInfo.email
          }
      })
  }
  else if (userInfo.role === UserRole.PATIENT) {
      profileInfo = await prisma.patient.findUnique({
          where: {
              email: userInfo.email
          }
      })
  }

  return { ...userInfo, ...profileInfo };
};


export const userService = {
  createAdmin,
  changeProfileStatus,
  getMyProfile
};
