# Athlete Performance Tracker - Backend

Backend API built with Node.js, Express, MongoDB Atlas, and Google Gemini API.

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env`:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Secret key for JWT tokens
   - `GEMINI_API_KEY`: API key from Google AI Studio

3. Seed exercise data:
   ```bash
   npm run seed
   ```

4. Start the backend server:
   ```bash
   npm start
   ```
