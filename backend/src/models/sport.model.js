const mongoose = require('mongoose');

// Sports collection schema
const sportSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Sport', sportSchema);
