ALTER TABLE `enterprises`
ADD `created_by` int(11) NOT NULL,
ADD `created_date` datetime NOT NULL,
MODIFY `status` ENUM('active', 'inactive') NOT NULL,
ADD `is_deleted` tinyint(1) NOT NULL;
