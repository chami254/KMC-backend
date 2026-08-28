const express = require("express");

const {
  getLeadership,
  getLeadershipById,
  createLeadership,
  updateLeadership,
  deleteLeadership,
} = require("../controllers/leadershipController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", getLeadership);
router.get("/:id", getLeadershipById);

// Protected admin routes
router.post("/", protect, createLeadership);
router.put("/:id", protect, updateLeadership);
router.delete("/:id", protect, deleteLeadership);

module.exports = router;