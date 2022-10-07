CREATE TABLE `spaces` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `space_template_id` int(11) NOT NULL,
  `exhibition_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_e9698fee92a245a0890b20c99f` (`exhibition_id`),
  KEY `fk-spaces-space_templates` (`space_template_id`),
  CONSTRAINT `fk-spaces-space_templates` FOREIGN KEY (`space_template_id`) REFERENCES `space_templates` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_exhibition_space` FOREIGN KEY (`exhibition_id`) REFERENCES `exhibitions` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
