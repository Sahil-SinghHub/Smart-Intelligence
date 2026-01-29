const express = require('express');
const router = express.Router();
const { getRevisionPlan, getDailyDirection, getGeneratedTest, suggestConcepts } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.get('/revision-plan', protect, getRevisionPlan);
router.get('/direction', protect, getDailyDirection);
router.get('/generate-test', protect, getGeneratedTest);
router.get('/suggest-concepts', protect, suggestConcepts);

module.exports = router;
