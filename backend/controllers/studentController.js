const Student = require('../models/Student');

const createStudent = async (req, res) => {
  try {
    const student = await Student.create(req.body);
    return res.status(201).json({ data: student });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getStudents = async (_req, res) => {
  const students = await Student.find().select('-password').sort({ createdAt: -1 });
  return res.status(200).json({ data: students });
};

module.exports = { createStudent, getStudents };
