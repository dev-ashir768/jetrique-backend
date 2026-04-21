/*
  Warnings:

  - The values [ACTIVE,INACTIVE] on the enum `users_status` will be removed. If these variants are still used in the database, this will fail.
  - The values [ACTIVE,INACTIVE] on the enum `users_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `agents` ADD COLUMN `approvedAt` DATETIME(3) NULL,
    ADD COLUMN `approvedBy` INTEGER NULL,
    MODIFY `status` ENUM('SUSPENDED', 'REJECTED', 'APPROVED', 'PENDING') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `users` MODIFY `status` ENUM('SUSPENDED', 'REJECTED', 'APPROVED', 'PENDING') NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE `agent_status_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `agentId` INTEGER NOT NULL,
    `status` ENUM('SUSPENDED', 'REJECTED', 'APPROVED', 'PENDING') NOT NULL,
    `changedBy` INTEGER NULL,
    `reason` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `agent_status_logs` ADD CONSTRAINT `agent_status_logs_agentId_fkey` FOREIGN KEY (`agentId`) REFERENCES `agents`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
