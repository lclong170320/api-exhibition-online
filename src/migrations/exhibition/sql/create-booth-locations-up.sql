CREATE TABLE `booth_locations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `position_x` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `position_y` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `position_z` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rotation_x` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rotation_y` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rotation_z` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `space_template_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk-space_templates-booth_location` (`space_template_id`),
  CONSTRAINT `fk-space_templates-booth_location` FOREIGN KEY (`space_template_id`) REFERENCES `space_templates` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
