const trainingService = require('./training.service');

// Controller to get today's workout
async function getToday(req, res) {
  try {
    const data = await trainingService.getTodaysTraining(req.user.id);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Controller to get week schedule
async function getWeek(req, res) {
  try {
    const week = await trainingService.getWeekSchedule(req.user.id);
    res.status(200).json(week);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Controller to toggle rest day status
async function toggleRestDay(req, res) {
  try {
    const { isRest } = req.body;
    const updated = await trainingService.toggleRestDay(req.params.dayId, isRest);
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Controller to reorder exercise sequence
async function reorderExercise(req, res) {
  try {
    const { sequenceOrder } = req.body;
    const updated = await trainingService.reorderExercise(req.params.planExerciseId, sequenceOrder);
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Controller to log workout performance
async function logWorkout(req, res) {
  try {
    const log = await trainingService.logWorkout(req.user.id, req.body);
    res.status(201).json({
      message: log.isPersonalBest ? 'Personal Best achieved! Log saved.' : 'Workout log saved successfully.',
      log
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Controller to update log
async function updateLog(req, res) {
  try {
    const updated = await trainingService.updateLog(req.params.logId, req.body);
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Controller to delete log
async function deleteLog(req, res) {
  try {
    await trainingService.deleteLog(req.params.logId);
    res.status(200).json({ message: 'Log deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Controller to get exercise PB
async function getExercisePB(req, res) {
  try {
    const pb = await trainingService.getExercisePB(req.user.id, req.params.exerciseId);
    res.status(200).json(pb);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = {
  getToday,
  getWeek,
  toggleRestDay,
  reorderExercise,
  logWorkout,
  updateLog,
  deleteLog,
  getExercisePB
};
