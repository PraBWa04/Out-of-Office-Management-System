CREATE DATABASE IF NOT EXISTS OutOfOfficeDB;

USE OutOfOfficeDB;

CREATE TABLE IF NOT EXISTS Employees (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    FullName VARCHAR(255) NOT NULL,
    Subdivision VARCHAR(255) NOT NULL,
    Position VARCHAR(255) NOT NULL,
    Status ENUM('Active', 'Inactive') NOT NULL,
    PeoplePartner INT,
    OutOfOfficeBalance INT NOT NULL,
    Photo VARCHAR(255),
    FOREIGN KEY (PeoplePartner) REFERENCES Employees(ID)
);

CREATE TABLE IF NOT EXISTS LeaveRequests (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    EmployeeID INT NOT NULL,
    AbsenceReason VARCHAR(255) NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    Comment TEXT,
    Status ENUM('New', 'Submitted', 'Approved', 'Rejected', 'Cancelled') NOT NULL DEFAULT 'New',
    FOREIGN KEY (EmployeeID) REFERENCES Employees(ID)
);

CREATE TABLE IF NOT EXISTS ApprovalRequests (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    ApproverID INT NOT NULL,
    LeaveRequestID INT NOT NULL,
    Status ENUM('New', 'Approved', 'Rejected') NOT NULL DEFAULT 'New',
    Comment TEXT,
    FOREIGN KEY (ApproverID) REFERENCES Employees(ID),
    FOREIGN KEY (LeaveRequestID) REFERENCES LeaveRequests(ID)
);

CREATE TABLE IF NOT EXISTS Projects (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    ProjectType VARCHAR(255) NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE,
    ProjectManager INT NOT NULL,
    Comment TEXT,
    Status ENUM('Active', 'Inactive') NOT NULL,
    FOREIGN KEY (ProjectManager) REFERENCES Employees(ID)
);

INSERT INTO Employees (FullName, Subdivision, Position, Status, PeoplePartner, OutOfOfficeBalance, Photo)
VALUES ('John Doe', 'IT', 'Developer', 'Active', NULL, 10, 'http://example.com/photo.jpg');
