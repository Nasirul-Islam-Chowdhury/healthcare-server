/*
  Warnings:

  - You are about to drop the column `doctorSchedulesDoctorId` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the column `doctorSchedulesScheduleId` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the `doctor_specialities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `patientHelthDatas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `specialities` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[appointmentId]` on the table `doctor_schedules` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_doctorSchedulesDoctorId_doctorSchedulesSchedu_fkey";

-- DropForeignKey
ALTER TABLE "doctor_specialities" DROP CONSTRAINT "doctor_specialities_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_specialities" DROP CONSTRAINT "doctor_specialities_specialitiesId_fkey";

-- DropForeignKey
ALTER TABLE "patientHelthDatas" DROP CONSTRAINT "patientHelthDatas_patientId_fkey";

-- AlterTable
ALTER TABLE "appointments" DROP COLUMN "doctorSchedulesDoctorId",
DROP COLUMN "doctorSchedulesScheduleId";

-- AlterTable
ALTER TABLE "doctors" ADD COLUMN     "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0.0;

-- DropTable
DROP TABLE "doctor_specialities";

-- DropTable
DROP TABLE "patientHelthDatas";

-- DropTable
DROP TABLE "specialities";

-- CreateTable
CREATE TABLE "specialties" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "icon" TEXT NOT NULL,

    CONSTRAINT "specialties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor_specialties" (
    "specialitiesId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,

    CONSTRAINT "doctor_specialties_pkey" PRIMARY KEY ("specialitiesId","doctorId")
);

-- CreateTable
CREATE TABLE "patient_health_datas" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "dateOfBirth" TEXT NOT NULL,
    "bloodGroup" "BloodGroup" NOT NULL,
    "hasAllergies" BOOLEAN DEFAULT false,
    "hasDiabetes" BOOLEAN DEFAULT false,
    "height" TEXT NOT NULL,
    "weight" TEXT NOT NULL,
    "smokingStatus" BOOLEAN DEFAULT false,
    "dietaryPreferences" TEXT,
    "pregnancyStatus" BOOLEAN DEFAULT false,
    "mentalHealthHistory" TEXT,
    "immunizationStatus" TEXT,
    "hasPastSurgeries" BOOLEAN DEFAULT false,
    "recentAnxiety" BOOLEAN DEFAULT false,
    "recentDepression" BOOLEAN DEFAULT false,
    "maritalStatus" "MaritalStatus" NOT NULL DEFAULT 'UNMARRIED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patient_health_datas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "patient_health_datas_patientId_key" ON "patient_health_datas"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "doctor_schedules_appointmentId_key" ON "doctor_schedules"("appointmentId");

-- AddForeignKey
ALTER TABLE "doctor_specialties" ADD CONSTRAINT "doctor_specialties_specialitiesId_fkey" FOREIGN KEY ("specialitiesId") REFERENCES "specialties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_specialties" ADD CONSTRAINT "doctor_specialties_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_health_datas" ADD CONSTRAINT "patient_health_datas_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_schedules" ADD CONSTRAINT "doctor_schedules_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
