const Exercise = require('../../models/exercise.model');

// Get all exercises with optional query filtering
async function getAllExercises(req, res) {
  try {
    const { sport, goalType, level } = req.query;
    const filter = {};
    if (sport) filter.sport = sport;
    if (goalType) filter.goalType = goalType;
    if (level) filter.level = level;

    const exercises = await Exercise.find(filter);
    res.status(200).json(exercises);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get single exercise by ID
async function getExerciseById(req, res) {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }
    res.status(200).json(exercise);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getAllExercises,
  getExerciseById
};
