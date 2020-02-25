DROP TABLE IF EXISTS `actor_pelicula`;

CREATE TABLE `actor_pelicula` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `actor_id` int(11) unsigned NOT NULL,
  `pelicula_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `actor_id` (`actor_id`),
  KEY `pelicula_id` (`pelicula_id`),
  CONSTRAINT `actor_id` FOREIGN KEY (`actor_id`) REFERENCES `actor` (`id`),
  CONSTRAINT `pelicula_id` FOREIGN KEY (`pelicula_id`) REFERENCES `pelicula` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2965 DEFAULT CHARSET=latin1