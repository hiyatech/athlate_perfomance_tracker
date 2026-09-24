const mongoose = require('mongoose');

// Workout Log collection schema
const logSchema = new mongoose.Schema({
  athleteId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
  plannedTrainingId: { type: mongoose.Schema.Types.ObjectId, ref: 'PlannedTraining' },
  exerciseName: { type: String, required: true },
  dayName: { type: String, default: 'Today' },
  actualSets: { type: Number, default: 3 },
  actualReps: { type: Number, default: 10 },
  actualWeight: { type: Number, default: 0 }, // weight in kg
  actualTime: { type: Number, default: 0 },   // duration in seconds
  mood: { type: String, enum: ['tough', 'okay', 'strong'], default: 'okay' },
  note: { type: String, default: '' },
  isPersonalBest: { type: Boolean, default: false },
  loggedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.model('Log', logSchema);
