/*
  Warnings:

  - A unique constraint covering the columns `[photo]` on the table `sosmeds` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[photo]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `photo` to the `sosmeds` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `sosmeds` ADD COLUMN `photo` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `photo` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `sosmeds_photo_key` ON `sosmeds`(`photo`);

-- CreateIndex
CREATE UNIQUE INDEX `users_photo_key` ON `users`(`photo`);
