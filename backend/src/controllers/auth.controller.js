// controllers/auth.controller.js
const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "All fields are required" });

  db.query("SELECT * FROM users WHERE email = ?", [username], async (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!results.length) return res.status(401).json({ message: "Invalid credentials" });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role, till_id: user.till_id },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );
console.log("JWT_SECRET:", process.env.JWT_SECRET);

    res.json({ token, user: { id: user.id, name: user.name, role: user.role, till_id: user.till_id } });
  });
};
