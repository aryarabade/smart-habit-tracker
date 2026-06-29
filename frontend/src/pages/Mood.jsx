import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const API   = "http://localhost:5000/api/mood";
const token = () => localStorage.getItem("token");

const moods = [
  { emoji: "😄", label: "Great",   value: "great",   color: "#22c55e" },
  { emoji: "🙂", label: "Good",    value: "good",    color: "#86efac" },
  { emoji: "😐", label: "Okay",    value: "okay",    color: "#fbbf24" },
  { emoji: "😔", label: "Low",     value: "low",     color: "#f87171" },
  { emoji: "😢", label: "Awful",   value: "awful",   color: "#ef4444" },
];

export default function Mood() {
  const [selected,  setSelected]  = useState(null);
  const [journal,   setJournal]   = useState("");
  const [todayMood, setTodayMood] = useState(null);
  const [history,   setHistory]   = useState([]);
  const [saving,    setSaving]    = useState(false);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token()}` };
    fetch(`${API}/today`, { headers })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setTodayMood(d); })
      .catch(() => {});

    fetch(API, { headers })
      .then(r => r.json())
      .then(setHistory)
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    if (!selected) return toast.error("Pick a mood first");
    setSaving(true);
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ mood: selected.value, emoji: selected.emoji, journal }),
      });
      const data = await res.json();
      setTodayMood(data);
      toast.success("Mood logged! 😊");
    } catch {
      toast.error("Could not save mood");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <div className="page-topbar">
        <div>
          <h1 className="page-title">😊 Daily Mood</h1>
          <p className="page-date">How are you feeling today?</p>
        </div>
      </div>

      {todayMood ? (
        <div className="mood-logged-card">
          <div className="mood-logged-emoji">{todayMood.emoji}</div>
          <div className="mood-logged-text">
            <strong>Today's mood logged:</strong> {todayMood.mood}
          </div>
          {todayMood.journal && (
            <p className="mood-journal-preview">"{todayMood.journal}"</p>
          )}
        </div>
      ) : (
        <div className="form-card">
          <h3 className="form-title">How are you feeling?</h3>
          <div className="mood-picker">
            {moods.map(m => (
              <button
                key={m.value}
                className={`mood-btn ${selected?.value === m.value ? "mood-selected" : ""}`}
                style={{ "--mood-color": m.color }}
                onClick={() => setSelected(m)}
              >
                <span className="mood-emoji">{m.emoji}</span>
                <span className="mood-label">{m.label}</span>
              </button>
            ))}
          </div>
          <textarea
            className="input-green"
            rows={3}
            placeholder="Optional: Write a few thoughts about your day..."
            value={journal}
            onChange={e => setJournal(e.target.value)}
            style={{ resize: "vertical", marginTop: 16 }}
          />
          <button className="btn-green" onClick={handleSave} disabled={saving} style={{ marginTop: 12 }}>
            {saving ? "Saving..." : "Log Mood"}
          </button>
        </div>
      )}

      {history.length > 0 && (
        <div className="section">
          <h2 className="section-title">📅 Mood History</h2>
          <div className="mood-history">
            {history.slice(0, 10).map((m, i) => (
              <div key={i} className="mood-history-row">
                <span className="mood-history-emoji">{m.emoji}</span>
                <span className="mood-history-label">{m.mood}</span>
                <span className="mood-history-date">
                  {new Date(m.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
