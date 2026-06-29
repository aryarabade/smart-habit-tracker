import { useState, useEffect } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

const AnalyticsCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [logs, setLogs] = useState([]);
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMonthData();
  }, [currentDate]);

  const fetchMonthData = async () => {
    setLoading(true);
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;

      // Fetch all habits and logs for the month
      const [habitsRes, logsRes] = await Promise.all([
        API.get("/habits"),
        API.get(`/habits/logs/month?year=${year}&month=${month}`),
      ]);

      setHabits(habitsRes.data || []);

      // Group logs by date
      const logsByDate = {};
      if (logsRes.data && Array.isArray(logsRes.data)) {
        logsRes.data.forEach((log) => {
          if (!logsByDate[log.date]) {
            logsByDate[log.date] = { completed: 0, total: 0 };
          }
          logsByDate[log.date].total += 1;
          if (log.completed) {
            logsByDate[log.date].completed += 1;
          }
        });
      }

      setLogs(logsByDate);
    } catch (error) {
      console.error("Error fetching calendar data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = () => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = () => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  };

  const getColorForDay = (day) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    const dateStr = `${year}-${month}-${dayStr}`;

    const today = new Date();
    const currentDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const cellDate = new Date(year, currentDate.getMonth(), day);

    // Future date - gray
    if (cellDate > currentDateOnly) {
      return { bg: "#f3f4f6", text: "#9ca3af", status: "future" };
    }

    const dayData = logs[dateStr];

    // No data or all missed
    if (!dayData || dayData.completed === 0) {
      return { bg: "#fee2e2", text: "#dc2626", status: "missed" };
    }

    // Partial completion
    if (dayData.completed < dayData.total) {
      return { bg: "#fef3c7", text: "#d97706", status: "partial" };
    }

    // All completed
    return { bg: "#dcfce7", text: "#15803d", status: "completed" };
  };

  const getStatusIcon = (day) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    const dateStr = `${year}-${month}-${dayStr}`;

    const today = new Date();
    const currentDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const cellDate = new Date(year, currentDate.getMonth(), day);

    if (cellDate > currentDateOnly) return "";

    const dayData = logs[dateStr];
    if (!dayData || dayData.completed === 0) return "✗";
    if (dayData.completed < dayData.total) return "◐";
    return "✓";
  };

  const getCompletionText = (day) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    const dateStr = `${year}-${month}-${dayStr}`;

    const dayData = logs[dateStr];
    if (!dayData) return "0/0";
    return `${dayData.completed}/${dayData.total}`;
  };

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const daysInMonth = getDaysInMonth();
  const firstDay = getFirstDayOfMonth();

  // Calculate statistics
  const totalDays = Object.keys(logs).length;
  const completedDays = Object.values(logs).filter(
    (d) => d.completed === d.total && d.total > 0
  ).length;
  const partialDays = Object.values(logs).filter(
    (d) => d.completed > 0 && d.completed < d.total
  ).length;
  const missedDays = Object.values(logs).filter(
    (d) => d.completed === 0 && d.total > 0
  ).length;

  return (
    <div className="form-card" style={{ marginBottom: 20 }}>
      <div className="section-header">
        <h2 className="section-title">📅 Monthly Overview</h2>
      </div>

      {/* Month Navigation */}
      <div style={styles.navRow}>
        <button onClick={prevMonth} style={styles.navBtn}>
          ◀ Previous
        </button>
        <span style={styles.monthName}>{monthName}</span>
        <button onClick={nextMonth} style={styles.navBtn}>
          Next ▶
        </button>
      </div>

      {/* Statistics Summary */}
      <div style={styles.statsRow}>
        <div style={styles.statItem}>
          <div style={{ ...styles.statDot, backgroundColor: "#dcfce7" }} />
          <span style={styles.statLabel}>
            Completed: <strong>{completedDays}</strong>
          </span>
        </div>
        <div style={styles.statItem}>
          <div style={{ ...styles.statDot, backgroundColor: "#fef3c7" }} />
          <span style={styles.statLabel}>
            Partial: <strong>{partialDays}</strong>
          </span>
        </div>
        <div style={styles.statItem}>
          <div style={{ ...styles.statDot, backgroundColor: "#fee2e2" }} />
          <span style={styles.statLabel}>
            Missed: <strong>{missedDays}</strong>
          </span>
        </div>
      </div>

      {/* Week Day Headers */}
      <div style={styles.weekRow}>
        {weekDays.map((d) => (
          <div key={d} style={styles.weekDay}>
            {d}
          </div>
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
          const day = i + 1;
          const colorInfo = getColorForDay(day);
          const isToday =
            day === new Date().getDate() &&
            currentDate.getMonth() === new Date().getMonth() &&
            currentDate.getFullYear() === new Date().getFullYear();

          return (
            <div
              key={day}
              style={{
                ...styles.dayCell,
                backgroundColor: colorInfo.bg,
                color: colorInfo.text,
                border: isToday ? "2px solid #f59e0b" : "1px solid #e5e7eb",
              }}
              title={`${day}: ${getCompletionText(day)} habits completed`}
            >
              <div style={styles.dayNumber}>{day}</div>
              {colorInfo.status !== "future" && (
                <div style={styles.dayStatus}>{getStatusIcon(day)}</div>
              )}
              <div style={styles.dayCompletion}>{getCompletionText(day)}</div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={styles.legend}>
        <div style={styles.legendItem}>
          <div
            style={{
              ...styles.legendDot,
              backgroundColor: "#dcfce7",
              border: "1px solid #15803d",
            }}
          />
          <span>All Completed</span>
        </div>
        <div style={styles.legendItem}>
          <div
            style={{
              ...styles.legendDot,
              backgroundColor: "#fef3c7",
              border: "1px solid #d97706",
            }}
          />
          <span>Partial</span>
        </div>
        <div style={styles.legendItem}>
          <div
            style={{
              ...styles.legendDot,
              backgroundColor: "#fee2e2",
              border: "1px solid #dc2626",
            }}
          />
          <span>Missed</span>
        </div>
        <div style={styles.legendItem}>
          <div
            style={{
              ...styles.legendDot,
              backgroundColor: "#f3f4f6",
              border: "1px solid #d1d5db",
            }}
          />
          <span>Future</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  navRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
    gap: "12px",
  },
  navBtn: {
    background: "#f3f4f6",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    padding: "8px 14px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500",
    color: "#374151",
    transition: "all 0.2s",
  },
  monthName: {
    fontWeight: "bold",
    fontSize: "16px",
    color: "#111827",
  },
  statsRow: {
    display: "flex",
    gap: "16px",
    marginBottom: "16px",
    flexWrap: "wrap",
  },
  statItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
  },
  statDot: {
    width: "12px",
    height: "12px",
    borderRadius: "3px",
    border: "1px solid #e5e7eb",
  },
  statLabel: {
    color: "#6b7280",
  },
  weekRow: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "8px",
    marginBottom: "8px",
  },
  weekDay: {
    textAlign: "center",
    fontSize: "12px",
    fontWeight: "bold",
    color: "#9ca3af",
    padding: "8px 0",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "8px",
    marginBottom: "16px",
  },
  emptyCell: {
    height: "80px",
  },
  dayCell: {
    height: "80px",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    cursor: "pointer",
    position: "relative",
    transition: "all 0.2s",
  },
  dayNumber: {
    fontWeight: "bold",
    fontSize: "15px",
  },
  dayStatus: {
    fontSize: "18px",
    fontWeight: "bold",
  },
  dayCompletion: {
    fontSize: "11px",
    opacity: 0.8,
    marginTop: "2px",
  },
  legend: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
    paddingTop: "12px",
    borderTop: "1px solid #e5e7eb",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "12px",
    color: "#6b7280",
  },
  legendDot: {
    width: "14px",
    height: "14px",
    borderRadius: "4px",
  },
};

export default AnalyticsCalendar;
