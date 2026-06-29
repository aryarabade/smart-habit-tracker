import Habit from "../models/Habit.js";
import HabitLog from "../models/HabitLog.js";
import Notification from "../models/Notification.js";

// ✅ CREATE — Add new habit
export const createHabit = async (req, res) => {
  try {
    const { title, icon, category, frequency, reminderTime } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const habit = await Habit.create({
      user: req.user,
      title,
      icon:          icon || "📌",
      category:      category || "general",
      frequency:     frequency || "daily",
      reminderTime:  reminderTime || "",
    });

    // Create notification if reminderTime is set
    if (reminderTime) {
      await Notification.create({
        user: req.user,
        habit: habit._id,
        message: `Reminder: ${title}`,
        scheduledAt: reminderTime,
        sent: false,
      });
    }

    res.status(201).json(habit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ READ — Get all habits of logged in user
export const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user, isActive: true });
    const today = new Date().toISOString().split("T")[0];
    const logs = await HabitLog.find({ user: req.user, date: today }).select("habit");
    const completedIds = new Set(logs.map((log) => log.habit.toString()));
    const habitsWithStatus = habits.map((habit) => ({
      ...habit.toObject(),
      completedToday: completedIds.has(habit._id.toString()),
    }));
    res.json(habitsWithStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ READ ONE — Get single habit by id
export const getHabitById = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    res.json(habit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ UPDATE — Edit habit title, category etc
export const updateHabit = async (req, res) => {
  try {
    const { title, icon, category, frequency, reminderTime } = req.body;

    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    // only update fields that were sent
    if (title)        habit.title        = title;
    if (icon)         habit.icon         = icon;
    if (category)     habit.category     = category;
    if (frequency)    habit.frequency    = frequency;
    if (reminderTime !== undefined) habit.reminderTime = reminderTime;

    const updated = await habit.save();

    // Handle notification updates
    if (reminderTime !== undefined) {
      const existingNotification = await Notification.findOne({
        user: req.user,
        habit: habit._id,
        sent: false,
      });

      if (reminderTime && reminderTime.trim() !== "") {
        // Create or update notification
        if (existingNotification) {
          existingNotification.message = `Reminder: ${habit.title}`;
          existingNotification.scheduledAt = reminderTime;
          await existingNotification.save();
        } else {
          await Notification.create({
            user: req.user,
            habit: habit._id,
            message: `Reminder: ${habit.title}`,
            scheduledAt: reminderTime,
            sent: false,
          });
        }
      } else {
        // Remove notification if reminderTime is cleared
        if (existingNotification) {
          await existingNotification.deleteOne();
        }
      }
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ DELETE — Soft delete (just mark inactive)
export const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    habit.isActive = false;
    await habit.save();

    // Delete associated notifications
    await Notification.deleteMany({
      user: req.user,
      habit: habit._id,
    });

    res.json({ message: "Habit deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ COMPLETE — Mark habit as done today + update streak
export const completeHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    const today = new Date().toISOString().split("T")[0]; // "2024-01-15"

    // check if already completed today
    const alreadyDone = await HabitLog.findOne({
      habit: habit._id,
      user:  req.user,
      date:  today,
    });

    if (alreadyDone) {
      return res.status(400).json({ message: "Already completed today!" });
    }

    // save to habitlogs collection
    await HabitLog.create({
      user:      req.user,
      habit:     habit._id,
      date:      today,
      completed: true,
    });

    // update streak
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    const doneYesterday = await HabitLog.findOne({
      habit: habit._id,
      user:  req.user,
      date:  yesterdayStr,
    });

    // if done yesterday → continue streak, else reset to 1
    habit.streak        = doneYesterday ? habit.streak + 1 : 1;
    habit.lastCompleted = new Date();

    await habit.save();

    res.json({ message: "Habit completed!", habit });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET LOGS FOR MONTH — Fetch all logs for a specific month
export const getLogsForMonth = async (req, res) => {
  try {
    const { year, month } = req.query;

    if (!year || !month) {
      return res.status(400).json({ message: "Year and month are required" });
    }

    const paddedMonth = String(month).padStart(2, "0");
    const prefix = `${year}-${paddedMonth}`;

    // Get all logs for this user in the specified month
    const logs = await HabitLog.find({
      user: req.user,
      date: { $regex: `^${prefix}` },
    })
      .select("date habit completed")
      .populate("habit", "title icon");

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};