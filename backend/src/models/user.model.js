const mongoose = require('mongoose');

// User Schema with exact personal, emergency, and training background fields
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  photoUrl: { type: String, default: '' },
  
  // Personal Info Section
  dob: { type: String, default: '' },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Male' },
  contactNumber: { type: String, default: '' },
  location: { type: String, default: '' },
  bloodGroup: { type: String, default: 'O+' },
  height: { type: Number, default: 170 }, // cm
  weight: { type: Number, default: 70 },  // kg

  // Emergency Contact Section
  emergencyContactName: { type: String, default: '' },
  emergencyContactNumber: { type: String, default: '' },

  // Training Background Section
  medicalConditions: { type: String, default: '' },
  occupation: { type: String, enum: ['Student', 'Employed', 'Self-Employed', 'Athlete'], default: 'Student' },
  trainingLocation: { type: String, enum: ['Home', 'Gym', 'Outdoor', 'Sports Academy'], default: 'Gym' },
  yearsExperience: { type: Number, default: 1 },
  bio: { type: String, default: '' },
  followsDiet: { type: Boolean, default: false },
  dietType: { type: String, default: 'High Protein' },
  injuryTags: { type: [String], default: [] },
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
