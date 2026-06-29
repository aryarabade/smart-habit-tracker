import cron from "node-cron";
import Notification from "../models/Notification.js";

export const startReminderJob = () => {
  // runs every minute
  cron.schedule("* * * * *", async () => {
    try {
      // get current time in "HH:MM" format
      const now = new Date();
      const hours   = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const currentTime = `${hours}:${minutes}`; // e.g. "08:00"

      // find all unsent notifications scheduled for right now
      const dueNotifications = await Notification.find({
        scheduledAt: currentTime,
        sent:        false,
      }).populate("user", "name email")
        .populate("habit", "title");

      if (dueNotifications.length === 0) return;

      for (const notification of dueNotifications) {
        // for now just log it — later connect email or push notification
        console.log(`
          ⏰ REMINDER for ${notification.user.name}
          📌 Habit: ${notification.habit?.title || "General"}
          💬 Message: ${notification.message}
          🕐 Time: ${currentTime}
        `);

        // DON'T mark as sent here - let frontend handle delivery
        // notification.sent = true;
        // await notification.save();
      }
    } catch (error) {
      console.error("Reminder job error:", error.message);
    }
  });

  console.log("Reminder job started - checking every minute");
};