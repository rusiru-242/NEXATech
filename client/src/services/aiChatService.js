/**
 * Service for interacting with the Express AI Chat History API.
 * Uses JWT stored in localStorage under 'nexatech_token'.
 */

const BACKEND_URL = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost:5000"
).replace(/\/+$/, "");

const getAuthHeaders = () => {
  const token = localStorage.getItem("nexatech_token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/**
 * Fetch all conversations for the authenticated user.
 */
export const getMyChats = async () => {
  const res = await fetch(`${BACKEND_URL}/api/ai-chats/my`, {
    headers: getAuthHeaders(),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to load chat history.");
  }
  return data.chats || [];
};

/**
 * Fetch a single full conversation by its ID.
 */
export const getChat = async (chatId) => {
  const res = await fetch(`${BACKEND_URL}/api/ai-chats/${chatId}`, {
    headers: getAuthHeaders(),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to load conversation.");
  }
  return data.chat;
};

/**
 * Create a new empty conversation.
 */
export const createChat = async () => {
  const res = await fetch(`${BACKEND_URL}/api/ai-chats`, {
    method: "POST",
    headers: getAuthHeaders(),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to create new chat.");
  }
  return data.chat;
};

/**
 * Append a message (user or bot with products) to the specified conversation.
 */
export const saveMessage = async (chatId, { sender, text, products = [] }) => {
  const res = await fetch(`${BACKEND_URL}/api/ai-chats/${chatId}/messages`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      sender,
      text,
      products,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to save message.");
  }
  return data.chat;
};

/**
 * Update/rename the title of a conversation.
 */
export const updateChatTitle = async (chatId, title) => {
  const res = await fetch(`${BACKEND_URL}/api/ai-chats/${chatId}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ title }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to rename chat.");
  }
  return data.chat;
};

/**
 * Delete a conversation.
 */
export const deleteChat = async (chatId) => {
  const res = await fetch(`${BACKEND_URL}/api/ai-chats/${chatId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to delete chat.");
  }
  return data;
};
