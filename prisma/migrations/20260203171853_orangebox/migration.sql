-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `photo` LONGTEXT NULL,
    `name` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` LONGTEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `users_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tokens` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `token` LONGTEXT NOT NULL,
    `expired_at` DATETIME(3) NULL,

    UNIQUE INDEX `tokens_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` LONGTEXT NOT NULL DEFAULT '',

    UNIQUE INDEX `categories_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `category_id` INTEGER NOT NULL,
    `photo` LONGTEXT NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` LONGTEXT NOT NULL DEFAULT '',
    `price` DECIMAL(10, 2) NOT NULL,
    `is_favorite` BOOLEAN NOT NULL DEFAULT false,
    `is_new` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `products_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sosmeds` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `photo` LONGTEXT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `link` LONGTEXT NOT NULL,

    UNIQUE INDEX `sosmeds_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `facilities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `photo` LONGTEXT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `testimonies` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `photo` LONGTEXT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,

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
ALTER TABLE `tokens` ADD CONSTRAINT `tokens_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `content` ADD CONSTRAINT `content_cta_link_id_fkey` FOREIGN KEY (`cta_link_id`) REFERENCES `sosmeds`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `content` ADD CONSTRAINT `content_location_link_id_fkey` FOREIGN KEY (`location_link_id`) REFERENCES `sosmeds`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
