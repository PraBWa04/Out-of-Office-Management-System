const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3001;

// Ensure the upload directory exists
const uploadDir = path.join(__dirname, "public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:5500"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "role"],
  })
);

app.use(express.json());
app.use(express.static("public"));

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

function checkRole(role) {
  return (req, res, next) => {
    const userRole = req.headers["role"];
    if (userRole !== role) {
      return res.status(403).json({
        message: `Access denied: incorrect role (expected: ${role}, received: ${userRole})`,
      });
    }
    next();
  };
}

let db;
async function connectToDatabase() {
  try {
    db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "SQLity2024$",
      database: "OutOfOfficeDB",
    });
    console.log("MySQL Connected...");
  } catch (err) {
    console.error("MySQL Connection Error: ", err);
    setTimeout(connectToDatabase, 2000); // retry connection after 2 seconds
  }
}

connectToDatabase();

// Employees endpoints
app.get("/employees", checkRole("HR Manager"), async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM Employees");
    res.send(results);
  } catch (err) {
    console.error("MySQL Query Error: ", err);
    res.status(500).send({ message: "Error fetching employees", error: err });
  }
});

app.get("/employees/:id", checkRole("HR Manager"), async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM Employees WHERE ID = ?", [
      req.params.id,
    ]);
    res.send(results[0]);
  } catch (err) {
    console.error("MySQL Query Error: ", err);
    res.status(500).send({ message: "Error fetching employee", error: err });
  }
});

app.post(
  "/employees",
  checkRole("HR Manager"),
  upload.single("photo"),
  async (req, res) => {
    try {
      const newEmployee = req.body;
      const photo = req.file
        ? `/uploads/${req.file.filename}`
        : "/uploads/photo_user.png";
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
      const [result] = await db.query(sql, values);
      res.send({ message: "Employee added", id: result.insertId });
    } catch (err) {
      console.error("MySQL Insert Error: ", err);
      res.status(500).send({ message: "Error adding employee", error: err });
    }
  }
);

app.put(
  "/employees/:id",
  checkRole("HR Manager"),
  upload.single("photo"),
  async (req, res) => {
    try {
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
      await db.query(sql, values);
      res.send({ message: "Employee updated" });
    } catch (err) {
      console.error("MySQL Update Error: ", err);
      res.status(500).send({ message: "Error updating employee", error: err });
    }
  }
);

app.delete("/employees/:id", checkRole("HR Manager"), async (req, res) => {
  try {
    const sql = "DELETE FROM Employees WHERE ID = ?";
    await db.query(sql, [req.params.id]);
    res.send({ message: "Employee deleted" });
  } catch (err) {
    console.error("MySQL Delete Error: ", err);
    res.status(500).send({ message: "Error deleting employee", error: err });
  }
});

// Projects endpoints
app.get("/projects", checkRole("Project Manager"), async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM Projects");
    res.send(results);
  } catch (err) {
    console.error("MySQL Query Error: ", err);
    res.status(500).send({ message: "Error fetching projects", error: err });
  }
});

app.get("/projects/:id", checkRole("Project Manager"), async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM Projects WHERE ID = ?", [
      req.params.id,
    ]);
    res.send(results[0]);
  } catch (err) {
    console.error("MySQL Query Error: ", err);
    res.status(500).send({ message: "Error fetching project", error: err });
  }
});

app.post("/projects", checkRole("Project Manager"), async (req, res) => {
  try {
    const { projectType, startDate, endDate, projectManager, comment, status } =
      req.body;

    const sql =
      "INSERT INTO Projects (ProjectType, StartDate, EndDate, ProjectManager, Comment, Status) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [
      projectType,
      startDate,
      endDate,
      projectManager,
      comment,
      status,
    ];
    const [result] = await db.query(sql, values);
    res.send({ message: "Project added", id: result.insertId });
  } catch (err) {
    console.error("MySQL Insert Error: ", err);
    res.status(500).send({ message: "Error adding project", error: err });
  }
});

app.put("/projects/:id", checkRole("Project Manager"), async (req, res) => {
  try {
    const { projectType, startDate, endDate, projectManager, comment, status } =
      req.body;

    const sql =
      "UPDATE Projects SET ProjectType = ?, StartDate = ?, EndDate = ?, ProjectManager = ?, Comment = ?, Status = ? WHERE ID = ?";
    const values = [
      projectType,
      startDate,
      endDate,
      projectManager,
      comment,
      status,
      req.params.id,
    ];
    await db.query(sql, values);
    res.send({ message: "Project updated" });
  } catch (err) {
    console.error("MySQL Update Error: ", err);
    res.status(500).send({ message: "Error updating project", error: err });
  }
});

app.delete("/projects/:id", checkRole("Project Manager"), async (req, res) => {
  try {
    const sql = "DELETE FROM Projects WHERE ID = ?";
    await db.query(sql, [req.params.id]);
    res.send({ message: "Project deleted" });
  } catch (err) {
    console.error("MySQL Delete Error: ", err);
    res.status(500).send({ message: "Error deleting project", error: err });
  }
});

