import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const features = [
  { icon: "🎯", title: "Smart Habit Tracking",    desc: "Create daily and weekly habits with streak tracking. Never lose your momentum with our intelligent reminder system." },
  { icon: "🤖", title: "AI Personal Coach",       desc: "Get personalized habit suggestions and weekly feedback powered by Claude AI. Your goals, analyzed intelligently." },
  { icon: "📊", title: "Analytics Dashboard",     desc: "Visualize your progress with beautiful charts, heatmaps and streak statistics. See exactly where you stand." },
  { icon: "😊", title: "Mood Tracking",           desc: "Log your daily mood and journal entries. AI connects your mood patterns with habit consistency automatically." },
  { icon: "📅", title: "Calendar View",           desc: "See your entire month at a glance. Green for completed, red for missed. Track your consistency visually." },
  { icon: "🔔", title: "Smart Reminders",         desc: "Set custom reminders for each habit. Never miss a habit again with our intelligent notification system." },
  { icon: "🔥", title: "Streak System",           desc: "Build unstoppable momentum with streaks. Earn medals for 7 day and 30 day streaks. Stay consistent!" },
  
];

const quotes = [
  { text: "We are what we repeatedly do. Excellence is not an act, but a habit.", author: "Aristotle" },
  { text: "Motivation gets you started. Habit keeps you going.",                  author: "Jim Ryun" },
  { text: "Small daily improvements lead to stunning results.",                   author: "Robin Sharma" },
  { text: "Your future is created by what you do today, not tomorrow.",           author: "Robert Kiyosaki" },
  { text: "Success is the sum of small efforts, repeated day in and day out.",    author: "Robert Collier" },
];

