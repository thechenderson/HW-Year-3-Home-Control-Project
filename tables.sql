
CREATE TABLE runningDevices(
  `rDeviceID` int(11) NOT NULL,
  `rDeviceDisplayName` varchar(20) NOT NULL,
  `rDevicePower` int(11) NOT NULL DEFAULT 0,
  `rDeviceType` int(11) NOT NULL DEFAULT 0,
  `roomID`varchar(20) NOT NULL,
  PRIMARY KEY (rDeviceID),
  FOREIGN KEY (roomID) REFERENCES rooms(roomID),
  FOREIGN KEY (rDeviceID) REFERENCES devices(deviceID)
) ENGINE=INNODB;

CREATE TABLE `changes` (
  `deviceID` varchar(20) NOT NULL,
  `deviceDisplayName` varchar(20) NOT NULL,
  `onOff` int(11) NOT NULL,
  PRIMARY KEY (deviceID),
  FOREIGN KEY (deviceID) REFERENCES devices(deviceID)
) ENGINE=INNODB;

CREATE TABLE `averages` (
  `date` varchar(20) NOT NULL,
  `averagePower` int(20) NOT NULL,
  PRIMARY KEY (date)
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