const Sport = require('../../models/sport.model');

// List all active sports
async function getAllSports() {
  return await Sport.find({ isActive: true });
}

// Create sport
async function createSport(sportData) {
  return await Sport.create(sportData);
}

module.exports = {
  getAllSports,
  createSport
};
