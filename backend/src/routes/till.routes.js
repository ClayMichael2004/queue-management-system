const express = require("express");
const router = express.Router();
const tillController = require("../controllers/till.controller");

// Mark queue as completed
router.post("/queues/:queue_id/complete", tillController.completeQueue);
router.get("/:id", tillController.getTillById);

module.exports = router;
