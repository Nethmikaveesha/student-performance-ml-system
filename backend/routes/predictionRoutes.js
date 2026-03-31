const express = require('express');
const {
  createPrediction,
  getPredictionHistory,
} = require('../controllers/predictionController');

const router = express.Router();

router.post('/', createPrediction);
router.get('/history', getPredictionHistory);

module.exports = router;
