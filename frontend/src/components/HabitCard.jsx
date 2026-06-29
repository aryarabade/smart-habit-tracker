import { completeHabit, deleteHabit } from "../services/habitService";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";

const categoryColors = {
  health:   { bg: "#d8f3dc", text: "#2d6a4f", border: "#95d5b2" },
  fitness:  { bg: "#fce4ec", text: "#c62828", border: "#f48fb1" },
  learning: { bg: "#e3f2fd", text: "#1565c0", border: "#90caf9" },
  general:  { bg: "#f3e5f5", text: "#6a1b9a", border: "#ce93d8" },
};

const HabitCard = ({ habit, onUpdate }) => {
  const color = categoryColors[habit.category] || categoryColors.general;

  const fireConfetti = () => {
    confetti({
      particleCount: 100,
      spread:        70,
      origin:        { y: 0.6 },
      colors:        ["#2d6a4f", "#40916c", "#74c69d", "#ffd166", "#ef476f"],
    });
  };

  const handleComplete = async () => {
    try {
      await completeHabit(habit._id);
      fireConfetti();
      toast.success(`🎉 "${habit.title}" completed!`);
      onUpdate();
    } catch (error) {
      toast.error(error.response?.data?.message || "Already completed today!");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteHabit(habit._id);
      toast.success("Habit deleted!");
      onUpdate();
    } catch (error) {
      toast.error("Could not delete habit");
    }
  };

  return (
    <div style={{
      ...styles.card,
      borderLeft: `5px solid ${color.border}`,
    }}>

      {/* Category Badge */}
      <span style={{
        ...styles.badge,
        backgroundColor: color.bg,
        color:           color.text,
      }}>
        {habit.category}
      </span>

      {/* Title */}
      <h3 style={styles.title}>{habit.title}</h3>

      {/* Frequency */}
      <p style={styles.frequency}>🔁 {habit.frequency}</p>

      {/* Streak */}
      <div style={styles.streakBox}>
        <span style={styles.streakFire}>🔥</span>
        <span style={styles.streakCount}>{habit.streak}</span>
        <span style={styles.streakLabel}>day streak</span>
        {habit.streak >= 7  && <span style={styles.medal}>🥉</span>}
        {habit.streak >= 30 && <span style={styles.medal}>🥇</span>}
      </div>

      {/* Reminder */}
      {habit.reminderTime && (
        <p style={styles.reminder}>⏰ {habit.reminderTime}</p>
      )}

      {/* Buttons */}
      <div style={styles.buttons}>
        <button onClick={handleComplete} style={styles.completeBtn}>
          ✅ Mark Done
        </button>
        <button onClick={handleDelete} style={styles.deleteBtn}>
          🗑️
        </button>
      </div>

    </div>
  );
};

const styles = {
  card: {
    backgroundColor: "#ffffff",
    borderRadius:    "16px",
    padding:         "20px",
    boxShadow:       "0 4px 15px rgba(0,0,0,0.08)",
    display:         "flex",
    flexDirection:   "column",
    gap:             "10px",
    transition:      "transform 0.2s, box-shadow 0.2s",
  },
  badge: {
    padding:       "4px 10px",
    borderRadius:  "20px",
    fontSize:      "11px",
    fontWeight:    "bold",
    width:         "fit-content",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  title: {
    fontSize:   "17px",
    fontWeight: "700",
    color:      "#222",
  },
  frequency: {
    fontSize: "13px",
    color:    "#888",
  },
  streakBox: {
    display:         "flex",
    alignItems:      "center",
    gap:             "6px",
    backgroundColor: "#fff8e1",
    padding:         "8px 12px",
    borderRadius:    "10px",
  },
  streakFire: {
    fontSize: "18px",
  },
  streakCount: {
    fontSize:   "22px",
    fontWeight: "bold",
    color:      "#e65100",
  },
  streakLabel: {
    fontSize: "13px",
    color:    "#777",
    flex:     1,
  },
  medal: {
    fontSize: "18px",
  },
  reminder: {
    fontSize: "12px",
    color:    "#aaa",
  },
  buttons: {
    display:   "flex",
    gap:       "8px",
    marginTop: "4px",
  },
  completeBtn: {
    flex:            1,
    padding:         "10px",
    backgroundColor: "#2d6a4f",
    color:           "#fff",
    border:          "none",
    borderRadius:    "8px",
    fontWeight:      "bold",
    cursor:          "pointer",
    fontSize:        "13px",
  },
  deleteBtn: {
    padding:         "10px 14px",
    backgroundColor: "#fff0f0",
    color:           "#e53935",
    border:          "1px solid #ffcdd2",
    borderRadius:    "8px",
    cursor:          "pointer",
    fontSize:        "16px",
  },
};

export default HabitCard;