require("dotenv").config();
const express = require("express");
const cors = require("cors");

const db = require("./config/db");
const app = express();
const bookingRoutes = require("./routes/booking.routes");

app.use(cors());
app.use(express.json());
app.use("/api", bookingRoutes);

app.get("/", (req, res) => {
  res.send("Queue Management System API running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
