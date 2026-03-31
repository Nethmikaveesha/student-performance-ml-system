const Prediction = require('../models/Prediction');
const { runModel } = require('../ml-integration/runModel');

const createPrediction = async (req, res) => {
  try {
    const payload = {
      study_time: Number(req.body.studyTime),
      attendance_percentage: Number(req.body.attendancePercentage),
      quiz_score: Number(req.body.quizScore),
      assignment_completion: Number(req.body.assignmentCompletion),
      number_of_attempts: Number(req.body.numberOfAttempts),
      lesson_completion_percentage: Number(req.body.lessonCompletionPercentage),
    };

    const model = await runModel(payload);

    const record = await Prediction.create({
      studentId: req.body.studentId,
      studyTime: payload.study_time,
      attendancePercentage: payload.attendance_percentage,
      quizScore: payload.quiz_score,
      assignmentCompletion: payload.assignment_completion,
      numberOfAttempts: payload.number_of_attempts,
      lessonCompletionPercentage: payload.lesson_completion_percentage,
      prediction: model.prediction,
    });

    return res.status(201).json({ data: record, model });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getPredictionHistory = async (_req, res) => {
  const rows = await Prediction.find().sort({ createdAt: -1 }).limit(50);
  return res.status(200).json({ data: rows });
};

module.exports = { createPrediction, getPredictionHistory };
