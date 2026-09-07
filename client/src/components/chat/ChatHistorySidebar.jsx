import {
  Plus,
  MessageSquare,
  Trash2,
  X,
  Sparkles,
  Loader2,
  Edit2,
  Check,
} from "lucide-react";
import { useState } from "react";

function ChatHistorySidebar({
  chats = [],
  activeChatId,
  loading = false,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onRenameChat,
  onCloseMobile,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // Group chats chronologically into Today, Yesterday, Previous
  const groupChatsByDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const groups = {
      Today: [],
      Yesterday: [],
      Previous: [],
    };

    chats.forEach((chat) => {
      const chatDate = new Date(chat.updatedAt || chat.createdAt);
      chatDate.setHours(0, 0, 0, 0);

      if (chatDate.getTime() === today.getTime()) {
        groups.Today.push(chat);
      } else if (chatDate.getTime() === yesterday.getTime()) {
        groups.Yesterday.push(chat);
      } else {
        groups.Previous.push(chat);
      }
    });

    return groups;
  };

  const groups = groupChatsByDate();

  const handleStartRename = (e, chat) => {
    e.stopPropagation();
    setEditingId(chat._id);
    setEditingTitle(chat.title);
  };

  const handleSaveRename = async (e, chatId) => {
    e.stopPropagation();
    if (editingTitle.trim() && onRenameChat) {
      await onRenameChat(chatId, editingTitle.trim());
    }
    setEditingId(null);
  };

  const handleCancelRename = (e) => {
    e.stopPropagation();
    setEditingId(null);
    setEditingTitle("");
  };

  const handleDeleteClick = async (e, chatId) => {
    e.stopPropagation();
    setDeletingId(chatId);
    try {
      await onDeleteChat(chatId);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <aside className="flex h-full w-full flex-col bg-[#070707] text-white">
      {/* ================= SIDEBAR HEADER ================= */}
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00E5FF]/10 text-[#00E5FF]">
            <Sparkles size={16} />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-wide text-white">
              NexaTech AI
            </h2>
            <p className="text-[10px] uppercase tracking-widest text-[#00E5FF]">
              Chat History
            </p>
          </div>
        </div>

        {/* Mobile close button */}
        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-white/5 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* ================= NEW CHAT BUTTON ================= */}
      <div className="p-4">
        <button
          type="button"
          onClick={onNewChat}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#00E5FF]/40 bg-[#00E5FF]/10 py-3 text-sm font-semibold text-[#00E5FF] transition duration-200 hover:border-[#00E5FF] hover:bg-[#00E5FF] hover:text-black"
        >
          <Plus size={16} />
          <span>New Chat</span>
        </button>
      </div>

      {/* ================= CONVERSATION LIST ================= */}
      <div className="flex-1 space-y-5 overflow-y-auto px-3 pb-6">
        {loading && chats.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-gray-500">
            <Loader2 size={20} className="animate-spin text-[#00E5FF]" />
            <span className="ml-2 text-xs">Loading history...</span>
          </div>
        ) : chats.length === 0 ? (
          <div className="px-3 py-10 text-center">
            <MessageSquare size={24} className="mx-auto mb-2 text-gray-600" />
            <p className="text-xs text-gray-500">No previous chats yet</p>
            <p className="mt-1 text-[11px] text-gray-600">
              Start asking questions to see your history here.
            </p>
          </div>
        ) : (
          Object.entries(groups).map(([groupTitle, groupChats]) => {
            if (groupChats.length === 0) return null;

            return (
              <div key={groupTitle} className="space-y-1">
                <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  {groupTitle}
                </p>

                {groupChats.map((chat) => {
                  const isActive = chat._id === activeChatId;
                  const isEditing = editingId === chat._id;
                  const isDeleting = deletingId === chat._id;

                  return (
                    <div
                      key={chat._id}
                      onClick={() => onSelectChat(chat._id)}
                      className={`group relative flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-xs transition ${
                        isActive
                          ? "border border-[#00E5FF]/30 bg-[#00E5FF]/10 text-white font-medium shadow-[0_0_15px_rgba(0,229,255,0.08)]"
                          : "text-gray-400 hover:bg-white/[0.04] hover:text-gray-200"
                      }`}
                    >
                      {/* Left: icon + title */}
                      <div className="flex min-w-0 flex-1 items-center gap-2.5 pr-2">
                        <MessageSquare
                          size={14}
                          className={`shrink-0 ${
                            isActive ? "text-[#00E5FF]" : "text-gray-500 group-hover:text-gray-300"
                          }`}
                        />

                        {isEditing ? (
                          <input
                            type="text"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveRename(e, chat._id);
                              if (e.key === "Escape") handleCancelRename(e);
                            }}
                            autoFocus
                            className="min-w-0 flex-1 rounded border border-[#00E5FF]/60 bg-black/60 px-1.5 py-0.5 text-xs text-white outline-none"
                          />
                        ) : (
                          <span className="truncate" title={chat.title}>
                            {chat.title || "Untitled Chat"}
                          </span>
                        )}
                      </div>

                      {/* Right: action buttons */}
                      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 lg:opacity-0 lg:group-hover:opacity-100">
                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              onClick={(e) => handleSaveRename(e, chat._id)}
                              className="p-1 text-green-400 hover:text-green-300"
                              title="Save title"
                            >
                              <Check size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={handleCancelRename}
                              className="p-1 text-gray-400 hover:text-white"
                              title="Cancel"
                            >
                              <X size={13} />
                            </button>
                          </>
                        ) : (
                          <>
                            {onRenameChat && (
                              <button
                                type="button"
                                onClick={(e) => handleStartRename(e, chat)}
                                className="p-1 text-gray-500 transition hover:text-[#00E5FF]"
                                title="Rename chat"
                              >
                                <Edit2 size={12} />
                              </button>
                            )}
                            <button
                              type="button"
                              disabled={isDeleting}
                              onClick={(e) => handleDeleteClick(e, chat._id)}
                              className="p-1 text-gray-500 transition hover:text-red-400"
                              title="Delete chat"
                            >
                              {isDeleting ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : (
                                <Trash2 size={12} />
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })
        )}
      </div>

      {/* ================= FOOTER ================= */}
      <div className="border-t border-white/10 p-3 text-center text-[10px] text-gray-600">
        NexaTech Intelligence Suite
      </div>
    </aside>
  );
}

export default ChatHistorySidebar;
