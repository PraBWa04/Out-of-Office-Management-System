-- Drop the existing database if it exists
DROP DATABASE IF EXISTS OutOfOfficeDB;

-- Create the database
CREATE DATABASE OutOfOfficeDB;

-- Use the created database
USE OutOfOfficeDB;

-- Create the Employees table
CREATE TABLE Employees (
  ID INT AUTO_INCREMENT PRIMARY KEY,
  FullName VARCHAR(100) NOT NULL,
  Subdivision VARCHAR(50) NOT NULL,
  Position VARCHAR(50) NOT NULL,
  Status VARCHAR(10) NOT NULL DEFAULT 'Active',
  PeoplePartner INT DEFAULT NULL,
  OutOfOfficeBalance INT NOT NULL DEFAULT 0,
  Photo VARCHAR(255) DEFAULT NULL,
  FOREIGN KEY (PeoplePartner) REFERENCES Employees(ID)
);

-- Create the Projects table
CREATE TABLE Projects (
  ID INT AUTO_INCREMENT PRIMARY KEY,
  ProjectType VARCHAR(255) NOT NULL,
  StartDate DATE NOT NULL,
  EndDate DATE DEFAULT NULL,
  ProjectManager INT DEFAULT NULL,
  Comment TEXT DEFAULT NULL,
  Status VARCHAR(50) NOT NULL DEFAULT 'Active',
  FOREIGN KEY (ProjectManager) REFERENCES Employees(ID)
);

-- Create the LeaveRequests table
CREATE TABLE LeaveRequests (
  ID INT AUTO_INCREMENT PRIMARY KEY,
  EmployeeID INT NOT NULL,
  AbsenceReason VARCHAR(255) NOT NULL,
  StartDate DATE NOT NULL,
  EndDate DATE NOT NULL,
  Comment VARCHAR(255) DEFAULT NULL,
  Status VARCHAR(10) NOT NULL DEFAULT 'Pending',
  FOREIGN KEY (EmployeeID) REFERENCES Employees(ID)
);

-- Create the ApprovalRequests table
CREATE TABLE ApprovalRequests (
  ID INT AUTO_INCREMENT PRIMARY KEY,
  ApproverID INT NOT NULL DEFAULT 1,
  LeaveRequestID INT NOT NULL,
  ApprovalStatus VARCHAR(10) NOT NULL DEFAULT 'Pending',
  Comment VARCHAR(255) DEFAULT NULL,
  FOREIGN KEY (ApproverID) REFERENCES Employees(ID),
  FOREIGN KEY (LeaveRequestID) REFERENCES LeaveRequests(ID)
);

-- Describe the tables to verify structure
DESCRIBE Employees;
DESCRIBE Projects;
DESCRIBE LeaveRequests;
DESCRIBE ApprovalRequests;

-- Insert test data into the Employees table
INSERT INTO Employees (FullName, Subdivision, Position, Status, PeoplePartner, OutOfOfficeBalance, Photo) VALUES 
('John Doe', 'IT', 'Developer', 'Active', NULL, 10, NULL),
('Jane Smith', 'HR', 'HR Manager', 'Active', NULL, 15, NULL),
('Alice Brown', 'IT', 'Project Manager', 'Active', NULL, 5, NULL);  -- Additional manager for testing

-- Insert test data into the LeaveRequests table
INSERT INTO LeaveRequests (EmployeeID, AbsenceReason, StartDate, EndDate, Comment, Status) VALUES
(1, 'Vacation', '2024-07-01', '2024-07-10', 'Family vacation', 'Pending'),
(2, 'Sick Leave', '2024-08-01', '2024-08-05', 'Flu', 'Pending');  -- Additional leave request for testing

-- Insert test data into the Projects table
INSERT INTO Projects (ProjectType, StartDate, EndDate, ProjectManager, Comment, Status) VALUES
('Development', '2024-06-01', '2024-12-31', 1, 'Development of new feature', 'Active'),
('HR System Upgrade', '2024-07-01', '2024-12-01', 3, 'Upgrade of the HR management system', 'Active');  -- Additional project for testing

-- Insert test data into the ApprovalRequests table
INSERT INTO ApprovalRequests (ApproverID, LeaveRequestID, ApprovalStatus, Comment) VALUES
(2, 1, 'New', 'Leave approved'),
(3, 2, 'Pending', 'Under review'),  -- Additional approval request for testing
(1, 1, 'Approved', 'Approved by IT Manager'),  -- More test data
(2, 2, 'Rejected', 'Not enough balance');  -- More test data

-- Add indexes for performance optimization
CREATE INDEX idx_employee_status ON Employees (Status);
CREATE INDEX idx_project_status ON Projects (Status);
CREATE INDEX idx_leave_request_status ON LeaveRequests (Status);
CREATE INDEX idx_approval_request_status ON ApprovalRequests (ApprovalStatus);

-- Insert a new approval request directly to test
INSERT INTO ApprovalRequests (ApproverID, LeaveRequestID, ApprovalStatus, Comment) VALUES (2, 1, 'Approved', 'Leave approved for medical reasons');
