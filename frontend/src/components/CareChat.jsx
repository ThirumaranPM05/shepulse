import { useState } from "react";
import { api } from "../api/api.js";

export default function CareChat({ profileId }) {
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [chat, setChat] = useState([
    { from: "bot", text: "Hi 👋 I'm CareChat 💗 How are you feeling today?" },
  ]);

  async function sendMessage() {
    // 🔒 prevent double send
    if (loading) return;

    if (!profileId) {
      setChat((prev) => [
        ...prev,
        {
          from: "bot",
          text: "⚠️ Profile not found. Please complete setup first.",
        },
      ]);
      return;
    }

    const text = msg.trim();
    if (!text) return;

    // push user message
    setChat((prev) => [...prev, { from: "user", text }]);
    setMsg("");
    setLoading(true);

    try {
      const res = await api.post("/chat/", {
        profile_id: profileId,
        message: text,
      });

      const reply =
        typeof res.data?.reply === "string" && res.data.reply.trim()
          ? res.data.reply
          : "🤍 I'm here with you. Can you tell me a bit more?";

      setChat((prev) => [...prev, { from: "bot", text: reply }]);
    } catch (e) {
      console.error("Chat error:", e);

      setChat((prev) => [
        ...prev,
        {
          from: "bot",
          text:
            "❌ CareChat is temporarily unavailable.\n" +
            "Please check backend status or API key.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-pink-500/20 bg-[#2a0016]/60 backdrop-blur-xl p-5 w-full shadow-[0_0_35px_rgba(255,0,110,0.15)]">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-pink-50 flex items-center gap-2">
            Care Chat 💬
          </h2>
          <p className="text-pink-100/80 text-sm mt-1">
            AI support based on cycle + check-in + risk
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-xs text-pink-100">
          {loading ? "Thinking…" : "AI"}
        </span>
      </div>

      {/* Chat area */}
      <div className="mt-4 rounded-2xl bg-[#16000c]/60 border border-pink-500/15 p-4">
        {/* Status */}
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold text-pink-50">CareChat 💗</div>
          <div className="text-xs text-emerald-300 font-medium">● Online</div>
        </div>

        {/* Messages */}
        <div className="h-56 overflow-y-auto rounded-xl space-y-2 pr-1">
          {chat.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                m.from === "user"
                  ? "ml-auto bg-[#ff006e] text-white shadow-md"
                  : "bg-[#ff85c2]/15 border border-[#ff85c2]/25 text-pink-50"
              }`}
            >
              {m.text}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="mt-4 flex gap-2">
          <input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-xl bg-[#12000a]/70 border border-pink-500/20 px-4 py-2 text-pink-50 placeholder:text-pink-200/40 outline-none focus:border-pink-400"
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            className={`px-6 py-2 rounded-xl font-semibold shadow-lg transition ${
              loading
                ? "bg-pink-400/40 cursor-not-allowed"
                : "bg-[#ff006e] hover:bg-[#ff4da6] text-white shadow-pink-500/30"
            }`}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
