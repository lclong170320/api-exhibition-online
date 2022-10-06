CREATE TABLE `space_datas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `media_id` int(11) DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `space_id` int(11) NOT NULL,
  `position_space_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk-space_datas-spaces` (`space_id`),
  KEY `fk-space_datas-position_space` (`position_space_id`),
  CONSTRAINT `fk-space_datas-position_space` FOREIGN KEY (`position_space_id`) REFERENCES `position_spaces` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk-space_datas-spaces` FOREIGN KEY (`space_id`) REFERENCES `spaces` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
