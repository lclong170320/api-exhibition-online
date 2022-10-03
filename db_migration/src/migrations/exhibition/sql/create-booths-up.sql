CREATE TABLE `booths` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `booth_template_id` int(11) NOT NULL,
  `exhibition_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk-booths-booth_templates` (`booth_template_id`),
  KEY `fk-booths-exhibitions` (`exhibition_id`),
  CONSTRAINT `fk-booths-booth_templates` FOREIGN KEY (`booth_template_id`) REFERENCES `booth_templates` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk-booths-exhibitions` FOREIGN KEY (`exhibition_id`) REFERENCES `exhibitions` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
