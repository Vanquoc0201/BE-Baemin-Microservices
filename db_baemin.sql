CREATE TABLE `Users` (
	`userId` INT PRIMARY KEY NOT NULL AUTO_INCREMENT, -- mặc định luôn luôn có
	`userName` VARCHAR (100),
	`email` VARCHAR(100) UNIQUE NOT NULL,
	`password` VARCHAR(100),
	`address` VARCHAR(100),
	`phone` VARCHAR(100),
	
	-- mặc định luôn luôn có
	`deletedBy` INT NOT NULL DEFAULT 0,
	`isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
	`deletedAt` TIMESTAMP  NULL DEFAULT NULL,
	`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
CREATE TABLE `Categories` (
	`categoryId` INT PRIMARY KEY NOT NULL AUTO_INCREMENT, -- mặc định luôn luôn có
	`categoryName` VARCHAR (100),
	-- mặc định luôn luôn có
	`deletedBy` INT NOT NULL DEFAULT 0,
	`isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
	`deletedAt` TIMESTAMP  NULL DEFAULT NULL,
	`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
CREATE TABLE `Foods` (
	`foodId` INT PRIMARY KEY NOT NULL AUTO_INCREMENT, -- mặc định luôn luôn có
	`foodName` VARCHAR (100),
	`foodPrice` FLOAT,
	`foodDescription` VARCHAR(255),
	`foodImage` VARCHAR(100),
	`foodStock` INT,
	`categoryId` INT,
	FOREIGN KEY (`categoryId`) REFERENCES `Categories`(`categoryId`),
	
	-- mặc định luôn luôn có
	`deletedBy` INT NOT NULL DEFAULT 0,
	`isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
	`deletedAt` TIMESTAMP  NULL DEFAULT NULL,
	`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
CREATE TABLE `Orders` (
	`orderId` INT PRIMARY KEY NOT NULL AUTO_INCREMENT, -- mặc định luôn luôn có
	`userId` INT NOT NULL,
	`totalPrice` FLOAT NOT NULL DEFAULT 0,
	`status` ENUM('pending', 'paid', 'shipping', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
	FOREIGN KEY (`userId`) REFERENCES `Users`(`userId`),
	
	-- mặc định luôn luôn có
	`deletedBy` INT NOT NULL DEFAULT 0,
	`isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
	`deletedAt` TIMESTAMP  NULL DEFAULT NULL,
	`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
CREATE TABLE `OrderItems` (
	`orderItemId` INT PRIMARY KEY NOT NULL AUTO_INCREMENT, -- mặc định luôn luôn có
	`orderId` INT NOT NULL,
	`foodId` INT NOT NULL ,
	`quantity` INT,
	`unitPrice` FLOAT,
	FOREIGN KEY (`orderId`) REFERENCES `Orders`(`orderId`),
	FOREIGN KEY (`foodId`) REFERENCES `Foods`(`foodId`),
	-- mặc định luôn luôn có
	`deletedBy` INT NOT NULL DEFAULT 0,
	`isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
	`deletedAt` TIMESTAMP  NULL DEFAULT NULL,
	`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
CREATE TABLE `Deliveries` (
	`deliveryId` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
	`orderId` INT NOT NULL,
	`address` VARCHAR(200),
	`status` ENUM('pending', 'shipping', 'delivered', 'failed', 'cancelled') NOT NULL DEFAULT 'pending',
	`shipperName` VARCHAR(100),
	`shipTime` TIMESTAMP NULL DEFAULT NULL,
	FOREIGN KEY (`orderId`) REFERENCES `Orders`(`orderId`) ON DELETE CASCADE ON UPDATE CASCADE,
	`deletedBy` INT NOT NULL DEFAULT 0,
	`isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
	`deletedAt` TIMESTAMP NULL DEFAULT NULL,
	`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


