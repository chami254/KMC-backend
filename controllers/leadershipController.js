const pool = require("../config/db");

// GET all leadership members
const getLeadership = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT id, name, position, bio, image, status, created_at, updated_at
       FROM leadership
       ORDER BY id ASC`
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error("Get leadership error:", error);

    res.status(500).json({
      message: "Server error while fetching leadership.",
    });
  }
};

// GET one leadership member
const getLeadershipById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.execute(
      `SELECT id, name, position, bio, image, status, created_at, updated_at
       FROM leadership
       WHERE id = ?
       LIMIT 1`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Leadership member not found.",
      });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Get leadership member error:", error);

    res.status(500).json({
      message: "Server error while fetching leadership member.",
    });
  }
};

// CREATE leadership member
const createLeadership = async (req, res) => {
  try {
    const { name, position, bio, image, status } = req.body;

    if (!name || !position) {
      return res.status(400).json({
        message: "Name and position are required.",
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO leadership
       (name, position, bio, image, status)
       VALUES (?, ?, ?, ?, ?)`,
      [
        name,
        position,
        bio || null,
        image || null,
        status || "Active",
      ]
    );

    const [rows] = await pool.execute(
      `SELECT id, name, position, bio, image, status, created_at, updated_at
       FROM leadership
       WHERE id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      message: "Leadership member created successfully.",
      leadership: rows[0],
    });
  } catch (error) {
    console.error("Create leadership error:", error);

    res.status(500).json({
      message: "Server error while creating leadership member.",
    });
  }
};

// UPDATE leadership member
const updateLeadership = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, position, bio, image, status } = req.body;

    const [existing] = await pool.execute(
      "SELECT id FROM leadership WHERE id = ?",
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        message: "Leadership member not found.",
      });
    }

    await pool.execute(
      `UPDATE leadership
       SET name = ?,
           position = ?,
           bio = ?,
           image = ?,
           status = ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        name,
        position,
        bio || null,
        image || null,
        status || "Active",
        id,
      ]
    );

    const [rows] = await pool.execute(
      `SELECT id, name, position, bio, image, status, created_at, updated_at
       FROM leadership
       WHERE id = ?`,
      [id]
    );

    res.status(200).json({
      message: "Leadership member updated successfully.",
      leadership: rows[0],
    });
  } catch (error) {
    console.error("Update leadership error:", error);

    res.status(500).json({
      message: "Server error while updating leadership member.",
    });
  }
};

// DELETE leadership member
const deleteLeadership = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.execute(
      "SELECT id FROM leadership WHERE id = ?",
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        message: "Leadership member not found.",
      });
    }

    await pool.execute(
      "DELETE FROM leadership WHERE id = ?",
      [id]
    );

    res.status(200).json({
      message: "Leadership member deleted successfully.",
    });
  } catch (error) {
    console.error("Delete leadership error:", error);

    res.status(500).json({
      message: "Server error while deleting leadership member.",
    });
  }
};

module.exports = {
  getLeadership,
  getLeadershipById,
  createLeadership,
  updateLeadership,
  deleteLeadership,
};