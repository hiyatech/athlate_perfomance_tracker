const User = require('../../models/user.model');
const Log = require('../../models/log.model');
const PlannedTraining = require('../../models/plannedTraining.model');

// Get overall real dashboard stats for athlete
async function getStats(userId) {
  const logs = await Log.find({ athleteId: userId }).sort({ loggedAt: -1 });
  const activePlan = await PlannedTraining.findOne({ athleteId: userId, status: 'active' });

  const completedWorkouts = logs.length;
  const totalVolumeKg = logs.reduce((sum, l) => {
    const wt = l.actualWeight || 0;
    const reps = l.actualReps || 1;
    const sets = l.actualSets || 1;
    return sum + (wt * reps * sets);
  }, 0);

  // Calculate real streak (consecutive days with at least 1 log)
  let streak = 0;
  if (logs.length > 0) {
    const uniqueDates = Array.from(new Set(logs.map(l => new Date(l.loggedAt).toDateString())));
    const todayStr = new Date().toDateString();
    const yesterdayStr = new Date(Date.now() - 86400000).toDateString();

    let checkDate = new Date();
    if (!uniqueDates.includes(todayStr) && uniqueDates.includes(yesterdayStr)) {
      checkDate = new Date(Date.now() - 86400000);
    }

    while (uniqueDates.includes(checkDate.toDateString())) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  }

  // Calculate real weekly consistency score
  const now = new Date();
  const startOfWeek = new Date(now);
  const dayIndex = now.getDay() === 0 ? 6 : now.getDay() - 1; // Mon = 0
  startOfWeek.setDate(now.getDate() - dayIndex);
  startOfWeek.setHours(0, 0, 0, 0);

  const logsThisWeek = logs.filter(l => new Date(l.loggedAt) >= startOfWeek);
  const targetDays = activePlan?.restDays ? (7 - activePlan.restDays.length) : 5;
  const uniqueDaysLoggedThisWeek = new Set(logsThisWeek.map(l => new Date(l.loggedAt).toDateString())).size;
  const consistencyScore = Math.min(100, Math.round((uniqueDaysLoggedThisWeek / Math.max(1, targetDays)) * 100));

  return {
    streak,
    consistencyScore,
    completedWorkouts,
    totalVolumeKg,
    activePlan: !!activePlan
  };
}

// Get real weekly target goal breakdown
async function getWeeklyGoal(userId) {
  const user = await User.findById(userId);
  const activePlan = await PlannedTraining.findOne({ athleteId: userId, status: 'active' });

  const targetDays = activePlan?.restDays
    ? (7 - activePlan.restDays.length)
    : (user?.daysAvailablePerWeek || 4);

  const now = new Date();
  const startOfWeek = new Date(now);
  const dayIndex = now.getDay() === 0 ? 6 : now.getDay() - 1;
  startOfWeek.setDate(now.getDate() - dayIndex);
  startOfWeek.setHours(0, 0, 0, 0);

  const logsThisWeek = await Log.find({
    athleteId: userId,
    loggedAt: { $gte: startOfWeek }
  });

  const uniqueDaysCompleted = new Set(logsThisWeek.map(l => new Date(l.loggedAt).toDateString())).size;
  const completedDays = Math.min(uniqueDaysCompleted, targetDays);
  const percentage = Math.min(100, Math.round((completedDays / targetDays) * 100)) || 0;

  return {
    targetDays,
    completedDays,
    percentage
  };
}

