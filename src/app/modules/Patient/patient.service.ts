import { Patient, Prisma, UserStatus } from '@prisma/client';
import { IPatientFilterRequest, IPatientUpdate } from './patient.interface';

import httpStatus from 'http-status';
import { IPaginationOptions } from '../../interfaces/pagination';
import { patientSearchableFields } from './patient.constant';
import prisma from '../../../shared/prisma';
import { IGenericResponse } from '../../interfaces/common';
import { paginationHelper } from '../../../helpers/paginationHelper';
import ApiError from '../../errors/ApiError';

const getAllFromDB = async (
  filters: IPatientFilterRequest,
  options: IPaginationOptions,
): Promise<IGenericResponse<Patient[]>> => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: patientSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        return {
          [key]: {
            equals: (filterData as any)[key],
          },
        };
      }),
    });
  }
  andConditions.push({
    isDeleted: false,
  });

  const whereConditions: Prisma.PatientWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.patient.findMany({
    include: {
      medicalReport: true,
      patientHealthData: true,
    },
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: 'desc',
          },
  });
  const total = await prisma.patient.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<Patient | null> => {
  const result = await prisma.patient.findUnique({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      medicalReport: true,
      patientHealthData: true,
    },
  });
  return result;
};

const updateIntoDB = async (
  id: string,
  payload: Partial<IPatientUpdate>,
): Promise<Patient | null> => {
  const { patientHelthData, medicalReport, ...patientData } = payload;
  await prisma.$transaction(async transactionClient => {
    const result = await transactionClient.patient.update({
      include: {
        medicalReport: true,
        patientHealthData: true,
      },
      where: {
        id,
        isDeleted: false,
      },
      data: patientData,
    });
    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to update Patient');
    }
    if (result?.patientHealthData && patientHelthData) {
      const updateHelthData = await transactionClient.patientHealthData.update({
        where: {
          id: result?.patientHealthData.id,
        },
        data: patientHelthData,
      });
    }
    if (!result?.patientHealthData && patientHelthData) {
      const newHelthData = await transactionClient.patientHealthData.create({
        data: {
          patientId: id,
          ...patientHelthData,
        },
      });
    }
    if (medicalReport) {
      const newMedicalReport = await transactionClient.medicalReport.create({
        data: {
          patientId: id,
          ...medicalReport,
        },
      });
    }

    return result;
  });

  const responseData = await prisma.patient.findUnique({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      medicalReport: true,
      patientHealthData: true,
    },
  });
  return responseData;
};

const deleteFromDB = async (id: string): Promise<Patient> => {
  return await prisma.$transaction(async transactionClient => {
    await transactionClient.patientHealthData.delete({
      where: {
        patientId: id,
      },
    });
    await transactionClient.medicalReport.deleteMany({
      where: {
        patientId: id,
      },
    });
    const deletedPatient = await transactionClient.patient.delete({
      where: {
        id,
      },
    });

    await transactionClient.user.delete({
      where: {
        email: deletedPatient.email,
      },
    });

    return deletedPatient;
  });
};

const softDelete = async (id: string): Promise<Patient> => {
  return await prisma.$transaction(async transactionClient => {
    const deletedPatient = await transactionClient.patient.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    await transactionClient.user.update({
      where: {
        email: deletedPatient.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return deletedPatient;
  });
};

export const PatientService = {
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  softDelete,
};