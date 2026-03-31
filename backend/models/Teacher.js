const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    department: { type: String, default: 'General' },
    role: { type: String, default: 'teacher' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Teacher', teacherSchema);
