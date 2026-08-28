const express = require("express");

const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectsController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// PUBLIC ROUTES
// ==========================================

// Get all projects
router.get("/", getProjects);

// Get one project
router.get("/:id", getProjectById);


// ==========================================
// PROTECTED ADMIN ROUTES
// ==========================================

// Create project
router.post("/", protect, createProject);

// Update project
router.put("/:id", protect, updateProject);

// Delete project
router.delete("/:id", protect, deleteProject);


module.exports = router;