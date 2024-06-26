const express = require("express");
const router = express.Router();
const db = require("./db");

router.get("/", (req, res) => {
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

router.post("/", (req, res) => {
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

module.exports = router;
