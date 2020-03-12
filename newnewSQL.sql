CREATE TABLE `homes` (
  `homeID` varchar(20) NOT NULL,
  `homeName` varchar(20) NOT NULL,
  PRIMARY KEY (homeID)
) ENGINE=INNODB;


CREATE TABLE `users` (
  `username` varchar(20) NOT NULL,
  `password` varchar(20) NOT NULL,
  `isAdmin` tinyint(1) NOT NULL,
  `displayName` varchar(30) DEFAULT NULL,
  `homeID` varchar(20) NOT NULL,
  PRIMARY KEY (username),
  FOREIGN KEY (homeID) REFERENCES homes(homeID)
) ENGINE=INNODB;


CREATE TABLE `rooms` (
  `roomID` varchar(20) NOT NULL,
  `roomDisplayName` varchar(20) NOT NULL,
  `roomType` varchar(20) NOT NULL DEFAULT 0,
  `homeID` varchar(20) NOT NULL,
  PRIMARY KEY (roomID),
  FOREIGN KEY (homeID) REFERENCES homes(homeID)
) ENGINE=INNODB;


CREATE TABLE `devices` (
  `deviceID` int(11) NOT NULL AUTO_INCREMENT,
  `deviceDisplayName` varchar(20) NOT NULL,
  `devicePower` int(11) NOT NULL DEFAULT 0,
  `deviceType` VARCHAR(20) NOT NULL DEFAULT 0,
  `roomID`varchar(20) NOT NULL,
  PRIMARY KEY (deviceID),
  FOREIGN KEY (roomID) REFERENCES rooms(roomID)
) ENGINE=INNODB;
