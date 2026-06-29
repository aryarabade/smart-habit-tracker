import express from "express";
import {
  createNotification,
  getNotifications,
  updateNotification,
  deleteNotification,
   getPendingNotifications,
} from "../controllers/notificationController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/",     protect, createNotification);  // create reminder
router.get("/",      protect, getNotifications); 
   // get all reminders
router.get("/pending", protect, getPendingNotifications); // get pending notifications
router.put("/:id",   protect, updateNotification);  // update reminder
router.delete("/:id",protect, deleteNotification);  // delete reminder

export default router;