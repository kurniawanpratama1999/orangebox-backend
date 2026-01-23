/*
  Warnings:

  - You are about to drop the `sosmed` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `location` DROP FOREIGN KEY `location_link1_id_fkey`;

-- DropForeignKey
ALTER TABLE `location` DROP FOREIGN KEY `location_link2_id_fkey`;

-- DropForeignKey
ALTER TABLE `more_cta` DROP FOREIGN KEY `more_cta_link_id_fkey`;

-- DropIndex
DROP INDEX `location_link1_id_fkey` ON `location`;

-- DropIndex
DROP INDEX `location_link2_id_fkey` ON `location`;

-- DropTable
DROP TABLE `sosmed`;

-- CreateTable
CREATE TABLE `sosmeds` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `link` LONGTEXT NOT NULL,

    UNIQUE INDEX `sosmeds_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `more_cta` ADD CONSTRAINT `more_cta_link_id_fkey` FOREIGN KEY (`link_id`) REFERENCES `sosmeds`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `location` ADD CONSTRAINT `location_link1_id_fkey` FOREIGN KEY (`link1_id`) REFERENCES `sosmeds`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `location` ADD CONSTRAINT `location_link2_id_fkey` FOREIGN KEY (`link2_id`) REFERENCES `sosmeds`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
