CREATE TABLE `homes` (
  `homeID` varchar(20) NOT NULL,
  `homeName` varchar(20) NOT NULL,
  `homeCreator` varchar(20) NOT NUll,
  PRIMARY KEY (homeID)
) ENGINE=INNODB;


CREATE TABLE `users` (
  `username` varchar(20) NOT NULL,
  `password` varchar(20) NOT NULL,
  `isAdmin` tinyint(1) NOT NULL,
  `displayName` varchar(30) DEFAULT NULL,
  `homeID` varchar(20),
  PRIMARY KEY (username),
  FOREIGN KEY (homeID) REFERENCES homes(homeID)
) ENGINE=INNODB;


CREATE TABLE `rooms` (
  `roomID` varchar(20) NOT NULL,
  `roomDisplayName` varchar(20) NOT NULL,
  `roomType` varchar(20) NOT NULL DEFAULT 0,
  `temperature` int(2) NOT NULL,
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

CREATE TABLE `changes` (
  `deviceID` int(11) NOT NULL,
  `deviceDisplayName` varchar(20) NOT NULL,
  `onOff` varchar(3) NOT NULL,
  PRIMARY KEY (deviceID),
  FOREIGN KEY (deviceID) REFERENCES devices(deviceID)
) ENGINE=INNODB;

CREATE TABLE `runningDevices`(
  `rID` int(11)  NOT NULL AUTO_INCREMENT,
  `rDeviceDisplayName` varchar(20) NOT NULL,
  `rDevicePower` int(11) NOT NULL DEFAULT 0,
  `rDeviceType` int(11) NOT NULL DEFAULT 0,
  `deviceID` int(11) NOT NULL, 
  `roomID`varchar(20) NOT NULL,
  PRIMARY KEY (rID),
  FOREIGN KEY (roomID) REFERENCES rooms(roomID),
  FOREIGN KEY (deviceID) REFERENCES devices(deviceID)
) ENGINE=INNODB;

CREATE TABLE `faults` (
 `faultID` int(11) NOT NULL,
 `deviceID` int(11) NOT NULL,
 `deviceDisplayName` varchar(20) NOT NULL,
 `roomDisplayName` varchar(20) NOT NULL,
 `faultInfo` varchar(40),
 PRIMARY KEY (faultID),
 FOREIGN KEY (deviceID) REFERENCES devices(deviceID)
) ENGINE=INNODB;

CREATE TABLE `averagesForH` (
  `homeID` varchar(20) NOT NULL,
  `date` varchar(20) NOT NULL,
  `averOverallPower` int(20) NOT NULL,
  `powerLimit` int(20) DEFAULT 8000,
  PRIMARY KEY (homeID),
  FOREIGN KEY (homeID) REFERENCES homes(homeID)
) ENGINE=INNODB;

CREATE TABLE `averagesForR` (
  `roomID` varchar(20) NOT NULL,
  `date` varchar(20) NOT NULL,
  `averRoomPower` int(20) NOT NULL,
  PRIMARY KEY (roomID),
  FOREIGN KEY (roomID) REFERENCES rooms(roomID)
) ENGINE=INNODB;
