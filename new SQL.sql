CREATE TABLE `rooms` (
  `roomID` varchar(20),
  `roomDisplayName` varchar(20) NOT NULL DEFAULT roomID,
  `roomType` varchar(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (roomID)
) ENGINE=INNODB;



CREATE TABLE `devices` (
  `deviceID` varchar(20) NOT NULL,
  `deviceDisplayName` varchar(20) NOT NULL DEFAULT deviceID,
  `devicePower` int(11) NOT NULL DEFAULT 0,
  `deviceType` int(11) NOT NULL DEFAULT 0,
  `roomID`varchar(20) NOT NULL,
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
  `roomID` varchar(20),
  PRIMARY KEY (username, roomID),
  FOREIGN KEY (username) REFERENCES users(username),
  FOREIGN KEY (roomID) REFERENCES rooms(roomID)
) ENGINE=INNODB;


