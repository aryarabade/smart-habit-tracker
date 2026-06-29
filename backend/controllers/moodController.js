import Mood from "../models/Mood.js";
import HabitLog from "../models/HabitLog.js";

// ✅ CREATE — Save today's mood
export const createMood = async (req, res) => {
  try {
    const { mood, note } = req.body;

    if (!mood) {
      return res.status(400).json({ message: "Mood is required" });
    }

    const today = new Date().toISOString().split("T")[0]; // "2024-01-15"

    // check if mood already saved today
    const alreadyExists = await Mood.findOne({
      user: req.user,
      date: today,
    });

    if (alreadyExists) {
      return res.status(400).json({ message: "Mood already saved for today!" });
    }

    const newMood = await Mood.create({
      user: req.user,
      mood,
      note: note || "",
      date: today,
    });

    res.status(201).json(newMood);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET ALL — Get all moods of logged in user
export const getMoods = async (req, res) => {
  try {
    const moods = await Mood.find({ user: req.user }).sort({ date: -1 });
    res.json(moods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET TODAY — Get only today's mood
export const getTodayMood = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const mood = await Mood.findOne({
      user: req.user,
      date: today,
    });

    if (!mood) {
      return res.status(404).json({ message: "No mood saved for today" });
    }

    res.json(mood);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ DELETE — Delete a mood entry
export const deleteMood = async (req, res) => {
  try {
    const mood = await Mood.findById(req.params.id);

    if (!mood) {
      return res.status(404).json({ message: "Mood not found" });
    }

    // make sure user owns this mood
    if (mood.user.toString() !== req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await mood.deleteOne();
    res.json({ message: "Mood deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ AI READY — Get mood + habit data together (for AI analysis later)
export const getMoodWithHabits = async (req, res) => {
  try {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      last7Days.push(date.toISOString().split("T")[0]);
    }

    // get moods for last 7 days
    const moods = await Mood.find({
      user: req.user,
      date: { $in: last7Days },
    });

    // get habit completions for last 7 days
    const habitLogs = await HabitLog.find({
      user:      req.user,
      date:      { $in: last7Days },
      completed: true,
    });

    // combine both by date
    const combined = last7Days.map((date) => ({
      date,
      mood:           moods.find((m) => m.date === date)?.mood || "none",
      note:           moods.find((m) => m.date === date)?.note || "",
      habitsCompleted: habitLogs.filter((h) => h.date === date).length,
    }));

    res.json(combined);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};