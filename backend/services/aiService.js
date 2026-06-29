// backend/services/aiService.js
// Uses Groq Cloud — FREE, no credit card, 30K tokens/min, ~500 tokens/sec
// API is OpenAI-compatible so same format as before, just different URL + key

import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const GROQ_URL   = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_KEY   = process.env.GROQ_API_KEY;   // rename this in .env
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

// ── Core call function ────────────────────────────────────────────────────────
const callGroq = async (messages, opts = {}) => {
  if (!GROQ_KEY) throw new Error("GROQ_API_KEY is missing from .env");

  const res = await axios.post(
    GROQ_URL,
    {
      model:       GROQ_MODEL,
      messages,
      temperature: opts.temperature ?? 0.6,
      max_tokens:  opts.max_tokens  ?? 500,
    },
    {
      headers: {
        Authorization:  `Bearer ${GROQ_KEY}`,
        "Content-Type": "application/json",
      },
      timeout: 15000,
    }
  );

  return res.data?.choices?.[0]?.message?.content ?? null;
};

// ── 1. Habit suggestions ──────────────────────────────────────────────────────
export const suggestHabitsUsingGrok = async (goals = [], currentHabits = []) => {
  const messages = [
    {
      role: "system",
      content:
        "You are a habit coach. Return ONLY a valid JSON array of exactly 3 objects. " +
        "Each object must have: name (string), category (string), icon (emoji), reason (string). " +
        "No markdown, no explanation, no code blocks — raw JSON array only.",
    },
    {
      role: "user",
      content: `Goals: ${goals.join(", ")}. Current habits: ${currentHabits.join(", ") || "none"}.`,
    },
  ];

  const content = await callGroq(messages, { temperature: 0.3, max_tokens: 500 });

  // Strip any accidental markdown backticks
  const cleaned = content.replace(/```json|```/g, "").trim();

  try {
    const parsed = JSON.parse(cleaned);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    // Try extracting JSON array from text
    const match = cleaned.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (match) return JSON.parse(match[0]);
    // Fallback
    return [
      { name: "Morning Walk",    category: "fitness",      icon: "🏃", reason: "30 min walk boosts energy" },
      { name: "Drink 8 Glasses", category: "water",        icon: "💧", reason: "Hydration improves focus" },
      { name: "Read 20 Minutes", category: "productivity", icon: "📚", reason: "Daily reading builds knowledge" },
    ];
  }
};

// ── 2. AI Chat coach ──────────────────────────────────────────────────────────
export const chatWithGrok = async (message, history = []) => {
  const messages = [
    {
      role: "system",
      content:
        "You are a friendly, encouraging habit coach. " +
        "Give practical, specific advice in 2-4 sentences. " +
        "Be warm and motivating. Never repeat yourself.",
    },
    ...history.slice(-10), // keep last 10 for context, avoid token overflow
    { role: "user", content: message },
  ];

  return await callGroq(messages, { temperature: 0.7, max_tokens: 300 });
};

// ── 3. Weekly feedback ────────────────────────────────────────────────────────
export const weeklyFeedbackUsingGrok = async (habits = [], completionRates = {}) => {
  const messages = [
    {
      role: "system",
      content: "You are a supportive habit coach. Give encouraging weekly feedback in exactly 3 sentences.",
    },
    {
      role: "user",
      content: `My habits: ${habits.join(", ")}. Completion rates this week: ${JSON.stringify(completionRates)}.`,
    },
  ];

  return await callGroq(messages, { temperature: 0.5, max_tokens: 250 });
};

// ── 4. Mood insight ───────────────────────────────────────────────────────────
export const insightUsingGrok = async (moods = [], habits = []) => {
  const messages = [
    {
      role: "system",
      content: "You are a wellness coach. Give a 2-sentence insight on how mood and habits are connected for this user.",
    },
    {
      role: "user",
      content: `Recent moods: ${JSON.stringify(moods)}. Active habits: ${habits.join(", ")}.`,
    },
  ];

  return await callGroq(messages, { temperature: 0.5, max_tokens: 200 });
};
