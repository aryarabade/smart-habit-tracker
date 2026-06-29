import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { label: "Dashboard",  icon: "🏠", to: "/dashboard" },
  { label: "My Habits",  icon: "✅", to: "/habits" },
  { label: "Mood",       icon: "😊", to: "/mood" },
  { label: "Analytics",  icon: "📊", to: "/analytics" },
];
const aiItems = [
  { label: "AI Coach",    icon: "🤖", to: "/ai-chat" },
  { label: "Suggestions", icon: "💡", to: "/ai-suggest" },
];
const accountItems = [
  { label: "Reminders", icon: "🔔", to: "/notifications" },
  { label: "Profile",   icon: "👤", to: "/profile" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/login"); };

  // className as function — works with React Router v6
  const cls = ({ isActive }) => "sb-link" + (isActive ? " active" : "");

  return (
    <aside className="sidebar">
      {/* ── Logo ── */}
          <div className="sb-logo">
            <span className="sb-logo-icon">🌱</span>
            <div>
              <span className="sb-logo-title">HabitTracker</span>
            </div>
          </div>

      {/* ── Nav ── */}
      <nav className="sb-nav">
        <span className="sb-section-label">Menu</span>
        {navItems.map(item => (
          <NavLink key={item.to} to={item.to} className={cls} end={item.to === "/dashboard"}>
            <span className="sb-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}

        <span className="sb-section-label">AI Features</span>
        {aiItems.map(item => (
          <NavLink key={item.to} to={item.to} className={cls}>
            <span className="sb-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}

        <span className="sb-section-label">Account</span>
        {accountItems.map(item => (
          <NavLink key={item.to} to={item.to} className={cls}>
            <span className="sb-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* ── Footer ── */}
      <div className="sb-footer">
        <div className="sb-user">
          <div className="sb-avatar">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <div className="sb-user-name">{user?.name || "User"}</div>
            <div className="sb-user-xp">⚡ {user?.xp || 0} XP</div>
          </div>
        </div>
        <button className="sb-logout" onClick={handleLogout}>
          Sign out
        </button>
      </div>
    </aside>
  );
}
