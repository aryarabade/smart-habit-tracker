# 🚀 Smart Habit Tracker

> **Build Better Habits. Stay Consistent. Improve Every Day.**

A modern **AI-powered Habit Tracker** built using the **MERN Stack** that helps users develop positive habits, monitor their mood, visualize progress, and receive personalized AI guidance for continuous self-improvement.

---

## ✨ Features

✅ **Habit Management**

* Create, edit, and delete habits
* Track daily habit completion
* Maintain streaks and consistency

😊 **Mood Tracking**

* Log your daily mood
* Analyze emotional trends over time

📊 **Analytics Dashboard**

* Visualize habit progress
* Interactive charts and statistics
* Track consistency and completion rates

🤖 **AI Features**

* AI-powered habit recommendations
* Personal AI Habit Coach
* Motivation and productivity tips using Groq AI

🔔 **Smart Reminders**

* Automated habit reminders
* Notification support using scheduled jobs

🔐 **Authentication**

* Secure JWT-based login & registration
* Protected routes

---

# 🛠️ Tech Stack

## Frontend

* ⚛️ React
* ⚡ Vite
* 🧭 React Router
* 🌐 Axios
* 📈 Recharts
* 🎨 Lucide React

## Backend

* 🟢 Node.js
* 🚀 Express.js
* 🍃 MongoDB
* 📦 Mongoose
* 🔐 JWT Authentication
* ⏰ Node Cron
* 🤖 Groq AI API

---

# 📁 Project Structure

```text
habittracker/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   └── vite.config.js
│
├── README.md
└── package.json
```

---

# 🚀 Getting Started

## Prerequisites

Make sure you have installed:

* Node.js (v18+)
* npm
* MongoDB (Local or Atlas)

---

## 📥 Clone the Repository

```bash
git clone https://github.com/your-username/habit-tracker.git

cd habit-tracker
```

---

## 📦 Install Dependencies

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd ../frontend
npm install
```

---

# ⚙️ Environment Variables

Create a **`.env`** file inside the **backend** directory.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

GROQ_API_KEY=your_groq_api_key

GROQ_MODEL=llama-3.3-70b-versatile
```

---

# ▶️ Run the Application

## Start Backend

```bash
cd backend
npm run dev
```

Backend runs on:

```
http://localhost:5000
```

---

## Start Frontend

```bash
cd frontend
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# 📱 How to Use

1. Register or log in.
2. Create your daily habits.
3. Mark habits as completed.
4. Record your daily mood.
5. View your analytics dashboard.
6. Chat with the AI Habit Coach.
7. Receive personalized habit suggestions.

---



# 🔮 Future Improvements

* 📱 Mobile Responsive UI
* 📅 Calendar View
* 🏆 Achievement Badges
* 👥 Friend Challenges
* 📧 Email Notifications
* 🌙 Dark Mode
* ☁️ Cloud Deployment


---


# 👨‍💻 Author

**Arya Rabade**

If you like this project, consider giving it a ⭐ on GitHub!
