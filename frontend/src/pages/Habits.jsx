import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const API = "http://localhost:5000/api/habits";
const token = () => localStorage.getItem("token");

export default function Habits() {
  const [habits, setHabits]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm]       = useState({ title: "", category: "", icon: "📌" });
  const [adding, setAdding]   = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    try {
      const res = await fetch(API, { headers: { Authorization: `Bearer ${token()}` } });
      setHabits(await res.json());
    } catch {
      toast.error("Could not load habits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error("Habit name required");
    setAdding(true);
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
        body: JSON.stringify(form),
      });
      const newHabit = await res.json();
      setHabits(prev => [{ ...form, ...newHabit }, ...prev]);
      setForm({ title: "", category: "", icon: "📌" });
      setShowForm(false);
      toast.success("Habit added! 🌱");
    } catch {
      toast.error("Failed to add habit");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API}/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token()}` } });
      setHabits(prev => prev.filter(h => h._id !== id));
      toast.success("Habit removed");
    } catch {
      toast.error("Could not delete habit");
    }
  };

  const categories = ["fitness","sleep","study","water","mental health","productivity","nutrition","other"];
  const icons = ["📌","🏃","💧","📚","😴","🧘","🥗","💪","✍️","🎯","🌿","⚡"];

  return (
    <div className="page">
      <div className="page-topbar">
        <div>
          <h1 className="page-title">✅ My Habits</h1>
          <p className="page-date">{habits.length} habit{habits.length !== 1 ? "s" : ""} tracked</p>
        </div>
        <button className="btn-green" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Add Habit"}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="form-card">
          <h3 className="form-title">New Habit</h3>
          <form onSubmit={handleAdd} className="habit-form">
            <div className="form-row">
              <div className="form-group">
                <label>Habit Name</label>
                <input
                  className="input-green"
                  placeholder="e.g. Drink 3L water"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  className="input-green"
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                >
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Icon</label>
              <div className="icon-picker">
                {icons.map(ic => (
                  <button
                    type="button"
                    key={ic}
                    className={`icon-btn ${form.icon === ic ? "selected" : ""}`}
                    onClick={() => setForm(f => ({ ...f, icon: ic }))}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            </div>
            <button className="btn-green" type="submit" disabled={adding}>
              {adding ? "Adding..." : "Add Habit"}
            </button>
          </form>
        </div>
      )}

      {/* Habit list */}
      {loading ? (
        <div className="loading-rows">
          {[1,2,3].map(i => <div key={i} className="skeleton-row" />)}
        </div>
      ) : habits.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🌱</div>
          <p>No habits yet. Add your first one above!</p>
        </div>
      ) : (
        <div className="habit-list">
          {habits.map(h => (
            <div key={h._id} className="habit-row">
              <div className="habit-left">
                <div className="habit-emoji">{h.icon || "📌"}</div>
                <div>
                  <div className="habit-name">{h.title || h.name}</div>
                  <div className="habit-meta">
                    {h.streak > 0 && <span className="streak-chip">🔥 {h.streak}d streak</span>}
                    {h.category && <span className="cat-chip">{h.category}</span>}
                  </div>
                </div>
              </div>
              <button
                className="delete-btn"
                onClick={() => handleDelete(h._id)}
                title="Delete habit"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
