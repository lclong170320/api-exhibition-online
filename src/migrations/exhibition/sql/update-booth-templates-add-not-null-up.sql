ALTER TABLE booth_templates
DROP COLUMN created_by,
DROP COLUMN type,
ADD COLUMN `created_by` int(11) NOT NULL,
ADD COLUMN `type` enum('project','product','organize') COLLATE utf8mb4_unicode_ci NOT NULL;
