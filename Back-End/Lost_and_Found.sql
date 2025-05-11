CREATE DATABASE sem_project;
USE sem_project;

CREATE TABLE User (
    User_ID INT PRIMARY KEY AUTO_INCREMENT,
    First_Name VARCHAR(50) NOT NULL,
    Last_Name VARCHAR(50) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Phone VARCHAR(20),
    Department VARCHAR(50),
    Password VARCHAR(100) NOT NULL,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Location (
    Location_ID INT PRIMARY KEY AUTO_INCREMENT,
    Building_Name VARCHAR(100),
    Room_Number VARCHAR(20),
    Campus_Area VARCHAR(50),
    Description TEXT,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Category (
    Category_ID INT PRIMARY KEY AUTO_INCREMENT,
    Category_Name VARCHAR(50) UNIQUE NOT NULL,
    Description TEXT,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Lost_Item (
    Lost_Item_ID INT PRIMARY KEY AUTO_INCREMENT,
    Reported_By INT,
    Category_ID INT,
    Location_ID INT,
    Item_Name VARCHAR(100) NOT NULL,
    Description TEXT,
    Lost_Date DATE,
    Lost_Time TIME,
    Color VARCHAR(30),
    Features TEXT,
    Photo_Path VARCHAR(255),
    Status ENUM('Open', 'Claimed', 'Resolved'),
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (Reported_By) REFERENCES User(User_ID),
    FOREIGN KEY (Category_ID) REFERENCES Category(Category_ID),
    FOREIGN KEY (Location_ID) REFERENCES Location(Location_ID)
);

CREATE TABLE Found_Item (
    Found_Item_ID INT PRIMARY KEY AUTO_INCREMENT,
    Reported_By INT,
    Category_ID INT,
    Location_ID INT,
    Item_Name VARCHAR(100) NOT NULL,
    Description TEXT,
    Found_Date DATE,
    Found_Time TIME,
    Color VARCHAR(30),
    Features TEXT,
    Photo_Path VARCHAR(255),
    Status ENUM('Unclaimed', 'Claimed'),
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (Reported_By) REFERENCES User(User_ID),
    FOREIGN KEY (Category_ID) REFERENCES Category(Category_ID),
    FOREIGN KEY (Location_ID) REFERENCES Location(Location_ID)
);

CREATE TABLE Claim (
    Claim_ID INT PRIMARY KEY AUTO_INCREMENT,
    Lost_Item_ID INT,
    Found_Item_ID INT,
    Claimant_ID INT,
    Claim_Date DATE,
    Verification_Details TEXT,
    Status ENUM('Pending', 'Approved', 'Rejected'),
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Lost_Item_ID) REFERENCES Lost_Item(Lost_Item_ID),
    FOREIGN KEY (Found_Item_ID) REFERENCES Found_Item(Found_Item_ID),
    FOREIGN KEY (Claimant_ID) REFERENCES User(User_ID)
);


CREATE TABLE Attachment (
    Attachment_ID INT PRIMARY KEY AUTO_INCREMENT,
    Lost_Item_ID INT,
    Found_Item_ID INT,
    File_Path VARCHAR(255) NOT NULL,
    Upload_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (
        (Lost_Item_ID IS NOT NULL AND Found_Item_ID IS NULL)
        OR
        (Lost_Item_ID IS NULL AND Found_Item_ID IS NOT NULL)
    ),
    FOREIGN KEY (Lost_Item_ID) REFERENCES Lost_Item(Lost_Item_ID),
    FOREIGN KEY (Found_Item_ID) REFERENCES Found_Item(Found_Item_ID)
);

CREATE TABLE Admin (
    Admin_ID INT PRIMARY KEY AUTO_INCREMENT,
    User_ID INT,
    Permissions TEXT,
    FOREIGN KEY (User_ID) REFERENCES User(User_ID)
);

-- Optional performance-boosting indexes:
CREATE INDEX idx_user_email ON User(Email);
CREATE INDEX idx_lostitem_status ON Lost_Item(Status);
CREATE INDEX idx_founditem_status ON Found_Item(Status);

-- Inserting sample users into the User table
INSERT INTO User (First_Name, Last_Name, Email, Phone, User_Type, Department, Password)
VALUES
('John', 'Doe', 'john.doe@example.com', '1234567890', 'Student', 'Computer Science', 'password123'),
('Jane', 'Smith', 'jane.smith@example.com', '2345678901', 'Faculty', 'Mathematics', 'password123'),
('Michael', 'Brown', 'michael.brown@example.com', '3456789012', 'Staff', 'Administration', 'password123'),
('Sarah', 'Williams', 'sarah.williams@example.com', '4567890123', 'Student', 'Biology', 'password123');

-- Inserting sample categories into the Category table
INSERT INTO Category (Category_Name, Description)
VALUES
('Electronics', 'Items related to electronics, such as phones, laptops, etc.'),
('Clothing', 'Items of clothing, including jackets, t-shirts, pants, etc.'),
('Accessories', 'Items like bags, hats, watches, etc.'),
('Documents', 'Any papers, notebooks, IDs, etc.'),
('Keys', 'Keys of various kinds, including car keys, room keys, etc.');

-- Inserting sample locations into the Location table
INSERT INTO Location (Building_Name, Room_Number, Campus_Area, Description)
VALUES
('Library', 'Room 101', 'Main Campus', 'A quiet space for reading and studying.'),
('Cafeteria', 'Room 205', 'Main Campus', 'Serving food and beverages to students and staff.'),
('Science Building', 'Room 303', 'Science Campus', 'Home to the science faculty and laboratories.'),
('Engineering Building', 'Room 405', 'Engineering Campus', 'Houses the engineering faculty and classrooms.'),
('Arts Building', 'Room 507', 'Arts Campus', 'Home to the arts faculty, including music and theater.'),
('Sports Complex', 'Field 1', 'Sports Campus', 'Area for sports activities and gymnasium.');


select * from user;
select * from Lost_Item;
desc lost_item;
desc location;
select * from found_item;
ALTER TABLE User MODIFY User_Type ENUM('Student', 'Admin') NOT NULL;
ALTER TABLE Lost_Item MODIFY Status ENUM('Open', 'Pending', 'Claimed', 'Returned', 'Closed') NOT NULL DEFAULT 'Open';
ALTER TABLE Found_Item MODIFY Status ENUM('Unclaimed', 'Pending', 'Claimed', 'Returned', 'Closed') NOT NULL DEFAULT 'Unclaimed';
INSERT INTO User (First_Name, Last_Name, Email, Phone, User_Type, Department, Password)
VALUES ('Admin', 'User', 'admin@example.com', '1234567890', 'Admin', 'IT', 'admin123');

ALTER TABLE user 
MODIFY COLUMN User_Type ENUM('Student', 'Admin') NOT NULL;	
desc user;
select * from claim;

ALTER TABLE Claim
ADD COLUMN Proof_Photo_Path VARCHAR(255),
ADD COLUMN Admin_Notes TEXT,
MODIFY COLUMN Status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending';


UPDATE Lost_Item SET Photo_Path = REPLACE(Photo_Path, '\\', '/');
UPDATE Found_Item SET Photo_Path = REPLACE(Photo_Path, '\\', '/');


ALTER TABLE Feedback RENAME COLUMN Date TO Old_Date;
ALTER TABLE Feedback ADD COLUMN Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE Feedback MODIFY COLUMN Message TEXT NOT NULL;
ALTER TABLE Feedback MODIFY COLUMN Feedback_Type VARCHAR(50);
ALTER TABLE Feedback ADD COLUMN Status ENUM('New', 'Reviewed') DEFAULT 'New';

desc Feedback;

CREATE TABLE Feedback (
    Feedback_ID INT PRIMARY KEY AUTO_INCREMENT,
    User_ID INT,
    Message TEXT NOT NULL,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Rating INT CHECK (Rating >= 1 AND Rating <= 5),
    Feedback_Type VARCHAR(50),
    Status ENUM('New', 'Reviewed') DEFAULT 'New',
    FOREIGN KEY (User_ID) REFERENCES User(User_ID)
);

select * from Feedback;

select * from user;
select * from lost_item;
select * from found_item;

