ALTER TABLE `documents`
ADD is_profile boolean default false,
DROP medias,
ADD media_id int(11) NOT NULL;
