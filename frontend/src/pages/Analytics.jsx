import { useState, useEffect } from "react";
import {
  BarChart, Bar,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";
import API   from "../services/api";
import toast from "react-hot-toast";
import AnalyticsCalendar from "../components/AnalyticsCalendar";

const Analytics = () => {
  const [summary, setSummary] = useState(null);
  const [weekly,  setWeekly]  = useState([]);
  const [bestDay, setBestDay] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [s, w] = await Promise.all([
        API.get("/analytics/summary"),
        API.get("/analytics/weekly"),
      ]);
      setSummary(s.data);
      setWeekly(w.data);

      // best-day is optional — some backends may not have it
      try {
        const b = await API.get("/analytics/best-day");
        setBestDay(b.data);
      } catch (_) {}
    } catch {
      toast.error("Could not load analytics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="page">
      <div className="loading-rows" style={{ marginTop: 40 }}>
        {[1,2,3].map(i => <div key={i} className="skeleton-row" />)}
      </div>
    </div>
  );

  const metrics = summary ? [
    { icon: "🔥", label: "Best Streak",     value: summary.bestStreak     || 0,    unit: "days" },
    { icon: "📈", label: "Completion Rate", value: summary.completionRate || "0%", unit: ""    },
    { icon: "✅", label: "Total Completed", value: summary.totalCompleted || 0,    unit: ""    },
    { icon: "🌿", label: "Active Habits",   value: summary.activeHabits   || 0,    unit: ""    },
  ] : [];

  return (
    <div className="page">

      {/* ── Header ── */}
      <div className="page-topbar">
        <div>
          <h1 className="page-title">📊 Analytics</h1>
          <p className="page-date">Your habit performance at a glance</p>
        </div>
      </div>

      {/* ── Metric cards ── */}
      {metrics.length > 0 && (
        <div className="stat-grid" style={{ marginBottom: 28 }}>
          {metrics.map((m, i) => (
            <div key={i} className={`stat-card ${i === 0 ? "stat-primary" : ""}`}>
              <div className="stat-icon">{m.icon}</div>
              <div className="stat-label">{m.label}</div>
              <div className="stat-value">{m.value}</div>
              {m.unit && <div className="stat-sub">{m.unit}</div>}
            </div>
          ))}
        </div>
      )}

      {/* ── Monthly Calendar View ── */}
      <AnalyticsCalendar />

      {/* ── Weekly bar chart ── */}
      {weekly.length > 0 && (
        <div className="form-card" style={{ marginBottom: 20 }}>
          <div className="section-header">
            <h2 className="section-title">📅 Last 7 Days — Habits Completed</h2>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={weekly} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dcfce7" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 12, fill: "#6b7280" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "10px",
                  border: "1px solid #bbf7d0",
                  boxShadow: "0 4px 12px rgba(0,0,0,.08)",
                  fontSize: "13px",
                }}
                labelStyle={{ color: "#15803d", fontWeight: "600" }}
                cursor={{ fill: "#f0fdf4" }}
              />
              <Bar
                dataKey="habitsCompleted"
                fill="#22c55e"
                radius={[6, 6, 0, 0]}
                name="Habits Completed"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ── Line chart if weekly has completion % ── */}
      {weekly.length > 0 && weekly[0]?.completionRate !== undefined && (
        <div className="form-card" style={{ marginBottom: 20 }}>
          <div className="section-header">
            <h2 className="section-title">📈 Completion Rate Trend</h2>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={weekly} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dcfce7" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: "10px", border: "1px solid #bbf7d0", fontSize: "13px" }}
                labelStyle={{ color: "#15803d", fontWeight: "600" }}
              />
              <Line
                type="monotone"
                dataKey="completionRate"
                stroke="#16a34a"
                strokeWidth={2.5}
                dot={{ fill: "#22c55e", r: 4 }}
                name="Completion %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ── Best day card ── */}
      {bestDay && (
        <div className="form-card best-day-card">
          <div className="best-day-inner">
            <span style={{ fontSize: 32 }}>🏆</span>
            <div>
              <p className="section-title">Your Best Day</p>
              <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 4 }}>
                <strong style={{ color: "var(--green-700)" }}>{bestDay.bestDay}</strong>
                {" — "}{bestDay.count} habits completed!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!summary && weekly.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <p>No data yet. Start completing habits to see your analytics!</p>
        </div>
      )}

    </div>
  );
};

export default Analytics;
