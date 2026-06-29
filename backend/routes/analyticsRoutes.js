import express from "express";
import {
  getSummary,
  getHeatmap,
  getWeeklyStats,
  getBestDay,
  getCalendarData,
} from "../controllers/analyticsController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/summary",  protect, getSummary);
router.get("/heatmap",  protect, getHeatmap);
router.get("/weekly",   protect, getWeeklyStats);
router.get("/best-day", protect, getBestDay);
router.get("/calendar", protect, getCalendarData);

export default router;