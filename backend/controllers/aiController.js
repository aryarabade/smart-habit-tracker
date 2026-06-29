// backend/controllers/aiController.js
// Connects to your aiService.js (Grok) functions

import {
  suggestHabitsUsingGrok,
  chatWithGrok,
  weeklyFeedbackUsingGrok,
  insightUsingGrok,
} from "../services/aiService.js";

import Habit     from "../models/Habit.js";
import HabitLog  from "../models/HabitLog.js";
import Mood      from "../models/Mood.js";

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/ai/suggest
// Body: { goals: ["fitness","sleep",...] }
// Returns: { suggestions: [{name, category, icon, reason}, ...] }
// ─────────────────────────────────────────────────────────────────────────────
export const getSuggestions = async (req, res) => {
  try {
    const { goals = [] } = req.body;

    if (!goals.length) {
      return res.status(400).json({ message: "Please provide at least one goal." });
    }

    // Fetch current habit names so AI avoids duplicates
    const existing = await Habit.find({ user: req.user.id }).select("name").lean();
    const currentHabits = existing.map(h => h.name);

    const suggestions = await suggestHabitsUsingGrok(goals, currentHabits);

    // Ensure it's always an array
    const result = Array.isArray(suggestions) ? suggestions : [];
    return res.json({ suggestions: result });

  } catch (err) {
    console.error("AI suggest error:", err.message);
    return res.status(500).json({ message: "AI suggestion failed. Check your GROK_API_KEY." });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/ai/chat
// Body: { message: "string", history: [{role, content}, ...] }
// Returns: { reply: "string" }
// ─────────────────────────────────────────────────────────────────────────────
export const chatWithCoach = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ message: "Message is required." });
    }

    // Keep history to last 10 messages to stay within token limits
    const trimmedHistory = history.slice(-10);

    const reply = await chatWithGrok(message, trimmedHistory);
    return res.json({ reply: reply || "I couldn't generate a response. Please try again!" });

  } catch (err) {
    console.error("AI chat error:", err.message);
    return res.status(500).json({ message: "AI chat failed. Check your GROK_API_KEY." });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/ai/feedback
// Returns weekly feedback based on user's actual habit data
// ─────────────────────────────────────────────────────────────────────────────
export const getWeeklyFeedback = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user.id }).lean();

    // Build completion rate map from last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const logs = await HabitLog.find({
      habit:       { $in: habits.map(h => h._id) },
      completedAt: { $gte: sevenDaysAgo },
    }).lean();

    const completionRates = {};
    habits.forEach(h => {
      const count = logs.filter(l => l.habit.toString() === h._id.toString()).length;
      completionRates[h.name] = `${Math.round((count / 7) * 100)}%`;
    });

    const feedback = await weeklyFeedbackUsingGrok(
      habits.map(h => h.name),
      completionRates
    );

    return res.json({ feedback: feedback || "Keep going — consistency is key!" });

  } catch (err) {
    console.error("AI feedback error:", err.message);
    return res.status(500).json({ message: "Feedback generation failed." });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/ai/insight
// Returns mood + habit correlation insight
// ─────────────────────────────────────────────────────────────────────────────
export const getMoodInsight = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [moods, habits] = await Promise.all([
      Mood.find({ user: req.user.id, createdAt: { $gte: sevenDaysAgo } }).lean(),
      Habit.find({ user: req.user.id }).select("name").lean(),
    ]);

    const moodList  = moods.map(m => ({ mood: m.mood, date: m.createdAt }));
    const habitList = habits.map(h => h.name);

    const insight = await insightUsingGrok(moodList, habitList);
    return res.json({ insight: insight || "Track more moods and habits to get personalized insights!" });

  } catch (err) {
    console.error("AI insight error:", err.message);
    return res.status(500).json({ message: "Insight generation failed." });
  }
};
