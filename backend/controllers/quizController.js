const Quiz = require('../models/Quiz');

const createQuiz = async (req, res) => {
  try {
    const studentId = req.user.studentId;
    if (!studentId) {
      return res.status(403).json({ message: 'Student account required to submit quizzes' });
    }

    const quizScore = Number(req.body.quizScore);
    if (Number.isNaN(quizScore) || quizScore < 0 || quizScore > 100) {
      return res.status(400).json({ message: 'quizScore must be a number between 0 and 100' });
    }

    const quiz = await Quiz.create({
      studentId,
      quizScore,
    });
    return res.status(201).json({ data: quiz });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getQuizzes = async (req, res) => {
  try {
    const filter = req.user.role === 'teacher' ? {} : { studentId: req.user.studentId };
    if (req.user.role !== 'teacher' && !req.user.studentId) {
      return res.status(403).json({ message: 'Student ID missing from session' });
    }
    const quizzes = await Quiz.find(filter).sort({ createdAt: -1 }).limit(100);
    return res.status(200).json({ data: quizzes });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { createQuiz, getQuizzes };
