# ************************************************************
# Sequel Pro SQL dump
# Version 4004
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Host: localhost (MySQL 5.5.25)
# Database: Codelaborate
# Generation Time: 2013-02-06 07:34:50 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table admin
# ------------------------------------------------------------

DROP TABLE IF EXISTS `admin`;

CREATE TABLE `admin` (
  `admin_id` bigint(11) NOT NULL,
  `user_id` bigint(11) NOT NULL,
  `admin_level` int(11) NOT NULL,
  PRIMARY KEY (`admin_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table download
# ------------------------------------------------------------

DROP TABLE IF EXISTS `download`;

CREATE TABLE `download` (
  `download_id` bigint(100) NOT NULL,
  `session_id` bigint(100) NOT NULL,
  UNIQUE KEY `download_id` (`download_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table sessions
# ------------------------------------------------------------

DROP TABLE IF EXISTS `sessions`;

CREATE TABLE `sessions` (
  `session_id` bigint(100) NOT NULL,
  `session_name` text NOT NULL,
  `session_document` longblob NOT NULL,
  `session_password` text,
  `session_owner` bigint(100) NOT NULL,
  `session_editors` text,
  `session_breakpoints` longblob NOT NULL,
  `session_external_path` text,
  `session_type` text,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `user_id` bigint(100) NOT NULL,
  `user_name` text NOT NULL,
  `user_screen_name` text NOT NULL,
  `user_email` mediumtext NOT NULL,
  `user_level` int(11) NOT NULL DEFAULT '0',
  `user_password` text NOT NULL,
  `user_activated` int(11) DEFAULT NULL,
  `user_locations` longblob NOT NULL,
  `user_github` text,
  `user_external_files` longblob NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_activated` (`user_activated`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`user_id`, `user_name`, `user_screen_name`, `user_email`, `user_level`, `user_password`, `user_activated`, `user_locations`, `user_github`, `user_external_files`)
VALUES
	(899159637279808394,'Brian Vallelunga','Brian','1',1,'$2a$07$aydsaqvpodfwrtdmdnboheY8zNdNNtlKpqurS3FAR7leUrS.Urylq',72514309,X'7B2239323633223A7B2274797065223A22676974687562222C226E616D65223A22436F64656C61626F72617465222C226769746875625F7265706F7369746F7279223A226276616C6C656C756E67615C2F436F64656C61626F72617465227D2C2236373239223A7B2274797065223A22676974687562222C226E616D65223A22546563686E6F6C6F676963222C226769746875625F7265706F7369746F7279223A226276616C6C656C756E67615C2F746563686E6F6C6F676963227D2C2231363931223A7B2274797065223A2273667470222C226E616D65223A224469676974616C204F6365616E222C22736674705F736572766572223A223230382E36382E33392E3536222C22736674705F7365727665725F64656661756C74223A225C2F7661725C2F7777775C2F222C22736674705F757365725F6E616D65223A22726F6F74222C22736674705F757365725F70617373776F7264223A2246316F546669756C227D7D','d1575a7537f77af9e9fd63f3050a35b50ae80825',X'5B5D');

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
