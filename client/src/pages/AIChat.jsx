import {
  Bot,
  Send,
  Sparkles,
  User,
  Loader2,
  ExternalLink,
  History,
  Plus,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import Navbar from "../components/Navbar";
import ChatHistorySidebar from "../components/chat/ChatHistorySidebar";
import {
  getMyChats,
  getChat,
  createChat,
  saveMessage,
  deleteChat,
  updateChatTitle,
} from "../services/aiChatService";

// In production, AI requests route through Node proxy at /api/ai/chat (FastAPI port 8000 is internal)
// In local dev without proxy, VITE_AI_API_URL points directly to FastAPI on localhost:8000
const API_URL = import.meta.env.VITE_API_URL || "";
const AI_API_URL =
  import.meta.env.VITE_AI_API_URL
    ? import.meta.env.VITE_AI_API_URL
    : `${API_URL}/api/ai`;

const INITIAL_WELCOME_MESSAGE = {
  id: "welcome-1",
  sender: "bot",
  text: "Hi! I'm NexaTech AI. Tell me your budget and what type of product you need, and I'll help you find the best option.",
  products: [],
};

function AIChat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([INITIAL_WELCOME_MESSAGE]);
  const [loading, setLoading] = useState(false);

  // Chat history persistence states
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [activeChatTitle, setActiveChatTitle] = useState("");
  const [sidebarLoading, setSidebarLoading] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  // =========================================================
  // AUTH CHECK & INITIAL LOAD
  // =========================================================

  useEffect(() => {
    const token = localStorage.getItem("nexatech_token");

    if (!token) {
      navigate("/login");
      return;
    }

    loadInitialChatHistory();
  }, [navigate]);

  // =========================================================
  // LOAD CHATS FROM MONGODB
  // =========================================================

  const loadInitialChatHistory = async () => {
    setSidebarLoading(true);
    try {
      const userChats = await getMyChats();
      setChats(userChats);

      // If user has previous conversations, automatically load the latest one
      if (userChats.length > 0) {
        await handleSelectChat(userChats[0]._id, false);
      } else {
        // Fresh start
        setActiveChatId(null);
        setActiveChatTitle("New Chat");
        setMessages([INITIAL_WELCOME_MESSAGE]);
      }
    } catch (error) {
      console.error("Failed to load chat history:", error);
    } finally {
      setSidebarLoading(false);
    }
  };

  const refreshChatList = async () => {
    try {
      const userChats = await getMyChats();
      setChats(userChats);
    } catch (error) {
      console.error("Failed to refresh chat list:", error);
    }
  };

  // =========================================================
  // SWITCH CONVERSATION
  // =========================================================

  const handleSelectChat = async (chatId, closeMobile = true) => {
    if (closeMobile) {
      setMobileSidebarOpen(false);
    }

    try {
      const fullChat = await getChat(chatId);
      if (fullChat) {
        setActiveChatId(fullChat._id);
        setActiveChatTitle(fullChat.title || "NexaTech Assistant");

        if (fullChat.messages && fullChat.messages.length > 0) {
          const formatted = fullChat.messages.map((m, idx) => ({
            id: m._id || `${fullChat._id}-${idx}`,
            sender: m.sender,
            text: m.text,
            products: Array.isArray(m.products) ? m.products : [],
            createdAt: m.createdAt,
          }));
          setMessages(formatted);
        } else {
          setMessages([INITIAL_WELCOME_MESSAGE]);
        }
      }
    } catch (error) {
      console.error("Failed to load conversation:", error);
    }
  };

  // =========================================================
  // NEW CHAT ACTION
  // =========================================================

  const handleNewChat = () => {
    setActiveChatId(null);
    setActiveChatTitle("New Chat");
    setMessages([INITIAL_WELCOME_MESSAGE]);
    setMobileSidebarOpen(false);
  };

  // =========================================================
  // DELETE CHAT
  // =========================================================

  const handleDeleteChat = async (chatId) => {
    try {
      await deleteChat(chatId);

      const remaining = chats.filter((c) => c._id !== chatId);
      setChats(remaining);

      // If the currently open chat was deleted
      if (activeChatId === chatId) {
        if (remaining.length > 0) {
          await handleSelectChat(remaining[0]._id, false);
        } else {
          handleNewChat();
        }
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

  // =========================================================
  // RENAME CHAT
  // =========================================================

  const handleRenameChat = async (chatId, newTitle) => {
    try {
      await updateChatTitle(chatId, newTitle);
      setChats((prev) =>
        prev.map((c) =>
          c._id === chatId ? { ...c, title: newTitle } : c
        )
      );
      if (activeChatId === chatId) {
        setActiveChatTitle(newTitle);
      }
    } catch (error) {
      console.error("Failed to rename chat:", error);
    }
  };

  // =========================================================
  // AUTO SCROLL
  // =========================================================

  useEffect(() => {
    const timeout = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 100);
    return () => clearTimeout(timeout);
  }, [messages, loading]);

  // =========================================================
  // SUGGESTIONS
  // =========================================================

  const suggestedQuestions = [
    "I need a gaming laptop under Rs. 300000",
    "Recommend a smartphone with a good camera",
    "Which headphones are best under Rs. 30000?",
    "Intel or Ryzen is best for video editing?",
  ];

  // =========================================================
  // SEND MESSAGE
  // =========================================================

  const sendMessage = async (text) => {
    const trimmedMessage = text.trim();

    if (!trimmedMessage || loading) {
      return;
    }

    // 1. Render user message in UI immediately
    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: trimmedMessage,
      products: [],
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    let currentChatId = activeChatId;

    try {
      // 2. Ensure an active conversation exists in Express MongoDB
      if (!currentChatId) {
        const newChat = await createChat();
        currentChatId = newChat._id;
        setActiveChatId(newChat._id);
        setActiveChatTitle(newChat.title || "New Chat");
      }

      // 3. Save USER message to Express backend
      try {
        await saveMessage(currentChatId, {
          sender: "user",
          text: trimmedMessage,
        });
      } catch (saveUserErr) {
        console.error("Failed to persist user message:", saveUserErr);
        // Do not silently lose user message if backend save fails
        throw new Error("Failed to save your message. Please check your connection.");
      }

      // 4. Send query to FastAPI AI microservice
      const token = localStorage.getItem("nexatech_token");

      let aiResponse;
      try {
        aiResponse = await fetch(`${AI_API_URL}/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && {
              Authorization: `Bearer ${token}`,
            }),
          },
          body: JSON.stringify({
            message: trimmedMessage,
          }),
        });
      } catch (fetchErr) {
        console.error("Network error reaching AI service:", fetchErr);
        throw new Error("NexaTech AI is temporarily unavailable. Please try again.");
      }

      let data;
      try {
        data = await aiResponse.json();
      } catch {
        throw new Error("NexaTech AI is temporarily unavailable. Please try again.");
      }

      if (!aiResponse.ok || !data.success) {
        throw new Error(
          data.message ||
          data.detail ||
          "NexaTech AI is temporarily unavailable. Please try again."
        );
      }

      const botReply =
        data.reply || "I couldn't generate a recommendation.";
      const botProducts = Array.isArray(data.products)
        ? data.products
        : [];

      // 5. Display AI response in UI
      const botMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text: botReply,
        products: botProducts,
      };

      setMessages((prev) => [...prev, botMessage]);

      // 6. Save BOT response to Express backend
      try {
        await saveMessage(currentChatId, {
          sender: "bot",
          text: botReply,
          products: botProducts,
        });
      } catch (saveBotErr) {
        console.warn("Safe persistence warning: Failed to save bot response to MongoDB:", saveBotErr);
      }

      // 7. Refresh sidebar to reflect latest conversation order & updated auto-title
      await refreshChatList();
    } catch (error) {
      console.error("NexaTech AI error:", error);

      const errorMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text:
          error.message ||
          "NexaTech AI is temporarily unavailable. Please try again.",
        products: [],
        isError: true,
      };

      setMessages((prev) => [...prev, errorMessage]);

      // Refresh sidebar list in case user message was saved before error
      await refreshChatList();
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // FORM SUBMIT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendMessage(message);
  };

  // =========================================================
  // SUGGESTION CLICK
  // =========================================================

  const handleSuggestion = (question) => {
    setMessage(question);
  };

  // =========================================================
  // PRODUCT PAGE NAVIGATION
  // =========================================================

  const handleViewProduct = (product) => {
    const productId =
      product._id ||
      product.id ||
      product.productId;

    if (!productId) {
      return;
    }

    navigate(`/products/${productId}`);
  };

  // =========================================================
  // FORMAT PRICE
  // =========================================================

  const formatPrice = (price) => {
    const numericPrice = Number(price);

    if (Number.isNaN(numericPrice)) {
      return "Price unavailable";
    }

    return `Rs. ${numericPrice.toLocaleString("en-US")}`;
  };

  // =========================================================
  // FORMAT INLINE MARKDOWN
  // =========================================================

  const formatInlineText = (text) => {
    if (!text) {
      return null;
    }

    const parts = text.split(/(\*\*.*?\*\*)/g);

    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="font-semibold text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }

      return <span key={index}>{part}</span>;
    });
  };

  // =========================================================
  // FORMAT AI RESPONSE
  // =========================================================

  const renderAIResponse = (text) => {
    if (!text) {
      return null;
    }

    const lines = text.split("\n");

    return lines.map((line, index) => {
      const trimmed = line.trim();

      if (!trimmed) {
        return <div key={index} className="h-2" />;
      }

      if (trimmed.startsWith("### ")) {
        const title = trimmed.replace(/^###\s*/, "");
        return (
          <h4
            key={index}
            className="mb-1 mt-3 text-sm font-semibold text-[#00E5FF]"
          >
            {formatInlineText(title)}
          </h4>
        );
      }

      if (trimmed.startsWith("## ")) {
        const title = trimmed.replace(/^##\s*/, "");
        return (
          <h3
            key={index}
            className="mb-2 mt-4 text-base font-bold text-white"
          >
            {formatInlineText(title)}
          </h3>
        );
      }

      if (trimmed.startsWith("# ")) {
        const title = trimmed.replace(/^#\s*/, "");
        return (
          <h2
            key={index}
            className="mb-2 mt-4 text-lg font-bold text-[#00E5FF]"
          >
            {formatInlineText(title)}
          </h2>
        );
      }

      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const content = trimmed.substring(2);
        return (
          <div key={index} className="my-1.5 flex items-start gap-2.5">
            <span className="mt-[1px] shrink-0 text-[#00E5FF]">•</span>
            <span className="text-sm leading-6 text-gray-300">
              {formatInlineText(content)}
            </span>
          </div>
        );
      }

      if (/^\d+\.\s/.test(trimmed)) {
        const match = trimmed.match(/^(\d+)\.\s(.*)/);
        if (match) {
          return (
            <div key={index} className="my-1.5 flex items-start gap-2.5">
              <span className="shrink-0 font-semibold text-[#00E5FF]">
                {match[1]}.
              </span>
              <span className="text-sm leading-6 text-gray-300">
                {formatInlineText(match[2])}
              </span>
            </div>
          );
        }
      }

      if (trimmed.startsWith("> ")) {
        const content = trimmed.substring(2);
        return (
          <div
            key={index}
            className="my-3 border-l-2 border-[#00E5FF]/50 pl-3 text-sm italic leading-6 text-gray-400"
          >
            {formatInlineText(content)}
          </div>
        );
      }

      return (
        <p key={index} className="my-1 text-sm leading-6 text-gray-300">
          {formatInlineText(trimmed)}
        </p>
      );
    });
  };

  // =========================================================
  // UI LAYOUT
  // =========================================================

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-[#050505] text-white">
      {/* Background Video */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover opacity-40"
          src="/videos/neural_network.mp4"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/90 via-[#050505]/70 to-[#050505]" />
      </div>

      {/* ================= NAVBAR ================= */}
      <div className="relative z-20 shrink-0">
        <Navbar />
      </div>

      {/* ================= MOBILE SLIDE-OVER BACKDROP ================= */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* ================= MOBILE SLIDE-OVER DRAWER ================= */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-[#070707] shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <ChatHistorySidebar
          chats={chats}
          activeChatId={activeChatId}
          loading={sidebarLoading}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
          onRenameChat={handleRenameChat}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />
      </div>

      {/* ================= MAIN SPLIT-PANE ================= */}
      <motion.main
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 overflow-hidden px-4 py-4 sm:px-6 sm:py-6 lg:gap-6"
      >
        {/* ================= DESKTOP SIDEBAR ================= */}
        <div className="hidden w-72 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-[#070707] lg:block">
          <ChatHistorySidebar
            chats={chats}
            activeChatId={activeChatId}
            loading={sidebarLoading}
            onSelectChat={handleSelectChat}
            onNewChat={handleNewChat}
            onDeleteChat={handleDeleteChat}
            onRenameChat={handleRenameChat}
          />
        </div>

        {/* ================= CHAT CONVERSATION CONTAINER ================= */}
        <section className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/50 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          {/* ================= CHAT HEADER ================= */}
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              {/* Mobile open history button */}
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-300 transition hover:border-[#00E5FF]/40 hover:text-[#00E5FF] lg:hidden"
                title="Open Chat History"
              >
                <History size={18} />
              </button>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00E5FF]/10 text-[#00E5FF]">
                <Bot size={21} />
              </div>

              <div>
                <h2 className="text-sm font-semibold sm:text-base">
                  {activeChatTitle || "NexaTech Assistant"}
                </h2>
                <p className="text-xs text-gray-500">
                  AI Technology & Shopping Assistant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* New chat button for quick access */}
              <button
                type="button"
                onClick={handleNewChat}
                className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-gray-300 transition hover:border-[#00E5FF]/40 hover:text-[#00E5FF]"
                title="Start new conversation"
              >
                <Plus size={13} />
                <span className="hidden sm:inline">New Chat</span>
              </button>

              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-gray-400">
                <span className="h-2 w-2 rounded-full bg-green-400" />
                <span className="hidden sm:inline">AI Online</span>
              </div>
            </div>
          </div>

          {/* ================= MESSAGES FEED ================= */}
          <div className="flex-1 space-y-6 overflow-y-auto p-4 sm:p-6">
            {messages.map((item) => (
              <div
                key={item.id}
                className={`flex gap-3 ${item.sender === "user" ? "justify-end" : "justify-start"
                  }`}
              >
                {/* BOT ICON */}
                {item.sender === "bot" && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#00E5FF]/10 text-[#00E5FF]">
                    <Bot size={18} />
                  </div>
                )}

                <div
                  className={`flex max-w-[85%] flex-col ${item.sender === "user" ? "items-end" : "items-start"
                    }`}
                >
                  {/* MESSAGE BUBBLE */}
                  <div
                    className={`max-w-full rounded-2xl px-4 py-3 text-sm leading-6 ${item.sender === "user"
                      ? "bg-[#00E5FF] text-black font-medium"
                      : item.isError
                        ? "border border-red-500/20 bg-red-500/5 text-red-300"
                        : "bg-white/[0.06] text-gray-300"
                      }`}
                  >
                    {item.sender === "bot"
                      ? renderAIResponse(item.text)
                      : item.text}
                  </div>

                  {/* RECOMMENDED PRODUCTS CARDS */}
                  {item.sender === "bot" && item.products?.length > 0 && (
                    <div className="mt-4 grid w-full gap-3 sm:grid-cols-2">
                      {item.products.map((product, index) => {
                        const productId =
                          product._id ||
                          product.id ||
                          product.productId ||
                          index;

                        return (
                          <div
                            key={productId}
                            className="overflow-hidden rounded-xl border border-white/10 bg-[#090909] transition hover:border-[#00E5FF]/30"
                          >
                            {/* PRODUCT IMAGE */}
                            {product.image && (
                              <div className="flex h-36 items-center justify-center overflow-hidden bg-white/[0.02]">
                                <img
                                  src={product.image}
                                  alt={product.name || "Product"}
                                  className="h-full w-full object-contain p-4"
                                />
                              </div>
                            )}

                            {/* PRODUCT INFO */}
                            <div className="p-4">
                              {product.brand && (
                                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#00E5FF]">
                                  {product.brand}
                                </p>
                              )}

                              <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-white">
                                {product.name || "Product"}
                              </h3>

                              <p className="mt-3 text-base font-bold text-white">
                                {formatPrice(product.price)}
                              </p>

                              <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] text-gray-500">
                                {product.rating !== undefined && (
                                  <span>★ {product.rating}</span>
                                )}

                                {product.stock !== undefined && (
                                  <span
                                    className={
                                      Number(product.stock) > 0
                                        ? "text-green-400"
                                        : "text-red-400"
                                    }
                                  >
                                    {Number(product.stock) > 0
                                      ? `${product.stock} in stock`
                                      : "Out of stock"}
                                  </span>
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={() => handleViewProduct(product)}
                                className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#00E5FF] text-xs font-bold text-black transition hover:bg-white"
                              >
                                View Product
                                <ExternalLink size={13} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* USER ICON */}
                {item.sender === "user" && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-gray-300">
                    <User size={18} />
                  </div>
                )}
              </div>
            ))}

            {/* LOADING INDICATOR */}
            {loading && (
              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#00E5FF]/10 text-[#00E5FF]">
                  <Bot size={18} />
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-white/[0.06] px-4 py-3 text-sm text-gray-400">
                  <Loader2
                    size={16}
                    className="animate-spin text-[#00E5FF]"
                  />
                  Thinking and searching NexaTech...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ================= SUGGESTIONS ================= */}
          <div className="border-t border-white/10 px-5 py-4 sm:px-6">
            <p className="mb-2.5 text-[10px] uppercase tracking-[0.15em] text-gray-500">
              Suggested Questions
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  disabled={loading}
                  onClick={() => handleSuggestion(question)}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs text-gray-400 transition hover:border-[#00E5FF]/40 hover:text-[#00E5FF] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* ================= INPUT FORM ================= */}
          <form onSubmit={handleSubmit} className="border-t border-white/10 p-4 sm:p-5">
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 p-2 transition focus-within:border-[#00E5FF]/40">
              <input
                type="text"
                value={message}
                disabled={loading}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about laptops, specs, Intel vs Ryzen, or recommend products..."
                className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-gray-600 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={!message.trim() || loading}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#00E5FF] text-black transition hover:bg-[#00cce6] disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Send message"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>
          </form>
        </section>
      </motion.main>
    </div>
  );
}

export default AIChat;