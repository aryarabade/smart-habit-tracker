import mongoose from "mongoose";

const habitLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    habit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Habit",
      required: true,
    },
    date:      { type: String, required: true }, // "2024-01-15"
    completed: { type: Boolean, default: false },
    note:      { type: String, default: "" },
  },
  { timestamps: true }
);

const HabitLog = mongoose.model("HabitLog", habitLogSchema);
export default HabitLog;  // ← this line was missing!