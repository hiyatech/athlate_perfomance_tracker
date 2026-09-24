const express = require('express');
const router = express.Router();
const goalsController = require('./goals.controller');

// GET /api/goals (supports ?sportId=xxx)
router.get('/', goalsController.getGoals);

module.exports = router;
