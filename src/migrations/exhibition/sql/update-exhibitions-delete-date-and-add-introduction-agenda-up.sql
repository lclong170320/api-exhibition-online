ALTER TABLE `exhibitions`
DROP COLUMN `date_input_data_start`,
DROP COLUMN `date_input_data_end`,
ADD `introduction`longtext COLLATE utf8mb4_unicode_ci NOT NULL,
ADD `agenda` longtext COLLATE utf8mb4_unicode_ci NOT NULL
