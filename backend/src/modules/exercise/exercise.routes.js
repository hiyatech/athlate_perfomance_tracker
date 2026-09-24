const express = require('express');
const router = express.Router();
const exerciseController = require('./exercise.controller');

// Exercise library endpoints
router.get('/', exerciseController.getAllExercises);
router.get('/:id', exerciseController.getExerciseById);

module.exports = router;
