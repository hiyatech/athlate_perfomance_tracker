const mongoose = require('mongoose');

// Goals collection schema
const goalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['general', 'sportSpecific'], default: 'general' },
  sportId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sport', default: null },
  description: { type: String, default: '' },
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Goal', goalSchema);
