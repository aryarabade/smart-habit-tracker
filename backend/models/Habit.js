import mongoose from "mongoose";

const habitSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title:         { type: String, required: true },
    icon:          { type: String, default: "📌" },
    category:      { type: String, default: "general" }, // health, fitness, learning
    frequency:     { type: String, default: "daily" },   // daily, weekly
    streak:        { type: Number, default: 0 },
    reminderTime:  { type: String, default: "" },        // "08:00"
    lastCompleted: { type: Date },
    isActive:      { type: Boolean, default: true },
  },
  { timestamps: true }  // adds createdAt and updatedAt automatically
);

const Habit = mongoose.model("Habit", habitSchema);
export default Habit;