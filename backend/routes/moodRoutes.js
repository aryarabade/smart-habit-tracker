import express from "express";
import {
  createMood,
  getMoods,
  getTodayMood,
  deleteMood,
  getMoodWithHabits,
} from "../controllers/moodController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/",             protect, createMood);        // save mood
router.get("/",              protect, getMoods);          // get all moods
router.get("/today",         protect, getTodayMood);      // get today's mood
router.get("/with-habits",   protect, getMoodWithHabits); // mood + habits combined
router.delete("/:id",        protect, deleteMood);        // delete mood

export default router;