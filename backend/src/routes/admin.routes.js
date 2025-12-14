const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");

// Get all queues with optional filters
router.get("/queues", adminController.getQueues);

module.exports = router;
