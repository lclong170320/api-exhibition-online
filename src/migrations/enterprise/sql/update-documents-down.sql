ALTER TABLE `documents`
DROP is_profile,
ADD medias JSON DEFAULT NULL, 
DROP media_id;
