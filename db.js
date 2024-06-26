const mysql = require("mysql");

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

module.exports = db;
