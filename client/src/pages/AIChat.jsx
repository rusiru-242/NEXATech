import {
  Bot,
  Send,
  Sparkles,
  User,
} from "lucide-react";

import { useState } from "react";

import Navbar from "../components/Navbar";

function AIChat() {
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hi! I'm NexaTech AI. How can I help you find the right technology product today?",
    },
  ]);

  const suggestedQuestions = [
    "Which laptop is best for gaming?",
    "Recommend a smartphone under my budget",
    "Which headphones should I buy?",
    "Help me choose a laptop for university",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return;
    }

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: trimmedMessage,
    };

    setMessages((prev) => [...prev, userMessage]);

    setMessage("");

    // AI backend integration will be added here later.
    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text: "Thanks! I'm currently being connected to the NexaTech AI service. Soon I'll be able to recommend products based on your requirements.",
      };

      setMessages((prev) => [...prev, botMessage]);
    }, 500);
  };

  const handleSuggestion = (question) => {
    setMessage(question);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">

      {/* Navbar */}
      <Navbar />

      {/* Main */}
      <main className="mx-auto max-w-5xl px-6 py-10 sm:py-12">

        {/* Header */}
        <section className="mb-10 text-center">

          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#00E5FF]/10 text-[#00E5FF]">
            <Sparkles size={32} />
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#00E5FF]">
            NexaTech AI
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            Ask AI
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-gray-400">
            Get smart assistance when choosing your next technology product.
          </p>

        </section>

        {/* Chat Box */}
        <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">

          {/* Chat Header */}
          <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00E5FF]/10 text-[#00E5FF]">
              <Bot size={21} />
            </div>

            <div>
              <h2 className="font-semibold">
                NexaTech Assistant
              </h2>

              <p className="text-xs text-gray-500">
                AI Product Assistant
              </p>
            </div>

          </div>

          {/* Messages */}
          <div className="min-h-[400px] space-y-5 p-6">

            {messages.map((item) => (

              <div
                key={item.id}
                className={`flex gap-3 ${
                  item.sender === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >

                {item.sender === "bot" && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#00E5FF]/10 text-[#00E5FF]">
                    <Bot size={18} />
                  </div>
                )}

                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    item.sender === "user"
                      ? "bg-[#00E5FF] text-black"
                      : "bg-white/[0.06] text-gray-300"
                  }`}
                >
                  {item.text}
                </div>

                {item.sender === "user" && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-gray-300">
                    <User size={18} />
                  </div>
                )}

              </div>

            ))}

          </div>

          {/* Suggestions */}
          <div className="border-t border-white/10 px-6 py-5">

            <p className="mb-3 text-xs uppercase tracking-[0.15em] text-gray-500">
              Suggested Questions
            </p>

            <div className="flex flex-wrap gap-2">

              {suggestedQuestions.map((question) => (

                <button
                  key={question}
                  type="button"
                  onClick={() => handleSuggestion(question)}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-gray-400 transition hover:border-[#00E5FF]/40 hover:text-[#00E5FF]"
                >
                  {question}
                </button>

              ))}

            </div>

          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-white/10 p-5"
          >

            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 p-2">

              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about laptops, phones, headphones..."
                className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-gray-600"
              />

              <button
                type="submit"
                disabled={!message.trim()}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#00E5FF] text-black transition hover:bg-[#00cce6] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send size={18} />
              </button>

            </div>

          </form>

        </section>

      </main>

    </div>
  );
}

export default AIChat;