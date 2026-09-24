const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

// Import routes for each module
const authRoutes = require('./modules/auth/auth.routes');
const profileRoutes = require('./modules/profile/profile.routes');
const sportsRoutes = require('./modules/sports/sports.routes');
const goalsRoutes = require('./modules/goals/goals.routes');
const intelligenceRoutes = require('./modules/intelligence/intelligence.routes');
const trainingRoutes = require('./modules/training/training.routes');
const performanceRoutes = require('./modules/performance/performance.routes');
const dashboardRoutes = require('./modules/dashboard/dashboard.routes');
const exerciseRoutes = require('./modules/exercise/exercise.routes');

const app = express();

// Enable Cross-Origin Resource Sharing (CORS) and JSON body parsing
app.use(cors());
app.use(express.json());

// API Root Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Athlete Performance Tracker API is running' });
});

// Mount modular API routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/sports', sportsRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/intelligence', intelligenceRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/exercises', exerciseRoutes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
