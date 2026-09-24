const profileService = require('./profile.service');

// Controller to get profile
async function getProfile(req, res) {
  try {
    const profile = await profileService.getProfile(req.user.id);
    res.status(200).json(profile);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

// Controller to update full profile
async function updateProfile(req, res) {
  try {
    const updated = await profileService.updateProfile(req.user.id, req.body);
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Controller to update profile photo
async function updatePhoto(req, res) {
  try {
    const { photoUrl } = req.body;
    const updated = await profileService.updatePhoto(req.user.id, photoUrl);
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Controller to update athletic goal
async function updateGoal(req, res) {
  try {
    const { goal } = req.body;
    const updated = await profileService.updateGoal(req.user.id, goal);
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Controller to update diet
async function updateDiet(req, res) {
  try {
    const { followsDiet, dietType } = req.body;
    const updated = await profileService.updateDiet(req.user.id, followsDiet, dietType);
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Controller to add an injury
async function addInjury(req, res) {
  try {
    const { injury } = req.body;
    const updated = await profileService.addInjury(req.user.id, injury);
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Controller to delete an injury
async function removeInjury(req, res) {
  try {
    const { id } = req.params; // injury name or id string
    const updated = await profileService.removeInjury(req.user.id, id);
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Controller to update availability days
async function updateAvailability(req, res) {
  try {
    const { daysAvailablePerWeek } = req.body;
    const updated = await profileService.updateAvailability(req.user.id, daysAvailablePerWeek);
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = {
  getProfile,
  updateProfile,
  updatePhoto,
  updateGoal,
  updateDiet,
  addInjury,
  removeInjury,
  updateAvailability
};
