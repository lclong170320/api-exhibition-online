ALTER TABLE `spaces`
ADD `exhibition_id` int(10),
ADD KEY `fk_exhibition_space` (`exhibition_id`),
ADD CONSTRAINT `fk-space_templates-exhibitions` FOREIGN KEY (`exhibition_id`) REFERENCES `exhibition` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
