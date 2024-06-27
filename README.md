# Out of Office Management System

# Project description

This project is a leave management system for company employees. It allows HR managers, project managers, and employees to manage leaves, projects, and approval requests.

# Features

- CRUD operations for employees, projects, leave requests, and approval requests.
- Role-based access control for different roles (HR Manager, Project Manager, Employee).

# Technologies

- Node.js
- Express.js
- MySQL
- Postman for testing API

# SQL Queries to Create Database

```sql
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
    Employee INT NOT NULL,
    AbsenceReason VARCHAR(255) NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    Comment TEXT,
    Status ENUM('New', 'Submitted', 'Approved', 'Rejected', 'Cancelled') NOT NULL DEFAULT 'New',
    FOREIGN KEY (Employee) REFERENCES Employees(ID)
);

CREATE TABLE IF NOT EXISTS ApprovalRequests (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Approver INT NOT NULL,
    LeaveRequest INT NOT NULL,
    Status ENUM('New', 'Approved', 'Rejected') NOT NULL DEFAULT 'New',
    Comment TEXT,
    FOREIGN KEY (Approver) REFERENCES Employees(ID),
    FOREIGN KEY (LeaveRequest) REFERENCES LeaveRequests(ID)
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
```
