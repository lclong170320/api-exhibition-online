-- compaon_exhibition_dev.booth_templates definition

CREATE TABLE `booth_templates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `thumbnail_id` int(11) NOT NULL,
  `model_id` int(11) NOT NULL,
  `created_date` datetime NOT NULL,
  `created_by` int(11) NOT NULL,
  `type` enum('project','product','organize') COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- compaon_exhibition_dev.categories definition

CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- compaon_exhibition_dev.space_templates definition

CREATE TABLE `space_templates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `thumbnail_id` int(11) NOT NULL,
  `model_id` int(11) NOT NULL,
  `exhibition_map_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- compaon_exhibition_dev.booth_locations definition

CREATE TABLE `booth_locations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `position_x` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `position_y` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `position_z` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rotation_x` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rotation_y` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rotation_z` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `space_template_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk-space_templates-booth_location` (`space_template_id`),
  CONSTRAINT `fk-space_templates-booth_location` FOREIGN KEY (`space_template_id`) REFERENCES `space_templates` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- compaon_exhibition_dev.booth_organizations definition

CREATE TABLE `booth_organizations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `booth_template_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk-booth_organizations-booth_templates` (`booth_template_id`),
  CONSTRAINT `fk-booth_organizations-booth_templates` FOREIGN KEY (`booth_template_id`) REFERENCES `booth_templates` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- compaon_exhibition_dev.position_booths definition

CREATE TABLE `position_booths` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `object_3d_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('project','product','organize') COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `booth_template_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk-position_templates-booth_templates` (`booth_template_id`),
  CONSTRAINT `fk-position_templates-booth_templates` FOREIGN KEY (`booth_template_id`) REFERENCES `booth_templates` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- compaon_exhibition_dev.position_spaces definition

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


-- compaon_exhibition_dev.spaces definition

CREATE TABLE `spaces` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `space_template_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk-spaces-space_templates` (`space_template_id`),
  CONSTRAINT `fk-spaces-space_templates` FOREIGN KEY (`space_template_id`) REFERENCES `space_templates` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- compaon_exhibition_dev.booth_organization_data definition

CREATE TABLE `booth_organization_data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `media_id` int(11) DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `booth_organization_id` int(11) NOT NULL,
  `position_booth_id` int(11) NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `fk-booth_organization_datas-booth_organizations` (`booth_organization_id`),
  KEY `fk-booth_organization_datas-position_booths` (`position_booth_id`),
  CONSTRAINT `fk-booth_organization_datas-booth_organizations` FOREIGN KEY (`booth_organization_id`) REFERENCES `booth_organizations` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk-booth_organization_datas-position_booths` FOREIGN KEY (`position_booth_id`) REFERENCES `position_booths` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- compaon_exhibition_dev.exhibitions definition

CREATE TABLE `exhibitions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `booth_number` int(11) NOT NULL,
  `exhibition_code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_exhibition_start` datetime NOT NULL,
  `date_exhibition_end` datetime NOT NULL,
  `category_id` int(11) NOT NULL,
  `space_template_id` int(11) NOT NULL,
  `space_id` int(11) NOT NULL,
  `introduction` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `agenda` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `booth_organization_id` int(11) NOT NULL,
  `status` enum('new','listing','finished') COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_dc7e45c918679d61f9748aa7ad` (`booth_organization_id`),
  UNIQUE KEY `REL_68ca5098dca8f75f0da224b4da` (`space_id`),
  KEY `fk_category_exhibition` (`category_id`),
  KEY `fk-space_templates-exhibitions` (`space_template_id`),
  CONSTRAINT `fk-exhibition-booth_organization` FOREIGN KEY (`booth_organization_id`) REFERENCES `booth_organizations` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk-space-informations` FOREIGN KEY (`space_id`) REFERENCES `spaces` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk-space_templates-exhibitions` FOREIGN KEY (`space_template_id`) REFERENCES `space_templates` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_category_exhibition` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- compaon_exhibition_dev.exhibitions_booth_templates definition

CREATE TABLE `exhibitions_booth_templates` (
  `exhibitions_id` int(11) NOT NULL,
  `booth_template_id` int(11) NOT NULL,
  PRIMARY KEY (`exhibitions_id`,`booth_template_id`),
  KEY `IDX_540e1ebba26f7f7318f7944c15` (`exhibitions_id`),
  KEY `IDX_5631a6238bbfc44def7999ab61` (`booth_template_id`),
  CONSTRAINT `fk-booth-templates-exhibitions` FOREIGN KEY (`booth_template_id`) REFERENCES `booth_templates` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk-exhibitions_booth-templates` FOREIGN KEY (`exhibitions_id`) REFERENCES `exhibitions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- compaon_exhibition_dev.location_status definition

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


-- compaon_exhibition_dev.space_datas definition

CREATE TABLE `space_datas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `media_id` int(11) DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `space_id` int(11) NOT NULL,
  `position_space_id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk-space_datas-spaces` (`space_id`),
  KEY `fk-space_datas-position_space` (`position_space_id`),
  CONSTRAINT `fk-space_datas-position_space` FOREIGN KEY (`position_space_id`) REFERENCES `position_spaces` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk-space_datas-spaces` FOREIGN KEY (`space_id`) REFERENCES `spaces` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- compaon_exhibition_dev.booths definition

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
