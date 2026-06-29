import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

dotenv.config();

import authRoutes from "./routes/authRoutes.js";
import habitRoutes from "./routes/habitRoutes.js";
import moodRoutes from "./routes/moodRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import { startReminderJob } from "./jobs/reminderJob.js";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/mood", moodRoutes); 
app.use("/api/analytics", analyticsRoutes); 
app.use("/api/notifications", notificationRoutes);
app.use("/api/ai", aiRoutes);   // ← ADD THIS

// START SERVER AFTER DB CONNECT
const startServer = async () => {
  try {
    console.log("Connecting to DB...");

    await connectDB();

    console.log("MongoDB Connected ✅");

    startReminderJob(); // ← ADD THIS (starts after DB connects)

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} 🚀`);
    });

  } catch (error) {
    console.error("DB Connection Failed ❌");
    console.error(error.message);
    process.exit(1);
  }
  
};

startServer();