import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/authService";
import toast from "react-hot-toast";

const Login = () => {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);

  const { login }    = useAuth();
  const navigate     = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await loginUser(email, password);
      login(data, data.token);
      toast.success("Welcome back!");
      navigate("/dashboard"); 
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <h1 style={styles.title}>🌱 HabitTracker</h1>
        <h2 style={styles.subtitle}>Welcome Back!</h2>

        <form onSubmit={handleSubmit} style={styles.form}>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <button
            type="submit"
            style={loading ? styles.buttonDisabled : styles.button}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p style={styles.link}>
          Don't have an account?{" "}
          <Link to="/register" style={styles.linkText}>
            Register here
          </Link>
        </p>

      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight:       "100vh",
    display:         "flex",
    alignItems:      "center",
    justifyContent:  "center",
    backgroundColor: "#f0f4f8",
  },
  card: {
    backgroundColor: "#ffffff",
    padding:         "40px",
    borderRadius:    "16px",
    boxShadow:       "0 4px 20px rgba(0,0,0,0.1)",
    width:           "100%",
    maxWidth:        "400px",
  },
  title: {
    textAlign:   "center",
    fontSize:    "28px",
    fontWeight:  "bold",
    color:       "#2d6a4f",
    marginBottom:"8px",
  },
  subtitle: {
    textAlign:   "center",
    fontSize:    "18px",
    color:       "#555",
    marginBottom:"24px",
  },
  form: {
    display:       "flex",
    flexDirection: "column",
    gap:           "16px",
  },
  inputGroup: {
    display:       "flex",
    flexDirection: "column",
    gap:           "6px",
  },
  label: {
    fontSize:   "14px",
    fontWeight: "600",
    color:      "#333",
  },
  input: {
    padding:      "12px",
    borderRadius: "8px",
    border:       "1px solid #ddd",
    fontSize:     "14px",
    outline:      "none",
  },
  button: {
    padding:         "12px",
    backgroundColor: "#2d6a4f",
    color:           "#fff",
    border:          "none",
    borderRadius:    "8px",
    fontSize:        "16px",
    fontWeight:      "bold",
    cursor:          "pointer",
    marginTop:       "8px",
  },
  buttonDisabled: {
    padding:         "12px",
    backgroundColor: "#aaa",
    color:           "#fff",
    border:          "none",
    borderRadius:    "8px",
    fontSize:        "16px",
    cursor:          "not-allowed",
    marginTop:       "8px",
  },
  link: {
    textAlign:  "center",
    marginTop:  "20px",
    fontSize:   "14px",
    color:      "#555",
  },
  linkText: {
    color:          "#2d6a4f",
    fontWeight:     "bold",
    textDecoration: "none",
  },
};

export default Login;