 --Device Table
CREATE TABLE `devices` (
  `deviceID` int(11) NOT NULL,
  `deviceDisplayName` varchar(20) NOT NULL,
  `deviceType` int(11) NOT NULL,
  `roomAssigned` int(3) NOT NULL,
  PRIMARY KEY (deviceID)
) ENGINE=INNODB;

--Room Table
CREATE TABLE `rooms` (
  `roomID` int(3) NOT NULL,
  `roomDisplayName` varchar(20) NOT NULL,
  `assignedUsers` varchar(20) NOT NULL,
  `assignedDevices` int(3) NOT NULL,
  PRIMARY KEY (roomID)
) ENGINE=INNODB;

--User Table
CREATE TABLE `users` (
  `username` varchar(20) NOT NULL,
  `password` varchar(20) NOT NULL,
  `isAdmin` tinyint(1) NOT NULL,
  `displayName` varchar(30) DEFAULT NULL,
  `assignedRooms` int(3) NOT NULL,
  PRIMARY KEY (username)
) ENGINE=INNODB;

------- Foreign Keys
--Device table FK
ALTER TABLE devices
ADD FOREIGN KEY (roomAssigned) REFERENCES rooms(roomID);

--Room table FK
ALTER TABLE rooms
ADD FOREIGN KEY (assignedDevices) REFERENCES devices(deviceID),
ADD FOREIGN KEY (assignedUsers) REFERENCES users(username);

--User table FK
ALTER TABLE users
ADD FOREIGN KEY (assignedRooms) REFERENCES rooms(roomID);
