const User = require('../../models/user.model');

// Get athlete profile details by User ID
async function getProfile(userId) {
  const user = await User.findById(userId).select('-passwordHash');
  return user;
}

// Update athlete profile details
async function updateProfile(userId, updateData) {
  const {
    name,
    photoUrl,
    dob,
    gender,
    contactNumber,
    location,
    bloodGroup,
    height,
    weight,
    emergencyContactName,
    emergencyContactNumber,
    medicalConditions,
    occupation,
    trainingLocation,
    yearsExperience,
    bio,
    followsDiet,
    dietType,
    injuryTags
  } = updateData;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        name,
        photoUrl,
        dob,
        gender,
        contactNumber,
        location,
        bloodGroup,
        height,
        weight,
        emergencyContactName,
        emergencyContactNumber,
        medicalConditions,
        occupation,
        trainingLocation,
        yearsExperience,
        bio,
        followsDiet,
        dietType,
        injuryTags
      }
    },
    { new: true }
  ).select('-passwordHash');

  return updatedUser;
}

module.exports = {
  getProfile,
  updateProfile
};
