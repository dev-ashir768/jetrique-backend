-- AlterTable
ALTER TABLE `payment_type_logs` MODIFY `oldPaymentType` ENUM('ONLINE') NULL;

-- AlterTable
ALTER TABLE `permissions` ADD COLUMN `type` ENUM('MENU', 'ACTION') NULL DEFAULT 'MENU';
