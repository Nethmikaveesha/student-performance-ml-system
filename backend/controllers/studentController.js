const bcrypt = require('bcryptjs');
const Student = require('../models/Student');

const createStudent = async (req, res) => {
  try {
    const body = { ...req.body };
    if (body.password) {
      body.password = await bcrypt.hash(String(body.password), 10);
    }
    const student = await Student.create(body);
    const out = student.toObject();
    delete out.password;
    return res.status(201).json({ data: out });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getStudents = async (_req, res) => {
  const students = await Student.find().select('-password').sort({ createdAt: -1 });
  return res.status(200).json({ data: students });
};

module.exports = { createStudent, getStudents };
