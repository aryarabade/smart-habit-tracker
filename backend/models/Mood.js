import mongoose from "mongoose";

const moodSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mood:  { type: String, required: true }, // "happy", "neutral", "sad"
    note:  { type: String, default: "" },    // short journal entry
    date:  { type: String, required: true }, // "2024-01-15"
  },
  { timestamps: true }
);

export default mongoose.model("Mood", moodSchema);