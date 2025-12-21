const express = require("express");
const router = express.Router();
const {
  callNext,
  markServed,
  getQueuesByTill,
} = require("../controllers/queue.controller");
const { verifyToken, allowRoles } = require("../middleware/auth");

// Only secretaries (CASHIER) can access queues
router.get("/", verifyToken, allowRoles("ADMIN", "CASHIER"), getQueuesByTill);
router.post("/serve", verifyToken, allowRoles("CASHIER"), markServed);

// Only admin can call next queue (optional)
router.post("/call-next", verifyToken, allowRoles("ADMIN"), callNext);

module.exports = router;
