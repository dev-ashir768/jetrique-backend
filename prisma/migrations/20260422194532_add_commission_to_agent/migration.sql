/*
  Warnings:

  - The values [SUSPENDED] on the enum `users_status` will be removed. If these variants are still used in the database, this will fail.
  - The values [SUSPENDED] on the enum `users_status` will be removed. If these variants are still used in the database, this will fail.
  - The values [SUSPENDED] on the enum `users_status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `commissions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `commissions` DROP FOREIGN KEY `commissions_agentId_fkey`;

-- AlterTable
ALTER TABLE `agent_status_logs` MODIFY `status` ENUM('REJECTED', 'APPROVED', 'PENDING') NOT NULL;

-- AlterTable
ALTER TABLE `agents` ADD COLUMN `commission` DOUBLE NULL DEFAULT 0,
    MODIFY `status` ENUM('REJECTED', 'APPROVED', 'PENDING') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `users` MODIFY `status` ENUM('REJECTED', 'APPROVED', 'PENDING') NOT NULL DEFAULT 'PENDING';

-- DropTable
DROP TABLE `commissions`;
