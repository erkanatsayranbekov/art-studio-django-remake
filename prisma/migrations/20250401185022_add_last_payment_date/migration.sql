-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "last_payment_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
