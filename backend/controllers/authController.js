const Student = require('../models/Student');
const Teacher = require('../models/Teacher');

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'name, email, password and role are required' });
    }

    const normalizedRole = String(role).toLowerCase();
    if (!['student', 'teacher'].includes(normalizedRole)) {
      return res.status(400).json({ message: 'role must be student or teacher' });
    }

    const normalizedEmail = String(email).toLowerCase();

    if (normalizedRole === 'student') {
      const studentId = `STU-${Date.now().toString().slice(-6)}`;
      const existingStudent = await Student.findOne({ email: normalizedEmail });
      if (existingStudent) {
        return res.status(409).json({ message: 'Student account already exists for this email. Please login.' });
      }

      const student = await Student.create({
        studentId,
        name,
        email: normalizedEmail,
        password,
        role: 'student',
      });
      return res.status(201).json({
        data: {
          id: student._id,
          name: student.name,
          email: student.email,
          role: student.role,
          studentId: student.studentId,
        },
      });
    }

    const existingTeacher = await Teacher.findOne({ email: normalizedEmail });
    if (existingTeacher) {
      return res.status(409).json({ message: 'Teacher account already exists for this email. Please login.' });
    }

    const teacher = await Teacher.create({
      name,
      email: normalizedEmail,
      password,
      role: 'teacher',
    });
    return res.status(201).json({
      data: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        role: teacher.role,
      },
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: 'Account already exists with this email.' });
    }
    return res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ message: 'email, password and role are required' });
    }

    const normalizedRole = String(role).toLowerCase();
    let user = null;

    if (normalizedRole === 'student') {
      user = await Student.findOne({ email: String(email).toLowerCase(), password, role: 'student' });
    } else if (normalizedRole === 'teacher') {
      user = await Teacher.findOne({ email: String(email).toLowerCase(), password, role: 'teacher' });
    } else {
      return res.status(400).json({ message: 'role must be student or teacher' });
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    return res.status(200).json({
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login };
