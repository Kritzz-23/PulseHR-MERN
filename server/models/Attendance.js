const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  employeeName: {
    type: String,
    required: true
  },
  date: {
    type: String, // YYYY-MM-DD
    required: true
  },
  clockIn: {
    type: String, // e.g. "09:14 AM"
    default: null
  },
  clockOut: {
    type: String, // e.g. "06:05 PM"
    default: null
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Late', 'Half-Day', 'On Leave'],
    default: 'Present'
  },
  workHours: {
    type: Number,
    default: 8.5
  },
  ipAddress: {
    type: String,
    default: '192.168.1.45'
  }
});

AttendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
