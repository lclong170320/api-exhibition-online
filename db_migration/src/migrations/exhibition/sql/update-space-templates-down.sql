ALTER TABLE `space_templates`
DROP COLUMN `thumbnail_id`,
DROP COLUMN `model_id`,
DROP COLUMN`exhibition_map_id`,
ADD  `media_id` int(11) NOT NULL
