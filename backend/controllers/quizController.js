const Quiz = require('../models/Quiz');

const createQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.create({
      studentId: req.body.studentId,
      quizScore: Number(req.body.quizScore),
    });
    return res.status(201).json({ data: quiz });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getQuizzes = async (_req, res) => {
  const quizzes = await Quiz.find().sort({ createdAt: -1 }).limit(100);
  return res.status(200).json({ data: quizzes });
};

module.exports = { createQuiz, getQuizzes };
