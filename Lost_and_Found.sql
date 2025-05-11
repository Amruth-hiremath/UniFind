create database sem_project;
use sem_project;

CREATE TABLE User (
    User_ID INT PRIMARY KEY AUTO_INCREMENT,
    First_Name VARCHAR(50) NOT NULL,
    Last_Name VARCHAR(50) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Phone VARCHAR(20),
    User_Type ENUM('Student', 'Faculty', 'Staff') NOT NULL,
    Department VARCHAR(50),
    Password VARCHAR(100) NOT NULL
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
    FOREIGN KEY (Lost_Item_ID) REFERENCES Lost_Item(Lost_Item_ID),
    FOREIGN KEY (Found_Item_ID) REFERENCES Found_Item(Found_Item_ID),
    FOREIGN KEY (Claimant_ID) REFERENCES User(User_ID)
);

CREATE TABLE Location (
    Location_ID INT PRIMARY KEY AUTO_INCREMENT,
    Building_Name VARCHAR(100),
    Room_Number VARCHAR(20),
    Campus_Area VARCHAR(50),
    Description TEXT
);

CREATE TABLE Category (
    Category_ID INT PRIMARY KEY AUTO_INCREMENT,
    Category_Name VARCHAR(50) UNIQUE NOT NULL,
    Description TEXT
);

CREATE TABLE Feedback (
    Feedback_ID INT PRIMARY KEY AUTO_INCREMENT,
    User_ID INT,
    Message TEXT,
    Date DATE,
    Rating INT CHECK (Rating >= 1 AND Rating <= 5),
    FOREIGN KEY (User_ID) REFERENCES User(User_ID)
);

CREATE TABLE Attachment (
    Attachment_ID INT PRIMARY KEY AUTO_INCREMENT,
    Lost_Item_ID INT,
    Found_Item_ID INT,
    File_Path VARCHAR(255) NOT NULL,
    Upload_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Lost_Item_ID) REFERENCES Lost_Item(Lost_Item_ID),
    FOREIGN KEY (Found_Item_ID) REFERENCES Found_Item(Found_Item_ID)
);

CREATE TABLE Admin (
    Admin_ID INT PRIMARY KEY AUTO_INCREMENT,
    User_ID INT,
    Permissions TEXT,
    FOREIGN KEY (User_ID) REFERENCES User(User_ID)
);

