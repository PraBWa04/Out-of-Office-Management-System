CREATE DATABASE IF NOT EXISTS OutOfOfficeDB;
USE OutOfOfficeDB;

DROP TABLE IF EXISTS ApprovalRequests;
DROP TABLE IF EXISTS LeaveRequests;
DROP TABLE IF EXISTS Projects;
DROP TABLE IF EXISTS Employees;

CREATE TABLE Employees (
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

CREATE TABLE LeaveRequests (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    EmployeeID INT NOT NULL,
    AbsenceReason VARCHAR(255) NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    Comment TEXT,
    Status ENUM('New', 'Submitted', 'Approved', 'Rejected', 'Cancelled') NOT NULL DEFAULT 'New',
    FOREIGN KEY (EmployeeID) REFERENCES Employees(ID)
);

CREATE TABLE ApprovalRequests (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    ApproverID INT NOT NULL DEFAULT 1,
    LeaveRequestID INT NOT NULL,
    ApprovalStatus ENUM('New', 'Approved', 'Rejected') NOT NULL DEFAULT 'New',
    Comment TEXT,
    FOREIGN KEY (ApproverID) REFERENCES Employees(ID),
    FOREIGN KEY (LeaveRequestID) REFERENCES LeaveRequests(ID)
);

CREATE TABLE Projects (
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

INSERT INTO LeaveRequests (EmployeeID, AbsenceReason, StartDate, EndDate, Comment, Status)
VALUES (1, 'Vacation', '2024-07-01', '2024-07-10', 'Family vacation', 'Submitted');

INSERT INTO ApprovalRequests (ApproverID, LeaveRequestID, ApprovalStatus, Comment)
VALUES (1, 1, 'New', 'Pending approval');

INSERT INTO Projects (ProjectType, StartDate, EndDate, ProjectManager, Comment, Status)
VALUES ('Development', '2024-06-01', '2024-12-31', 1, 'Development of new feature', 'Active'),
       ('HR Training', '2024-05-01', '2024-10-31', 1, 'HR training program', 'Active');
