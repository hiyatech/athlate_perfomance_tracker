const Exercise = require('../../models/exercise.model');
const PlannedTraining = require('../../models/plannedTraining.model');
const Log = require('../../models/log.model');

// Build training plan schedule using simple database queries (No AI)
async function generatePlanRecommendation({ athleteId, sportId, goalIds, trainingPeriod, restDays, trainingTime, deadlineDate }) {
  // Query exercises matching selected sport or general exercises
  const query = { isActive: true };

  if (sportId) {
    query.$or = [{ sportId: sportId }, { type: 'general' }, { sportId: null }];
  } else {
    query.type = 'general';
  }

  if (Array.isArray(goalIds) && goalIds.length > 0) {
    query.goalId = { $in: goalIds };
  }

  let matchingExercises = await Exercise.find(query).limit(20);
  if (matchingExercises.length === 0) {
    matchingExercises = await Exercise.find({ isActive: true }).limit(20);
  }

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const userRestDays = Array.isArray(restDays) ? restDays : ['Sunday'];
  const schedule = {};

  // Distribute 5-6 exercises per workout day
  daysOfWeek.forEach((day, dayIdx) => {
    if (userRestDays.includes(day)) {
      schedule[day] = 'Rest';
    } else {
      const dayExercises = [];
      const numExercises = Math.min(5, matchingExercises.length);

      for (let i = 0; i < numExercises; i++) {
        const exIndex = (dayIdx * 2 + i) % matchingExercises.length;
        const ex = matchingExercises[exIndex];
        if (ex) {
          dayExercises.push({
            exerciseId: ex._id,
            name: ex.name,
            sets: ex.unitType === 'duration' ? 3 : 4,
            reps: ex.unitType === 'duration' ? 0 : 10,
            duration: ex.unitType === 'duration' ? '60s' : '0'
          });
        }
      }

      schedule[day] = dayExercises;
    }
  });

  return {
    athleteId,
    sportId,
    goalIds,
    trainingPeriod: trainingPeriod || '1 Week',
    deadlineDate: deadlineDate || null,
    restDays: userRestDays,
    trainingTime: trainingTime || '6:00 AM',
    planData: schedule,
    status: 'draft'
  };
}

// Save new plan into plannedTraining collection (Insert)
async function savePlan(planPayload) {
  const { athleteId, sportId, goalIds, trainingPeriod, deadlineDate, restDays, trainingTime, planData } = planPayload;

  // Set previous active plans to completed
  await PlannedTraining.updateMany({ athleteId, status: 'active' }, { status: 'completed' });

  const newPlan = await PlannedTraining.create({
    athleteId,
    sportId: sportId || null,
    goalIds: goalIds || [],
    trainingPeriod: trainingPeriod || '1 Week',
    startDate: new Date(),
    endDate: deadlineDate ? new Date(deadlineDate) : null,
    restDays: restDays || [],
    trainingTime: trainingTime || '6:00 AM',
    planData,
    status: 'active'
  });

  return newPlan;
}

// Update existing plan (Update)
async function updatePlan(planId, athleteId, updateData) {
  return await PlannedTraining.findOneAndUpdate(
    { _id: planId, athleteId },
    { $set: updateData },
    { new: true }
  ).populate('sportId').populate('goalIds');
}

// Delete plan record (Delete)
async function deletePlan(planId, athleteId) {
  return await PlannedTraining.findOneAndDelete({ _id: planId, athleteId });
}

// Activate specific plan
async function activatePlan(planId, athleteId) {
  await PlannedTraining.updateMany({ athleteId, status: 'active' }, { status: 'completed' });
  return await PlannedTraining.findOneAndUpdate(
    { _id: planId, athleteId },
    { status: 'active' },
    { new: true }
  ).populate('sportId').populate('goalIds');
}

// Select all saved plans for athlete (Read)
async function getPlans(athleteId) {
  const plans = await PlannedTraining.find({ athleteId })
    .populate('sportId')
    .populate('goalIds')
    .sort({ createdAt: -1 });

  const planIds = plans.map((plan) => plan._id);
  const userLogs = await Log.find({
    athleteId,
    plannedTrainingId: { $in: planIds }
  });

  return plans.map(p => {
    const planObj = p.toObject();
    const weeklyExerciseCount = Object.values(p.planData || {}).reduce(
      (total, day) => total + (Array.isArray(day) ? day.length : 0),
      0
    );

    let scheduleMultiplier = 1;
    if (p.trainingPeriod === '15 Days') scheduleMultiplier = 2;
    if (p.trainingPeriod === '1 Month') scheduleMultiplier = 4;
    if (p.trainingPeriod === 'Custom' && p.startDate && p.endDate) {
      const durationDays = Math.max(1, Math.ceil((p.endDate - p.startDate) / 86400000));
      scheduleMultiplier = Math.max(1, Math.ceil(durationDays / 7));
    }

    const totalExercises = weeklyExerciseCount * scheduleMultiplier;
    const planLogs = userLogs.filter(
      (log) => String(log.plannedTrainingId) === String(p._id)
    );
    const uniqueCompletedExercises = new Set(
      planLogs.map((log) => {
        const date = new Date(log.loggedAt).toISOString().slice(0, 10);
        const exercise = log.exerciseId ? String(log.exerciseId) : log.exerciseName;
        return `${date}:${exercise}`;
      })
    );
    const completedExercises = Math.min(totalExercises, uniqueCompletedExercises.size);
    const completionPercentage = totalExercises > 0
      ? Math.min(100, Math.round((completedExercises / totalExercises) * 100))
      : 0;

    return {
      ...planObj,
      completedExercises,
      totalExercises,
      completionPercentage
    };
  });
}

// Select single plan by ID
async function getPlanById(planId) {
  return await PlannedTraining.findById(planId)
    .populate('sportId')
    .populate('goalIds');
}

module.exports = {
  generatePlanRecommendation,
  savePlan,
  updatePlan,
  deletePlan,
  activatePlan,
  getPlans,
  getPlanById
};
