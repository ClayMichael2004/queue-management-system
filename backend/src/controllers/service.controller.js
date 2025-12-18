console.log("✅ service.controller.js LOADED");
const db = require("../config/db");

// Declare the function as a constant
const getServices = (req, res) => {
  console.log("GET /api/services hit!");
  db.query("SELECT id, name, code FROM services", (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
};

// Export the function properly
module.exports = { getServices };