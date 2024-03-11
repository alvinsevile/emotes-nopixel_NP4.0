CREATE TABLE IF NOT EXISTS `player_emotes` (
`id` int(11) NOT NULL AUTO_INCREMENT,
`player_id` varchar(50) DEFAULT NULL,
`emote_category` varchar(255) NOT NULL,
`emote_index` int(11) NOT NULL,
`emote_type` varchar(255) NOT NULL,
`emote_value` varchar(255) NOT NULL,
PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;