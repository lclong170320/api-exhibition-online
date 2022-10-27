ALTER TABLE `booth_organization_data`
DROP COLUMN `description`,
ADD COLUMN `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL;
