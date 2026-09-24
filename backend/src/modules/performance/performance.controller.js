const performanceService = require('./performance.service');

// Controller to get performance summary
async function getSummary(req, res) {
  try {
    const summary = await performanceService.getPerformanceSummary(req.user.id);
    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Controller to get exercise growth trends
async function getExerciseGrowth(req, res) {
  try {
    const growth = await performanceService.getExerciseGrowth(req.user.id);
    res.status(200).json(growth);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Controller for monthly completed workout sessions
async function getMonthlySessions(req, res) {
  try {
    const sessions = await performanceService.getMonthlySessions(req.user.id);
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Controller to get mood distribution
async function getMoodTrend(req, res) {
  try {
    const mood = await performanceService.getMoodTrend(req.user.id);
    res.status(200).json(mood);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Controller to get weekly consistency score
async function getWeeklyScore(req, res) {
  try {
    const score = await performanceService.getWeeklyScore(req.user.id);
    res.status(200).json(score);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getSummary,
  getExerciseGrowth,
  getMonthlySessions,
  getMoodTrend,
  getWeeklyScore
};
