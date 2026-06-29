import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const API   = "http://localhost:5000/api/notifications";
const token = () => localStorage.getItem("token");

export default function Notifications() {
  const [notifs,  setNotifs]  = useState([]);
  const [time,    setTime]    = useState("08:00");
  const [message, setMessage] = useState("");
  const [saving,  setSaving]  = useState(false);

  useEffect(() => {
    fetch(API, { headers: { Authorization: `Bearer ${token()}` } })
      .then(async (r) => {
        if (!r.ok) throw new Error("Could not load reminders");
        return r.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setNotifs(data);
      })
      .catch(() => {
        setNotifs([]);
      });
  }, []);

  const handleSave = async () => {
    if (!message.trim()) return toast.error("Add a reminder message");
    setSaving(true);
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ scheduledAt: time, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        return toast.error(data.message || "Could not set reminder");
      }
      setNotifs(prev => [data, ...prev]);
      setMessage("");
      toast.success("Reminder set! 🔔");
    } catch {
      toast.error("Could not set reminder");
    } finally {
      setSaving(false);
    }
  };

  const handleDismiss = async (id) => {
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token()}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      setNotifs(prev => prev.filter((notif) => notif._id !== id));
      toast.success("Reminder dismissed");
    } catch {
      toast.error("Could not dismiss reminder");
    }
  };

  return (
    <div className="page">
      <div className="page-topbar">
        <div>
          <h1 className="page-title">🔔 Reminders</h1>
          <p className="page-date">Set daily nudges to stay on track</p>
        </div>
      </div>

      <div className="form-card">
        <h3 className="form-title">New Reminder</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Time</label>
            <input type="time" className="input-green" value={time} onChange={e => setTime(e.target.value)} />
          </div>
          <div className="form-group" style={{ flex: 2 }}>
            <label>Message</label>
            <input
              className="input-green"
              placeholder="e.g. Time to drink water! 💧"
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
          </div>
        </div>
        <button className="btn-green" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Set Reminder 🔔"}
        </button>
      </div>

      {notifs.length > 0 && (
        <div className="section">
          <h2 className="section-title">📋 Your Reminders</h2>
          <div className="habit-list">
            {notifs.map((n, i) => (
              <div key={n._id || i} className="habit-row">
                <div className="habit-left">
                  <div className="habit-emoji">🔔</div>
                  <div>
                    <div className="habit-name">{n.message}</div>
                    <div className="habit-meta">
                      <span className="streak-chip">⏰ {n.scheduledAt}</span>
                    </div>
                  </div>
                </div>
                <button className="btn-green" style={{ minWidth: 100 }} onClick={() => handleDismiss(n._id)}>
                  OK
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
