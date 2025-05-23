/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.7.2-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: grfood
-- ------------------------------------------------------
-- Server version	11.7.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `namn` varchar(255) NOT NULL,
  `order_index` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES
(1,'Al-Osrah & Osraty',0),
(2,'Khanum',1),
(3,'Nido',2),
(4,'Mahmood Ris',3),
(5,'Mate',4),
(6,'Lara Raha',5),
(7,'Lara Sylt',6),
(8,'Mahmood Kaffe',7),
(9,'Indomie',8),
(10,'Freshly',9),
(11,'Zwan',10),
(12,'Robert',11),
(13,'Campo',12),
(14,'Confetti',13),
(15,'Gold Medal',14),
(16,'Lara Inlagd Gurka',15),
(17,'Lara Inlagd Vildgurka',16),
(18,'Lara Blandade Pickles',17),
(19,'Lara Irakisk Pickles',18),
(20,'Lara Burkmat',19),
(21,'Lara Oliver',20),
(22,'Daoud Brothers',21),
(23,'Lara Inlagd k?lrot med r?dbeta',22),
(24,'Lara Inlagd chili',23),
(25,'Lara Burkmat',24),
(26,'Lara Rosen- & Blomvatten',25),
(27,'Lara Halawa',26),
(28,'Lara Granat?pplesirap',27),
(29,'Lara Tahini',28),
(30,'Lara Makdous',29),
(31,'Lara Vin?ger',30),
(32,'Lara Siraper och Pur?er',31),
(33,'Lara Hinkar',32),
(34,'Lara Mix',33),
(35,'Lara Tonfisk',34),
(36,'Lara Torkad',35),
(37,'Sobrina',36),
(38,'Lara Dadlar',37),
(39,'Lara Qamar Al-Din',38),
(40,'Lara Grillad Aubergine',39),
(41,'Lara Br?dpinnar',40),
(42,'Lara Olivolja',41),
(43,'Lara Artichoke',42),
(44,'Lara S?ser',43),
(45,'Lara Favab?nor',44),
(46,'Lara Surt Druvjuice',45),
(47,'Lara Naturlig Mullb?r',46),
(48,'Lara Freekeh',47),
(49,'Lara KalciumKarbonat',48),
(50,'Lara Sardiner',49),
(51,'Mahmood Te',50),
(52,'Filistina',51),
(53,'Lara Okra',52),
(54,'Lara Vindruvsblad',53),
(55,'Mayasan',54),
(56,'Frizbi',55),
(57,'Derby',56),
(58,'Lara S?t Majs',57),
(59,'Lara Vita b?nor',58),
(60,'Lara Tryffel',59),
(61,'Blu',60),
(62,'AL SAMIR',62),
(63,'Dutch Meadows',61),
(64,'pelle',63);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` bigint(20) DEFAULT NULL,
  `sale_price` double NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES
(19,36,23536,3,13.5),
(20,36,23537,1,13.5),
(21,37,23541,1,52),
(22,37,23545,1,15),
(23,38,23536,1,13.5);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_name` varchar(255) DEFAULT NULL,
  `creation_date` date DEFAULT curdate(),
  `send_date` date DEFAULT NULL,
  `completed` tinyint(1) NOT NULL DEFAULT 0,
  `created_by` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES
