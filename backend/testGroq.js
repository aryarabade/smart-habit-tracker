// backend/testGroq.js
// Run: node testGroq.js
// Verifies your Groq Cloud key works before touching your app

import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const key   = process.env.GROQ_API_KEY;
const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

console.log("\n🔍 Groq Cloud Key Check");
console.log("Key loaded:", key ? `✅ ${key.slice(0, 10)}...` : "❌ MISSING — add GROQ_API_KEY to .env");
console.log("Model:     ", model);

if (!key) {
  console.log("\n👉 Get a free key at https://console.groq.com → API Keys → Create");
  process.exit(1);
}

console.log("\n⏳ Testing API call...\n");

try {
  const res = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model,
      messages: [{ role: "user", content: "Say exactly: Groq is working!" }],
      max_tokens: 20,
    },
    {
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      timeout: 10000,
    }
  );

  const reply = res.data.choices[0].message.content;
  console.log("✅ Groq API works!");
  console.log("Response:", reply);
  console.log("Tokens used:", res.data.usage?.total_tokens);
  console.log("Speed (tokens/s):", res.data.usage?.prompt_tokens_per_second?.toFixed(0) || "N/A");
} catch (err) {
  const status = err.response?.status;
  const msg    = err.response?.data?.error?.message || err.message;

  console.log("❌ Groq API failed!");
  console.log("Status:", status);
  console.log("Error: ", msg);

  if (status === 401) console.log("\n👉 Invalid API key. Get one free at https://console.groq.com");
  if (status === 429) console.log("\n👉 Rate limit hit. Wait 1 minute and try again.");
}
