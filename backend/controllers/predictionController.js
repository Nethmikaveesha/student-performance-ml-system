const Prediction = require('../models/Prediction');
const { runModel } = require('../ml-integration/runModel');
const { buildPredictionPayload } = require('../utils/predictionPayload');

const createPrediction = async (req, res) => {
  try {
    const parsed = buildPredictionPayload(req.body);
    if (!parsed.ok) {
      return res.status(400).json({ message: parsed.errors.join('; ') });
    }

    const studentId = req.user.studentId;
    if (!studentId) {
      return res.status(403).json({ message: 'Student account required for predictions' });
    }

    const model = await runModel(parsed.forModel);

    const record = await Prediction.create({
      studentId,
      ...parsed.forDb,
      prediction: model.prediction,
    });

    return res.status(201).json({ data: record, model });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getPredictionHistory = async (req, res) => {
  try {
    if (req.user.role === 'teacher') {
      const rows = await Prediction.find().sort({ createdAt: -1 }).limit(100);
      return res.status(200).json({ data: rows });
    }
    const sid = req.user.studentId;
    if (!sid) {
      return res.status(403).json({ message: 'Student ID missing from session' });
    }
    const rows = await Prediction.find({ studentId: sid }).sort({ createdAt: -1 }).limit(50);
    return res.status(200).json({ data: rows });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { createPrediction, getPredictionHistory };
