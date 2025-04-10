const mysql = require("mysql");

const db = mysql.createPool({
  connectionLimit: 10, // Allows multiple simultaneous queries
  host: "localhost",
  user: "root", // Change if needed
  password: "", // Change if needed
  database: "alumni_portal",
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL Database");
    connection.release();
  }
});

module.exports = db;
