const dashboardService = require('./dashboard.service');

// Controller for dashboard stats
async function getStats(req, res) {
  try {
    const stats = await dashboardService.getStats(req.user.id);
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Controller for weekly goal breakdown
async function getWeeklyGoal(req, res) {
  try {
    const goal = await dashboardService.getWeeklyGoal(req.user.id);
    res.status(200).json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Controller for overall growth curve
async function getOverallGrowth(req, res) {
  try {
    const growth = await dashboardService.getOverallGrowth(req.user.id);
    res.status(200).json(growth);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Controller for daily AI insight banner
async function getInsight(req, res) {
  try {
    const insight = await dashboardService.getInsight(req.user.id);
    res.status(200).json(insight);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Controller for best day highlight
async function getBestDay(req, res) {
  try {
    const bestDay = await dashboardService.getBestDay(req.user.id);
    res.status(200).json(bestDay);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Controller for week calendar status
async function getWeekCalendar(req, res) {
  try {
    const calendar = await dashboardService.getWeekCalendar(req.user.id);
    res.status(200).json(calendar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getStats,
  getWeeklyGoal,
  getOverallGrowth,
  getInsight,
  getBestDay,
  getWeekCalendar
};
