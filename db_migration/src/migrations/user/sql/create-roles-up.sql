CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TODO
insert  into `roles`(`id`,`slug`,`created_at`,`updated_at`) values 
(1,'admin_system','2022-09-20 13:50:17.170220','2022-09-21 09:17:25.801639'),
(2,'admin','2022-09-20 13:50:17.170220','2022-09-21 09:17:25.801639'),
(3,'staff','2022-09-20 13:50:17.170220','2022-09-21 09:17:25.801639'),
(4,'customer','2022-09-20 13:50:17.170220','2022-09-21 09:17:25.801639');
