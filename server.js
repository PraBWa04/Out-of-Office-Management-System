const express = require("express");
const mysql = require("mysql");
const multer = require("multer");
const path = require("path");
const app = express();
const port = 3001;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// Middleware для перевірки ролі користувача
function checkRole(role) {
  return (req, res, next) => {
    const userRole = req.headers["role"];
    if (userRole !== role) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
}

// Налаштування бази даних
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "SQLity2024$",
  database: "OutOfOfficeDB",
});

db.connect((err) => {
  if (err) {
    console.error("MySQL Connection Error: ", err);
    throw err;
  }
  console.log("MySQL Connected...");
});

app.use(express.json());
app.use(express.static("public"));

// Employees endpoints
app.get("/employees", checkRole("HR Manager"), (req, res) => {
  let sql = "SELECT * FROM Employees";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("MySQL Query Error: ", err);
      res.status(500).send(err);
    } else {
      res.send(results);
    }
  });
});

app.get("/employees/:id", checkRole("HR Manager"), (req, res) => {
  let sql = "SELECT * FROM Employees WHERE ID = ?";
  db.query(sql, [req.params.id], (err, results) => {
    if (err) {
      console.error("MySQL Query Error: ", err);
      res.status(500).send(err);
    } else {
      res.send(results[0]);
    }
  });
});

app.post(
  "/employees",
  checkRole("HR Manager"),
  upload.single("photo"),
  (req, res) => {
    const newEmployee = req.body;
    const photo = req.file ? `/uploads/${req.file.filename}` : null;
    const sql =
      "INSERT INTO Employees (FullName, Subdivision, Position, Status, PeoplePartner, OutOfOfficeBalance, Photo) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const values = [
      newEmployee["full-name"],
      newEmployee.subdivision,
      newEmployee.position,
      newEmployee.status,
      newEmployee["people-partner"],
      newEmployee["out-of-office-balance"],
      photo,
    ];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("MySQL Insert Error: ", err);
        res.status(500).send(err);
      } else {
        res.send({ message: "Employee added", id: result.insertId });
      }
    });
  }
);

app.put(
  "/employees/:id",
  checkRole("HR Manager"),
  upload.single("photo"),
  (req, res) => {
    const updatedEmployee = req.body;
    const photo = req.file
      ? `/uploads/${req.file.filename}`
      : updatedEmployee.photo;
    const sql =
      "UPDATE Employees SET FullName = ?, Subdivision = ?, Position = ?, Status = ?, PeoplePartner = ?, OutOfOfficeBalance = ?, Photo = ? WHERE ID = ?";
    const values = [
      updatedEmployee["full-name"],
      updatedEmployee.subdivision,
      updatedEmployee.position,
      updatedEmployee.status,
      updatedEmployee["people-partner"],
      updatedEmployee["out-of-office-balance"],
      photo,
      req.params.id,
    ];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("MySQL Update Error: ", err);
        res.status(500).send(err);
      } else {
        res.send({ message: "Employee updated" });
      }
    });
  }
);

app.delete("/employees/:id", checkRole("HR Manager"), (req, res) => {
  const sql = "DELETE FROM Employees WHERE ID = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error("MySQL Delete Error: ", err);
      res.status(500).send(err);
    } else {
      res.send({ message: "Employee deleted" });
    }
  });
});

// Projects endpoints
app.get("/projects", checkRole("Project Manager"), (req, res) => {
  let sql = "SELECT * FROM Projects";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("MySQL Query Error: ", err);
      res.status(500).send(err);
    } else {
      res.send(results);
    }
  });
});

app.get("/projects/:id", checkRole("Project Manager"), (req, res) => {
  let sql = "SELECT * FROM Projects WHERE ID = ?";
  db.query(sql, [req.params.id], (err, results) => {
    if (err) {
      console.error("MySQL Query Error: ", err);
      res.status(500).send(err);
    } else {
      res.send(results[0]);
    }
  });
});

app.post("/projects", checkRole("Project Manager"), (req, res) => {
  const newProject = req.body;
  const sql =
    "INSERT INTO Projects (ProjectType, StartDate, EndDate, ProjectManager, Comment, Status) VALUES (?, ?, ?, ?, ?, ?)";
  const values = [
    newProject.projectType,
    newProject.startDate,
    newProject.endDate,
    newProject.projectManager,
    newProject.comment,
    newProject.status,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("MySQL Insert Error: ", err);
      res.status(500).send(err);
    } else {
      res.send({ message: "Project added", id: result.insertId });
    }
  });
});

app.put("/projects/:id", checkRole("Project Manager"), (req, res) => {
  const updatedProject = req.body;
  const sql =
    "UPDATE Projects SET ProjectType = ?, StartDate = ?, EndDate = ?, ProjectManager = ?, Comment = ?, Status = ? WHERE ID = ?";
  const values = [
    updatedProject.projectType,
    updatedProject.startDate,
    updatedProject.endDate,
    updatedProject.projectManager,
    updatedProject.comment,
    updatedProject.status,
    req.params.id,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("MySQL Update Error: ", err);
      res.status(500).send(err);
    } else {
      res.send({ message: "Project updated" });
    }
  });
});

