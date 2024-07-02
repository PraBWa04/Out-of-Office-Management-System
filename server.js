const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");

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

app.use(bodyParser.json());
app.use(express.static("public"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Ensure the upload directory is correct
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
    console.log(`Checking role: ${role}, received: ${userRole}`);
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
    res.status(500).send(err);
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
    res.status(500).send(err);
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
      res.status(500).send(err);
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
      res.status(500).send(err);
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
    res.status(500).send(err);
  }
});

// Projects endpoints
app.get("/projects", checkRole("Project Manager"), async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM Projects");
    res.send(results);
  } catch (err) {
    console.error("MySQL Query Error: ", err);
    res.status(500).send(err);
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
    res.status(500).send(err);
  }
});

app.post("/projects", checkRole("Project Manager"), async (req, res) => {
  try {
    console.log("Incoming request body for projects:", req.body); // Log request body
    const { projectType, startDate, endDate, projectManager, comment, status } =
      req.body;

    if (!projectType || !startDate || !projectManager || !status) {
      console.error("Missing required fields in projects", req.body);
      return res.status(400).send({ message: "Missing required fields" });
    }

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
    console.log("Executing SQL for projects:", sql, values); // Log SQL and values
    const [result] = await db.query(sql, values);
    res.send({ message: "Project added", id: result.insertId });
  } catch (err) {
    console.error("MySQL Insert Error in projects:", err);
    res.status(500).send(err);
  }
});

app.put("/projects/:id", checkRole("Project Manager"), async (req, res) => {
  try {
    console.log("Incoming request body for projects:", req.body); // Log request body
    const { projectType, startDate, endDate, projectManager, comment, status } =
      req.body;

    if (!projectType || !startDate || !projectManager || !status) {
      console.error("Missing required fields in projects", req.body);
      return res.status(400).send({ message: "Missing required fields" });
    }

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
    console.log(values); // Log the values array to check data before query execution
    await db.query(sql, values);
    res.send({ message: "Project updated" });
  } catch (err) {
    console.error("MySQL Update Error in projects:", err);
    res.status(500).send(err);
  }
});

app.delete("/projects/:id", checkRole("Project Manager"), async (req, res) => {
  try {
    const sql = "DELETE FROM Projects WHERE ID = ?";
    await db.query(sql, [req.params.id]);
    res.send({ message: "Project deleted" });
  } catch (err) {
    console.error("MySQL Delete Error in projects:", err);
    res.status(500).send(err);
  }
});

// LeaveRequests endpoints
app.get("/leave-requests", checkRole("Employee"), async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM LeaveRequests");
    res.send(results);
  } catch (err) {
    console.error("MySQL Query Error: ", err);
    res.status(500).send(err);
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
    res.status(500).send(err);
  }
});

app.post("/leave-requests", checkRole("Employee"), async (req, res) => {
  try {
    console.log("Incoming request body for leave-requests:", req.body); // Log request body
    const { EmployeeID, AbsenceReason, StartDate, EndDate, Comment, Status } =
      req.body;

    if (!EmployeeID || !AbsenceReason || !StartDate || !EndDate || !Status) {
      console.error("Missing required fields in leave-requests", req.body);
      return res.status(400).send({ message: "Missing required fields" });
    }

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
    console.error("MySQL Insert Error in leave-requests:", err);
    res.status(500).send(err);
  }
});

app.put("/leave-requests/:id", checkRole("Employee"), async (req, res) => {
  try {
    console.log("Incoming request body for leave-requests:", req.body); // Log request body
    const { EmployeeID, AbsenceReason, StartDate, EndDate, Comment, Status } =
      req.body;

    if (!EmployeeID || !AbsenceReason || !StartDate || !EndDate || !Status) {
      console.error("Missing required fields in leave-requests", req.body);
      return res.status(400).send({ message: "Missing required fields" });
    }

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
    console.error("MySQL Update Error in leave-requests:", err);
    res.status(500).send(err);
  }
});

app.delete("/leave-requests/:id", checkRole("Employee"), async (req, res) => {
  try {
    const sql = "DELETE FROM LeaveRequests WHERE ID = ?";
    await db.query(sql, [req.params.id]);
    res.send({ message: "Leave request deleted" });
  } catch (err) {
    console.error("MySQL Delete Error in leave-requests:", err);
    res.status(500).send(err);
  }
});

// ApprovalRequests endpoints
app.get("/approval-requests", checkRole("HR Manager"), async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM ApprovalRequests");
    res.send(results);
  } catch (err) {
    console.error("MySQL Query Error: ", err);
    res.status(500).send(err);
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
    res.status(500).send(err);
  }
});

app.post("/approval-requests", checkRole("HR Manager"), async (req, res) => {
  try {
    console.log("Incoming request body for approval-requests:", req.body); // Log request body
    const { approverID, leaveRequestID, approvalStatus, comment } = req.body;

    if (!approverID || !leaveRequestID || !approvalStatus) {
      console.error("Missing required fields in approval-requests", req.body);
      return res.status(400).send({ message: "Missing required fields" });
    }

    const sql =
      "INSERT INTO ApprovalRequests (ApproverID, LeaveRequestID, ApprovalStatus, Comment) VALUES (?, ?, ?, ?)";
    const values = [approverID, leaveRequestID, approvalStatus, comment];
    console.log("Executing SQL for approval-requests:", sql, values); // Log SQL and values
    const [result] = await db.query(sql, values);
    res.send({ message: "Approval request added", id: result.insertId });
  } catch (err) {
    console.error("MySQL Insert Error in approval-requests:", err);
    res.status(500).send(err);
  }
});

app.put("/approval-requests/:id", checkRole("HR Manager"), async (req, res) => {
  try {
    console.log("Incoming request body for approval-requests:", req.body); // Log request body
    const { approverID, leaveRequestID, approvalStatus, comment } = req.body;

    if (!approverID || !leaveRequestID || !approvalStatus) {
      console.error("Missing required fields in approval-requests", req.body);
      return res.status(400).send({ message: "Missing required fields" });
    }

    const sql =
      "UPDATE ApprovalRequests SET ApproverID = ?, LeaveRequestID = ?, ApprovalStatus = ?, Comment = ? WHERE ID = ?";
    const values = [
      approverID,
      leaveRequestID,
      approvalStatus,
      comment,
      req.params.id,
    ];
    console.log(values); // Log the values array to check data before query execution
    await db.query(sql, values);
    res.send({ message: "Approval request updated" });
  } catch (err) {
    console.error("MySQL Update Error in approval-requests:", err);
    res.status(500).send(err);
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
      console.error("MySQL Delete Error in approval-requests:", err);
      res.status(500).send(err);
    }
  }
);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "Something went wrong!" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
