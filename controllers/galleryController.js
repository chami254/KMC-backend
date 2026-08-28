const pool = require("../config/db");

// GET all gallery items
const getGallery = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM gallery ORDER BY created_at DESC"
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error("Get gallery error:", error);

    res.status(500).json({
      message: "Server error while fetching gallery.",
    });
  }
};

// GET one gallery item
const getGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.execute(
      "SELECT * FROM gallery WHERE id = ? LIMIT 1",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Gallery item not found.",
      });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Get gallery item error:", error);

    res.status(500).json({
      message: "Server error while fetching gallery item.",
    });
  }
};

// CREATE gallery item
const createGalleryItem = async (req, res) => {
  try {
    const { title, image, category } = req.body;

    if (!title || !image || !category) {
      return res.status(400).json({
        message: "Title, image and category are required.",
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO gallery (title, image, category)
       VALUES (?, ?, ?)`,
      [title, image, category]
    );

    const [rows] = await pool.execute(
      "SELECT * FROM gallery WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json({
      message: "Gallery item created successfully.",
      gallery: rows[0],
    });
  } catch (error) {
    console.error("Create gallery item error:", error);

    res.status(500).json({
      message: "Server error while creating gallery item.",
    });
  }
};

// UPDATE gallery item
const updateGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, image, category } = req.body;

    if (!title || !image || !category) {
      return res.status(400).json({
        message: "Title, image and category are required.",
      });
    }

    const [result] = await pool.execute(
      `UPDATE gallery
       SET title = ?, image = ?, category = ?
       WHERE id = ?`,
      [title, image, category, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Gallery item not found.",
      });
    }

    const [rows] = await pool.execute(
      "SELECT * FROM gallery WHERE id = ?",
      [id]
    );

    res.status(200).json({
      message: "Gallery item updated successfully.",
      gallery: rows[0],
    });
  } catch (error) {
    console.error("Update gallery item error:", error);

    res.status(500).json({
      message: "Server error while updating gallery item.",
    });
  }
};

// DELETE gallery item
const deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      "DELETE FROM gallery WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Gallery item not found.",
      });
    }

    res.status(200).json({
      message: "Gallery item deleted successfully.",
    });
  } catch (error) {
    console.error("Delete gallery item error:", error);

    res.status(500).json({
      message: "Server error while deleting gallery item.",
    });
  }
};

module.exports = {
  getGallery,
  getGalleryItem,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
};