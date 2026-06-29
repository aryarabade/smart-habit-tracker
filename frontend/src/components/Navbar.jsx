import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";


const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out!");
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>
        🌱 HabitTracker
      </div>

      <div style={styles.right}>
        <span style={styles.welcome}>
          👋 Hey, {user?.name || "User"}!
        </span>

       <Link to="/profile" style={styles.profileBtn}>
  👤 {user?.name?.split(" ")[0] || "Profile"}
</Link>
<Link to="/analytics" style={styles.analyticsBtn}>
  📊 Analytics
</Link>


        {/* Logout Button */}
        <button onClick={handleLogout} style={styles.logoutBtn}>
          🚪 Logout
        </button>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display:         "flex",
    justifyContent:  "space-between",
    alignItems:      "center",
    padding:         "16px 32px",
    backgroundColor: "#2d6a4f",
    boxShadow:       "0 2px 10px rgba(0,0,0,0.15)",
    position:        "sticky",
    top:             0,
    zIndex:          100,
  },
  logo: {
    fontSize:   "22px",
    fontWeight: "bold",
    color:      "#ffffff",
  },
  right: {
    display:    "flex",
    alignItems: "center",
    gap:        "12px",
  },
  welcome: {
    color:    "#b7e4c7",
    fontSize: "14px",
  },
  profileBtn: {
    padding:         "8px 16px",
    backgroundColor: "#40916c",
    color:           "#fff",
    borderRadius:    "8px",
    textDecoration:  "none",
    fontWeight:      "bold",
    fontSize:        "14px",
  },
  analyticsBtn: {
  padding:         "8px 16px",
  backgroundColor: "#52b788",
  color:           "#fff",
  borderRadius:    "8px",
  textDecoration:  "none",
  fontWeight:      "bold",
  fontSize:        "14px",
},
  logoutBtn: {
    padding:         "8px 16px",
    backgroundColor: "#ffffff",
    color:           "#2d6a4f",
    border:          "none",
    borderRadius:    "8px",
    fontWeight:      "bold",
    cursor:          "pointer",
    fontSize:        "14px",
  },
};

export default Navbar;