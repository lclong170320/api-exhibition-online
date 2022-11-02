ALTER TABLE `booths` CHANGE `user_id` `created_by` int(11) NOT NULL;
ALTER TABLE `booths` CHANGE `booth_id` `booth_template_id` int(11) NOT NULL;

CREATE TABLE `booth_data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `media_id` int(11) DEFAULT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `booth_id` int(11) NOT NULL,
  `position_booth_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk-booth_data-booth` (`booth_id`),
  KEY `fk-booth_data-position_booths` (`position_booth_id`),
  CONSTRAINT `fk-booth_data-booth` FOREIGN KEY (`booth_id`) REFERENCES `booths` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk-booth_data-position_booths` FOREIGN KEY (`position_booth_id`) REFERENCES `position_booths` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `livestreams` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `link` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` datetime NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `booth_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk-livestreams-booth` (`booth_id`),
  CONSTRAINT `fk-livestreams-booth` FOREIGN KEY (`booth_id`) REFERENCES `booths` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `media_id` int(11) DEFAULT NULL,
  `price` float NOT NULL,
  `purchase_link` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `booth_id` int(11) NOT NULL,
  `position_booth_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk-products-booth` (`booth_id`),
  KEY `fk-products-position_booths` (`position_booth_id`),
  CONSTRAINT `fk-products-booth` FOREIGN KEY (`booth_id`) REFERENCES `booths` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk-products-position_booths` FOREIGN KEY (`position_booth_id`) REFERENCES `position_booths` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `projects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `media_id` int(11) DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `booth_id` int(11) NOT NULL,
  `position_booth_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk-project-booth` (`booth_id`),
  KEY `fk-projects-position_booths` (`position_booth_id`),
  CONSTRAINT `fk-project-booth` FOREIGN KEY (`booth_id`) REFERENCES `booths` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk-projects-position_booths` FOREIGN KEY (`position_booth_id`) REFERENCES `position_booths` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
