const Log = require('../../models/log.model');
const PlannedTraining = require('../../models/plannedTraining.model');

// Get overall performance summary stats
async function getPerformanceSummary(userId) {
  const logs = await Log.find({ athleteId: userId });
  const activePlan = await PlannedTraining.findOne({ athleteId: userId, status: 'active' });

  const totalWorkoutsLogged = logs.length;
  const personalBestsCount = logs.filter(l => l.isPersonalBest).length;
  const totalWeightLifted = logs.reduce((sum, l) => sum + ((l.actualWeight || 0) * (l.actualReps || 0) * (l.actualSets || 0)), 0);

  // Group PBs by exercise
  const pbMap = {};
  logs.forEach(l => {
    if (l.isPersonalBest || l.actualWeight > 0) {
      if (!pbMap[l.exerciseName] || l.actualWeight > pbMap[l.exerciseName].actualWeight) {
        pbMap[l.exerciseName] = {
          exerciseName: l.exerciseName,
          actualWeight: l.actualWeight,
          actualReps: l.actualReps,
          actualSets: l.actualSets,
          loggedAt: l.loggedAt
        };
      }
    }
  });

  const pbList = Object.values(pbMap);

  return {
    totalWorkoutsLogged,
    personalBestsCount,
    totalWeightLifted,
    activePlanCount: activePlan ? 1 : 0,
    personalBestsList: pbList
  };
}

// Get exercise growth trends over time
async function getExerciseGrowth(userId) {
  const logs = await Log.find({ athleteId: userId }).sort({ loggedAt: 1 });

  return logs.map(l => ({
    date: new Date(l.loggedAt).toLocaleDateString(),
    exerciseName: l.exerciseName || 'Workout Session',
    actualWeight: l.actualWeight || 0,
    actualReps: l.actualReps || 0,
    actualSets: l.actualSets || 0
  }));
}

// Get completed workout sessions for each of the last 4 calendar months
async function getMonthlySessions(userId) {
  const now = new Date();
  const firstMonth = new Date(now.getFullYear(), now.getMonth() - 3, 1);
  const logs = await Log.find({
    athleteId: userId,
    loggedAt: { $gte: firstMonth }
  }).sort({ loggedAt: 1 });

  return Array.from({ length: 4 }, (_, index) => {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - 3 + index, 1);
    const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 1);
    const uniqueSessionDays = new Set(
      logs
        .filter((log) => {
          const loggedAt = new Date(log.loggedAt);
          return loggedAt >= monthStart && loggedAt < monthEnd;
        })
        .map((log) => new Date(log.loggedAt).toDateString())
    );

    return {
      month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      sessions: uniqueSessionDays.size
    };
  });
}

// Get real mood breakdown trends (tough / okay / strong)
async function getMoodTrend(userId) {
  const logs = await Log.find({ athleteId: userId });

  const moodCounts = { tough: 0, okay: 0, strong: 0 };
  logs.forEach(l => {
    if (l.mood && moodCounts[l.mood] !== undefined) {
      moodCounts[l.mood]++;
    } else {
      moodCounts.okay++;
    }
  });

  return moodCounts;
}

// Compute real weekly execution score
async function getWeeklyScore(userId) {
  const activePlan = await PlannedTraining.findOne({ athleteId: userId, status: 'active' });
  const totalPlanned = activePlan?.restDays ? (7 - activePlan.restDays.length) : 5;

  const now = new Date();
  const startOfWeek = new Date(now);
  const dayIndex = now.getDay() === 0 ? 6 : now.getDay() - 1;
  startOfWeek.setDate(now.getDate() - dayIndex);
  startOfWeek.setHours(0, 0, 0, 0);

  const logsThisWeek = await Log.find({
    athleteId: userId,
    loggedAt: { $gte: startOfWeek }
  });

  const totalCompleted = new Set(logsThisWeek.map(l => new Date(l.loggedAt).toDateString())).size;
  const weeklyScore = Math.min(100, Math.round((totalCompleted / Math.max(1, totalPlanned)) * 100));

  return {
    weeklyScore,
    totalPlanned,
    totalCompleted
  };
}

module.exports = {
  getPerformanceSummary,
  getExerciseGrowth,
  getMonthlySessions,
  getMoodTrend,
  getWeeklyScore
};
