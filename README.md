# Athlete Performance Tracker (MERN Stack Mini-Project)

A single-panel, athlete-facing web application for AI training plan generation, daily workout logging, and growth tracking.

## Tech Stack
- **Frontend**: React (Vite, React Router DOM, Axios, Context API, Tailwind CSS, Lucide Icons, Chart.js)
- **Backend**: Node.js + Express (Modular structure: auth, profile, intelligence, training, performance, dashboard)
- **Database**: MongoDB Atlas (cloud-hosted cluster via Mongoose ODM)
- **AI Integration**: Google Gemini 1.5 Flash (server-side only via `@google/generative-ai`)
- **Authentication**: JWT Bearer token authentication with bcrypt password hashing

---

## Project Structure

```
athlete-performance-tracker/
├── backend/
│   ├── src/
│   │   ├── config/ (db.js, llm.js)
│   │   ├── models/ (User, Exercise, PlannedTraining, Log, Goal, Sport)
│   │   ├── modules/ (auth, profile, intelligence, training, performance, dashboard, exercise, goals, sports)
│   │   ├── middleware/ (auth.middleware.js, errorHandler.js)
│   │   ├── seed/ (exercises.seed.js)
│   │   ├── app.js
│   │   └── server.js
│   ├── .env
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/ (authApi, profileApi, intelligenceApi, trainingApi, performanceApi, dashboardApi)
    │   ├── components/ (Sidebar, Card, ExerciseCard, ChipSelector, ProgressRing, ChartWidget, Modal)
    │   ├── context/ (AuthContext.jsx)
    │   ├── pages/ (Auth, Profile, Intelligence, Training, Dashboard)
    │   ├── App.jsx
    │   └── main.jsx
    ├── tailwind.config.js
    └── package.json
```

---

## Quick Start Instructions

### 1. Backend Setup & Database Seeding

```bash
cd backend
npm install

# Edit .env with your MONGODB_URI & GEMINI_API_KEY
npm run seed      # Seeds 15+ sample exercises into MongoDB Atlas
npm start         # Starts backend API server on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev       # Starts React dev server on http://localhost:3000
```

---

## Core Features & Workflow

1. **Auth & Profile**: Athletes sign up, set up physical attributes, sport, athletic goals, experience level, available training days, and injury exclusions.
2. **AI Plan Generation (Intelligence)**: Pre-filters exercises from MongoDB based on athlete sport, level, and injury tags. Builds prompt for Google Gemini Flash, validates structured JSON response, and saves plan to database.
3. **Training & Workout Logs**: Today's workout view with expandable set/rep/weight forms, auto-detection of Personal Bests (PBs), exercise ratings, and rest day toggles.
4. **Performance & Dashboard**: Aggregate weekly execution score, overall growth curve since account creation, mood distribution, active consecutive streak, and AI insight highlights.
