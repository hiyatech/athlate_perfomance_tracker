const intelligenceService = require('./intelligence.service');

// Controller to generate recommended plan draft
async function generatePlan(req, res) {
  try {
    const { sportId, goalIds, trainingPeriod, restDays, trainingTime } = req.body;
    const planDraft = await intelligenceService.generatePlanRecommendation({
      athleteId: req.user.id,
      sportId,
      goalIds,
      trainingPeriod,
      restDays,
      trainingTime
    });
    res.status(200).json(planDraft);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Controller to save final edited plan into DB
async function savePlan(req, res) {
  try {
    const planPayload = {
      ...req.body,
      athleteId: req.user.id
    };
    const savedPlan = await intelligenceService.savePlan(planPayload);
    res.status(201).json({
      message: 'Plan saved successfully to My Planned Training!',
      plan: savedPlan
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Controller to update existing plan
async function updatePlan(req, res) {
  try {
    const updated = await intelligenceService.updatePlan(req.params.planId, req.user.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    res.status(200).json({ message: 'Plan updated successfully', plan: updated });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Controller to delete plan
async function deletePlan(req, res) {
  try {
    const deleted = await intelligenceService.deletePlan(req.params.planId, req.user.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    res.status(200).json({ message: 'Plan deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Controller to set plan as active
async function activatePlan(req, res) {
  try {
    const activated = await intelligenceService.activatePlan(req.params.planId, req.user.id);
    if (!activated) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    res.status(200).json({ message: 'Plan activated successfully', plan: activated });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Controller to get all saved plans for athlete
async function getPlans(req, res) {
  try {
    const plans = await intelligenceService.getPlans(req.user.id);
    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Controller to get single plan details
async function getPlanById(req, res) {
  try {
    const plan = await intelligenceService.getPlanById(req.params.planId);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  generatePlan,
  savePlan,
  updatePlan,
  deletePlan,
  activatePlan,
  getPlans,
  getPlanById
};
