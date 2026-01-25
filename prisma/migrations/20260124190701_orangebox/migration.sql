/*
  Warnings:

  - You are about to alter the column `price` on the `products` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to drop the column `created_at` on the `tokens` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `tokens` table. All the data in the column will be lost.
  - You are about to drop the `facilities_and_places` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `facility_and_place` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `favorite_menu` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `hero` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `location` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `more_cta` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `testimoni` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `umkm_name` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `expired_at` to the `tokens` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `location` DROP FOREIGN KEY `location_link1_id_fkey`;

-- DropForeignKey
ALTER TABLE `location` DROP FOREIGN KEY `location_link2_id_fkey`;

-- DropForeignKey
ALTER TABLE `more_cta` DROP FOREIGN KEY `more_cta_link_id_fkey`;

-- AlterTable
ALTER TABLE `products` MODIFY `price` DECIMAL(10, 2) NOT NULL;

-- AlterTable
ALTER TABLE `tokens` DROP COLUMN `created_at`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `expired_at` DATETIME(3) NOT NULL;

-- DropTable
DROP TABLE `facilities_and_places`;

-- DropTable
DROP TABLE `facility_and_place`;

-- DropTable
DROP TABLE `favorite_menu`;

-- DropTable
DROP TABLE `hero`;

-- DropTable
DROP TABLE `location`;

-- DropTable
DROP TABLE `more_cta`;

-- DropTable
DROP TABLE `testimoni`;

-- DropTable
DROP TABLE `umkm_name`;

-- CreateTable
CREATE TABLE `facilities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `photo` LONGTEXT NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `content` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `umkm_name` VARCHAR(191) NOT NULL,
    `umkm_address` VARCHAR(191) NOT NULL,
    `hero_photo` VARCHAR(191) NOT NULL,
    `hero_headline` VARCHAR(191) NOT NULL,
    `hero_subheadline` VARCHAR(191) NOT NULL,
    `hero_description` VARCHAR(191) NOT NULL,
    `favorite_title` VARCHAR(191) NOT NULL,
    `favorite_information` VARCHAR(191) NOT NULL,
    `favorite_max_product` INTEGER NOT NULL,
    `facility_title` VARCHAR(191) NOT NULL,
    `facility_information` VARCHAR(191) NOT NULL,
    `cta_title` VARCHAR(191) NOT NULL,
    `cta_button` VARCHAR(191) NOT NULL,
    `cta_link_id` INTEGER NOT NULL,
    `testimoni_title` VARCHAR(191) NOT NULL,
    `testimoni_information` VARCHAR(191) NOT NULL,
    `location_photo` VARCHAR(191) NOT NULL,
    `location_title` VARCHAR(191) NOT NULL,
    `location_maps` VARCHAR(191) NOT NULL,
    `location_button` VARCHAR(191) NOT NULL,
    `location_link_id` INTEGER NOT NULL,

    UNIQUE INDEX `content_cta_link_id_key`(`cta_link_id`),
    UNIQUE INDEX `content_location_link_id_key`(`location_link_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `content` ADD CONSTRAINT `content_cta_link_id_fkey` FOREIGN KEY (`cta_link_id`) REFERENCES `sosmeds`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `content` ADD CONSTRAINT `content_location_link_id_fkey` FOREIGN KEY (`location_link_id`) REFERENCES `sosmeds`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
