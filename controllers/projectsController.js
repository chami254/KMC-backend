const pool = require("../config/db");

// ==========================================
// GET ALL PROJECTS
// ==========================================
const getProjects = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT 
        id,
        title,
        category,
        description,
        image,
        status,
        created_at,
        updated_at
       FROM projects
       ORDER BY created_at DESC`
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error("Get projects error:", error);

    res.status(500).json({
      message: "Server error while fetching projects.",
    });
  }
};


// ==========================================
// GET SINGLE PROJECT
// ==========================================
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.execute(
      `SELECT 
        id,
        title,
        category,
        description,
        image,
        status,
        created_at,
        updated_at
       FROM projects
       WHERE id = ?
       LIMIT 1`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Project not found.",
      });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Get project error:", error);

    res.status(500).json({
      message: "Server error while fetching project.",
    });
  }
};


// ==========================================
// CREATE PROJECT
// ==========================================
const createProject = async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      image,
      status,
    } = req.body;

    // Basic validation
    if (!title || !category || !description) {
      return res.status(400).json({
        message: "Title, category and description are required.",
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO projects
        (title, category, description, image, status)
       VALUES (?, ?, ?, ?, ?)`,
      [
        title,
        category,
        description,
        image || null,
        status || "draft",
      ]
    );

    const [rows] = await pool.execute(
      `SELECT 
        id,
        title,
        category,
        description,
        image,
        status,
        created_at,
        updated_at
       FROM projects
       WHERE id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      message: "Project created successfully.",
      project: rows[0],
    });
  } catch (error) {
    console.error("Create project error:", error);

    res.status(500).json({
      message: "Server error while creating project.",
    });
  }
};


// ==========================================
// UPDATE PROJECT
// ==========================================
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      category,
      description,
      image,
      status,
    } = req.body;

    // Check if project exists
    const [existing] = await pool.execute(
      "SELECT id FROM projects WHERE id = ? LIMIT 1",
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        message: "Project not found.",
      });
    }

    // Basic validation
    if (!title || !category || !description) {
      return res.status(400).json({
        message: "Title, category and description are required.",
      });
    }

    await pool.execute(
      `UPDATE projects
       SET
        title = ?,
        category = ?,
        description = ?,
        image = ?,
        status = ?,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        title,
        category,
        description,
        image || null,
        status || "draft",
        id,
      ]
    );

    const [rows] = await pool.execute(
      `SELECT 
        id,
        title,
        category,
        description,
        image,
        status,
        created_at,
        updated_at
       FROM projects
       WHERE id = ?`,
      [id]
    );

    res.status(200).json({
      message: "Project updated successfully.",
      project: rows[0],
    });
  } catch (error) {
    console.error("Update project error:", error);

    res.status(500).json({
      message: "Server error while updating project.",
    });
  }
};


// ==========================================
// DELETE PROJECT
// ==========================================
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      "DELETE FROM projects WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Project not found.",
      });
    }

    res.status(200).json({
      message: "Project deleted successfully.",
    });
  } catch (error) {
    console.error("Delete project error:", error);

    res.status(500).json({
      message: "Server error while deleting project.",
    });
  }
};


module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};