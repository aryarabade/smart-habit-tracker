import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Analytics from "./pages/Analytics";
import Habits from "./pages/Habits";
import Mood from "./pages/Mood";
import AIChat from "./pages/AIChat";
import AISuggest from "./pages/AISuggest";
import Notifications from "./pages/Notifications";
import DashboardLayout from "./components/DashboardLayout";
import useReminders from "./hooks/useReminders";

// ── Protected route wrapper ─────────────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
};

// ── All routes live here so they have AuthContext ───────────────────────────
const AppRoutes = () => {
  useReminders();

  return (
    <Routes>
      {/* Public */}
      <Route path="/"          element={<Home />} />
      <Route path="/home"      element={<Home />} />
      <Route path="/login"     element={<Login />} />
      <Route path="/register"  element={<Register />} />

      {/* Protected — DashboardLayout wraps all dashboard pages via <Outlet /> */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard"    element={<Dashboard />} />
        <Route path="/habits"       element={<Habits />} />
        <Route path="/mood"         element={<Mood />} />
        <Route path="/analytics"    element={<Analytics />} />
        <Route path="/ai-chat"      element={<AIChat />} />
        <Route path="/ai-suggest"   element={<AISuggest />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile"      element={<Profile />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// ── Root app ────────────────────────────────────────────────────────────────
const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{ style: { zIndex: 99999 } }}
        containerStyle={{ zIndex: 99999, top: 80 }}
      />
      <AppRoutes />
    </BrowserRouter>
  </AuthProvider>
);

export default App;
