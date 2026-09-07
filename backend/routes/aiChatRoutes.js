const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createChat,
  getMyChats,
  getChatById,
  saveMessage,
  updateChatTitle,
  deleteChat,
} = require("../controllers/aiChatController");

// All AI chat routes require authentication
router.use(authMiddleware);

// POST /api/ai-chats - Create a new empty conversation
router.post("/", createChat);

// GET /api/ai-chats/my - List user's conversations
router.get("/my", getMyChats);

// GET /api/ai-chats/:chatId - Retrieve full conversation
router.get("/:chatId", getChatById);

// POST /api/ai-chats/:chatId/messages - Append a message to conversation
router.post("/:chatId/messages", saveMessage);

// PATCH /api/ai-chats/:chatId - Rename conversation
router.patch("/:chatId", updateChatTitle);

// DELETE /api/ai-chats/:chatId - Delete conversation
router.delete("/:chatId", deleteChat);

module.exports = router;
