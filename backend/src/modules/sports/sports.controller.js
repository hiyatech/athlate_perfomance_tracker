const sportsService = require('./sports.service');

// Controller to get all sports
async function getAllSports(req, res) {
  try {
    const sports = await sportsService.getAllSports();
    res.status(200).json(sports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getAllSports
};
