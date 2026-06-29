import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import API from "../services/api"; // ← uses your axios instance with baseURL + auth header

export default function AIChat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I'm your AI habit coach 🤖 Ask me anything about building better habits, staying motivated, or your progress!",
    },
  ]);
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const msg = input.trim();
    if (!msg || loading) return;

    const userMsg = { role: "user", text: msg };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Build history in the format the backend expects: [{role, content}]
      const history = messages.map(m => ({
        role:    m.role === "assistant" ? "assistant" : "user",
        content: m.text,
      }));

      // Use your API axios instance — it already has baseURL + token header
      const { data } = await API.post("/ai/chat", { message: msg, history });

      setMessages(prev => [
        ...prev,
        { role: "assistant", text: data.reply || "I couldn't generate a response. Try again!" },
      ]);
    } catch (err) {
      // Show the real error from backend so you can debug
      const errMsg = err.response?.data?.message || err.message || "Connection failed";
      console.error("AI Chat error:", errMsg);
      toast.error(`AI Error: ${errMsg}`);
      setMessages(prev => [
        ...prev,
        { role: "assistant", text: `⚠️ Error: ${errMsg}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const quickPrompts = [
    "How do I build a morning routine?",
    "I keep skipping my workout 😔",
    "Tips to drink more water daily",
    "How long to build a new habit?",
  ];

  return (
    <div className="page">
      <div className="page-topbar">
        <div>
          <h1 className="page-title">🤖 AI Coach</h1>
          <p className="page-date">Your personal habit coach, powered by Grok AI</p>
        </div>
      </div>

      {/* Quick prompt chips */}
      {messages.length <= 1 && (
        <div className="quick-prompts">
          {quickPrompts.map((p, i) => (
            <button
              key={i}
              className="quick-prompt-chip"
              onClick={() => { setInput(p); }}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <div className="chat-shell">
        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`chat-bubble ${m.role === "user" ? "user" : "bot"}`}>
              {m.role === "assistant" && (
                <div className="bot-avatar">🤖</div>
              )}
              <div className="bubble-text">{m.text}</div>
            </div>
          ))}

          {loading && (
            <div className="chat-bubble bot">
              <div className="bot-avatar">🤖</div>
              <div className="bubble-text typing">
                <span /><span /><span />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="chat-input-row">
          <textarea
            className="chat-input"
            rows={1}
            placeholder="Ask your AI coach anything... (Enter to send)"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
          />
          <button
            className="btn-green chat-send"
            onClick={send}
            disabled={loading || !input.trim()}
          >
            {loading ? "..." : "Send ➤"}
          </button>
        </div>
      </div>
    </div>
  );
}
