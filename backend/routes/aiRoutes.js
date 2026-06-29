// backend/routes/aiRoutes.js
import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  getSuggestions,
  chatWithCoach,
  getWeeklyFeedback,
  getMoodInsight,
} from "../controllers/aiController.js";

const router = express.Router();

// All AI routes are protected — user must be logged in
router.post("/suggest",   protect, getSuggestions);    // Goal-based habit suggestions
router.post("/chat",      protect, chatWithCoach);     // Conversational AI coach
router.get("/feedback",   protect, getWeeklyFeedback); // Weekly habit feedback
router.get("/insight",    protect, getMoodInsight);    // Mood + habit insight

export default router;
