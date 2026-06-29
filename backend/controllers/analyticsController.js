import Habit from "../models/Habit.js";
import HabitLog from "../models/HabitLog.js";
import Mood from "../models/Mood.js";


// ✅ SUMMARY — total habits, best streak, completion rate
export const getSummary = async (req, res) => {
  try {
    // get all active habits
    const habits = await Habit.find({ user: req.user, isActive: true });

    // get all habit logs
    const logs = await HabitLog.find({
      user:      req.user,
      completed: true,
    });

    // total habits count
    const totalHabits = habits.length;

    // best streak among all habits
    const bestStreak = habits.reduce((max, h) => {
      return h.streak > max ? h.streak : max;
    }, 0);

    // completion rate — last 7 days
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      last7Days.push(date.toISOString().split("T")[0]);
    }

    const logsLast7 = logs.filter((l) => last7Days.includes(l.date));
    const totalPossible = totalHabits * 7;
    const completionRate = totalPossible > 0
      ? Math.round((logsLast7.length / totalPossible) * 100)
      : 0;

    // total completions ever
    const totalCompletions = logs.length;

    res.json({
      totalHabits,
      bestStreak,
      completionRate: `${completionRate}%`,
      totalCompletions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ HEATMAP — last 30 days data for calendar
export const getHeatmap = async (req, res) => {
  try {
    // build last 30 days array
    const last30Days = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      last30Days.push(date.toISOString().split("T")[0]);
    }

    // get all logs in last 30 days
    const logs = await HabitLog.find({
      user:      req.user,
      date:      { $in: last30Days },
      completed: true,
    });

    // group logs by date — count completions per day
    const heatmap = last30Days.map((date) => {
      const count = logs.filter((l) => l.date === date).length;
      return {
        date,
        count,
        level: count === 0 ? 0        // no activity
             : count <= 1 ? 1         // low
             : count <= 3 ? 2         // medium
             : count <= 5 ? 3         // high
             : 4,                     // very high
      };
    });

    res.json(heatmap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ WEEKLY — last 7 days completion count for bar chart
export const getWeeklyStats = async (req, res) => {
  try {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      last7Days.push(date.toISOString().split("T")[0]);
    }

    const logs = await HabitLog.find({
      user:      req.user,
      date:      { $in: last7Days },
      completed: true,
    });

    const moods = await Mood.find({
      user: req.user,
      date: { $in: last7Days },
    });

    // build weekly data with mood included
    const weekly = last7Days.map((date) => {
      const dayName = new Date(date).toLocaleDateString("en-US", {
        weekday: "short",
      }); // "Mon", "Tue" etc

      return {
        date,
        day:            dayName,
        habitsCompleted: logs.filter((l) => l.date === date).length,
        mood:           moods.find((m) => m.date === date)?.mood || "none",
      };
    });

    res.json(weekly);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ BEST DAY — which day of week you complete most habits
export const getBestDay = async (req, res) => {
  try {
    const logs = await HabitLog.find({
      user:      req.user,
      completed: true,
    });

    // count completions per day of week
    const dayCounts = {
      Sunday: 0, Monday: 0, Tuesday: 0, Wednesday: 0,
      Thursday: 0, Friday: 0, Saturday: 0,
    };

    logs.forEach((log) => {
      const dayName = new Date(log.date).toLocaleDateString("en-US", {
        weekday: "long",
      });
      if (dayCounts[dayName] !== undefined) {
        dayCounts[dayName]++;
      }
    });

    // find the best day
    const bestDay = Object.entries(dayCounts).reduce((best, [day, count]) => {
      return count > best.count ? { day, count } : best;
    }, { day: "None", count: 0 });

    res.json({
      bestDay:   bestDay.day,
      count:     bestDay.count,
      allDays:   dayCounts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/analytics/calendar?habitId=xxx&year=2024&month=1
export const getCalendarData = async (req, res) => {
  try {
    const { habitId, year, month } = req.query;

    const paddedMonth = String(month).padStart(2, "0");
    const prefix      = `${year}-${paddedMonth}`;

    const logs = await HabitLog.find({
      user:      req.user,
      habit:     habitId,
      completed: true,
      date:      { $regex: `^${prefix}` },
    });

    const completedDates = logs.map((l) => l.date);
    res.json(completedDates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};