CREATE TABLE `booth_datas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `media_id` int(11) DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `booth_id` int(11) NOT NULL,
  `position_booth_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk-booth_datas-booths` (`booth_id`),
  KEY `fk-booth_datas-position_booths` (`position_booth_id`),
  CONSTRAINT `fk-booth_datas-booths` FOREIGN KEY (`booth_id`) REFERENCES `booths` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk-booth_datas-position_booths` FOREIGN KEY (`position_booth_id`) REFERENCES `position_booths` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
