ALTER TABLE `exhibitions`
CHANGE COLUMN `space_template_id` `space_template_id` int(11),
CHANGE COLUMN `space_id` `space_id` int(11);
ALTER TABLE exhibitions
DROP FOREIGN KEY `fk-exhibition-booth_organization`;
ALTER TABLE exhibitions
DROP COLUMN `booth_organization_id`;
