import { useState, useEffect } from "react";
import API from "../services/api";

const HabitCalendar = ({ habitId, habitTitle }) => {
  const [logs,        setLogs]        = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchLogs();
  }, [currentDate, habitId]);

  const fetchLogs = async () => {
    try {
      const year  = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const { data } = await API.get(`/analytics/calendar?habitId=${habitId}&year=${year}&month=${month}`);
      setLogs(data);
    } catch (error) {
      console.log("Calendar fetch error", error);
    }
  };

  const getDaysInMonth = () => {
    const year  = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = () => {
    const year  = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const isCompleted = (day) => {
    const year   = currentDate.getFullYear();
    const month  = String(currentDate.getMonth() + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    const dateStr = `${year}-${month}-${dayStr}`;
    return logs.includes(dateStr);
  };

  const isMissed = (day) => {
    const year   = currentDate.getFullYear();
    const month  = String(currentDate.getMonth() + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    const dateStr = `${year}-${month}-${dayStr}`;
    const today   = new Date().toISOString().split("T")[0];
    return dateStr < today && !logs.includes(dateStr);
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const monthName = currentDate.toLocaleString("default", { month: "long", year: "numeric" });
  const daysInMonth   = getDaysInMonth();
  const firstDay      = getFirstDayOfMonth();
  const weekDays      = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div style={styles.container}>
      <h3 style={styles.habitTitle}>📅 {habitTitle}</h3>

      {/* Month Navigation */}
      <div style={styles.navRow}>
        <button onClick={prevMonth} style={styles.navBtn}>◀</button>
        <span style={styles.monthName}>{monthName}</span>
        <button onClick={nextMonth} style={styles.navBtn}>▶</button>
      </div>

      {/* Week Day Headers */}
      <div style={styles.weekRow}>
        {weekDays.map((d) => (
          <div key={d} style={styles.weekDay}>{d}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div style={styles.grid}>
        {/* Empty cells for first day offset */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} style={styles.emptyCell} />
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day       = i + 1;
          const completed = isCompleted(day);
          const missed    = isMissed(day);
          const isToday   = day === new Date().getDate() &&
                            currentDate.getMonth() === new Date().getMonth() &&
                            currentDate.getFullYear() === new Date().getFullYear();

          return (
            <div
              key={day}
              style={{
                ...styles.dayCell,
                backgroundColor: completed ? "#2d6a4f" : missed ? "#ffebee" : "#f5f5f5",
                color:           completed ? "#fff"     : missed ? "#e53935" : "#333",
                border:          isToday   ? "2px solid #f9a825" : "2px solid transparent",
                fontWeight:      isToday   ? "bold" : "normal",
              }}
            >
              {day}
              {completed && <span style={styles.dot}>✓</span>}
              {missed    && <span style={styles.dot}>✗</span>}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={styles.legend}>
        <span style={styles.legendItem}>
          <span style={{ ...styles.legendDot, backgroundColor: "#2d6a4f" }} />
          Completed
        </span>
        <span style={styles.legendItem}>
          <span style={{ ...styles.legendDot, backgroundColor: "#ffebee", border: "1px solid #e53935" }} />
          Missed
        </span>
        <span style={styles.legendItem}>
          <span style={{ ...styles.legendDot, border: "2px solid #f9a825" }} />
          Today
        </span>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#fff",
    borderRadius:    "16px",
    padding:         "20px",
    boxShadow:       "0 4px 15px rgba(0,0,0,0.08)",
    marginBottom:    "16px",
  },
  habitTitle: {
    fontSize:     "16px",
    fontWeight:   "700",
    color:        "#2d6a4f",
    marginBottom: "12px",
  },
  navRow: {
    display:        "flex",
    justifyContent: "space-between",
    alignItems:     "center",
    marginBottom:   "12px",
  },
  navBtn: {
    background:   "none",
    border:       "1px solid #ddd",
    borderRadius: "8px",
    padding:      "4px 10px",
    cursor:       "pointer",
    fontSize:     "14px",
  },
  monthName: {
    fontWeight: "bold",
    fontSize:   "15px",
    color:      "#333",
  },
  weekRow: {
    display:             "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap:                 "4px",
    marginBottom:        "4px",
  },
  weekDay: {
    textAlign:  "center",
    fontSize:   "11px",
    fontWeight: "bold",
    color:      "#999",
    padding:    "4px 0",
  },
  grid: {
    display:             "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap:                 "4px",
  },
  emptyCell: {
    height: "36px",
  },
  dayCell: {
    height:        "36px",
    borderRadius:  "8px",
    display:       "flex",
    flexDirection: "column",
    alignItems:    "center",
    justifyContent:"center",
    fontSize:      "12px",
    cursor:        "default",
    position:      "relative",
  },
  dot: {
    fontSize:  "8px",
    position:  "absolute",
    bottom:    "2px",
  },
  legend: {
    display:        "flex",
    gap:            "16px",
    marginTop:      "12px",
    justifyContent: "center",
  },
  legendItem: {
    display:    "flex",
    alignItems: "center",
    gap:        "6px",
    fontSize:   "12px",
    color:      "#777",
  },
  legendDot: {
    width:        "14px",
    height:       "14px",
    borderRadius: "4px",
    display:      "inline-block",
  },
};

export default HabitCalendar;