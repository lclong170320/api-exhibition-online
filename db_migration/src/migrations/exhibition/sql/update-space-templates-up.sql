ALTER TABLE `space_templates`
DROP COLUMN media_id,
ADD `thumbnail_id` int(11) NOT NULL,
ADD `model_id` int(11) NOT NULL,
ADD `exhibition_map_id` int(11) NOT NULL
