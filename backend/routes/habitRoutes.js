import express from "express";
import {
  createHabit,
  getHabits,
  getHabitById,
  updateHabit,
  deleteHabit,
  completeHabit,
  getLogsForMonth,
} from "../controllers/habitController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/",              protect, createHabit);   // add habit
router.get("/",               protect, getHabits);     // get all habits
router.get("/logs/month",     protect, getLogsForMonth); // get logs for month
router.get("/:id",            protect, getHabitById);  // get one habit
router.put("/:id",            protect, updateHabit);   // edit habit
router.delete("/:id",         protect, deleteHabit);   // delete habit
router.put("/:id/complete",   protect, completeHabit); // mark done

export default router;