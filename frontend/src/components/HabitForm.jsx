import { useState } from "react";
import { createHabit } from "../services/habitService";
import toast from "react-hot-toast";

const HabitForm = ({ onAdd }) => {
  const [title,        setTitle]        = useState("");
  const [category,     setCategory]     = useState("general");
  const [frequency,    setFrequency]    = useState("daily");
  const [reminderTime, setReminderTime] = useState("");
  const [loading,      setLoading]      = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createHabit({ title, category, frequency, reminderTime });
      toast.success("Habit added!");
      setTitle("");
      setReminderTime("");
      onAdd();
    } catch (error) {
      toast.error("Could not add habit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>➕ Add New Habit</h2>
      <form onSubmit={handleSubmit} style={styles.form}>

        <input
          type="text"
          placeholder="Habit name e.g. Drink Water"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
          required
        />

        <div style={styles.row}>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={styles.select}
          >
            <option value="general">🌀 General</option>
            <option value="health">💚 Health</option>
            <option value="fitness">💪 Fitness</option>
            <option value="learning">📚 Learning</option>
          </select>

          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            style={styles.select}
          >
            <option value="daily">📅 Daily</option>
            <option value="weekly">📆 Weekly</option>
          </select>

          <input
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            style={styles.select}
          />
        </div>

        <button
          type="submit"
          style={loading ? styles.btnDisabled : styles.btn}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Habit"}
        </button>

      </form>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#ffffff",
    borderRadius:    "16px",
    padding:         "24px",
    boxShadow:       "0 4px 15px rgba(0,0,0,0.08)",
    marginBottom:    "24px",
  },
  heading: {
    fontSize:     "18px",
    fontWeight:   "700",
    color:        "#2d6a4f",
    marginBottom: "16px",
  },
  form: {
    display:       "flex",
    flexDirection: "column",
    gap:           "12px",
  },
  row: {
    display: "flex",
    gap:     "12px",
  },
  input: {
    padding:      "12px",
    borderRadius: "8px",
    border:       "1px solid #ddd",
    fontSize:     "14px",
    outline:      "none",
    width:        "100%",
  },
  select: {
    padding:      "12px",
    borderRadius: "8px",
    border:       "1px solid #ddd",
    fontSize:     "14px",
    outline:      "none",
    flex:         1,
    cursor:       "pointer",
  },
  btn: {
    padding:         "12px",
    backgroundColor: "#2d6a4f",
    color:           "#fff",
    border:          "none",
    borderRadius:    "8px",
    fontWeight:      "bold",
    fontSize:        "15px",
    cursor:          "pointer",
  },
  btnDisabled: {
    padding:         "12px",
    backgroundColor: "#aaa",
    color:           "#fff",
    border:          "none",
    borderRadius:    "8px",
    fontSize:        "15px",
    cursor:          "not-allowed",
  },
};

export default HabitForm;