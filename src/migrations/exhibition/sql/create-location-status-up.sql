CREATE TABLE `location_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `position_x` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `position_y` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `position_z` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rotation_x` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rotation_y` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rotation_z` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_registered` tinyint(4) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `space_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk-space_location-status` (`space_id`),
  CONSTRAINT `fk-space_location-status` FOREIGN KEY (`space_id`) REFERENCES `spaces` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
