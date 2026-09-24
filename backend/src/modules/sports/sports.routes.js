const express = require('express');
const router = express.Router();
const sportsController = require('./sports.controller');

// GET /api/sports - List all active sports
router.get('/', sportsController.getAllSports);

module.exports = router;
