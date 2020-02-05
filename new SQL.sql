CREATE TABLE `rooms` (
  `roomID` int(3) NOT NULL AUTO_INCREMENT,
  `roomDisplayName` varchar(20) NOT NULL,
  `roomType` varchar(20) NOT NULL,
  PRIMARY KEY (roomID)
) ENGINE=INNODB;



CREATE TABLE `devices` (
  `deviceID` int(11) NOT NULL AUTO_INCREMENT,
  `deviceDisplayName` varchar(20) NOT NULL,
  `devicePower` int(11) NOT NULL,
  `deviceType` int(11) NOT NULL,
  `roomID` int(3) NOT NULL,
  PRIMARY KEY (deviceID),
  FOREIGN KEY (roomID) REFERENCES rooms(roomID)
) ENGINE=INNODB;




CREATE TABLE `users` (
  `username` varchar(20) NOT NULL,
  `password` varchar(20) NOT NULL,
  `isAdmin` tinyint(1) NOT NULL,
  `displayName` varchar(30) DEFAULT NULL,
  PRIMARY KEY (username)
) ENGINE=INNODB;


CREATE TABLE `homes` (
  `username` varchar(20),
  `roomID` int(3),
  PRIMARY KEY (username, roomID),
  FOREIGN KEY (username) REFERENCES users(username),
  FOREIGN KEY (roomID) REFERENCES rooms(roomID)
) ENGINE=INNODB;




