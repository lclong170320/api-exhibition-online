ALTER TABLE `exhibitions`
ADD COLUMN `status` ENUM('new', 'listing', 'finished') NOT NULL
