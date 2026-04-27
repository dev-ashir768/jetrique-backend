/*
  Warnings:

  - Made the column `type` on table `permissions` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `permissions` MODIFY `type` ENUM('MENU', 'ACTION') NOT NULL DEFAULT 'MENU';
