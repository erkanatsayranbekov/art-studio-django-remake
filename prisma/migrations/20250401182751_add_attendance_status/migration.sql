-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'EXCUSED');

-- AlterTable
ALTER TABLE "attendances" ADD COLUMN     "status" "AttendanceStatus" NOT NULL DEFAULT 'PRESENT';
