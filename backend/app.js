const express = require('express');
const cors = require('cors');
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const quizRoutes = require('./routes/quizRoutes');
const predictionRoutes = require('./routes/predictionRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => res.status(200).json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/predictions', predictionRoutes);

module.exports = app;
