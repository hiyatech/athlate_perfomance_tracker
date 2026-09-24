const Goal = require('../../models/goal.model');

// List goals with optional filtering by sportId
async function getGoals(sportId) {
  const query = { isActive: true };

  if (sportId) {
    // Show general goals AND sport-specific goals for the selected sport
    query.$or = [
      { type: 'general' },
      { sportId: sportId }
    ];
  }

  return await Goal.find(query);
}

module.exports = {
  getGoals
};
