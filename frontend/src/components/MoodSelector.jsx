import { useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

const moods = [
  { emoji: "😄", label: "happy",   color: "#4caf50" },
  { emoji: "😐", label: "neutral", color: "#ff9800" },
  { emoji: "😢", label: "sad",     color: "#2196f3" },
];

const MoodSelector = ({ onMoodSaved }) => {
  const [selected, setSelected] = useState(null);
  const [note,     setNote]     = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleSave = async () => {
    if (!selected) return toast.error("Please select a mood!");
    setLoading(true);
    try {
      await API.post("/mood", { mood: selected, note });
      toast.success("Mood saved!");
      setSelected(null);
      setNote("");
      if (onMoodSaved) onMoodSaved();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save mood");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>😊 How are you feeling today?</h2>

      <div style={styles.moodRow}>
        {moods.map((m) => (
          <button
            key={m.label}
            onClick={() => setSelected(m.label)}
            style={{
              ...styles.moodBtn,
              backgroundColor: selected === m.label ? m.color : "#f5f5f5",
              color:           selected === m.label ? "#fff"   : "#333",
              transform:       selected === m.label ? "scale(1.1)" : "scale(1)",
            }}
          >
            <span style={styles.emoji}>{m.emoji}</span>
            <span style={styles.moodLabel}>{m.label}</span>
          </button>
        ))}
      </div>

      <textarea
        placeholder="Write a short note... (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        style={styles.textarea}
        rows={2}
      />

      <button
        onClick={handleSave}
        style={loading ? styles.btnDisabled : styles.btn}
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Mood"}
      </button>
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
  moodRow: {
    display:       "flex",
    gap:           "12px",
    marginBottom:  "16px",
  },
  moodBtn: {
    flex:          1,
    padding:       "14px",
    borderRadius:  "12px",
    border:        "none",
    cursor:        "pointer",
    display:       "flex",
    flexDirection: "column",
    alignItems:    "center",
    gap:           "6px",
    transition:    "all 0.2s",
    fontWeight:    "bold",
  },
  emoji: {
    fontSize: "28px",
  },
  moodLabel: {
    fontSize:      "12px",
    textTransform: "capitalize",
  },
  textarea: {
    width:        "100%",
    padding:      "12px",
    borderRadius: "8px",
    border:       "1px solid #ddd",
    fontSize:     "14px",
    outline:      "none",
    marginBottom: "12px",
    resize:       "none",
  },
  btn: {
    width:           "100%",
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
    width:           "100%",
    padding:         "12px",
    backgroundColor: "#aaa",
    color:           "#fff",
    border:          "none",
    borderRadius:    "8px",
    fontSize:        "15px",
    cursor:          "not-allowed",
  },
};

export default MoodSelector;