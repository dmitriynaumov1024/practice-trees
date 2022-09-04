-- MySQL dump 10.13  Distrib 8.0.29, for Linux (x86_64)
--
-- Host: localhost    Database: MY_DATABASE
-- ------------------------------------------------------
-- Server version	8.0.29

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Trees`
--

DROP TABLE IF EXISTS `Trees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Trees` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nodesEncoded` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Trees`
--

LOCK TABLES `Trees` WRITE;
/*!40000 ALTER TABLE `Trees` DISABLE KEYS */;
INSERT INTO `Trees` VALUES (1,'[{\"id\":1,\"parent\":null,\"text\":\"Root\"},{\"id\":2,\"parent\":1,\"text\":\"1st child\"},{\"id\":3,\"parent\":1,\"text\":\"2nd child\"},{\"id\":4,\"parent\":2,\"text\":\"child of 1st child\"},{\"id\":5,\"parent\":1,\"text\":\"3rd child\"},{\"id\":6,\"parent\":1,\"text\":\"untitled#6\"},{\"id\":7,\"parent\":5,\"text\":\"untitled#7\"},{\"id\":8,\"parent\":5,\"text\":\"untitled#8\"},{\"id\":9,\"parent\":5,\"text\":\"untitled#9\"},{\"id\":10,\"parent\":2,\"text\":\"untitled#10\"},{\"id\":11,\"parent\":3,\"text\":\"untitled#11\"},{\"id\":12,\"parent\":3,\"text\":\"untitled#12\"},{\"id\":13,\"parent\":3,\"text\":\"untitled#13\"},{\"id\":14,\"parent\":8,\"text\":\"untitled#14\"},{\"id\":15,\"parent\":8,\"text\":\"untitled#15\"},{\"id\":16,\"parent\":8,\"text\":\"untitled#16\"},{\"id\":17,\"parent\":12,\"text\":\"untitled#17\"},{\"id\":18,\"parent\":12,\"text\":\"untitled#18\"},{\"id\":19,\"parent\":13,\"text\":\"untitled#19\"},{\"id\":20,\"parent\":13,\"text\":\"untitled#20\"},{\"id\":21,\"parent\":10,\"text\":\"untitled#21\"},{\"id\":22,\"parent\":10,\"text\":\"untitled#22\"},{\"id\":23,\"parent\":4,\"text\":\"untitled#23\"},{\"id\":24,\"parent\":4,\"text\":\"untitled#24\"}]'),(2,'[{\"id\":1,\"parent\":null,\"text\":\"practice\"},{\"id\":2,\"parent\":1,\"text\":\"ClientApp\"},{\"id\":3,\"parent\":1,\"text\":\"PhpApp\"},{\"id\":5,\"parent\":1,\"text\":\"science\"}]');
/*!40000 ALTER TABLE `Trees` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-06-08 11:28:15
