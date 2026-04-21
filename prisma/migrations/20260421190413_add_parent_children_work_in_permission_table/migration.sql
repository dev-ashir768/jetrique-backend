-- AlterTable
ALTER TABLE `permissions` ADD COLUMN `parentId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `permissions` ADD CONSTRAINT `permissions_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `permissions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
