const express = require('express');
const router = express.Router();
const intelligenceController = require('./intelligence.controller');
const { protect } = require('../../middleware/auth.middleware');

router.use(protect);

router.post('/generate', intelligenceController.generatePlan);
router.post('/plan/save', intelligenceController.savePlan);
router.get('/plans', intelligenceController.getPlans);
router.get('/plans/:planId', intelligenceController.getPlanById);
router.put('/plans/:planId', intelligenceController.updatePlan);
router.delete('/plans/:planId', intelligenceController.deletePlan);
router.put('/plans/:planId/activate', intelligenceController.activatePlan);

module.exports = router;
