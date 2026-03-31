const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, default: '' },
    email: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);
