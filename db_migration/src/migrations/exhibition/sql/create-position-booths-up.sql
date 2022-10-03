CREATE TABLE `position_booths` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `object_3d_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `booth_template_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk-position_templates-booth_templates` (`booth_template_id`),
  CONSTRAINT `fk-position_templates-booth_templates` FOREIGN KEY (`booth_template_id`) REFERENCES `booth_templates` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
