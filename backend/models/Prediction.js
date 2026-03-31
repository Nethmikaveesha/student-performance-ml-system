const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
      trim: true,
    },
    studyTime: {
      type: Number,
      required: true,
      min: 0,
      max: 6,
    },
    attendancePercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    quizScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    assignmentCompletion: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    numberOfAttempts: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    lessonCompletionPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    prediction: {
      type: String,
      enum: ['Weak', 'Average', 'Strong'],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Prediction', predictionSchema);
