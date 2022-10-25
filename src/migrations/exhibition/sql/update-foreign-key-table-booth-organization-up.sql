ALTER TABLE `booth_organizations`
  DROP FOREIGN KEY `fk-booths-booth_templates`,
  DROP FOREIGN KEY `fk-booths-exhibitions`,
  DROP COLUMN `is_organization`,
  DROP COLUMN `exhibition_id`,
  ADD CONSTRAINT `fk-booth_organizations-booth_templates` FOREIGN KEY (`booth_template_id`) REFERENCES `booth_templates` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
