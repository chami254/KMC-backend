const db = require("../config/db");

// GET ALL MESSAGES
const getMessages = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM messages ORDER BY created_at DESC"
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error("Get messages error:", error);

    res.status(500).json({
      message: "Failed to retrieve messages.",
    });
  }
};


// GET SINGLE MESSAGE
const getMessageById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      "SELECT * FROM messages WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Message not found.",
      });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Get message error:", error);

    res.status(500).json({
      message: "Failed to retrieve message.",
    });
  }
};


// CREATE MESSAGE
// PUBLIC - used by the Contact Us form
const createMessage = async (req, res) => {
  try {
    const {
      name,
      email,
      subject,
      message,
    } = req.body;

    // Required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        message: "Name, email and message are required.",
      });
    }

    const [result] = await db.query(
      `INSERT INTO messages
      (name, email, subject, message, status)
      VALUES (?, ?, ?, ?, ?)`,
      [
        name,
        email,
        subject || null,
        message,
        "Unread",
      ]
    );

    const [rows] = await db.query(
      "SELECT * FROM messages WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json({
      message: "Message sent successfully.",
      data: rows[0],
    });
  } catch (error) {
    console.error("Create message error:", error);

    res.status(500).json({
      message: "Failed to send message.",
    });
  }
};


// UPDATE MESSAGE
// ADMIN ONLY
const updateMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      email,
      subject,
      message,
      status,
    } = req.body;

    // Check whether message exists
    const [existing] = await db.query(
      "SELECT * FROM messages WHERE id = ?",
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        message: "Message not found.",
      });
    }

    await db.query(
      `UPDATE messages
       SET name = ?,
           email = ?,
           subject = ?,
           message = ?,
           status = ?
       WHERE id = ?`,
      [
        name,
        email,
        subject || null,
        message,
        status || "Unread",
        id,
      ]
    );

    const [rows] = await db.query(
      "SELECT * FROM messages WHERE id = ?",
      [id]
    );

    res.status(200).json({
      message: "Message updated successfully.",
      data: rows[0],
    });
  } catch (error) {
    console.error("Update message error:", error);

    res.status(500).json({
      message: "Failed to update message.",
    });
  }
};


// DELETE MESSAGE
// ADMIN ONLY
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "DELETE FROM messages WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Message not found.",
      });
    }

    res.status(200).json({
      message: "Message deleted successfully.",
    });
  } catch (error) {
    console.error("Delete message error:", error);

    res.status(500).json({
      message: "Failed to delete message.",
    });
  }
};


module.exports = {
  getMessages,
  getMessageById,
  createMessage,
  updateMessage,
  deleteMessage,
};