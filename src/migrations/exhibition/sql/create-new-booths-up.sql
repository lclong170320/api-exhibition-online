CREATE TABLE `booths` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `enterprise_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `location_status_id` int(11) NOT NULL,
  `exhibition_id` int(11) NOT NULL,
  `booth_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_1b838f3755bbb2f4d57ef74b03` (`location_status_id`),
  KEY `fk-booths-exhibition` (`exhibition_id`),
  KEY `fk-booths-booth_template` (`booth_id`),
  CONSTRAINT `fk-booht-location_status` FOREIGN KEY (`location_status_id`) REFERENCES `location_status` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk-booths-booth_template` FOREIGN KEY (`booth_id`) REFERENCES `booth_templates` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk-booths-exhibition` FOREIGN KEY (`exhibition_id`) REFERENCES `exhibitions` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