// LeaveRequests endpoints
app.get("/leave-requests", checkRole("Employee"), async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM LeaveRequests");
    res.send(results);
  } catch (err) {
    console.error("MySQL Query Error: ", err);
    res
      .status(500)
      .send({ message: "Error fetching leave requests", error: err });
  }
});

app.get("/leave-requests/:id", checkRole("Employee"), async (req, res) => {
  try {
    const [results] = await db.query(
      "SELECT * FROM LeaveRequests WHERE ID = ?",
      [req.params.id]
    );
    res.send(results[0]);
  } catch (err) {
    console.error("MySQL Query Error: ", err);
    res
      .status(500)
      .send({ message: "Error fetching leave request", error: err });
  }
});

app.post("/leave-requests", checkRole("Employee"), async (req, res) => {
  try {
    const { EmployeeID, AbsenceReason, StartDate, EndDate, Comment, Status } =
      req.body;

    const sql =
      "INSERT INTO LeaveRequests (EmployeeID, AbsenceReason, StartDate, EndDate, Comment, Status) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [
      EmployeeID,
      AbsenceReason,
      StartDate,
      EndDate,
      Comment,
      Status,
    ];
    const [result] = await db.query(sql, values);
    res.send({ message: "Leave request added", id: result.insertId });
  } catch (err) {
    console.error("MySQL Insert Error: ", err);
    res.status(500).send({ message: "Error adding leave request", error: err });
  }
});

app.put("/leave-requests/:id", checkRole("Employee"), async (req, res) => {
  try {
    const { EmployeeID, AbsenceReason, StartDate, EndDate, Comment, Status } =
      req.body;

    const sql =
      "UPDATE LeaveRequests SET EmployeeID = ?, AbsenceReason = ?, StartDate = ?, EndDate = ?, Comment = ?, Status = ? WHERE ID = ?";
    const values = [
      EmployeeID,
      AbsenceReason,
      StartDate,
      EndDate,
      Comment,
      Status,
      req.params.id,
    ];
    await db.query(sql, values);
    res.send({ message: "Leave request updated" });
  } catch (err) {
    console.error("MySQL Update Error: ", err);
    res
      .status(500)
      .send({ message: "Error updating leave request", error: err });
  }
});

app.delete("/leave-requests/:id", checkRole("Employee"), async (req, res) => {
  try {
    const sql = "DELETE FROM LeaveRequests WHERE ID = ?";
    await db.query(sql, [req.params.id]);
    res.send({ message: "Leave request deleted" });
  } catch (err) {
    console.error("MySQL Delete Error: ", err);
    res
      .status(500)
      .send({ message: "Error deleting leave request", error: err });
  }
});

// ApprovalRequests endpoints
app.get("/approval-requests", checkRole("HR Manager"), async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM ApprovalRequests");
    res.send(results);
  } catch (err) {
    console.error("MySQL Query Error: ", err);
    res
      .status(500)
      .send({ message: "Error fetching approval requests", error: err });
  }
});

app.get("/approval-requests/:id", checkRole("HR Manager"), async (req, res) => {
  try {
    const [results] = await db.query(
      "SELECT * FROM ApprovalRequests WHERE ID = ?",
      [req.params.id]
    );
    res.send(results[0]);
  } catch (err) {
    console.error("MySQL Query Error: ", err);
    res
      .status(500)
      .send({ message: "Error fetching approval request", error: err });
  }
});

app.post("/approval-requests", checkRole("HR Manager"), async (req, res) => {
  try {
    const { approverID, leaveRequestID, approvalStatus, comment } = req.body;

    const sql =
      "INSERT INTO ApprovalRequests (ApproverID, LeaveRequestID, ApprovalStatus, Comment) VALUES (?, ?, ?, ?)";
    const values = [approverID, leaveRequestID, approvalStatus, comment];
    const [result] = await db.query(sql, values);
    res.send({ message: "Approval request added", id: result.insertId });
  } catch (err) {
    console.error("MySQL Insert Error: ", err);
    res
      .status(500)
      .send({ message: "Error adding approval request", error: err });
  }
});

app.put("/approval-requests/:id", checkRole("HR Manager"), async (req, res) => {
  try {
    const { approverID, leaveRequestID, approvalStatus, comment } = req.body;

    const sql =
      "UPDATE ApprovalRequests SET ApproverID = ?, LeaveRequestID = ?, ApprovalStatus = ?, Comment = ? WHERE ID = ?";
    const values = [
      approverID,
      leaveRequestID,
      approvalStatus,
      comment,
      req.params.id,
    ];
    await db.query(sql, values);
    res.send({ message: "Approval request updated" });
  } catch (err) {
    console.error("MySQL Update Error: ", err);
    res
      .status(500)
      .send({ message: "Error updating approval request", error: err });
  }
});

app.delete(
  "/approval-requests/:id",
  checkRole("HR Manager"),
  async (req, res) => {
    try {
      const sql = "DELETE FROM ApprovalRequests WHERE ID = ?";
      await db.query(sql, [req.params.id]);
      res.send({ message: "Approval request deleted" });
    } catch (err) {
      console.error("MySQL Delete Error: ", err);
      res
        .status(500)
        .send({ message: "Error deleting approval request", error: err });
    }
  }
);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "Something went wrong!", error: err });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
