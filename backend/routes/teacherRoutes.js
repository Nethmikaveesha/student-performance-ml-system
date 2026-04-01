const express = require('express');
const { getTeachers } = require('../controllers/teacherController');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, requireRole('teacher'), getTeachers);

module.exports = router;