(36,'admin orders','2025-05-19',NULL,0,'f6f30c7c-ebff-4e89-8e44-a918ecf5f1be'),
(37,'user1 order','2025-05-19',NULL,0,'b8c58e6f-3339-4268-bb77-4975c4c47941'),
(38,'odr','2025-05-19',NULL,0,'59722f6e-05b2-4e00-a241-830bc2eab241');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `article_number` bigint(20) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `weight` varchar(255) DEFAULT NULL,
  `price` double NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `visible` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `article_number` (`article_number`),
  KEY `fk_category` (`category_id`),
  CONSTRAINT `fk_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24047 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES
(23536,3706,'OSRATY Zaatar Halabi R?d ','400 g x 24 st',13.5,'https://grfood.se/wp-content/uploads/2024/08/3706.jpg',1,0x01),
(23537,3707,'OSRATY Zaatar Naboulsi Gr?n ','400 g x 24 st',13.5,'https://grfood.se/wp-content/uploads/2024/08/3707.jpg',1,0x01),
(23538,5007,'Ghee KHANUM ','1kg x 12st',150,'https://grfood.se/wp-content/uploads/2024/08/5007-1.jpg',2,0x01),
(23539,5008,'Ghee KHANUM ','500g x 12st',85,'https://grfood.se/wp-content/uploads/2024/08/5008-1.jpg',2,0x01),
(23540,8201,'Mj?lk NIDO ','900g x 12st',115,'https://grfood.se/wp-content/uploads/2024/08/8201-1.jpg',3,0x01),
(23541,8202,'Mj?lk NIDO ','400g x 24st',52,'https://grfood.se/wp-content/uploads/2024/08/8201-1.jpg',3,0x01),
(23542,8205,'Mj?lk NIDO','1800g x 6st',209,'https://grfood.se/wp-content/uploads/2024/08/8202.jpg',3,0x01),
(23543,9105,'MAHMOOD 1121 Sella Basmati Ris plastp?se ','900g x 20 st',26,'https://grfood.se/wp-content/uploads/2024/08/9105-1.jpg',4,0x01),
(23544,9107,'MAHMOOD 1121 Sella Basmati Ris plastp?se ','4,5 kg x 4 st',115,'https://grfood.se/wp-content/uploads/2024/05/9107.jpg',4,0x01),
(23545,9622,'KHARTA Yerba Mate White ','250g x 20 st',15,'https://grfood.se/wp-content/uploads/2024/08/9622.jpg',5,0x01),
(23546,20157,'312 Nougat MAN & SALWA lux ','5kg',90,'https://grfood.se/wp-content/uploads/2024/08/20157.jpg',6,0x01),
(23547,20161,'KHARTA Yerba Mate Green ','250g x 20 st',15,'https://grfood.se/wp-content/uploads/2024/08/20161.jpg',5,0x01),
(23548,20266,'301 Raha ARAISI Lux ','5kg',110,'https://grfood.se/wp-content/uploads/2024/08/20266.jpg',6,0x01),
(23549,20275,'LARA, Bitter Apelsinmarmelad ','775g x 12st',43,'https://grfood.se/wp-content/uploads/2024/05/20275.jpg',7,0x01),
(23550,20481,'MAHMOOD Kaffe 3 i 1 Stick ','(24x18g) x 24 st',25,'https://grfood.se/wp-content/uploads/2024/07/20481-1.jpg',8,0x01),
(23551,20651,'AL OSRAH Zaatar R?d ','400 g x 24 st',18,'https://grfood.se/wp-content/uploads/2024/07/20651201-1.jpg',1,0x01),
(23552,20658,'AL OSRAH Zaatar Gr?n ','400 g x 24 st',18,'https://grfood.se/wp-content/uploads/2024/08/20658201.jpg',1,0x01),
(23553,20683,'INDOMIE Nudlar med gr?nsaker ','(5 x 75g) x 8 st',112,'https://grfood.se/wp-content/uploads/2024/05/20683.jpg',9,0x01),
(23554,20684,'INDOMIE Nudlar med kyckling ','(5 x 70g) x 8 st',112,'https://grfood.se/wp-content/uploads/2024/05/20684.jpg',9,0x01),
(23555,20687,'FRESHLY Luncheon Kyckling Stor ','850g x12 st',43,'https://grfood.se/wp-content/uploads/2024/07/20687-1.jpg',10,0x01),
(23556,20688,'FRESHLY Luncheon Kyckling STARK Stor ','850g x12 st',43,'https://grfood.se/wp-content/uploads/2024/07/20688.jpg',10,0x01),
(23557,20689,'ZWAN Kyckling Luncheon Normal Stor ','850g x 12 st',50,'https://grfood.se/wp-content/uploads/2024/07/20689-2.jpg',11,0x01),
(23558,20690,'ZWAN N?tk?tt Luncheon Normal Stor ','850g x 12 st',53,'https://grfood.se/wp-content/uploads/2024/07/20690-2.jpg',11,0x01),
(23559,20691,'ZWAN Kyckling Luncheon Normal Medium ','340g x 12 st',22,'https://grfood.se/wp-content/uploads/2024/07/20691-2.jpg',11,0x01),
(23560,20695,'ZWAN Kyckling Luncheon STARK Stor ','850g x 12 st',51,'https://grfood.se/wp-content/uploads/2024/07/20695-2.jpg',11,0x01),
(23561,20775,'PIPORE Yerba Mate ','250g x 20 st',15,'https://grfood.se/wp-content/uploads/2024/05/20775.jpg',5,0x01),
(23562,20795,'Mj?lk NIDO ','2500g x 6st',270,'https://grfood.se/wp-content/uploads/2024/05/20795-1.jpg',3,0x01),
(23563,20852,'ROBERT Luncheon Kyckling STARK Stor ','850g x 12 st',53,'https://grfood.se/wp-content/uploads/2024/08/20852.jpg',12,0x01),
(23564,20899,'ZWAN N?tk?tt Luncheon Normal Medium ','340g x 12 st',24,'https://grfood.se/wp-content/uploads/2024/05/20899.jpg',11,0x01),
(23565,21043,'CAMPO kanel och ingef?ra','(20X2g) x 20 st',10,'https://grfood.se/wp-content/uploads/2024/05/21043.jpg',13,0x01),
(23566,21044,'CAMPO Gr?n Te med naturlig kardemumma','(20X2g) x 20 st',10,'https://grfood.se/wp-content/uploads/2024/07/21044-1.jpg',13,0x01),
(23567,21046,'CAMPO spiskummin och citron','(20X2g) x 20 st',10,'https://grfood.se/wp-content/uploads/2024/08/21046.jpg',13,0x01),
(23568,21059,'ROBERT Luncheon Kyckling Stor ','850g x 12 st',53,'https://grfood.se/wp-content/uploads/2024/07/21059-2.jpg',12,0x01),
(23569,21069,'MAHMOOD Instantkaffe Gold ','100g(12 stuks)',27,'https://grfood.se/wp-content/uploads/2024/07/21069-1.jpg',8,0x01),
(23570,21070,'MAHMOOD Instantkaffe Gold ','200g(6 stuks)',50,'https://grfood.se/wp-content/uploads/2024/05/21070.jpg',8,0x01),
(23571,21086,'ZWAN Kyckling Luncheon STARK Medium ','340g x 12 st',23,'https://grfood.se/wp-content/uploads/2024/07/21086-2.jpg',11,0x01),
(23572,21121,'371 Nougat MAN & SALWA Pistachio balls lux ','5kg',110,'https://grfood.se/wp-content/uploads/2024/10/21121.jpg',6,0x01),
(23573,21373,'476 Raha Roll Pistachio Super Circle ','5kg',150,'https://grfood.se/wp-content/uploads/2024/05/21373-3.jpg',6,0x01),
(23574,21561,'CAMPO Laxerande blandning(Alkhalta Almulaiyene) ','(20x2g)x20st',12,'https://grfood.se/wp-content/uploads/2024/05/21561.jpg',13,0x01),
(23575,21565,'CAMPO Ingef?ra ','(20x2g) x 20 st',10,'https://grfood.se/wp-content/uploads/2024/07/21565-1.jpg',13,0x01),
(23576,21566,'CAMPO Hibiskus(Karkadee) ','(20x2g) x 20 st',10,'https://grfood.se/wp-content/uploads/2024/07/21566-1.jpg',13,0x01),
(23577,21567,'CAMPO Chamomile(Babonej) ','(20x2g) x 20 st',10,'https://grfood.se/wp-content/uploads/2024/07/21567-1.jpg',13,0x01),
(23578,21568,'CAMPO Rosmarin (Iklil al jabal) ','(20x2g) x 20 st',10,'https://grfood.se/wp-content/uploads/2024/07/21568.jpg',13,0x01),
(23579,21569,'CAMPO Naturlig zhourat ','(20x2g) x 20 st',10,'https://grfood.se/wp-content/uploads/2024/05/21569.jpg',13,0x01),
(23580,21570,'CAMPO Vild Timjan (Zaatar barri) ','(20x2g) x 20 st',10,'https://grfood.se/wp-content/uploads/2024/05/21570.jpg',13,0x01),
(23581,21571,'CAMPO Citronmeliss Melisse ','(20x2g) x 20 st',10,'https://grfood.se/wp-content/uploads/2024/08/21571.png',13,0x01),
(23582,21572,'CAMPO Anis','(20x2g) x 20st',10,'https://grfood.se/wp-content/uploads/2024/07/21572-1.jpg',13,0x01),
(23583,21573,'CAMPO Salvia(Miramie)','(20x2g) x 20 st',10,'https://grfood.se/wp-content/uploads/2024/07/21573-1.jpg',13,0x01),
(23584,21576,'TARAGUI Yerba Mate ','250g x 10 st',13,'https://grfood.se/wp-content/uploads/2024/07/21576-1.jpg',5,0x01),
(23585,21579,'CRUZ DE MALTA Yerba ','250g x 20 st',14,'https://grfood.se/wp-content/uploads/2024/08/21579.jpg',5,0x01),
(23586,21690,'Ghee KHANUM ','2kg x 6st',280,'https://grfood.se/wp-content/uploads/2024/08/21690.jpg',2,0x01),
(23587,21756,'ESPOSITORE CONFETTI Mandeldrag?er Mixed ','500 g x 6 st',55,'https://grfood.se/wp-content/uploads/2024/08/21756.png',14,0x01),
(23588,21757,'ESPOSITORE CONFETTI Mandeldrag?er Vit ','500 g x 6 st',55,'https://grfood.se/wp-content/uploads/2024/08/21757.png',14,0x01),
(23589,21758,'ESPOSITORE CONFETTI Mandeldrag?er Bl? ','500g x 6st',55,'https://grfood.se/wp-content/uploads/2024/08/21758.png',14,0x01),
(23590,21759,'ESPOSITORE CONFETTI Mandeldrag?er Rosa ','500 g x 6 st',55,'https://grfood.se/wp-content/uploads/2024/05/21759-1.png',14,0x01),
(23591,21760,'ESPOSITORE TRIOCIOCK MIX ','500 g x 6 st',60,'https://grfood.se/wp-content/uploads/2024/07/21760-2.png',14,0x01),
(23592,21761,'ESPOSITORE TRIOCIOCK MIX MARBLED ','500g x 6st',60,'https://grfood.se/wp-content/uploads/2024/08/2176120new.png',14,0x01),
(23593,21763,'ESPOSITORE TRIOCIOCK PISTACCHIO ','500 g x 6 st',60,'https://grfood.se/wp-content/uploads/2024/07/21763-2.png',14,0x01),
(23594,21769,'ESPOSITORE TRIOCIOCK TORTA CAPRESE ','500 g x 6 st',60,'https://grfood.se/wp-content/uploads/2024/07/21769-2.png',14,0x01),
(23595,21770,'CONFETTI AL CIOCCOLATO Gold ','500 g x 6 st',90,'https://grfood.se/wp-content/uploads/2024/07/21770-2.png',14,0x01),
(23596,21771,'CONFETTI AL CIOCCOLATO Silver ','500 g x 6 st',83,'https://grfood.se/wp-content/uploads/2024/05/21771-1.png',14,0x01),
(23597,22254,'Ghee GOLD MEDAL (ALBAKARA ALHALOUB) ','400g x 24 st',90,'https://grfood.se/wp-content/uploads/2024/09/22254-1.jpg',15,0x01),
(23598,22255,'Ghee GOLD MEDAL (ALBAKARA ALHALOUB) ','800g x 12 st',163,'https://grfood.se/wp-content/uploads/2024/09/22255.jpg',15,0x01),
(23599,22256,'Ghee GOLD MEDAL (ALBAKARA ALHALOUB)','1600g x 8st',315,'https://grfood.se/wp-content/uploads/2024/09/22256-1.jpg',15,0x01),
(23600,22288,'Mahmood Ris XXL Vit Basmati ','4,5kg x 4st',120,'https://grfood.se/wp-content/uploads/2024/09/22288.jpg',4,0x01),
(23601,22289,'Mahmood Ris XXL Vit Basmati ','907g x 20 st',27,'https://grfood.se/wp-content/uploads/2024/07/22289-2.jpg',4,0x01),
(23602,22424,'MAHMOOD Ris Rundris baldo pirinc ','5kg x 4st',119,'https://grfood.se/wp-content/uploads/2024/07/22424-1.jpg',4,0x01),
(23603,22437,'703 Raha Roll Pistachio Super Plus ','5kg',195,'https://grfood.se/wp-content/uploads/2024/07/22437-1.jpg',6,0x01),
(23604,22464,'CAMPO Blandning f?r fitness(Rashaka) ','(20x2g) x20st',11,'https://grfood.se/wp-content/uploads/2024/05/22464-1.jpg',13,0x01),
(23605,22646,'LARA Inlagd Gurka Liten ','400g x 12 st',17,'https://grfood.se/wp-content/uploads/2024/07/22646202-2.jpg',16,0x01),
(23606,22647,'LARA Inlagd Gurka Stor Extra ','1,8kg x 4 st',62,'https://grfood.se/wp-content/uploads/2024/07/22647203-2.jpg',16,0x01),
(23607,22649,'LARA Inlagda vildgurka Mellan ','650g x 12 st',22,'https://grfood.se/wp-content/uploads/2024/07/22649201-1.jpg',17,0x01),
(23608,22651,'LARA Blandade Pickles Liten ','400g x 12 st',17,'https://grfood.se/wp-content/uploads/2024/08/22651202.jpg',18,0x01),
(23609,22652,'LARA Blandade Pickles Mellan ','650g x 12 st',19,'https://grfood.se/wp-content/uploads/2024/07/22652-1.jpg',18,0x01),
(23610,22653,'LARA Blandade Pickles Stor ','1,8kg x 4 st',46,'https://grfood.se/wp-content/uploads/2024/08/22653.jpg',18,0x01),
(23611,22654,'LARA Iraqi Pickles Liten ','600g x 12 st',18.5,'https://grfood.se/wp-content/uploads/2024/07/22654202-1.jpg',19,0x01),
(23612,22655,'LARA Irakisk Pickles Medium ','950g x 12 st',21,'https://grfood.se/wp-content/uploads/2024/08/22655201.jpg',19,0x01),
(23613,22656,'LARA Iraqi Pickles Stor ','2,650kg x 4 st',56,'https://grfood.se/wp-content/uploads/2024/07/22656202.jpg',19,0x01),
(23614,22660,'LARA Zucchini med Olja ','400g x 12 st',20,'https://grfood.se/wp-content/uploads/2024/08/22660202.jpg',20,0x01),
(23615,22661,'LARA Fyllda Vindruvsblad ','400g x 12st',23,'https://grfood.se/wp-content/uploads/2024/07/22661-2.jpg',20,0x01),
(23616,22662,'LARA Gr?na B?nor Med Olja ','400g x 12 st',20,'https://grfood.se/wp-content/uploads/2024/07/22662-2.jpg',20,0x01),
(23617,22663,'LARA Gr?na Oliver Tfahi Liten ','400g x 12 st',25,'https://grfood.se/wp-content/uploads/2024/09/22663201.jpg',21,0x01),
(23618,22664,'LARA Gr?na Oliver Tfahi Mellan ','650g x 12 st',32,'https://grfood.se/wp-content/uploads/2024/09/22664202.jpg',21,0x01),
(23619,22665,'LARA Gr?na Oliver Tfahi Stor ','1,8kg x 4 st',84,'https://grfood.se/wp-content/uploads/2024/09/22665203.jpg',21,0x01),
(23620,22775,'402 Nougat Super ','5kg',150,'https://grfood.se/wp-content/uploads/2024/07/22775-2.jpg',6,0x01),
(23621,22793,'DAOUD BROTHERS Maamoul med dadlar ','(per 24 ? 21g) 504grx12st',25,'https://grfood.se/wp-content/uploads/2024/10/22793.jpg',22,0x01),
(23622,22814,'LARA Inlagd Gurka Liten F?RSK ','400g x 12 st',18.5,'https://grfood.se/wp-content/uploads/2024/09/22814202.jpg',16,0x01),
(23623,22816,'LARA Inlagd vildgurka Mellan F?RSK ','650g x 12 st',26,'https://grfood.se/wp-content/uploads/2024/07/22816-2.jpg',17,0x01),
(23624,22817,'LARA Blandade Pickles Mellan F?RSK ','650g x 12 st',18,'https://grfood.se/wp-content/uploads/2024/08/22817.jpg',18,0x01),
(23625,22818,'LARA Blandade Pickles Liten F?RSK ','400g x 12 st',16,'https://grfood.se/wp-content/uploads/2024/08/22818.jpg',18,0x01),
(23626,22819,'LARA Skivad inlagd k?lrot med r?dbeta F?RSK ','400g x 12st',17,'https://grfood.se/wp-content/uploads/2024/09/22819201.jpg',23,0x01),
(23627,22820,'LARA Skivad inlagd k?lrot med r?dbeta F?RSK ','650g x 12st',21,'https://grfood.se/wp-content/uploads/2024/08/22820202-1.jpg',23,0x01),
(23628,22821,'LARA Skivad inlagd k?lrot med r?dbeta F?RSK ','1,8kg x 4st',57,'https://grfood.se/wp-content/uploads/2024/07/22821202.jpg',23,0x01),
(23629,22822,'LARA Inlagd Chilipeppar Liten ','300g x 12 st',18,'https://grfood.se/wp-content/uploads/2024/07/22822202-1.jpg',24,0x01),
(23630,22823,'LARA Inlagd Chilipeppar Mellan ','400g x 12 st',20,'https://grfood.se/wp-content/uploads/2024/07/22823.jpg',24,0x01),
(23631,22824,'LARA Fikonmarmelad Med Valn?tter ','775g x 12 st',34,'https://grfood.se/wp-content/uploads/2024/08/22824.jpg',7,0x01),
(23632,22826,'LARA Fikon Marmelad ','800g x 12 st',32,'https://grfood.se/wp-content/uploads/2024/07/22826-2.jpg',7,0x01),
(23633,22828,'LARA Okra Med Olja ','400g x 12 st',22,'https://grfood.se/wp-content/uploads/2024/07/22828-2.jpg',25,0x01),
(23634,22829,'LARA Blomvatten (zahr) ','250ml x 24 st',8,'https://grfood.se/wp-content/uploads/2024/07/22829201-2.jpg',26,0x01),
(23635,22830,'LARA Rosenvatten (ward)) ','250ml x 24 st',8,'https://grfood.se/wp-content/uploads/2024/08/22830202.jpg',26,0x01),
(23636,22831,'LARA Gr?na Oliver Salkini Liten ','400g x 12 st',27,'https://grfood.se/wp-content/uploads/2024/07/22831203-1.jpg',21,0x01),
(23637,22832,'LARA Gr?na Oliver Salkini Mellan ','650g x 12 st',38,'https://grfood.se/wp-content/uploads/2024/07/22832202-1.jpg',21,0x01),
(23638,22833,'LARA Gr?na Oliver Salkini Stor ','1850g x 4 st',99,'https://grfood.se/wp-content/uploads/2024/07/22833201-2.jpg',21,0x01),
(23639,22840,'LARA Halva med Pistagen?tter Liten ','400g x 12 st',29,'https://grfood.se/wp-content/uploads/2024/07/22840-1.jpg',27,0x01),
(23640,22841,'LARA Halva med Pistagen?tter Stor ','800g x 12 st',48,'https://grfood.se/wp-content/uploads/2024/07/22841-1.jpg',27,0x01),
(23641,22842,'LARA Granat?pplesirap Liten ','350g x 24 st',14,'https://grfood.se/wp-content/uploads/2024/08/22842.jpg',28,0x01),
(23642,22843,'LARA Granat?pplesirap Stor ','650g x 12 st',25,'https://grfood.se/wp-content/uploads/2024/07/22843-2.jpg',28,0x01),
(23643,22844,'LARA Tahini Liten ','400g x 12 st',24.5,'https://grfood.se/wp-content/uploads/2024/10/22844.jpg',29,0x01),
(23644,22845,'LARA Tahini Stor ','800g x 12 st',42,'https://grfood.se/wp-content/uploads/2024/11/22845.png',29,0x01),
(23645,22846,'LARA Gr?na Skivade Oliver ','350g x 12 st',25,'https://grfood.se/wp-content/uploads/2024/09/22846202.jpg',21,0x01),
(23646,22847,'LARA Oliver fyllda med Paprika ','375g x 12 st',25,'https://grfood.se/wp-content/uploads/2024/07/22847202-2.jpg',21,0x01),
(23647,22848,'LARA Oliver Fyllda med Mor?tter ','375g x 12 st',25,'https://grfood.se/wp-content/uploads/2024/08/22848.jpg',21,0x01),
(23648,22849,'LARA Oliver Fyllda med Citron ','375g x 12 st',25,'https://grfood.se/wp-content/uploads/2024/08/22849.jpg',21,0x01),
(23649,22850,'LARA Oliver fyllda med Timjan ','375g x 12 st',25,'https://grfood.se/wp-content/uploads/2024/08/22850202.jpg',21,0x01),
(23650,22851,'LARA Olivsallad ','600g x 12 st',30,'https://grfood.se/wp-content/uploads/2024/07/22851-2.jpg',21,0x01),
(23651,22852,'LARA Sallad med Grillade Oliver ','600g x 12st',32.5,'https://grfood.se/wp-content/uploads/2024/07/22852202-2.jpg',21,0x01),
(23652,22856,'LARA Makdous (Fyllda Auberginer) Mellan EXTRA ','950g x 12 st',53,'https://grfood.se/wp-content/uploads/2024/07/22856-1.jpg',30,0x01),
(23653,22858,'LARA ?ppelvin?ger ','500ml x 12 st',17,'https://grfood.se/wp-content/uploads/2024/10/wconn-205865-1-1.jpg',31,0x01),
(23654,22859,'LARA Vitvinsvin?ger ','1L x 12 st',13,'https://grfood.se/wp-content/uploads/2024/08/22859.jpg',31,0x01),
(23655,22860,'LARA Aprikosmarmelad ','800g x 12 st',31,'https://grfood.se/wp-content/uploads/2024/07/22860.jpg',7,0x01),
(23656,22880,'LARA Inlagd Vildgurka Stor EXTRA','1,8kg x 4 st',70,'https://grfood.se/wp-content/uploads/2024/08/22880.jpg',17,0x01),
(23657,22895,'LARA Sirap av Julep Liten (sockerlag) ','600ml x 12 st',33,'https://grfood.se/wp-content/uploads/2024/07/22895202-2.jpg',32,0x01),
(23658,22896,'LARA Granat?pplesirap ','600ml x 12 st',33,'https://grfood.se/wp-content/uploads/2024/08/22896201.jpg',32,0x01),
(23659,22897,'LARA Sirap av Mullb?r ','600 ml x 12 st',33,'https://grfood.se/wp-content/uploads/2024/08/22897201.jpg',32,0x01),
(23660,22898,'LARA Sirap av Tamarind ( Tamar hndi) ','600ml x 12 st',33,'https://grfood.se/wp-content/uploads/2024/09/22898202.jpg',32,0x01),
(23661,22899,'LARA Sirap av Julep Stor (sockerlag) ','3,2L x 4 st',75,'https://grfood.se/wp-content/uploads/2024/07/22899202-2.jpg',32,0x01),
(23662,22900,'LARA Inlagd Gurka Mellan F?RSK ','650g x 12 st',24,'https://grfood.se/wp-content/uploads/2024/08/22900.jpg',16,0x01),
(23663,22901,'LARA Blandade Pickles Stor F?RSK ','1,8kg x 4 st',57,'https://grfood.se/wp-content/uploads/2024/05/22901202.jpg',18,0x01),
(23664,22902,'LARA Inlagda Vildgurka Hink ','10kg',160,'https://grfood.se/wp-content/uploads/2024/07/22902-1.jpg',33,0x01),
(23665,22903,'LARA Blandade Pickles Hink ','10kg',160,'https://grfood.se/wp-content/uploads/2024/05/22903.jpg',33,0x01),
(23666,22960,'444 Nougat Roll Pistachio Super ','5kg',160,'https://grfood.se/wp-content/uploads/2024/05/22960-1.jpg',6,0x01),
(23667,22962,'705 Raha Arch pistachio super plus ','5kg',195,'https://grfood.se/wp-content/uploads/2024/08/22962201.jpg',6,0x01),
(23668,22963,'706 Raha Square Pistachio super plus ','5kg',195,'https://grfood.se/wp-content/uploads/2024/07/22963-2.jpg',6,0x01),
(23669,22964,'707 Raha Rectangle pistachio super plus ','5kg',195,'https://grfood.se/wp-content/uploads/2024/08/22964.jpg',6,0x01),
(23670,23022,'LARA Makdous (Fyllda Auberginer) Liten EXTRA ','600g x 12st',43,'https://grfood.se/wp-content/uploads/2024/07/23022201-1.jpg',30,0x01),
(23671,23023,'LARA Makdous (Fyllda Auberginer) Stor EXTRA ','2,75Kg x 4st',158,'https://grfood.se/wp-content/uploads/2024/10/23023.jpg',30,0x01),
(23672,23025,'LARA Majsst?rkelse (Maizena) ','200g x 12st',15,'https://grfood.se/wp-content/uploads/2024/08/23025201.jpg',34,0x01),
(23673,23026,'LARA Salep (Sahlab) ','200g x 12st',17,'https://grfood.se/wp-content/uploads/2024/08/23026201.jpg',34,0x01),
(23674,23027,'LARA Krispig Kycklingmix ','200g x 12st',17,'https://grfood.se/wp-content/uploads/2024/08/23027201.jpg',34,0x01),
(23675,23028,'LARA Broilerkyckling Mix ','200g x 12st',17,'https://grfood.se/wp-content/uploads/2024/08/23028201.jpg',34,0x01),
(23676,23029,'LARA Falafel mix ','200g x 12st',15.5,'https://grfood.se/wp-content/uploads/2024/07/23029202-2.jpg',34,0x01),
(23677,23045,'LARA Skivade Inlagd Gurka Hink ','10kg',160,'https://grfood.se/wp-content/uploads/2024/08/23045.jpg',33,0x01),
(23678,23046,'LARA Inlagd Gurka Hink ','10kg',160,'https://grfood.se/wp-content/uploads/2024/08/23046.jpg',33,0x01),
(23679,23048,'LARA Inlagd Stark Paprika Hink ','10kg',170,'https://grfood.se/wp-content/uploads/2024/07/23048.jpg',33,0x01),
(23680,23049,'LARA Granat?pple Sirap Stor ','1,4kg x 6st',45,'https://grfood.se/wp-content/uploads/2024/05/23049.png',28,0x01),
(23681,23050,'LARA Tonfisk, Vanlig ','160g x 48st',12.5,'https://grfood.se/wp-content/uploads/2024/07/23050202-1.jpg',35,0x01),
(23682,23051,'LARA Tonfisk med Chili ','160g x 48st',12.5,'https://grfood.se/wp-content/uploads/2024/07/23051202-3.jpg',35,0x01),
(23683,23081,'LARA Inlagd Gurka Stor ','1,8kg x 4st',57,'https://grfood.se/wp-content/uploads/2024/08/23081202.jpg',16,0x01),
(23684,23095,'LARA Rosenvatten (ward) ','500ml x 12st',15,'https://grfood.se/wp-content/uploads/2024/07/23095202-1.jpg',26,0x01),
(23685,23096,'LARA Blomvatten (zahr) ','500ml x 12st',15,'https://grfood.se/wp-content/uploads/2024/08/23096201.jpg',26,0x01),
(23686,23097,'LARA Jordgubbs Marmelad ','800g x 12st',31,'https://grfood.se/wp-content/uploads/2024/07/23097-1.jpg',7,0x01),
(23687,23210,'LARA Bj?rnb?rs Sylt ','800g x 12st',35,'https://grfood.se/wp-content/uploads/2024/07/23210-2.jpg',7,0x01),
(23688,23211,'LARA Rosenmarmelad ','800 g x 12 st',30,'https://grfood.se/wp-content/uploads/2024/07/23211-2.jpg',7,0x01),
(23689,23212,'LARA K?rsb?rsmarmelad ','800 g x 12 st',31.5,'https://grfood.se/wp-content/uploads/2024/07/23212-1.jpg',7,0x01),
(23690,23218,'LARA Torkad Malva ','200g x 20st',16,'https://grfood.se/wp-content/uploads/2024/08/23218.jpg',36,0x01),
(23691,23299,'ROBERT Luncheon Kyckling Liten ','200 g x 24 st',17,'https://grfood.se/wp-content/uploads/2024/07/23299202-1.jpg',12,0x01),
(23692,23300,'ROBERT Luncheon Kyckling STARK Liten ','200 g x 24 st',15,'https://grfood.se/wp-content/uploads/2024/07/23300202-1.jpg',12,0x01),
(23693,23301,'ROBERT Luncheon Kyckling Medium ','340 g x 12 st',22.5,'https://grfood.se/wp-content/uploads/2024/07/23301201-1.jpg',12,0x01),
(23694,23302,'ROBERT Luncheon Kyckling STARK Medium ','340 g x 12 st',24,'https://grfood.se/wp-content/uploads/2024/08/23302202.jpg',12,0x01),
(23695,23306,'FRESHLY Luncheon Kyckling Liten ','200 g x 24 st',13.5,'https://grfood.se/wp-content/uploads/2024/07/23306201-1.jpg',10,0x01),
(23696,23307,'FRESHLY Luncheon Kyckling Medium ','340 g x 12 st',21,'https://grfood.se/wp-content/uploads/2024/07/23307202-1.jpg',10,0x01),
(23697,23337,'LARA Inlagd gurka SUPER EXTRA','650g x 12st',28,'https://grfood.se/wp-content/uploads/2024/10/23337.jpg',16,0x01),
(23698,23338,'SOBRINA Juicepulver Citron ','(12 x 1L) x 12 st',24,'https://grfood.se/wp-content/uploads/2024/08/2333820220-20kopie.jpg',37,0x01),
(23699,23339,'SOBRINA Juicepulver Jallab ','(12 x 1L) x 12 st',24,'https://grfood.se/wp-content/uploads/2024/07/2333920new-2.jpg',37,0x01),
(23700,23340,'SOBRINA Juicepulver Bj?rnb?r ','(12 x 1L) x 12 st',24,'https://grfood.se/wp-content/uploads/2024/08/23340.jpg',37,0x01),
(23701,23341,'SOBRINA Juicepulver Apelsin ','(12 x 1L) x 12 st',24,'https://grfood.se/wp-content/uploads/2024/08/23341.jpg',37,0x01),
(23702,23348,'SOBRINA Juicepulver Mango ','(12 x 1L) x 12 st',24,'https://grfood.se/wp-content/uploads/2024/08/2334820120-20kopie.jpg',37,0x01),
(23703,23350,'471 Big Roll Nougat pistachio super ','5kg',160,'https://grfood.se/wp-content/uploads/2024/08/23350.jpg',6,0x01),
(23704,23358,'SOBRINA Juicepulver Frukt ','(12 x 1L) x 12 st',24,'https://grfood.se/wp-content/uploads/2024/07/2335820new.jpg',37,0x01),
(23705,23409,'LARA Svarta Oliver Salkini Liten ','400g x 12st',27,'https://grfood.se/wp-content/uploads/2024/07/23409202.jpg',21,0x01),
(23706,23410,'LARA Svarta Oliver Salkini Medium ','650g x 12st',28,'https://grfood.se/wp-content/uploads/2024/07/23410201-1.jpg',21,0x01),
(23707,23411,'LARA Svarta Oliver Salkini Stor ','1850g x 4st',95,'https://grfood.se/wp-content/uploads/2024/09/23411201-1.jpg',21,0x01),
(23708,23414,'LARA Valn?ts Marmelad ','400g x 12st',42,'https://grfood.se/wp-content/uploads/2024/08/23414202.jpg',7,0x01),
(23709,23433,'LARA Tahini Extra Hink ','18Kg',900,'https://grfood.se/wp-content/uploads/2024/08/23433-1.jpg',33,0x01),
(23710,23522,'LARA Tamarind (Tamer Hndi) ','400g x 40st',12,'https://grfood.se/wp-content/uploads/2024/07/23522-1.jpg',38,0x01),
(23711,23525,'LARA Qamar Al-Din ','400g x 25 st',16.5,'https://grfood.se/wp-content/uploads/2024/09/23525202.jpg',39,0x01),
(23712,23527,'LARA Dadelsirap ','400g x 12st',22,'https://grfood.se/wp-content/uploads/2024/07/23527201-1.jpg',38,0x01),
(23713,23528,'LARA Halva med Vanilj ','400g x 12st',24.5,'https://grfood.se/wp-content/uploads/2024/08/23528202.jpg',27,0x01),
(23714,23529,'LARA Halva Med Vanilj ','800g x 12st',41,'https://grfood.se/wp-content/uploads/2024/07/23529201-1.jpg',27,0x01),
(23715,23530,'LARA Auberginemarmelad med Valn?tter ','775g x 12st',48,'https://grfood.se/wp-content/uploads/2024/08/23530202.jpg',7,0x01),
(23716,23535,'LARA Hel Grillad Aubergine I Glas burk ','1,45 Kg x 6st',45,'https://grfood.se/wp-content/uploads/2024/07/23535201.jpg',40,0x01),
(23717,23538,'LARA Handskuren grillad Aubergine I Glasburk ','610g x 12st',20,'https://grfood.se/wp-content/uploads/2024/05/23538.jpg',40,0x01),
(23718,23540,'LARA Br?dpinnar ','300g x 24st',15,'https://grfood.se/wp-content/uploads/2024/06/23540202.jpg',41,0x01),
(23719,23562,'LARA Blandade Pickles ALmousel STARK ','2650g x 4st',56,'https://grfood.se/wp-content/uploads/2024/09/23562202.jpg',19,0x01),
(23720,23589,'LARA Kalamata Gr?na Oliver ','1750g x 4st',83,'https://grfood.se/wp-content/uploads/2024/07/23589-1.jpg',21,0x01),
(23721,23626,'LARA Slicad Inlagd Vildgurka Hink ','10 Kg',150,'https://grfood.se/wp-content/uploads/2024/08/23626.jpg',33,0x01),
(23722,23676,'LARA Aprikos Marmelad ','1200g x 6 st',48,'https://grfood.se/wp-content/uploads/2024/08/23676202.jpg',7,0x01),
(23723,23677,'LARA Olivolja ','500ml x 12st',68,'https://grfood.se/wp-content/uploads/2024/08/23677.jpg',42,0x01),
(23724,23678,'LARA Olivolja ','750ml x 6st',99,'https://grfood.se/wp-content/uploads/2024/08/23678.jpg',42,0x01),
(23725,23713,'LARA Kron?rtskocka (Artichoke) ','500g x 12st',28,'https://grfood.se/wp-content/uploads/2024/08/23713.jpg',43,0x01),
(23726,23714,'LARA Gr?na Bondb?nor Med Olja ','400g x 12st',23,'https://grfood.se/wp-content/uploads/2024/07/23714-2.jpg',20,0x01),
(23727,23748,'LARA Rispudding ','200g x 12st',17,'https://grfood.se/wp-content/uploads/2024/08/23748.jpg',34,0x01),
(23728,23749,'LARA Mohalabia ','200g x 12st',17,'https://grfood.se/wp-content/uploads/2024/07/23749-2.jpg',34,0x01),
(23729,23759,'LARA Ketchup & BBQ s?s 2+1 Gratis ','920g x 9 st',34,'https://grfood.se/wp-content/uploads/2024/05/23759203.jpg',44,0x01),
(23730,23763,'LARA Ketchup ','300g x 12st',11.5,'https://grfood.se/wp-content/uploads/2024/08/23763.png',44,0x01),
(23731,23764,'LARA Favab?nor ','400g x 24st',5,'https://grfood.se/wp-content/uploads/2024/07/23764-1.jpg',45,0x01),
(23732,23765,'LARA Favab?nor Med Hummus ','400g x 24st',5,'https://grfood.se/wp-content/uploads/2024/09/23765-1.jpg',45,0x01),
(23733,23777,'LARA Surt Druvjuice ','500ml x 12st',27.5,'https://grfood.se/wp-content/uploads/2024/08/23777.jpg',46,0x01),
(23734,23779,'LARA Naturliga Mullb?r ','600g x 12st',29,'https://grfood.se/wp-content/uploads/2024/07/23779-120-20kopie-1.jpg',47,0x01),
(23735,23782,'LARA Paprikapure Stark EXTRA ','370g x 12st',29,'https://grfood.se/wp-content/uploads/2024/08/23782.jpg',32,0x01),
(23736,23797,'LARA Hel Aprikosmarmelad ','800 g x 12 st',44,'https://grfood.se/wp-content/uploads/2024/10/23797.jpg',7,0x01),
(23737,23802,'LARA Freekeh ','800 g x 12 st',38,'https://grfood.se/wp-content/uploads/2024/08/23802-1.jpg',48,0x01),
(23738,23807,'LARA 639 Raha & Nougat Blandade S?tsaker LUX ','700 g x 12 st',122,'https://grfood.se/wp-content/uploads/2024/10/23807.png',6,0x01),
(23739,23817,'DAOUD BROTHERS Baklava S?tsaker ','750 g x 12 st',155,'https://grfood.se/wp-content/uploads/2024/10/Daoud20Baklava202-1-440x372-1.jpg',22,0x01),
(23740,23818,'DAOUD BROTHERS Baklava S?tsaker ','500 g x 12 st',135,'https://grfood.se/wp-content/uploads/2024/10/Daoud20Baklava202-1-440x372-1.jpg',22,0x01),
(23741,23819,'DAOUD BROTHERS Barazek S?tsaker ','500 g x 12 st',80,'https://grfood.se/wp-content/uploads/2024/10/Daoud20Barazek202-440x373-2.jpg',22,0x01),
(23742,23820,'DAOUD BROTHERS Graibeh S?tsaker ','500 g x 12 st',80,'https://grfood.se/wp-content/uploads/2024/10/Daoud20Graibeh202-1.jpg',22,0x01),
(23743,23821,'DAOUD BROTHERS Mammoul S?tsaker ','500 g x 12 st',98,'https://grfood.se/wp-content/uploads/2024/10/Daoud20Mammoul202-440x396-2.jpg',22,0x01),
(23744,23822,'DAOUD BROTHERS Eish Albulbil S?tsaker ','500 g x 12 st',102,'https://grfood.se/wp-content/uploads/2024/10/Daoud20Eish20Albulbil202-1-440x328-2.jpg',22,0x01),
(23745,23829,'LARA Kvittenmarmelad ','400g x 12st',36,'https://grfood.se/wp-content/uploads/2024/10/23829.png',7,0x01),
(23746,23830,'LARA Luxury Sylt MIX ','(240 g x 4st) x 12 st',42,'https://grfood.se/wp-content/uploads/2024/09/23830.png',7,0x01),
(23747,23831,'LARA Kalciumkarbonat ','2 kg x 6 st',39,'https://grfood.se/wp-content/uploads/2024/08/23831-2.png',49,0x01),
(23748,23833,'LARA Fava Beans Chilli ','400 g x 24 st',5,'https://grfood.se/wp-content/uploads/2024/09/23833.png',45,0x01),
(23749,23835,'LARA Broad Beans Bajela ','400 g x 24 st',5.5,'https://grfood.se/wp-content/uploads/2024/09/23835-1.png',45,0x01),
(23750,23836,'LARA Fava Beans Lebanese ','400 g x 24 st',5,'https://grfood.se/wp-content/uploads/2024/09/23836-1.png',45,0x01),
(23751,23837,'LARA Fava Beans Syrian ','400 g x 24 st',5,'https://grfood.se/wp-content/uploads/2024/09/2383720-201-1.png',45,0x01),
(23752,23839,'LARA Fava Beans Cumin & Lemon ','400 g x 24 st',5,'https://grfood.se/wp-content/uploads/2024/09/23839.png',45,0x01),
(23753,23846,'SOBRINA Juicepulver ?pple ','(12 x 1L) x 12 st',24,'https://grfood.se/wp-content/uploads/2024/07/23846-1.jpg',37,0x01),
(23754,23847,'SOBRINA Juicepulver Apelsin och Morot ','(12 x 1L) x 12 st',24,'https://grfood.se/wp-content/uploads/2024/07/23847-1.jpg',37,0x01),
(23755,23848,'SOBRINA Juicepulver Jordgubb ','(12 x 1L) x 12 st',24,'https://grfood.se/wp-content/uploads/2024/07/23848-2.jpg',37,0x01),
(23756,23849,'LARA Johannesbr?d Sirap ','400 g x 12 st',22,'https://grfood.se/wp-content/uploads/2024/07/23849-1.jpg',32,0x01),
(23757,23852,'LARA Tahini Hink ','5kg x 2st',235,'https://grfood.se/wp-content/uploads/2024/10/2080764978-1.jpg',33,0x01),
(23758,23861,'LARA Dadelsmet ','900g x 12st',16,'https://grfood.se/wp-content/uploads/2024/07/23861.png',38,0x01),
(23759,23862,'LARA Fyllda Vindruvsblad','2 kg x 6 st',75,'https://grfood.se/wp-content/uploads/2024/07/23862-scaled.jpg',20,0x01),
(23760,23863,'LARA Jordgubbssylt ','1200g x 6 st',45,'https://grfood.se/wp-content/uploads/2024/10/23863-1-1.jpg',7,0x01),
(23761,23866,'DAOUD BROTHERS Graibeh S?tsaker ','250g x 24st',45,'https://grfood.se/wp-content/uploads/2024/10/Daoud20Graibeh202-1.jpg',22,0x01),
(23762,23868,'DAOUD BROTHERS Mammoul S?tsaker ','250g x 24st',45,'https://grfood.se/wp-content/uploads/2024/10/Daoud20Mammoul202-440x396-2.jpg',22,0x01),
(23763,23872,'CONFETTI Pelatina super White ','10kg',100,'https://grfood.se/wp-content/uploads/2024/10/23872.jpg',14,0x01),
(23764,23873,'CONFETTI Pelatina super Mix ','10kg',100,'https://grfood.se/wp-content/uploads/2024/10/23873.jpg',14,0x01),
(23765,23874,'CONFETTI Pelatina super Blue ','10kg',100,'https://grfood.se/wp-content/uploads/2024/10/23874.jpg',14,0x01),
(23766,23875,'CONFETTI Pelatina super Pink ','10kg',100,'https://grfood.se/wp-content/uploads/2024/10/23875.jpg',14,0x01),
(23767,23893,'LARA LB Olivolja ','500ml x 12st',60,'https://grfood.se/wp-content/uploads/2024/08/23893-4.png',42,0x01),
(23768,23894,'LARA LB Olivolja ','1000ML x 12st',107,'https://grfood.se/wp-content/uploads/2024/10/IMG_4752-440x660-2.png',42,0x01),
(23769,23917,'LARA Sardiner ','125g x 50st',6.4,'https://grfood.se/wp-content/uploads/2024/11/23917.png',50,0x01),
(23770,23918,'LARA Sardiner Med Chili ','125g x 50st',6.4,'https://grfood.se/wp-content/uploads/2024/10/DD-1.png',50,0x01),
(23771,61070,'MAHMOOD Tea Earl Grey bags ','(100x2g) x 18 st',28,'https://grfood.se/wp-content/uploads/2024/07/61070-3.jpg',51,0x01),
(23772,61071,'MAHMOOD Ceylon Black Tea bags ','(100x2g) x18 st',28,'https://grfood.se/wp-content/uploads/2024/07/61071-1.jpg',51,0x01),
(23773,61072,'MAHMOOD Tea Cardamom bags ','(100 x 2g) x 18 st',28,'https://grfood.se/wp-content/uploads/2024/06/61072.jpg',51,0x01),
(23774,61112,'MAHMOOD Ceylon Black Tea ','450g x 20 st',44,'https://grfood.se/wp-content/uploads/2024/05/61112.jpg',51,0x01),
(23775,61114,'MAHMOOD Tea Earl Grey ','450 g x 20 st',44,'https://grfood.se/wp-content/uploads/2024/07/61114.jpg',51,0x01),
(23776,61116,'MAHMOOD Tea Cardamom ','450g x 20 st',44,'https://grfood.se/wp-content/uploads/2024/08/61116.jpg',51,0x01),
(23777,61208,'MAHMOOD Tea Green ','450g x 20st',44,'https://grfood.se/wp-content/uploads/2024/07/61208-2.jpg',51,0x01),
(23778,23781,'LARA Torkad Okra ','150g x 12 st',40,'https://grfood.se/wp-content/uploads/2024/11/23781.jpg',36,0x01),
(23779,23217,'LARA Torkad Zucchini ','60g x 12 st',22,'https://grfood.se/wp-content/uploads/2024/11/23217.jpg',36,0x01),
(23780,23216,'LARA Torkad Aubergine ','60 g x 12 st',23,'https://grfood.se/wp-content/uploads/2024/11/23216.jpg',36,0x01),
(23781,23776,'Lara Surt Druvjuice ','270ml x 12 st',20,'https://grfood.se/wp-content/uploads/2024/08/23777.jpg',46,0x01),
(23782,23925,'Ghee GOLD MEDAL (ALBAKARA ALHALOUB)','15 kg x 1st',2650,'https://grfood.se/wp-content/uploads/2024/11/23925.jpg',15,0x01),
(23783,23931,'FILISTINA Medjoul Dadlar Jumbo Apelsin ','5kg',375,'https://grfood.se/wp-content/uploads/2024/11/23931.png',52,0x01),
(23784,23932,'FILISTINA Medjoul Dadlar Jumbo Guld ','5kg',475,'https://grfood.se/wp-content/uploads/2024/11/23932.png',52,0x01),
(23785,23933,'FILISTINA Medjoul Dadlar Stor Apelsin ','908g x 12st',75,'https://grfood.se/wp-content/uploads/2024/11/23933.png',52,0x01),
(23786,23934,'FILISTINA Medjoul Dadlar Stor Svart ','2kg x 4st',170,'https://grfood.se/wp-content/uploads/2024/11/23934.png',52,0x01),
(23787,22861,'LARA Pumpasylt','775g x 12 st',35,'https://grfood.se/wp-content/uploads/2024/11/22861.jpg',7,0x01),
(23788,23853,'LARA Dadelsylt ','775g x 12st',49,'https://grfood.se/wp-content/uploads/2024/11/23853.png',7,0x01),
(23789,23922,'LARA Okra ','400g x 12st',28,'https://grfood.se/wp-content/uploads/2024/11/23922-1.png',53,0x01),
(23790,23923,'LARA Jalape?opeppar ','1,5 kg x 6st',28,'https://grfood.se/wp-content/uploads/2024/11/23923-1.png',24,0x01),
(23791,23120,'LARA F?rska Vindruvsblad ','350 g x 12st',21,'https://grfood.se/wp-content/uploads/2024/11/23120-1.jpg',54,0x01),
(23792,23760,'LARA Chilis?s ','90ml x 24st',9,'https://grfood.se/wp-content/uploads/2024/11/23760.jpg',44,0x01),
(23793,23761,'LARA Chilis?s ','260ml x 12st',16,'https://grfood.se/wp-content/uploads/2024/11/23761.jpg',44,0x01),
(23794,23762,'LARA Chilis?s ','800ml x 12st',21,'https://grfood.se/wp-content/uploads/2024/11/23762.jpg',44,0x01),
(23795,23659,'MAYASAN Flytande j?st ','58g x 12 st',12,'https://grfood.se/wp-content/uploads/2024/11/23659.jpg',55,0x01),
(23796,22433,'MAHMOOD Cappuccino kakaogranulat','(20x25g) x12st',41,'https://grfood.se/wp-content/uploads/2024/11/22433.jpg',8,0x01),
(23797,20264,'201 Raha Araysseh Extra ','5kg',90,'https://grfood.se/wp-content/uploads/2024/11/20264.jpg',6,0x01),
(23798,20265,'227 Raha ARAISI Extra Rosa ','5kg',90,'https://grfood.se/wp-content/uploads/2024/11/20265.jpg',6,0x01),
(23799,20237,'221 Nougat Aprikos Rektangel Extra ','5 kg',90,'https://grfood.se/wp-content/uploads/2024/11/20237.jpg',6,0x01),
(23800,23900,'FRIZBI Lychee blanddryck ','250 ml x 24 st',8,'https://grfood.se/wp-content/uploads/2024/11/23900.png',56,0x01),
(23801,23901,'FRIZBI B?r blanddryck ','250 ml x 24 st',8,'https://grfood.se/wp-content/uploads/2024/11/23901.png',56,0x01),
(23802,23902,'FRIZBI Passions frukt dryck ','250 ml x 24 st',8,'https://grfood.se/wp-content/uploads/2024/11/23902.png',56,0x01),
(23803,23903,'FRIZBI Mango dryck ','250 ml x 24 st',8,'https://grfood.se/wp-content/uploads/2024/11/23903.png',56,0x01),
(23804,23904,'FRIZBI ?pple & Druva dryck ','250 ml x 24 st',8,'https://grfood.se/wp-content/uploads/2024/11/23904.png',56,0x01),
(23805,23905,'FRIZBI Citron & Mynta dryck ','250 ml x 24 st',8,'https://grfood.se/wp-content/uploads/2024/11/23905.png',56,0x01),
(23806,23906,'FRIZBI Ananas & Kokos dryck ','250 ml x 24 st',8,'https://grfood.se/wp-content/uploads/2024/11/23906.png',56,0x01),
(23807,23907,'FRIZBI Granat?pple dryck ','250 ml x 24 st',8,'https://grfood.se/wp-content/uploads/2024/11/23907.png',56,0x01),
(23808,23024,'LARA Vindruvsblad ','400g x 12 st',28,'https://grfood.se/wp-content/uploads/2024/12/23024.jpg',54,0x01),
(23809,20886,'DERBY 108 Chips P?se','108',2,'https://grfood.se/wp-content/uploads/2024/12/20886.jpg',57,0x01),
(23810,52211,'FILISTINA Medjoul Dadlar Jumbo Gold ','908g x 12st',90,'https://grfood.se/wp-content/uploads/2025/01/52211.png',52,0x01),
(23811,52215,'FILISTINA Medjoul Dadlar Medium R?d ','908g x 12st',77,'https://grfood.se/wp-content/uploads/2025/01/52215.png',52,0x01),
(23812,33026,'LARA Hel fikon marmelad ','775 g x 12 st',48,'https://grfood.se/wp-content/uploads/2025/01/33026.jpg',7,0x01),
(23813,13014,'MAHMOOD kaffe 3 in 1 p?sar ','(24x18g) x 15 st',28,'https://grfood.se/wp-content/uploads/2025/01/13014.jpg',8,0x01),
(23814,12012,'MAHMOOD Ceylon Black Tea Burk ','450g x 10 st',49,'https://grfood.se/wp-content/uploads/2025/01/12012.jpg',51,0x01),
(23815,12015,'MAHMOOD Tea Cardamom Burk ','450g x 10 st',49,'https://grfood.se/wp-content/uploads/2025/01/12015.jpg',51,0x01),
(23816,37514,'LARA Torkad Malva ','200g x 12st ',20,'https://grfood.se/wp-content/uploads/2025/01/37514.jpg',36,0x01),
(23817,34018,'LARA S?t majs ','400g x 24st',10,'https://grfood.se/wp-content/uploads/2025/01/34018.jpg',58,0x01),
(23818,34017,'LARA Vita b?nor ','400g x 24st',7,'https://grfood.se/wp-content/uploads/2025/01/34017.jpg',59,0x01),
(23819,34224,'LARA Hela Tryfflar ','800g x 12st',115,'https://grfood.se/wp-content/uploads/2025/01/34224.jpg',60,0x01),
(23820,61209,'Blu Ris ','4 x 4,5kg',90,'https://grfood.se/wp-content/uploads/2025/01/61209.webp',61,0x01),
(23821,38012,'LARA Moussaka med Olja ','400g x 12 st',23,'https://grfood.se/wp-content/uploads/2025/02/38012.jpg',20,0x01),
(23822,52811,'AL SAMIR Melonfr?n Extra ','300g x 70 st',16,'https://grfood.se/wp-content/uploads/2025/02/52811.jpg',62,0x01),
(23823,52813,'AL SAMIR Vita Pumpafr?n ','300g x 50 st',23,'https://grfood.se/wp-content/uploads/2025/02/52813.jpg',62,0x01),
(23824,52810,'AL SAMIR Cantaloupefr?n ','300g x 50 st',23,'https://grfood.se/wp-content/uploads/2025/02/52810.jpg',62,0x01),
(23825,52812,'AL SAMIR Mixade N?tter Extra ','300g x 50 st',25,'https://grfood.se/wp-content/uploads/2025/02/52812.jpg',62,0x01),
(23826,53045,'DUTCH MEADOWS Ren Sm?r Ghee ','800g x 12 st',109,'https://grfood.se/wp-content/uploads/2025/02/dutch-meadows-ghee-butter.png',63,0x01),
(23827,31218,'LARA Inlagd vildgurka Liten F?RSK ','400g x 12 st',23,'https://grfood.se/wp-content/uploads/2025/02/31218.jpg',17,0x01),
(23828,34217,'LARA Makdous (Fyllda Auberginer) Liten ','400g x 12st',33,'https://grfood.se/wp-content/uploads/2025/02/34217.jpg',20,0x01);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2025-05-20  8:21:55
