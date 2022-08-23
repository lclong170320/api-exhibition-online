CREATE TABLE `panos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `media_id` int(11) NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `exhibition_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_exhibition_panos` (`exhibition_id`),
  CONSTRAINT `fk_exhibition_panos` FOREIGN KEY (`exhibition_id`) REFERENCES `exhibitions` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
