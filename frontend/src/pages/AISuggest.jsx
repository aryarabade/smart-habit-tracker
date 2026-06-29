import { useState } from "react";
import toast from "react-hot-toast";
import API from "../services/api"; // ← uses your axios instance with baseURL + auth header

const goalOptions = [
  { label: "💪 Fitness",       value: "fitness" },
  { label: "😴 Sleep",         value: "sleep" },
  { label: "📚 Study",         value: "study" },
  { label: "💧 Water",         value: "water" },
  { label: "🧘 Mental Health", value: "mental health" },
  { label: "⚡ Productivity",  value: "productivity" },
  { label: "🥗 Nutrition",     value: "nutrition" },
  { label: "⚖️ Weight Loss",   value: "weight loss" },
];

export default function AISuggest() {
  const [goals,       setGoals]       = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");

  const toggleGoal = (g) =>
    setGoals(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);

  const getSuggestions = async () => {
    if (!goals.length) return toast.error("Pick at least one goal first!");
    setLoading(true);
    setError("");
    setSuggestions([]);

    try {
      const { data } = await API.post("/ai/suggest", { goals });

      if (!data.suggestions || data.suggestions.length === 0) {
        setError("No suggestions returned. Try different goals.");
        return;
      }
      setSuggestions(data.suggestions);
      toast.success(`Got ${data.suggestions.length} habit suggestions! 🌱`);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Request failed";
      console.error("AI Suggest error:", msg);
      setError(`Error: ${msg}`);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-topbar">
        <div>
          <h1 className="page-title">💡 AI Suggestions</h1>
          <p className="page-date">Get personalized habit recommendations from Grok AI</p>
        </div>
      </div>

      {/* Goal selector */}
      <div className="form-card">
        <h3 className="form-title">What are your goals?</h3>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 14 }}>
          Select one or more goals — AI will suggest 3 habits tailored to them.
        </p>
        <div className="goal-grid">
          {goalOptions.map(g => (
            <button
              key={g.value}
              className={`goal-btn ${goals.includes(g.value) ? "selected" : ""}`}
              onClick={() => toggleGoal(g.value)}
            >
              {g.label}
            </button>
          ))}
        </div>

        {goals.length > 0 && (
          <p style={{ fontSize: 12, color: "var(--green-600)", marginTop: 10 }}>
            Selected: {goals.join(", ")}
          </p>
        )}

        <button
          className="btn-green"
          onClick={getSuggestions}
          disabled={loading || !goals.length}
          style={{ marginTop: 16 }}
        >
          {loading ? "🤔 Thinking..." : "Get Suggestions 💡"}
        </button>

        {error && (
          <div className="ai-error-box">
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="section">
          <h2 className="section-title">✨ Generating habits...</h2>
          <div className="loading-rows">
            {[1, 2, 3].map(i => <div key={i} className="skeleton-row" />)}
          </div>
        </div>
      )}

      {/* Results */}
      {!loading && suggestions.length > 0 && (
        <div className="section">
          <div className="section-header">
            <h2 className="section-title">✨ Recommended Habits</h2>
            <span className="badge-green">{suggestions.length} suggestions</span>
          </div>
          <div className="suggest-list">
            {suggestions.map((s, i) => (
              <div key={i} className="suggest-card">
                <div className="suggest-icon">{s.icon || "🌿"}</div>
                <div className="suggest-body">
                  <div className="suggest-name">{s.name}</div>
                  <div className="suggest-cat">{s.category}</div>
                  <div className="suggest-reason">{s.reason}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
