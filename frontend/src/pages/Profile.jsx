import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, logout, login } = useAuth();
  const navigate                = useNavigate();

  const [name,        setName]        = useState(user?.name || "");
  const [password,    setPassword]    = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading,     setLoading]     = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.put("/auth/profile", {
        name,
        password:    password    || undefined,
        newPassword: newPassword || undefined,
      });
      login(data, localStorage.getItem("token"));
      toast.success("Profile updated! ✅");
      setPassword("");
      setNewPassword("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out!");
    navigate("/login");
  };

  const level = Math.floor((user?.xp || 0) / 300) + 1;
  const xpInLevel = (user?.xp || 0) % 300;
  const xpPct = Math.round((xpInLevel / 300) * 100);

  return (
    <div className="page">

      {/* ── Page header ── */}
      <div className="page-topbar">
        <div>
          <h1 className="page-title">👤 Profile</h1>
          <p className="page-date">Manage your account and preferences</p>
        </div>
      </div>

      {/* ── Profile hero card ── */}
      <div className="profile-hero">
        <div className="profile-avatar-lg">
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <div className="profile-hero-info">
          <h2 className="profile-hero-name">{user?.name}</h2>
          <p className="profile-hero-email">{user?.email}</p>
          <div className="profile-badges">
            <span className="badge-green">⚡ {user?.xp || 0} XP</span>
            <span className="badge-green">🏅 Level {level}</span>
            {user?.badges?.map((b, i) => (
              <span key={i} className="badge-green">{b}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── XP progress ── */}
      <div className="form-card" style={{ marginBottom: 16 }}>
        <div className="profile-xp-header">
          <span className="section-title">⚡ XP Progress — Level {level}</span>
          <span className="badge-green">{xpInLevel}/300 XP</span>
        </div>
        <div className="stat-bar" style={{ marginTop: 10, height: 10 }}>
          <div className="stat-bar-fill" style={{ width: `${xpPct}%` }} />
        </div>
        <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>
          {300 - xpInLevel} XP until Level {level + 1}
        </p>
      </div>

      {/* ── Edit form ── */}
      <div className="form-card">
        <h2 className="form-title">✏️ Edit Profile</h2>
        <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              className="input-green"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              className="input-green"
              placeholder="Enter current password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              className="input-green"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-green" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      {/* ── Danger zone ── */}
      <button onClick={handleLogout} className="logout-danger-btn">
        🚪 Logout from Account
      </button>

    </div>
  );
};

export default Profile;
