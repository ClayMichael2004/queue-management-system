const express = require("express");
const router = express.Router();
const tillController = require("../controllers/till.controller");
const { verifyToken, allowRoles } = require("../middleware/auth");

// 🔐 ADMIN — view all tills
router.get(
  "/",
  verifyToken,
  allowRoles("ADMIN"),
  tillController.getAllTills
);

// 🔐 ADMIN + SECRETARY — view single till
router.get(
  "/:id",
  verifyToken,
  allowRoles("ADMIN", "SECRETARY"),
  tillController.getTillById
);

// 🔐 SECRETARY — mark queue completed
router.post(
  "/queues/:queue_id/complete",
  verifyToken,
  allowRoles("SECRETARY"),
  tillController.completeQueue
);

module.exports = router;
