const express = require("express");

const router = express.Router();

const {
  getUpdates,
  getUpdateById,
  createUpdate,
  updateUpdate,
  deleteUpdate,
} = require("../controllers/updatesController");

const protect = require("../middleware/authMiddleware");


// PUBLIC ROUTES

router.get("/", getUpdates);

router.get("/:id", getUpdateById);


// PROTECTED ADMIN ROUTES

router.post("/", protect, createUpdate);

router.put("/:id", protect, updateUpdate);

router.delete("/:id", protect, deleteUpdate);


module.exports = router;