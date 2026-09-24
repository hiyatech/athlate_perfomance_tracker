const express = require('express');
const router = express.Router();
const trainingController = require('./training.controller');
const { protect } = require('../../middleware/auth.middleware');

router.use(protect);

router.get('/today', trainingController.getToday);
router.get('/week', trainingController.getWeek);
router.post('/log', trainingController.logWorkout);
router.put('/day/:dayId/rest', trainingController.toggleRestDay);
router.put('/exercise/:planExerciseId/reorder', trainingController.reorderExercise);
router.post('/exercise/:planExerciseId/log', trainingController.logWorkout);
router.put('/log/:logId', trainingController.updateLog);
router.delete('/log/:logId', trainingController.deleteLog);
router.get('/exercise/:exerciseId/pb', trainingController.getExercisePB);

module.exports = router;
