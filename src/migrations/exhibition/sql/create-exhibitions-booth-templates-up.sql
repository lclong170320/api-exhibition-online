CREATE TABLE `exhibitions_booth_templates` (
  `exhibitions_id` int(11) NOT NULL,
  `booth_template_id` int(11) NOT NULL,
  PRIMARY KEY (`exhibitions_id`,`booth_template_id`),
  KEY `IDX_540e1ebba26f7f7318f7944c15` (`exhibitions_id`),
  KEY `IDX_5631a6238bbfc44def7999ab61` (`booth_template_id`),
  CONSTRAINT `fk-booth-templates-exhibitions` FOREIGN KEY (`booth_template_id`) REFERENCES `booth_templates` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk-exhibitions_booth-templates` FOREIGN KEY (`exhibitions_id`) REFERENCES `exhibitions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
