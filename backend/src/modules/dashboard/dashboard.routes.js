const express = require('express');
const router = express.Router();
const dashboardController = require('./dashboard.controller');
const { protect } = require('../../middleware/auth.middleware');

router.use(protect);

router.get('/stats', dashboardController.getStats);
router.get('/weekly-goal', dashboardController.getWeeklyGoal);
router.get('/overall-growth', dashboardController.getOverallGrowth);
router.get('/insight', dashboardController.getInsight);
router.get('/best-day', dashboardController.getBestDay);
router.get('/week-calendar', dashboardController.getWeekCalendar);

module.exports = router;
