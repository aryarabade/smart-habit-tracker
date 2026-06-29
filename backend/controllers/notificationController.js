import Notification from "../models/Notification.js";
import Habit from "../models/Habit.js";

// ✅ CREATE — Add new reminder
export const createNotification = async (req, res) => {
  try {
    const { habitId, message, scheduledAt } = req.body;

    if (!message || !scheduledAt) {
      return res.status(400).json({ message: "Message and time are required" });
    }

    // check if habit exists
    if (habitId) {
      const habit = await Habit.findById(habitId);
      if (!habit) {
        return res.status(404).json({ message: "Habit not found" });
      }
    }

    const notification = await Notification.create({
      user:        req.user,
      habit:       habitId || null,
      message,
      scheduledAt, // "08:00" or "20:00"
      sent:        false,
    });

    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET ALL — Get all reminders of logged in user
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user, sent: false })
      .populate("habit", "title category") // show habit title too
      .sort({ scheduledAt: 1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ UPDATE — Edit reminder time or message
export const updateNotification = async (req, res) => {
  try {
    const { message, scheduledAt } = req.body;

    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    // make sure user owns this notification
    if (notification.user.toString() !== req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (message)      notification.message     = message;
    if (scheduledAt)  notification.scheduledAt = scheduledAt;
    notification.sent = false; // reset sent status after update

    const updated = await notification.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ DELETE — Remove a reminder
export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.user.toString() !== req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await notification.deleteOne();
    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPendingNotifications = async (req, res) => {
  try {
    const now     = new Date();
    const hours   = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const currentTime = `${hours}:${minutes}`;

    console.log("Current time checking:", currentTime); // ← see in terminal

    // find ALL unsent notifications for this user
    const allNotifications = await Notification.find({
      user: req.user,
      sent: false,
    });

    console.log("All unsent notifications:", allNotifications); // ← check terminal

    // filter by time
    const pending = allNotifications.filter(
      (n) => n.scheduledAt === currentTime
    );

    console.log("Pending right now:", pending); // ← check terminal

    res.json(pending);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};