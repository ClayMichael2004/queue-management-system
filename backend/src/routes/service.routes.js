console.log("✅ service.routes.js LOADED");
const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/service.controller");

// GET /api/services
router.get("/", serviceController.getServices);

module.exports = router;
