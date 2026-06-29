import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";

// ── Mock service calls — replace with your real axios services ──────────────
const fetchHabits = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:5000/api/habits", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch habits");
  return res.json();
};

const fetchPendingReminders = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:5000/api/notifications/pending", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to load reminders");
  return res.json();
};

const deleteReminder = async (id) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`http://localhost:5000/api/notifications/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to dismiss reminder");
  return res.json();
};

const markComplete = async (id) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`http://localhost:5000/api/habits/${id}/complete`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to complete habit");
  return res.json();
};

// ── Motivational quotes ────────────────────────────────────────────────────
const quotes = [
  "Small steps every day create massive change over time.",
  "A habit is a decision you no longer have to make.",
  "Discipline is just choosing between what you want now and what you want most.",
  "Don't break the chain. One day at a time.",
  "The secret of getting ahead is getting started.",
];

// ── Dashboard ───────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [habits, setHabits]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [quote]               = useState(quotes[Math.floor(Math.random() * quotes.length)]);

  const hour     = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const dateStr  = new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long",
  });

  const [pendingReminders, setPendingReminders] = useState([]);

  useEffect(() => {
    fetchHabits()
      .then(setHabits)
      .catch(() => toast.error("Could not load habits"))
      .finally(() => setLoading(false));

    fetchPendingReminders()
      .then((data) => {
        if (Array.isArray(data)) setPendingReminders(data);
      })
      .catch(() => {
        // silently ignore pending reminder load failures
      });
  }, []);

  const handleDismissReminder = async (id) => {
    try {
      await deleteReminder(id);
      setPendingReminders((prev) => prev.filter((reminder) => reminder._id !== id));
      toast.success("Reminder dismissed");
    } catch {
      toast.error("Could not dismiss reminder");
    }
  };

  const handleComplete = async (id) => {
    try {
      await markComplete(id);
      setHabits(prev =>
        prev.map(h => h._id === id ? { ...h, completedToday: true } : h)
      );
      confetti({ particleCount: 80, spread: 70, colors: ["#22c55e","#16a34a","#bbf7d0"] });
      toast.success("Habit done! Keep going 🎉");
    } catch {
      toast.error("Couldn't mark habit. Try again.");
    }
  };

  const done    = habits.filter(h => h.completedToday).length;
  const total   = habits.length;
  const pct     = total ? Math.round((done / total) * 100) : 0;
  const bestStreak = Math.max(0, ...habits.map(h => h.streak || 0));

  return (
    <div className="page">
      {/* ── Top bar ── */}
      <div className="page-topbar">
        <div>
          <h1 className="page-title">
            {greeting}, <span className="highlight">{user?.name?.split(" ")[0] || "there"}</span> 👋
          </h1>
          <p className="page-date">{dateStr}</p>
        </div>
        <button className="btn-green" onClick={() => navigate("/habits")}>
          + New Habit
        </button>
      </div>

      {pendingReminders.length > 0 && (
        <div className="reminder-banner">
          <div className="reminder-banner-header">
            <div className="reminder-banner-title">⏰ Reminder</div>
            <div className="reminder-banner-note">Tap OK to dismiss</div>
          </div>
          <div className="reminder-list">
            {pendingReminders.map((reminder) => (
              <div key={reminder._id} className="reminder-card">
                <div>
                  <div className="reminder-message">{reminder.message}</div>
                  <div className="reminder-time">Scheduled at {reminder.scheduledAt}</div>
                </div>
                <button
                  className="reminder-ok-btn"
                  onClick={() => handleDismissReminder(reminder._id)}
                >
                  OK
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="quote-banner">
        <span className="quote-leaf">🌱</span>
        <p className="quote-text">"{quote}"</p>
      </div>

      {/* ── Stats ── */}
      <div className="stat-grid">
        <div className="stat-card stat-primary">
          <div className="stat-icon">🎯</div>
          <div className="stat-label">Today's Progress</div>
          <div className="stat-value">{done}/{total}</div>
          <div className="stat-bar-wrap">
            <div className="stat-bar">
              <div className="stat-bar-fill" style={{ width: `${pct}%` }} />
            </div>
            <span className="stat-pct">{pct}%</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-label">Best Streak</div>
          <div className="stat-value">{bestStreak}</div>
          <div className="stat-sub">days running</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-label">Total XP</div>
          <div className="stat-value">{user?.xp || 0}</div>
          <div className="stat-sub">Level {Math.floor((user?.xp || 0) / 300) + 1}</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏅</div>
          <div className="stat-label">Habits Active</div>
          <div className="stat-value">{total}</div>
          <div className="stat-sub">habits tracked</div>
        </div>
      </div>

      {/* ── Today's habits ── */}
      <div className="section">
        <div className="section-header">
          <h2 className="section-title">📋 Today's Habits</h2>
          <span className="badge-green">{done}/{total} done</span>
        </div>

        {loading ? (
          <div className="loading-rows">
            {[1,2,3].map(i => <div key={i} className="skeleton-row" />)}
          </div>
        ) : habits.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🌱</div>
            <p>No habits yet. Start building your routine!</p>
            <button className="btn-green" onClick={() => navigate("/habits")}>
              Add your first habit
            </button>
          </div>
        ) : (
          <div className="habit-list">
            {habits.map(h => (
              <div key={h._id} className={`habit-row ${h.completedToday ? "done" : ""}`}>
                <div className="habit-left">
                  <div className="habit-emoji">{h.icon || "📌"}</div>
                  <div>
                    <div className="habit-name">{h.title || h.name}</div>
                    <div className="habit-meta">
                      {h.streak > 0 && (
                        <span className="streak-chip">🔥 {h.streak}d</span>
                      )}
                      {h.category && (
                        <span className="cat-chip">{h.category}</span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  className={`check-circle ${h.completedToday ? "checked" : ""}`}
                  onClick={() => !h.completedToday && handleComplete(h._id)}
                  disabled={h.completedToday}
                  title={h.completedToday ? "Done!" : "Mark complete"}
                >
                  {h.completedToday ? "✓" : ""}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Quick nav cards ── */}
      <div className="section">
        <h2 className="section-title">⚡ Quick Actions</h2>
        <div className="quick-grid">
          {[
            { icon: "📊", label: "View Analytics", to: "/analytics", color: "#dcfce7" },
            { icon: "🤖", label: "AI Coach",        to: "/ai-chat",   color: "#d1fae5" },
            { icon: "😊", label: "Log Mood",         to: "/mood",      color: "#bbf7d0" },
            { icon: "💡", label: "AI Suggestions",   to: "/ai-suggest",color: "#a7f3d0" },
          ].map(item => (
            <button
              key={item.to}
              className="quick-card"
              style={{ "--card-bg": item.color }}
              onClick={() => navigate(item.to)}
            >
              <span className="quick-icon">{item.icon}</span>
              <span className="quick-label">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
