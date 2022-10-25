ALTER TABLE `booth_organizations`
  DROP CONSTRAINT `fk-booth_organizations-booth_templates`,
  ADD CONSTRAINT `fk-booths-booth_templates` FOREIGN KEY (`booth_template_id`) REFERENCES `booth_templates` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk-booths-exhibitions` FOREIGN KEY (`exhibition_id`) REFERENCES `exhibitions` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD COLUMN `exhibition_id` int(11) NOT NULL,
  ADD COLUMN `is_organization` tinyint(4) NOT NULL DEFAULT '0';