app.delete("/projects/:id", checkRole("Project Manager"), (req, res) => {
  const sql = "DELETE FROM Projects WHERE ID = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error("MySQL Delete Error: ", err);
      res.status(500).send(err);
    } else {
      res.send({ message: "Project deleted" });
    }
  });
});

// LeaveRequests endpoints
app.get("/leave-requests", checkRole("Employee"), (req, res) => {
  let sql = "SELECT * FROM LeaveRequests";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("MySQL Query Error: ", err);
      res.status(500).send(err);
    } else {
      res.send(results);
    }
  });
});

app.get("/leave-requests/:id", checkRole("Employee"), (req, res) => {
  let sql = "SELECT * FROM LeaveRequests WHERE ID = ?";
  db.query(sql, [req.params.id], (err, results) => {
    if (err) {
      console.error("MySQL Query Error: ", err);
      res.status(500).send(err);
    } else {
      res.send(results[0]);
    }
  });
});

app.post("/leave-requests", checkRole("Employee"), (req, res) => {
  const newLeaveRequest = req.body;
  const sql =
    "INSERT INTO LeaveRequests (Employee, AbsenceReason, StartDate, EndDate, Comment, Status) VALUES (?, ?, ?, ?, ?, ?)";
  const values = [
    newLeaveRequest.employee,
    newLeaveRequest.absenceReason,
    newLeaveRequest.startDate,
    newLeaveRequest.endDate,
    newLeaveRequest.comment,
    newLeaveRequest.status,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("MySQL Insert Error: ", err);
      res.status(500).send(err);
    } else {
      res.send({ message: "Leave request added", id: result.insertId });
    }
  });
});

app.put("/leave-requests/:id", checkRole("HR Manager"), (req, res) => {
  const updatedLeaveRequest = req.body;
  const sql =
    "UPDATE LeaveRequests SET Employee = ?, AbsenceReason = ?, StartDate = ?, EndDate = ?, Comment = ?, Status = ? WHERE ID = ?";
  const values = [
    updatedLeaveRequest.employee,
    updatedLeaveRequest.absenceReason,
    updatedLeaveRequest.startDate,
    updatedLeaveRequest.endDate,
    updatedLeaveRequest.comment,
    updatedLeaveRequest.status,
    req.params.id,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("MySQL Update Error: ", err);
      res.status(500).send(err);
    } else {
      res.send({ message: "Leave request updated" });
    }
  });
});

app.delete("/leave-requests/:id", checkRole("Employee"), (req, res) => {
  const sql = "DELETE FROM LeaveRequests WHERE ID = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error("MySQL Delete Error: ", err);
      res.status(500).send(err);
    } else {
      res.send({ message: "Leave request deleted" });
    }
  });
});

// ApprovalRequests endpoints
app.get("/approval-requests", checkRole("HR Manager"), (req, res) => {
  let sql = "SELECT * FROM ApprovalRequests";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("MySQL Query Error: ", err);
      res.status(500).send(err);
    } else {
      res.send(results);
    }
  });
});

app.get("/approval-requests/:id", checkRole("HR Manager"), (req, res) => {
  let sql = "SELECT * FROM ApprovalRequests WHERE ID = ?";
  db.query(sql, [req.params.id], (err, results) => {
    if (err) {
      console.error("MySQL Query Error: ", err);
      res.status(500).send(err);
    } else {
      res.send(results[0]);
    }
  });
});

app.post("/approval-requests", checkRole("HR Manager"), (req, res) => {
  const newApprovalRequest = req.body;
  const sql =
    "INSERT INTO ApprovalRequests (Approver, LeaveRequest, Comment, Status) VALUES (?, ?, ?, ?)";
  const values = [
    newApprovalRequest.approver,
    newApprovalRequest.leaveRequest,
    newApprovalRequest.comment,
    newApprovalRequest.status,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("MySQL Insert Error: ", err);
      res.status(500).send(err);
    } else {
      res.send({ message: "Approval request added", id: result.insertId });
    }
  });
});

app.put("/approval-requests/:id", checkRole("HR Manager"), (req, res) => {
  const updatedApprovalRequest = req.body;
  const sql =
    "UPDATE ApprovalRequests SET Approver = ?, LeaveRequest = ?, Comment = ?, Status = ? WHERE ID = ?";
  const values = [
    updatedApprovalRequest.approver,
    updatedApprovalRequest.leaveRequest,
    updatedApprovalRequest.comment,
    updatedApprovalRequest.status,
    req.params.id,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("MySQL Update Error: ", err);
      res.status(500).send(err);
    } else {
      res.send({ message: "Approval request updated" });
    }
  });
});

app.delete("/approval-requests/:id", checkRole("HR Manager"), (req, res) => {
  const sql = "DELETE FROM ApprovalRequests WHERE ID = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error("MySQL Delete Error: ", err);
      res.status(500).send(err);
    } else {
      res.send({ message: "Approval request deleted" });
    }
  });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
