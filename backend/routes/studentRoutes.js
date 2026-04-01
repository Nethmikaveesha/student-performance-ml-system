const express = require('express');
const { createStudent, getStudents } = require('../controllers/studentController');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticate, requireRole('teacher'), createStudent);
router.get('/', authenticate, requireRole('teacher'), getStudents);

module.exports = router;
