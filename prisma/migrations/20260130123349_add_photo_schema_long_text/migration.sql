-- DropIndex
DROP INDEX `sosmeds_photo_key` ON `sosmeds`;

-- DropIndex
DROP INDEX `users_photo_key` ON `users`;

-- AlterTable
ALTER TABLE `facilities` MODIFY `photo` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `sosmeds` MODIFY `photo` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `photo` LONGTEXT NULL;
