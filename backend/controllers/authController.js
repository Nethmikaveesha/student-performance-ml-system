const bcrypt = require('bcryptjs');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const { signUserToken } = require('../utils/jwt');

const SALT_ROUNDS = 10;

function userResponse(user) {
  return {
    id: user._id?.toString?.() ?? user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    ...(user.studentId && { studentId: user.studentId }),
  };
}

async function verifyAndMaybeMigratePassword(user, plainPassword) {
  if (!user?.password) return false;
  if (user.password.startsWith('$2')) {
    return bcrypt.compare(plainPassword, user.password);
  }
  if (user.password === plainPassword) {
    user.password = await bcrypt.hash(plainPassword, SALT_ROUNDS);
    await user.save();
    return true;
  }
  return false;
}

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
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

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
        password: hashed,
        role: 'student',
      });
      const token = signUserToken(student);
      const data = { ...userResponse(student), token };
      return res.status(201).json({ token, data });
    }

    const existingTeacher = await Teacher.findOne({ email: normalizedEmail });
    if (existingTeacher) {
      return res.status(409).json({ message: 'Teacher account already exists for this email. Please login.' });
    }

    const teacher = await Teacher.create({
      name,
      email: normalizedEmail,
      password: hashed,
      role: 'teacher',
    });
    const token = signUserToken(teacher);
    const data = { ...userResponse(teacher), token };
    return res.status(201).json({ token, data });
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
      user = await Student.findOne({ email: String(email).toLowerCase(), role: 'student' });
    } else if (normalizedRole === 'teacher') {
      user = await Teacher.findOne({ email: String(email).toLowerCase(), role: 'teacher' });
    } else {
      return res.status(400).json({ message: 'role must be student or teacher' });
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const ok = await verifyAndMaybeMigratePassword(user, password);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signUserToken(user);
    const data = { ...userResponse(user), token };
    return res.status(200).json({ token, data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const me = async (req, res) => {
  return res.status(200).json({
    data: {
      id: req.user.sub,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      ...(req.user.studentId && { studentId: req.user.studentId }),
    },
  });
};

module.exports = { register, login, me };
