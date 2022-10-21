ALTER TABLE `exhibitions`
DROP COLUMN `description`,
ADD `space_template_id` int(10),
ADD KEY `fk-space_templates-exhibitions` (`space_template_id`),
ADD CONSTRAINT `fk-space_templates-exhibitions` FOREIGN KEY (`space_template_id`) REFERENCES `space_templates` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
ADD `space_id` int(10),
ADD UNIQUE KEY `REL_68ca5098dca8f75f0da224b4da` (`space_id`),
ADD CONSTRAINT `fk-space-informations` FOREIGN KEY (`space_id`) REFERENCES `spaces` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
