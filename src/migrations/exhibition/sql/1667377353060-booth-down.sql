ALTER TABLE `booths` CHANGE `created_by` `user_id` int(11) NOT NULL;
ALTER TABLE `booths` CHANGE `booth_template_id` `booth_id` int(11) NOT NULL;

DROP TABLE `booth_data`;
DROP TABLE `livestreams`;
DROP TABLE `products`;
DROP TABLE `projects`;