const Home = () => {
  const [time,  setTime]  = useState(new Date());
  const [quote, setQuote] = useState(quotes[0]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    setQuote(quotes[new Date().getDay() % quotes.length]);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-IN", {
      hour:   "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-IN", {
      weekday: "long",
      year:    "numeric",
      month:   "long",
      day:     "numeric",
    });
  };

  return (
    <div style={styles.page}>

      {/* Navbar */}
      <nav style={styles.nav}>
        <div style={styles.navLogo}>🌱 HabitTracker</div>
        <div style={styles.navLinks}>
          <Link to="/login"    style={styles.navLogin}>Login</Link>
          <Link to="/register" style={styles.navRegister}>Get Started Free</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={styles.hero}>

        {/* Live Date Time */}
        <div style={styles.dateTimePill}>
          <span style={styles.dateTimeIcon}>🕐</span>
          <span style={styles.dateTimeText}>
            {formatDate(time)} &nbsp;|&nbsp; {formatTime(time)}
          </span>
        </div>

        {/* Hero Content */}
        <h1 style={styles.heroTitle}>
          Build Habits That
          <span style={styles.heroHighlight}> Actually Stick</span>
        </h1>

        <p style={styles.heroSubtitle}>
          Your AI-powered habit coach that tracks progress, analyzes mood patterns,
          and gives personalized coaching — all in one beautiful dashboard.
        </p>

        {/* CTA Buttons */}
        <div style={styles.ctaRow}>
          <Link to="/register" style={styles.ctaPrimary}>
            🚀 Start For Free
          </Link>
          <Link to="/login" style={styles.ctaSecondary}>
            👤 Login to Dashboard
          </Link>
        </div>

        {/* Stats Row */}
        <div style={styles.statsRow}>
          {[
            { number: "7+",   label: "Features"        },
            { number: "AI",   label: "Powered Coach"   },
            { number: "100%", label: "Free to Use"     },
            { number: "24/7", label: "Smart Reminders" },
          ].map((stat) => (
            <div key={stat.label} style={styles.statItem}>
              <span style={styles.statNumber}>{stat.number}</span>
              <span style={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>

      </section>

      {/* Quote Section */}
      <section style={styles.quoteSection}>
        <div style={styles.quoteCard}>
          <span style={styles.quoteIcon}>💡</span>
          <div>
            <p style={styles.quoteText}>"{quote.text}"</p>
            <p style={styles.quoteAuthor}>— {quote.author}</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.featuresSection}>
        <h2 style={styles.sectionTitle}>Everything You Need to Build Better Habits</h2>
        <p style={styles.sectionSubtitle}>
          Powerful features designed to make habit building simple, fun and effective
        </p>

        <div style={styles.featuresGrid}>
          {features.map((feature) => (
            <div key={feature.title} style={styles.featureCard}>
              <div style={styles.featureIcon}>{feature.icon}</div>
              <h3 style={styles.featureTitle}>{feature.title}</h3>
              <p style={styles.featureDesc}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section style={styles.howSection}>
        <h2 style={styles.sectionTitle}>How It Works</h2>
        <div style={styles.stepsRow}>
          {[
            { step: "01", icon: "📝", title: "Create Account",    desc: "Sign up for free in seconds. No credit card needed." },
            { step: "02", icon: "🎯", title: "Add Your Habits",   desc: "Add habits with categories, frequency and reminders." },
            { step: "03", icon: "✅", title: "Track Daily",       desc: "Mark habits done daily and watch streaks grow." },
            { step: "04", icon: "🤖", title: "Get AI Insights",   desc: "Receive personalized coaching and weekly feedback." },
          ].map((step) => (
            <div key={step.step} style={styles.stepCard}>
              <div style={styles.stepNumber}>{step.step}</div>
              <div style={styles.stepIcon}>{step.icon}</div>
              <h3 style={styles.stepTitle}>{step.title}</h3>
              <p style={styles.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section style={styles.finalCta}>
        <h2 style={styles.finalCtaTitle}>Ready to Transform Your Life?</h2>
        <p style={styles.finalCtaSubtitle}>
          Join thousands of people building better habits every day
        </p>
        <Link to="/register" style={styles.finalCtaBtn}>
          🌱 Start Building Habits Today
        </Link>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerLogo}>🌱 HabitTracker</div>
          <p style={styles.footerTagline}>
            Your AI-powered companion for building better habits
          </p>
          <div style={styles.footerLinks}>
            <Link to="/login"    style={styles.footerLink}>Login</Link>
            <span style={styles.footerDot}>•</span>
            <Link to="/register" style={styles.footerLink}>Register</Link>
          </div>
          <p style={styles.footerCopy}>
            © {new Date().getFullYear()} HabitTracker. Built with ❤️ using MERN + AI
          </p>
        </div>
      </footer>

    </div>
  );
};

const styles = {
  page: {
    minHeight:       "100vh",
    backgroundColor: "#f0f4f8",
    fontFamily:      "'Segoe UI', sans-serif",
  },

  // Navbar
  nav: {
    display:         "flex",
    justifyContent:  "space-between",
    alignItems:      "center",
    padding:         "18px 48px",
    backgroundColor: "#ffffff",
    boxShadow:       "0 2px 20px rgba(0,0,0,0.08)",
    position:        "sticky",
    top:             0,
    zIndex:          100,
  },
  navLogo: {
    fontSize:   "24px",
    fontWeight: "800",
    color:      "#2d6a4f",
  },
  navLinks: {
    display:    "flex",
    alignItems: "center",
    gap:        "16px",
  },
  navLogin: {
    padding:        "10px 24px",
    color:          "#2d6a4f",
    textDecoration: "none",
    fontWeight:     "600",
    fontSize:       "15px",
    borderRadius:   "8px",
    border:         "2px solid #2d6a4f",
  },
  navRegister: {
    padding:         "10px 24px",
    backgroundColor: "#2d6a4f",
    color:           "#fff",
    textDecoration:  "none",
    fontWeight:      "700",
    fontSize:        "15px",
    borderRadius:    "8px",
  },

  // Hero
  hero: {
    background:     "linear-gradient(135deg, #1b4332 0%, #2d6a4f 50%, #40916c 100%)",
    padding:        "80px 48px",
    textAlign:      "center",
    display:        "flex",
    flexDirection:  "column",
    alignItems:     "center",
    gap:            "24px",
  },
  dateTimePill: {
    display:         "flex",
    alignItems:      "center",
    gap:             "8px",
    backgroundColor: "rgba(255,255,255,0.15)",
    padding:         "10px 24px",
    borderRadius:    "50px",
    backdropFilter:  "blur(10px)",
    border:          "1px solid rgba(255,255,255,0.2)",
  },
  dateTimeIcon: {
    fontSize: "16px",
  },
  dateTimeText: {
    color:      "#ffffff",
    fontSize:   "14px",
    fontWeight: "600",
    letterSpacing: "0.5px",
  },
  heroTitle: {
    fontSize:   "56px",
    fontWeight: "900",
    color:      "#ffffff",
    lineHeight: "1.2",
    maxWidth:   "700px",
    margin:     "0",
  },
  heroHighlight: {
    color:          "#b7e4c7",
    display:        "block",
  },
  heroSubtitle: {
    fontSize:   "18px",
    color:      "#d8f3dc",
    maxWidth:   "560px",
    lineHeight: "1.7",
    margin:     "0",
  },
  ctaRow: {
    display: "flex",
    gap:     "16px",
  },
  ctaPrimary: {
    padding:         "16px 36px",
    backgroundColor: "#ffffff",
    color:           "#2d6a4f",
    textDecoration:  "none",
    fontWeight:      "800",
    fontSize:        "16px",
    borderRadius:    "12px",
    boxShadow:       "0 4px 20px rgba(0,0,0,0.2)",
  },
  ctaSecondary: {
    padding:         "16px 36px",
    backgroundColor: "rgba(255,255,255,0.15)",
    color:           "#ffffff",
    textDecoration:  "none",
    fontWeight:      "700",
    fontSize:        "16px",
    borderRadius:    "12px",
    border:          "2px solid rgba(255,255,255,0.4)",
  },
  statsRow: {
    display:         "flex",
    gap:             "48px",
    marginTop:       "16px",
    backgroundColor: "rgba(255,255,255,0.1)",
    padding:         "20px 48px",
    borderRadius:    "16px",
    backdropFilter:  "blur(10px)",
  },
  statItem: {
    display:       "flex",
    flexDirection: "column",
    alignItems:    "center",
    gap:           "4px",
  },
  statNumber: {
    fontSize:   "28px",
    fontWeight: "900",
    color:      "#ffffff",
  },
  statLabel: {
    fontSize: "13px",
    color:    "#b7e4c7",
  },

  // Quote
  quoteSection: {
    padding: "48px 48px",
  },
  quoteCard: {
    background:    "linear-gradient(135deg, #2d6a4f, #40916c)",
    borderRadius:  "20px",
    padding:       "32px 40px",
    display:       "flex",
    alignItems:    "flex-start",
    gap:           "20px",
    maxWidth:      "900px",
    margin:        "0 auto",
    boxShadow:     "0 8px 32px rgba(45,106,79,0.3)",
  },
  quoteIcon: {
    fontSize:  "40px",
    flexShrink: 0,
  },
  quoteText: {
    fontSize:     "20px",
    color:        "#ffffff",
    fontStyle:    "italic",
    lineHeight:   "1.7",
    marginBottom: "10px",
    fontWeight:   "500",
  },
  quoteAuthor: {
    fontSize:   "15px",
    color:      "#b7e4c7",
    fontWeight: "700",
  },

  // Features
  featuresSection: {
    padding:   "64px 48px",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize:     "36px",
    fontWeight:   "800",
    color:        "#1b4332",
    marginBottom: "12px",
  },
  sectionSubtitle: {
    fontSize:     "16px",
    color:        "#777",
    marginBottom: "48px",
  },
  featuresGrid: {
    display:             "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap:                 "20px",
    maxWidth:            "1200px",
    margin:              "0 auto",
  },
  featureCard: {
    backgroundColor: "#ffffff",
    borderRadius:    "20px",
    padding:         "28px 24px",
    textAlign:       "left",
    boxShadow:       "0 4px 20px rgba(0,0,0,0.06)",
    borderTop:       "4px solid #2d6a4f",
    transition:      "transform 0.2s",
  },
  featureIcon: {
    fontSize:     "36px",
    marginBottom: "16px",
  },
  featureTitle: {
    fontSize:     "17px",
    fontWeight:   "700",
    color:        "#1b4332",
    marginBottom: "10px",
  },
  featureDesc: {
    fontSize:   "14px",
    color:      "#777",
    lineHeight: "1.7",
  },

  // How it works
  howSection: {
    backgroundColor: "#1b4332",
    padding:         "64px 48px",
    textAlign:       "center",
  },
  stepsRow: {
    display:             "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap:                 "24px",
    maxWidth:            "1100px",
    margin:              "40px auto 0",
  },
  stepCard: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius:    "20px",
    padding:         "32px 24px",
    textAlign:       "center",
    border:          "1px solid rgba(255,255,255,0.1)",
  },
  stepNumber: {
    fontSize:     "13px",
    fontWeight:   "800",
    color:        "#74c69d",
    letterSpacing:"2px",
    marginBottom: "12px",
  },
  stepIcon: {
    fontSize:     "36px",
    marginBottom: "16px",
  },
  stepTitle: {
    fontSize:     "17px",
    fontWeight:   "700",
    color:        "#ffffff",
    marginBottom: "10px",
  },
  stepDesc: {
    fontSize:   "14px",
    color:      "#95d5b2",
    lineHeight: "1.7",
  },

  // Final CTA
  finalCta: {
    padding:        "80px 48px",
    textAlign:      "center",
    background:     "linear-gradient(135deg, #d8f3dc, #b7e4c7)",
  },
  finalCtaTitle: {
    fontSize:     "40px",
    fontWeight:   "800",
    color:        "#1b4332",
    marginBottom: "16px",
  },
  finalCtaSubtitle: {
    fontSize:     "18px",
    color:        "#40916c",
    marginBottom: "32px",
  },
  finalCtaBtn: {
    display:         "inline-block",
    padding:         "18px 48px",
    backgroundColor: "#2d6a4f",
    color:           "#ffffff",
    textDecoration:  "none",
    fontWeight:      "800",
    fontSize:        "18px",
    borderRadius:    "14px",
    boxShadow:       "0 8px 32px rgba(45,106,79,0.4)",
  },

  // Footer
  footer: {
    backgroundColor: "#1b4332",
    padding:         "48px 48px",
    textAlign:       "center",
  },
  footerContent: {
    display:       "flex",
    flexDirection: "column",
    alignItems:    "center",
    gap:           "12px",
  },
  footerLogo: {
    fontSize:   "24px",
    fontWeight: "800",
    color:      "#ffffff",
  },
  footerTagline: {
    fontSize: "14px",
    color:    "#95d5b2",
  },
  footerLinks: {
    display:    "flex",
    alignItems: "center",
    gap:        "12px",
  },
  footerLink: {
    color:          "#74c69d",
    textDecoration: "none",
    fontSize:       "14px",
    fontWeight:     "600",
  },
  footerDot: {
    color: "#95d5b2",
  },
  footerCopy: {
    fontSize: "13px",
    color:    "#52b788",
    marginTop:"8px",
  },
};

export default Home;