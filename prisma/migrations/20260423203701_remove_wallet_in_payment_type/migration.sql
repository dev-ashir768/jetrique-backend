/*
  Warnings:

  - The values [WALLET] on the enum `agents_paymentType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `agents` MODIFY `paymentType` ENUM('ONLINE') NULL;
