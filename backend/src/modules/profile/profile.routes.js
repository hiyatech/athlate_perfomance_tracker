const express = require('express');
const router = express.Router();
const profileController = require('./profile.controller');
const { protect } = require('../../middleware/auth.middleware');

// All profile routes require authentication
router.use(protect);

router.get('/', profileController.getProfile);
router.put('/', profileController.updateProfile);
router.post('/photo', profileController.photoUpload || profileController.updatePhoto);
router.put('/goal', profileController.updateGoal);
router.put('/diet', profileController.updateDiet);
router.post('/injury', profileController.addInjury);
router.delete('/injury/:id', profileController.removeInjury);
router.put('/availability', profileController.updateAvailability);

module.exports = router;
