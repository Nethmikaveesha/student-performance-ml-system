const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true, trim: true },
    quizScore: { type: Number, required: true, min: 0, max: 100 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quiz', quizSchema);
