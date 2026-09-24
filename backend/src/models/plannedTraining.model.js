const mongoose = require('mongoose');

// PlannedTraining collection schema
const plannedTrainingSchema = new mongoose.Schema({
  athleteId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sportId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sport', default: null },
  goalIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Goal' }],
  trainingPeriod: { type: String, enum: ['1 Week', '15 Days', '1 Month', 'Custom'], default: '1 Week' },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  restDays: [{ type: String }],
  trainingTime: { type: String, default: '6:00 AM' },
  planData: { type: Object, required: true }, // Holds ENTIRE schedule JSON e.g. { "Monday": [{ exerciseId, name, sets, reps, duration }], "Wednesday": "Rest" }
  status: { type: String, enum: ['draft', 'active', 'completed'], default: 'active' }
}, {
  timestamps: true
});

module.exports = mongoose.model('PlannedTraining', plannedTrainingSchema);
