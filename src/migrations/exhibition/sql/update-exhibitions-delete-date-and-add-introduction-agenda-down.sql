ALTER TABLE `exhibitions`
DROP COLUMN `introduction`,
DROP COLUMN `agenda`,
ADD `date_input_data_start` datetime NOT NULL,
ADD `date_input_data_end` datetime NOT NULL
