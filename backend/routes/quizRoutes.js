const express = require('express');
const { createQuiz, getQuizzes } = require('../controllers/quizController');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticate, requireRole('student'), createQuiz);
router.get('/', authenticate, requireRole('student', 'teacher'), getQuizzes);

module.exports = router;
