ALTER TABLE `booth_organization_data`
  DROP FOREIGN KEY `fk-booth_organization_datas-booth_organizations`,
  DROP FOREIGN KEY `fk-booth_organization_datas-position_booths`;
ALTER TABLE `booth_organization_data` DROP COLUMN `booth_organization_id`;
ALTER TABLE `booth_organization_data` DROP COLUMN `position_booth_id`;
ALTER TABLE `booth_organization_data` ADD COLUMN `booth_id` int(11) NOT NULL;
ALTER TABLE `booth_organization_data` ADD COLUMN `position_booth_id` int(11) NOT NULL;
ALTER TABLE `booth_organization_data` ADD CONSTRAINT `fk-booth_datas-booths` FOREIGN KEY (`booth_id`) REFERENCES `booth_organizations` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `booth_organization_data` ADD CONSTRAINT `fk-booth_datas-position_booths` FOREIGN KEY (`position_booth_id`) REFERENCES `position_booths` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
