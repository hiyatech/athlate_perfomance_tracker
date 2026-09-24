const mongoose = require('mongoose');

// Modified Exercise collection schema matching new design
const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['general', 'sportSpecific'], default: 'general' },
  sportId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sport', default: null },
  goalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal', default: null },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'intermediate' },
  unitType: { type: String, enum: ['reps', 'duration', 'distance'], default: 'reps' },
  description: { type: String, default: '' },
  instructions: { type: String, default: '' },
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Exercise', exerciseSchema);
