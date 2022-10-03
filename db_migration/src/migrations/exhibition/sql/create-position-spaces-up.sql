CREATE TABLE `position_spaces` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `object_3d_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `space_template_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk-position_templates-space_templates` (`space_template_id`),
  CONSTRAINT `fk-position_templates-space_templates` FOREIGN KEY (`space_template_id`) REFERENCES `space_templates` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
