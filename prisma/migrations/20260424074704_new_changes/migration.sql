/*
  Warnings:

  - You are about to drop the column `commission` on the `commission_logs` table. All the data in the column will be lost.
  - You are about to drop the column `paymentType` on the `payment_type_logs` table. All the data in the column will be lost.
  - Added the required column `newCommission` to the `commission_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `oldCommission` to the `commission_logs` table without a default value. This is not possible if the table is not empty.
  - Made the column `changedBy` on table `commission_logs` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `newPaymentType` to the `payment_type_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `oldPaymentType` to the `payment_type_logs` table without a default value. This is not possible if the table is not empty.
  - Made the column `changedBy` on table `payment_type_logs` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `commission_logs` DROP COLUMN `commission`,
    ADD COLUMN `newCommission` DOUBLE NOT NULL,
    ADD COLUMN `oldCommission` DOUBLE NOT NULL,
    MODIFY `changedBy` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `payment_type_logs` DROP COLUMN `paymentType`,
    ADD COLUMN `newPaymentType` ENUM('ONLINE') NOT NULL,
    ADD COLUMN `oldPaymentType` ENUM('ONLINE') NOT NULL,
    MODIFY `changedBy` INTEGER NOT NULL;
