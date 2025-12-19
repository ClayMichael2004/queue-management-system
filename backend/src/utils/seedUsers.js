// src/utils/seedUsers.js
require("dotenv").config();
const db = require("../config/db");
const bcrypt = require("bcrypt");

async function seedUsers() {
  try {
    const saltRounds = 10;

    // Hash passwords
    const adminPassword = await bcrypt.hash("admin123", saltRounds);
    const secretaryPassword = await bcrypt.hash("secretary123", saltRounds);

    // Admin user
    db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      ["Admin User", "admin@example.com", adminPassword, "ADMIN"],
      (err, result) => {
        if (err) console.log("Admin insert error:", err.message);
        else console.log("Admin created successfully, ID:", result.insertId);
      }
    );

    // Secretary user assigned to Till 1
    db.query(
      "INSERT INTO users (name, email, password, role, till_id) VALUES (?, ?, ?, ?, ?)",
      ["Secretary One", "secretary1@example.com", secretaryPassword, "CASHIER", 1],
      (err, result) => {
        if (err) console.log("Secretary insert error:", err.message);
        else console.log("Secretary created successfully, ID:", result.insertId);
      }
    );
  } catch (err) {
    console.error("Seeding failed:", err);
  }
}

seedUsers();
