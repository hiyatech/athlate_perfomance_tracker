const express = require('express');
const router = express.Router();
const performanceController = require('./performance.controller');
const { protect } = require('../../middleware/auth.middleware');

router.use(protect);

router.get('/summary', performanceController.getSummary);
router.get('/exercise-growth', performanceController.getExerciseGrowth);
router.get('/monthly-sessions', performanceController.getMonthlySessions);
router.get('/mood-trend', performanceController.getMoodTrend);
router.get('/weekly-score', performanceController.getWeeklyScore);

module.exports = router;
