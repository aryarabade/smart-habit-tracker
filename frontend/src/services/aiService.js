import API from "./api.js";

export const getSuggestion = async (goal) => {
  const goalLower = goal.toLowerCase();

  // FITNESS
  if (goalLower.includes("fit") || goalLower.includes("exercise") || goalLower.includes("gym") || goalLower.includes("workout")) {
    return { suggestion: `Here are 3 specific habits to get fit:\n\n1. 🏃 Morning Walk/Run — Wake up at 6 AM, walk or jog for exactly 20 minutes. No gym needed, just shoes and consistency.\n\n2. 💪 Home Workout — Do 3 sets of: 10 pushups + 15 squats + 20 jumping jacks every evening at 7 PM. Takes only 15 minutes.\n\n3. 🥗 Protein with Every Meal — Add one protein source (eggs, dal, paneer, chicken) to breakfast, lunch and dinner. No dieting needed.` };
  }

  // SLEEP
  if (goalLower.includes("sleep") || goalLower.includes("rest") || goalLower.includes("tired")) {
    return { suggestion: `Here are 3 specific habits for better sleep:\n\n1. 📵 Phone Off at 10 PM — Put phone on charge outside your bedroom at exactly 10 PM every night. Use alarm clock instead.\n\n2. 🌙 Fixed Sleep Time — Sleep at 10:30 PM, wake at 6:30 AM every day including weekends. Your body needs consistency.\n\n3. ☕ No Caffeine After 5 PM — Stop chai, coffee, or energy drinks after 5 PM. Caffeine stays in body for 6 hours.` };
  }

  // STUDY
  if (goalLower.includes("study") || goalLower.includes("learn") || goalLower.includes("focus") || goalLower.includes("exam")) {
    return { suggestion: `Here are 3 specific habits to study better:\n\n1. 📚 Pomodoro Sessions — Study for exactly 25 minutes, then take 5 minute break. Repeat 4 times = 2 hours of deep focus. Use a timer.\n\n2. 📝 Daily Revision — Spend last 15 minutes of study session revising what you studied that day. Memory improves by 70%.\n\n3. 📵 Phone in Another Room — Keep phone in different room while studying. Even seeing phone reduces focus by 20%.` };
  }

  // WATER
  if (goalLower.includes("water") || goalLower.includes("drink") || goalLower.includes("hydrat")) {
    return { suggestion: `Here are 3 specific habits to drink more water:\n\n1. 🥤 Morning Glass — Drink 1 full glass of water immediately after waking up before anything else. Keep bottle on bedside table.\n\n2. ⏰ Hourly Reminder — Set phone alarm every 2 hours from 8 AM to 8 PM — drink one glass each time. That's 6 glasses done!\n\n3. 🍽️ Before Every Meal — Drink 1 glass of water 10 minutes before breakfast, lunch and dinner. Adds 3 more glasses daily.` };
  }

  // WEIGHT LOSS
  if (goalLower.includes("weight") || goalLower.includes("fat") || goalLower.includes("slim") || goalLower.includes("diet")) {
    return { suggestion: `Here are 3 specific habits to lose weight:\n\n1. 🚶 10000 Steps Daily — Walk 10000 steps every day. Use Google Fit or phone pedometer to track. Park far, take stairs always.\n\n2. 🍽️ Eat Slowly — Take 20 minutes minimum to finish every meal. Put spoon down between bites. Brain takes 20 mins to feel full.\n\n3. 🌙 No Food After 8 PM — Stop eating completely after 8 PM. Drink water or herbal tea if hungry. This alone reduces 300-400 calories daily.` };
  }

  // MENTAL HEALTH
  if (goalLower.includes("stress") || goalLower.includes("anxiety") || goalLower.includes("mental") || goalLower.includes("calm") || goalLower.includes("meditat")) {
    return { suggestion: `Here are 3 specific habits for mental wellness:\n\n1. 🧘 5 Minute Morning Meditation — Sit quietly for 5 minutes after waking. Focus only on breathing. Use Headspace or YouTube guided meditation.\n\n2. 📓 Gratitude Journal — Write exactly 3 things you are grateful for every night before sleep. Takes 3 minutes, reduces anxiety significantly.\n\n3. 🚶 Evening Walk Without Phone — Walk for 20 minutes every evening without earphones or phone. Just walk and observe surroundings.` };
  }

  // PRODUCTIVITY
  if (goalLower.includes("product") || goalLower.includes("organiz") || goalLower.includes("disciplin") || goalLower.includes("routine")) {
    return { suggestion: `Here are 3 specific habits to be more productive:\n\n1. 📋 Night Planning — Every night at 9 PM write exactly 3 most important tasks for tomorrow. Do those 3 first thing next morning.\n\n2. ⏰ Wake Up Same Time — Set alarm for 6 AM every day including Sunday. No snooze button. First 2 weeks are hard, then automatic.\n\n3. 🎯 One Task At A Time — Close all browser tabs except one. Put phone on silent. Work on single task for 45 minutes before switching.` };
  }

  // DEFAULT
  return { suggestion: `Here are 3 specific daily habits to achieve your goal "${goal}":\n\n1. ⏰ Start Small — Dedicate exactly 20 minutes every morning at 7 AM specifically to your goal. Consistency beats intensity.\n\n2. 📊 Track Daily — Every night rate yourself 1-10 on how well you worked towards your goal. Write one sentence about what you did.\n\n3. 🔁 Weekly Review — Every Sunday spend 15 minutes reviewing your week. What worked? What didn't? Adjust next week's plan accordingly.` };
};

export const getWeeklyFeedback = async ()        => (await API.get("/ai/feedback")).data;
export const chatWithAI        = async (message) => (await API.post("/ai/chat", { message })).data;
export const getInsight        = async ()        => (await API.get("/ai/insight")).data;