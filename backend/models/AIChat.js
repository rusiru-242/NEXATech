const mongoose = require("mongoose");

const aiChatProductSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.Mixed,
    },
    _id: {
      type: mongoose.Schema.Types.Mixed,
    },
    name: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      default: "",
    },
    brand: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const aiChatMessageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ["user", "bot"],
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  products: [aiChatProductSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const aiChatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: "New Chat",
      trim: true,
    },
    messages: [aiChatMessageSchema],
  },
  {
    timestamps: true,
  }
);

// Index to quickly list user chats sorted by latest updated
aiChatSchema.index({ user: 1, updatedAt: -1 });

const AIChat = mongoose.model("AIChat", aiChatSchema);

module.exports = AIChat;
