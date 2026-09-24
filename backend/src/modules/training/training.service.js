const Log = require('../../models/log.model');
const Exercise = require('../../models/exercise.model');
const PlannedTraining = require('../../models/plannedTraining.model');

// Helper to get current day name e.g. "Monday", "Friday"
function getTodayDayName() {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date().getDay()];
}

// Get today's training day and exercises for athlete
async function getTodaysTraining(userId) {
  const currentDayName = getTodayDayName();

  // Find active plan or fallback to latest plan
  let activePlan = await PlannedTraining.findOne({ athleteId: userId, status: 'active' });
  if (!activePlan) {
    activePlan = await PlannedTraining.findOne({ athleteId: userId }).sort({ createdAt: -1 });
  }

  if (!activePlan || !activePlan.planData) {
    return { plan: null, dayName: currentDayName, isRest: false, exercises: [] };
  }

  const dayData = activePlan.planData[currentDayName];
  const isRest = dayData === 'Rest' || (activePlan.restDays && activePlan.restDays.includes(currentDayName));

  if (isRest || !Array.isArray(dayData)) {
    return { plan: activePlan, dayName: currentDayName, isRest: true, exercises: [] };
  }

  // Fetch today's logged workouts to mark completion
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const todaysLogs = await Log.find({
    athleteId: userId,
    plannedTrainingId: activePlan._id,
    loggedAt: { $gte: startOfDay }
  });

  const exercises = await Promise.all(
    dayData.map(async (item, idx) => {
      let exerciseDoc = null;
      if (item.exerciseId && item.exerciseId !== 'custom') {
        exerciseDoc = await Exercise.findById(item.exerciseId).catch(() => null);
      }

      // Check if logged today
      const existingLog = todaysLogs.find(
        l => String(l.exerciseId) === String(item.exerciseId) || l.exerciseName === item.name
      );

      return {
        _id: item.exerciseId || `ex_${idx}`,
        exerciseId: item.exerciseId,
        name: item.name || exerciseDoc?.name || 'Workout Drill',
        sets: item.sets || 3,
        reps: item.reps || 10,
        duration: item.duration || '0',
        instructions: exerciseDoc?.instructions || 'Perform with proper posture and controlled breathing.',
        unitType: exerciseDoc?.unitType || 'reps',
        difficulty: exerciseDoc?.difficulty || 'intermediate',
        isDone: !!existingLog,
        logDetails: existingLog || null
      };
    })
  );

  return {
    plan: activePlan,
    dayName: currentDayName,
    isRest: false,
    exercises
  };
}

// Get entire week schedule for athlete
async function getWeekSchedule(userId) {
  let activePlan = await PlannedTraining.findOne({ athleteId: userId, status: 'active' });
  if (!activePlan) {
    activePlan = await PlannedTraining.findOne({ athleteId: userId }).sort({ createdAt: -1 });
  }

  if (!activePlan || !activePlan.planData) {
    return [];
  }

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  return daysOfWeek.map((dayName, idx) => {
    const rawData = activePlan.planData[dayName];
    const isRest = rawData === 'Rest' || (activePlan.restDays && activePlan.restDays.includes(dayName));

    return {
      dayNumber: idx + 1,
      dayName,
      isRest,
      exercises: Array.isArray(rawData) ? rawData : []
    };
  });
}

// Log workout performance and detect Personal Best (PB)
async function logWorkout(userId, logData) {
  const { plannedTrainingId, exerciseId, exerciseName, dayName, actualSets, actualReps, actualWeight, actualTime, note, mood } = logData;

  const plan = plannedTrainingId
    ? await PlannedTraining.findOne({ _id: plannedTrainingId, athleteId: userId })
    : await PlannedTraining.findOne({ athleteId: userId, status: 'active' });

  const pastLogs = await Log.find({ athleteId: userId, exerciseName }).sort({ loggedAt: -1 });

  const maxPastWeight = pastLogs.reduce((max, l) => Math.max(max, l.actualWeight || 0), 0);
  const maxPastReps = pastLogs.reduce((max, l) => Math.max(max, l.actualReps || 0), 0);

  let isPersonalBest = false;
  const numWeight = Number(actualWeight) || 0;
  const numReps = Number(actualReps) || 0;

  if ((numWeight > 0 && numWeight > maxPastWeight) || (numWeight === 0 && numReps > maxPastReps)) {
    isPersonalBest = true;
  }

  const newLog = await Log.create({
    athleteId: userId,
    plannedTrainingId: plan?._id || null,
    exerciseId: exerciseId && exerciseId !== 'custom' ? exerciseId : null,
    exerciseName: exerciseName || 'Logged Workout',
    dayName: dayName || getTodayDayName(),
    actualSets: Number(actualSets) || 3,
    actualReps: numReps || 10,
    actualWeight: numWeight,
    actualTime: Number(actualTime) || 0,
    note: note || '',
    mood: mood || 'okay',
    isPersonalBest
  });

  return newLog;
}

// Update existing log
async function updateLog(logId, logData) {
  return await Log.findByIdAndUpdate(logId, logData, { new: true });
}

// Delete a log
async function deleteLog(logId) {
  return await Log.findByIdAndDelete(logId);
}

// Get Personal Best (PB) for a specific exercise
async function getExercisePB(userId, exerciseId) {
  const logs = await Log.find({ athleteId: userId }).sort({ actualWeight: -1, actualReps: -1 });
  const topLog = logs[0] || null;

  return {
    exerciseId,
    personalBest: topLog
  };
}

module.exports = {
  getTodaysTraining,
  getWeekSchedule,
  logWorkout,
  updateLog,
  deleteLog,
  getExercisePB
};
