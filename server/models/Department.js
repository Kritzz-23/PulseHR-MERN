const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide department name'],
    unique: true,
    trim: true
  },
  code: {
    type: String,
    required: [true, 'Please provide department code'],
    unique: true,
    uppercase: true,
    trim: true
  },
  headOfDepartment: {
    type: String,
    required: true
  },
  headCount: {
    type: Number,
    default: 0
  },
  budget: {
    type: Number,
    default: 500000
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Department', DepartmentSchema);
