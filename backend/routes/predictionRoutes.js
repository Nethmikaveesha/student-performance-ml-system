const express = require('express');
const { createPrediction, getPredictionHistory } = require('../controllers/predictionController');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticate, requireRole('student'), createPrediction);
router.get('/history', authenticate, requireRole('student', 'teacher'), getPredictionHistory);

module.exports = router;