// Get completed workout sessions for each week of the current calendar month
async function getOverallGrowth(userId) {
  const user = await User.findById(userId);
  const activePlan = await PlannedTraining.findOne({ athleteId: userId, status: 'active' });
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const targetSessions = activePlan?.restDays
    ? Math.max(1, 7 - activePlan.restDays.length)
    : (user?.daysAvailablePerWeek || 6);
  const logs = await Log.find({
    athleteId: userId,
    loggedAt: { $gte: monthStart, $lt: nextMonth }
  }).sort({ loggedAt: 1 });

  const firstWeekStart = new Date(monthStart);
  const monthStartDayIndex = monthStart.getDay() === 0 ? 6 : monthStart.getDay() - 1;
  firstWeekStart.setDate(monthStart.getDate() - monthStartDayIndex);

  const weeklyActivity = [];
  let weekStart = new Date(firstWeekStart);
  let weekIndex = 1;

  while (weekStart < nextMonth) {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);
    const logsInWeek = logs.filter((log) => {
      const loggedAt = new Date(log.loggedAt);
      return loggedAt >= weekStart && loggedAt < weekEnd;
    });

    const uniqueSessionDates = Array.from(new Map(
      logsInWeek.map((log) => {
        const date = new Date(log.loggedAt);
        return [date.toDateString(), date];
      })
    ).values()).sort((a, b) => a - b);

    weeklyActivity.push({
      week: `Week ${weekIndex}`,
      completedTasks: logsInWeek.length,
      completedDates: uniqueSessionDates.map((date) =>
        date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      )
    });

    weekStart = weekEnd;
    weekIndex++;
  }

  return {
    accountCreatedAt: user?.createdAt,
    month: now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    targetSessions,
    weeklyActivity
  };
}

// Generate real insight highlight
async function getInsight(userId) {
  const stats = await getStats(userId);
  const user = await User.findById(userId);

  if (stats.streak >= 3) {
    return {
      title: `${stats.streak}-Day Training Streak 🔥`,
      message: `Incredible momentum, ${user?.name || 'Athlete'}! You're consistently hitting your training targets.`,
      type: 'positive'
    };
  } else if (stats.completedWorkouts > 0) {
    return {
      title: 'Solid Progress!',
      message: `You've logged ${stats.completedWorkouts} workouts and moved ${stats.totalVolumeKg}kg total volume.`,
      type: 'positive'
    };
  } else {
    return {
      title: 'Ready for Today\'s Session?',
      message: 'Consistency is key to athletic performance. Log today\'s workout to start your progress streak!',
      type: 'motivation'
    };
  }
}

// Get athlete's best performance day
async function getBestDay(userId) {
  const pbLogs = await Log.find({ athleteId: userId, isPersonalBest: true }).sort({ loggedAt: -1 });

  if (pbLogs.length > 0) {
    return {
      bestDay: pbLogs[0].loggedAt,
      highlight: `Personal Best: ${pbLogs[0].exerciseName} (${pbLogs[0].actualWeight}kg x ${pbLogs[0].actualReps})`,
      log: pbLogs[0]
    };
  }

  return {
    bestDay: new Date(),
    highlight: 'Keep training to log your first Personal Best!'
  };
}

// Get real week calendar view status (Mon-Sun)
async function getWeekCalendar(userId) {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dayNamesShort = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const activePlan = await PlannedTraining.findOne({ athleteId: userId, status: 'active' });
  const restDays = activePlan?.restDays || ['Sunday'];

  const now = new Date();
  const currentDayIndex = now.getDay() === 0 ? 6 : now.getDay() - 1; // Mon = 0, Sun = 6

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - currentDayIndex);
  startOfWeek.setHours(0, 0, 0, 0);

  const logsThisWeek = await Log.find({
    athleteId: userId,
    loggedAt: { $gte: startOfWeek }
  });

  return dayNamesShort.map((dayShort, idx) => {
    const dayLong = daysOfWeek[idx];
    const isRest = restDays.includes(dayLong);

    // Check if athlete logged a workout on this specific day of the current week
    const targetDate = new Date(startOfWeek);
    targetDate.setDate(startOfWeek.getDate() + idx);
    const targetDateStr = targetDate.toDateString();

    const logged = logsThisWeek.some(l => new Date(l.loggedAt).toDateString() === targetDateStr);

    let status = 'upcoming';
    if (isRest) {
      status = 'rest';
    } else if (logged) {
      status = 'completed';
    } else if (idx < currentDayIndex) {
      status = 'missed';
    } else if (idx === currentDayIndex) {
      status = 'today';
    }

    return {
      dayName: dayShort,
      dayNumber: idx + 1,
      status,
      isRest
    };
  });
}

module.exports = {
  getStats,
  getWeeklyGoal,
  getOverallGrowth,
  getInsight,
  getBestDay,
  getWeekCalendar
};
