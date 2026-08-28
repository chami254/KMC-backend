const express = require("express");

const router = express.Router();

const {
  getMessages,
  getMessageById,
  createMessage,
  updateMessage,
  deleteMessage,
} = require("../controllers/messagesController");

const protect = require("../middleware/authMiddleware");


// PUBLIC ROUTE
// Contact Us form submits here
router.post("/", createMessage);


// ADMIN ROUTES
router.get("/", protect, getMessages);

router.get("/:id", protect, getMessageById);

router.put("/:id", protect, updateMessage);

router.delete("/:id", protect, deleteMessage);


module.exports = router;