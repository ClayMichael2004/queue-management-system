const mysql = require("mysql2");

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
console.log("ENV Variables:", process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_NAME);

db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ MySQL connected successfully");
    connection.release();
  }
});

module.exports = db;
