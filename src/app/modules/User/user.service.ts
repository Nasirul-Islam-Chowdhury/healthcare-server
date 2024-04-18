import { Doctor, Patient, UserRole, UserStatus } from "@prisma/client";
import * as bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";
import { fileUploader } from "../../../helpers/uploadImage";
import { IAuthUser } from "../../interfaces/common";
import { IFile } from "../../interfaces/file";
import { Request } from "express";

const createAdmin = async (req: Request) => {

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

const createDoctor = async (req: Request): Promise<Doctor> => {

    const file = req.file as IFile;

    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        req.body.doctor.profilePhoto = uploadToCloudinary?.secure_url
    }

    const hashedPassword: string = await bcrypt.hash(req.body.password, 12)

    const userData = {
        email: req.body.doctor.email,
        password: hashedPassword,
        role: UserRole.DOCTOR
    }

    const result = await prisma.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: userData
        });

        const createdDoctorData = await transactionClient.doctor.create({
            data: req.body.doctor
        });

        return createdDoctorData;
    });

    return result;
};

const createPatient = async (req: Request): Promise<Patient> => {
    const file = req.file as IFile;

    if (file) {
        const uploadedProfileImage = await fileUploader.uploadToCloudinary(file);
        req.body.patient.profilePhoto = uploadedProfileImage?.secure_url;
    }

    const hashedPassword: string = await bcrypt.hash(req.body.password, 12)

    const userData = {
        email: req.body.patient.email,
        password: hashedPassword,
        role: UserRole.PATIENT
    }

    const result = await prisma.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: userData
        });

        const createdPatientData = await transactionClient.patient.create({
            data: req.body.patient
        });

        return createdPatientData;
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

const updateMyProfie = async (user: IAuthUser, req: Request) => {
    const userInfo = await prisma.user.findUniqueOrThrow({
        where: {
            email: user?.email,
            status: UserStatus.ACTIVE
        }
    });

    const file = req.file as IFile;
    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        req.body.profilePhoto = uploadToCloudinary?.secure_url;
    }

    let profileInfo;

    if (userInfo.role === UserRole.SUPER_ADMIN) {
        profileInfo = await prisma.admin.update({
            where: {
                email: userInfo.email
            },
            data: req.body
        })
    }
    else if (userInfo.role === UserRole.ADMIN) {
        profileInfo = await prisma.admin.update({
            where: {
                email: userInfo.email
            },
            data: req.body
        })
    }
    else if (userInfo.role === UserRole.DOCTOR) {
        profileInfo = await prisma.doctor.update({
            where: {
                email: userInfo.email
            },
            data: req.body
        })
    }
    else if (userInfo.role === UserRole.PATIENT) {
        profileInfo = await prisma.patient.update({
            where: {
                email: userInfo.email
            },
            data: req.body
        })
    }

    return { ...profileInfo };
}

export const userService = {
  createAdmin,
  changeProfileStatus,
  getMyProfile,
  createPatient,
  createDoctor,
  updateMyProfie
};
