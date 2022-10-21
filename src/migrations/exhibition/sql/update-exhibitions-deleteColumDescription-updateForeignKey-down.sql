ALTER TABLE `exhibitions`
ADD `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
DROP FOREIGN KEY `fk-space_templates-exhibitions`,
DROP `space_template_id`
