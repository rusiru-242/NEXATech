const mongoose = require("mongoose");
const AIChat = require("../models/AIChat");
const { generateChatTitle } = require("../utils/chatTitleGenerator");

// =========================================================
// CREATE NEW CHAT
// POST /api/ai-chats
// =========================================================
const createChat = async (req, res) => {
  try {
    const chat = await AIChat.create({
      user: req.user._id,
      title: "New Chat",
      messages: [],
    });

    res.status(201).json({
      success: true,
      chat: {
        _id: chat._id,
        title: chat.title,
        messages: chat.messages,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
      },
    });
  } catch (error) {
    console.error("Create AI Chat Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create new conversation.",
    });
  }
};

// =========================================================
// GET ALL USER CHATS (Lightweight list for sidebar)
// GET /api/ai-chats/my
// =========================================================
const getMyChats = async (req, res) => {
  try {
    const chats = await AIChat.find({ user: req.user._id })
      .select("_id title updatedAt createdAt")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      chats,
    });
  } catch (error) {
    console.error("Get My AI Chats Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve conversations.",
    });
  }
};

// =========================================================
// GET SINGLE CHAT FULL HISTORY
// GET /api/ai-chats/:chatId
// =========================================================
const getChatById = async (req, res) => {
  try {
    const { chatId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(404).json({
        success: false,
        message: "Invalid chat conversation ID.",
      });
    }

    const chat = await AIChat.findOne({
      _id: chatId,
      user: req.user._id,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat conversation not found or access denied.",
      });
    }

    res.status(200).json({
      success: true,
      chat,
    });
  } catch (error) {
    console.error("Get AI Chat By ID Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve conversation.",
    });
  }
};

// =========================================================
// SAVE MESSAGE TO CONVERSATION
// POST /api/ai-chats/:chatId/messages
// =========================================================
const saveMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { sender, text, products } = req.body;

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(404).json({
        success: false,
        message: "Invalid chat conversation ID.",
      });
    }

    if (!sender || !["user", "bot"].includes(sender)) {
      return res.status(400).json({
        success: false,
        message: "Message sender must be 'user' or 'bot'.",
      });
    }

    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message text is required.",
      });
    }

    // Ownership check: must match req.user._id
    const chat = await AIChat.findOne({
      _id: chatId,
      user: req.user._id,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat conversation not found or access denied.",
      });
    }

    // Auto-generate title on first user message if title is still default "New Chat"
    if (sender === "user" && (chat.title === "New Chat" || chat.messages.length === 0)) {
      chat.title = generateChatTitle(text);
    }

    // Format recommended products if any
    const formattedProducts = Array.isArray(products)
      ? products.map((p) => ({
          productId: p._id || p.id || p.productId || null,
          name: p.name || "",
          price: Number(p.price || 0),
          image: p.image || "",
        }))
      : [];

    chat.messages.push({
      sender,
      text: text.trim(),
      products: formattedProducts,
      createdAt: new Date(),
    });

    await chat.save();

    res.status(200).json({
      success: true,
      chat,
    });
  } catch (error) {
    console.error("Save AI Chat Message Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save message to conversation.",
    });
  }
};

// =========================================================
// UPDATE CHAT TITLE
// PATCH /api/ai-chats/:chatId
// =========================================================
const updateChatTitle = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { title } = req.body;

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(404).json({
        success: false,
        message: "Invalid chat conversation ID.",
      });
    }

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "A non-empty title string is required.",
      });
    }

    const chat = await AIChat.findOneAndUpdate(
      {
        _id: chatId,
        user: req.user._id,
      },
      { title: title.trim() },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat conversation not found or access denied.",
      });
    }

    res.status(200).json({
      success: true,
      chat,
    });
  } catch (error) {
    console.error("Update AI Chat Title Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update chat title.",
    });
  }
};

// =========================================================
// DELETE CHAT
// DELETE /api/ai-chats/:chatId
// =========================================================
const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(404).json({
        success: false,
        message: "Invalid chat conversation ID.",
      });
    }

    const chat = await AIChat.findOneAndDelete({
      _id: chatId,
      user: req.user._id,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat conversation not found or access denied.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Chat conversation deleted successfully.",
      deletedId: chatId,
    });
  } catch (error) {
    console.error("Delete AI Chat Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete chat conversation.",
    });
  }
};

module.exports = {
  createChat,
  getMyChats,
  getChatById,
  saveMessage,
  updateChatTitle,
  deleteChat,
};
