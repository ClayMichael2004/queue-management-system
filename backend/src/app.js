console.log("🔥 THIS app.js IS RUNNING 🔥");
console.log("App.js loaded successfully");
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const db = require("./config/db");
const app = express();
const bookingRoutes = require("./routes/booking.routes");
const tillRoutes = require("./routes/till.routes");
const adminRoutes = require("./routes/admin.routes");
const serviceRoutes = require("./routes/service.routes");

app.use(cors());
app.use(express.json());  // <-- important for POST/PUT requests

app.use("/api/bookings", bookingRoutes);  // booking routes
app.use("/api/tills", tillRoutes);        // till routes
app.use("/api/admin", adminRoutes);       // admin routes
app.use("/api/services", serviceRoutes);  // service routes
console.log("Service routes mounted!");
app.get("/", (req, res) => {
  res.send("Queue Management System API running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
