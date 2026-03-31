const Teacher = require('../models/Teacher');

const getTeachers = async (_req, res) => {
  try {
    const teachers = await Teacher.find().select('-password').sort({ createdAt: -1 });
    return res.status(200).json({ data: teachers });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getTeachers };
