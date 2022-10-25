ALTER TABLE exhibitions
ADD COLUMN `booth_organization_id` int(11) NOT NULL,
ADD CONSTRAINT `fk-exhibition-booth_organization` FOREIGN KEY (`booth_organization_id`) REFERENCES `booth_organizations` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
ADD UNIQUE KEY `REL_dc7e45c918679d61f9748aa7ad` (`booth_organization_id`);
