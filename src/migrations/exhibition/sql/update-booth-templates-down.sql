ALTER TABLE `booth_templates`
ADD `media_id` int(11) NOT NULL,
DROP COLUMN `thumbnail_id`,
DROP COLUMN `model_id`,
DROP COLUMN `user_id`
