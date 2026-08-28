const db = require("../config/db");

// GET ALL UPDATES
const getUpdates = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM updates ORDER BY published_at DESC, created_at DESC"
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error("Get updates error:", error);

    res.status(500).json({
      message: "Failed to retrieve updates.",
    });
  }
};


// GET SINGLE UPDATE
const getUpdateById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      "SELECT * FROM updates WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Update not found.",
      });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Get update error:", error);

    res.status(500).json({
      message: "Failed to retrieve update.",
    });
  }
};


// CREATE UPDATE
const createUpdate = async (req, res) => {
  try {
    const {
      title,
      content,
      image,
      category,
      status,
      published_at,
    } = req.body;

    // Basic validation
    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required.",
      });
    }

    const [result] = await db.query(
      `INSERT INTO updates
      (title, content, image, category, status, published_at)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        title,
        content,
        image || null,
        category || null,
        status || "Draft",
        published_at || null,
      ]
    );

    const [rows] = await db.query(
      "SELECT * FROM updates WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json({
      message: "Update created successfully.",
      update: rows[0],
    });
  } catch (error) {
    console.error("Create update error:", error);

    res.status(500).json({
      message: "Failed to create update.",
    });
  }
};


// UPDATE EXISTING UPDATE
const updateUpdate = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      content,
      image,
      category,
      status,
      published_at,
    } = req.body;

    // Check if update exists
    const [existing] = await db.query(
      "SELECT * FROM updates WHERE id = ?",
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        message: "Update not found.",
      });
    }

    await db.query(
      `UPDATE updates
       SET title = ?,
           content = ?,
           image = ?,
           category = ?,
           status = ?,
           published_at = ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        title,
        content,
        image || null,
        category || null,
        status || "Draft",
        published_at || null,
        id,
      ]
    );

    const [rows] = await db.query(
      "SELECT * FROM updates WHERE id = ?",
      [id]
    );

    res.status(200).json({
      message: "Update updated successfully.",
      update: rows[0],
    });
  } catch (error) {
    console.error("Update update error:", error);

    res.status(500).json({
      message: "Failed to update update.",
    });
  }
};


// DELETE UPDATE
const deleteUpdate = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "DELETE FROM updates WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Update not found.",
      });
    }

    res.status(200).json({
      message: "Update deleted successfully.",
    });
  } catch (error) {
    console.error("Delete update error:", error);

    res.status(500).json({
      message: "Failed to delete update.",
    });
  }
};


module.exports = {
  getUpdates,
  getUpdateById,
  createUpdate,
  updateUpdate,
  deleteUpdate,
};