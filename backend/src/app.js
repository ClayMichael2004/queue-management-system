console.log("🔥 THIS app.js IS RUNNING 🔥");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const db = require("./config/db");

const bookingRoutes = require("./routes/booking.routes");
const tillRoutes = require("./routes/till.routes");
const adminRoutes = require("./routes/admin.routes");
const serviceRoutes = require("./routes/service.routes");
const queueRoutes = require("./routes/queue.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();
const server = http.createServer(app);

// 🔥 Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Make io accessible everywhere
app.set("io", io);

io.on("connection", (socket) => {
  console.log("🟢 Display board connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Display board disconnected:", socket.id);
  });
});

app.use(cors());
app.use(express.json());

app.use("/api/bookings", bookingRoutes);
app.use("/api/tills", tillRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/queues", queueRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Queue Management System API running");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
