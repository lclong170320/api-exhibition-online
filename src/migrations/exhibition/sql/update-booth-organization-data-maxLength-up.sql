ALTER TABLE `booth_organization_data`
DROP COLUMN `description`,
ADD COLUMN `description` longtext COLLATE utf8mb4_unicode_ci;
