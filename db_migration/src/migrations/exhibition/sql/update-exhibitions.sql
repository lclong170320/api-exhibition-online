ALTER TABLE `exhibitions`
ADD `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
ADD `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
ADD `booth_number` int(11) NOT NULL,
ADD `exhibition_code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
ADD `date_exhibition_start` datetime NOT NULL,
ADD `date_exhibition_end` datetime NOT NULL,
ADD `date_input_data_start` datetime NOT NULL,
ADD `date_input_data_end` datetime NOT NULL,
ADD `category_id` int(11) NOT NULL,
ADD CONSTRAINT `fk_category_exhibition` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
