# Walkthrough - Athlete Performance Tracker Backend

The MongoDB Atlas models, API modules, LLM client helper functions, seed scripts, JWT authentication, and Express application routing are located inside `backend/`.

## Created Backend Structure & Components

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js                 # MongoDB Atlas mongoose connection
│   │   └── llm.js                # Gemini API client initialization
│   │
│   ├── models/
│   │   ├── user.model.js         # Athlete profile & auth schema
│   │   ├── exercise.model.js     # Exercise library schema
│   │   ├── plan.model.js         # Training plan schema
│   │   ├── planDay.model.js      # Plan days breakdown
│   │   ├── planExercise.model.js # Individual planned exercise instances
│   │   ├── log.model.js          # Workout performance logs with PB detection
│   │
│   ├── modules/
│   │   ├── auth/                 # Signup, Login, Logout, Me endpoints
│   │   ├── profile/              # Profile, Photo, Goal, Diet, Injury & Availability CRUD
│   │   ├── intelligence/         # Pre-filter query, Gemini prompt, response validation & rating
│   │   ├── training/             # Today's training view, set/rep/weight logging & PBs
│   │   ├── performance/          # Aggregations, exercise growth trends, mood trends
│   │   ├── dashboard/            # Streak, consistency score, weekly goal, AI insight
│   │   └── exercise/             # Exercise library endpoints
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js    # JWT Bearer token protection
│   │   └── errorHandler.js       # Centralized error handler
│   │
│   ├── seed/
│   │   └── exercises.seed.js     # Seed script for 15+ sample exercises
│   │
│   ├── app.js                    # Express app configuration & route mounting
│   └── server.js                 # Server entry point
│
├── .env                          # Config environment variables
├── .env.example                  # Template environment variables
├── package.json                  # Dependencies configuration
└── README.md                     # Backend documentation
```

## API Endpoint Matrix

| Module | Method | Endpoint | Description |
|---|---|---|---|
| **Auth** | `POST` | `/api/auth/signup` | Create athlete account |
| **Auth** | `POST` | `/api/auth/login` | Login & receive JWT token |
| **Auth** | `POST` | `/api/auth/logout` | Logout response |
| **Auth** | `GET` | `/api/auth/me` | Fetch logged-in user profile |
| **Profile** | `GET` | `/api/profile` | Get full athlete profile |
| **Profile** | `PUT` | `/api/profile` | Update profile fields |
| **Profile** | `POST` | `/api/profile/photo` | Update profile photo URL |
| **Profile** | `PUT` | `/api/profile/goal` | Update athletic goal |
| **Profile** | `PUT` | `/api/profile/diet` | Update diet preferences |
| **Profile** | `POST` | `/api/profile/injury` | Add injury tag |
| **Profile** | `DELETE` | `/api/profile/injury/:id` | Remove injury tag |
| **Profile** | `PUT` | `/api/profile/availability` | Update available workout days/week |
| **Intelligence** | `POST` | `/api/intelligence/generate` | Generate AI training plan |
| **Intelligence** | `GET` | `/api/intelligence/plans` | Fetch all athlete plans |
| **Intelligence** | `GET` | `/api/intelligence/plans/:planId` | Fetch plan details by ID |
| **Intelligence** | `PUT` | `/api/intelligence/exercise/:planExerciseId` | Update planned exercise sets/reps |
| **Intelligence** | `POST` | `/api/intelligence/exercise/:planExerciseId/rate` | Rate exercise (1-5 stars) |
| **Training** | `GET` | `/api/training/today` | Fetch today's workout plan & logs |
| **Training** | `GET` | `/api/training/week` | Fetch full week workout schedule |
| **Training** | `PUT` | `/api/training/day/:dayId/rest` | Toggle rest day status |
| **Training** | `PUT` | `/api/training/exercise/:planExerciseId/reorder` | Reorder exercise sequence |
| **Training** | `POST` | `/api/training/exercise/:planExerciseId/complete` | Mark exercise done |
| **Training** | `POST` | `/api/training/exercise/:planExerciseId/log` | Log workout & detect Personal Best |
| **Training** | `PUT` | `/api/training/log/:logId` | Edit logged workout |
| **Training** | `DELETE` | `/api/training/log/:logId` | Delete workout log |
| **Training** | `GET` | `/api/training/exercise/:exerciseId/pb` | Get Personal Best for exercise |
| **Performance** | `GET` | `/api/performance/summary` | Overall workouts & weight lifted |
| **Performance** | `GET` | `/api/performance/exercise-growth` | Timeline of weight/rep growth |
| **Performance** | `GET` | `/api/performance/mood-trend` | Mood distribution counts |
| **Performance** | `GET` | `/api/performance/weekly-score` | Weekly completion score % |
| **Dashboard** | `GET` | `/api/dashboard/stats` | Active streak & consistency % |
| **Dashboard** | `GET` | `/api/dashboard/weekly-goal` | Target vs completed workout days |
| **Dashboard** | `GET` | `/api/dashboard/overall-growth` | Overall growth curve data |
| **Dashboard** | `GET` | `/api/dashboard/insight` | Performance insight banner |
| **Dashboard** | `GET` | `/api/dashboard/best-day` | Best performance day highlight |
| **Dashboard** | `GET` | `/api/dashboard/week-calendar` | Weekly day status breakdown |
| **Exercise** | `GET` | `/api/exercises` | Get exercises library |
| **Exercise** | `GET` | `/api/exercises/:id` | Get exercise by ID |

## Verification
- Dependencies installed via `npm install`.
- Code written in simple, clear, beginner-friendly JavaScript with plain English comments above each function.
