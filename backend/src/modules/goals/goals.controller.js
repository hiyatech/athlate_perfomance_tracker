const goalsService = require('./goals.service');

// Controller to get goals
async function getGoals(req, res) {
  try {
    const { sportId } = req.query;
    const goals = await goalsService.getGoals(sportId);
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getGoals
};
