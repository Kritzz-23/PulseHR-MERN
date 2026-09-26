const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  employeeId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  designation: {
    type: String,
    required: [true, 'Please provide a designation'],
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Please assign a department'],
    enum: ['Engineering', 'Product', 'Human Resources', 'Marketing', 'Sales', 'Finance', 'Operations']
  },
  manager: {
    type: String,
    default: 'Direct to Executive'
  },
  joiningDate: {
    type: Date,
    default: Date.now
  },
  employmentType: {
    type: String,
    enum: ['Full-Time', 'Part-Time', 'Contract', 'Intern'],
    default: 'Full-Time'
  },
  salary: {
    basic: { type: Number, default: 60000 },
    hra: { type: Number, default: 24000 },
    allowances: { type: Number, default: 12000 },
    total: { type: Number, default: 96000 }
  },
  leaveBalance: {
    casual: { type: Number, default: 12 },
    sick: { type: Number, default: 10 },
    privilege: { type: Number, default: 15 }
  },
  phone: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    default: 'Kolkata, IN'
  },
  avatar: {
    type: String,
    default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
  },
  documents: [
    {
      title: String,
      fileUrl: String,
      uploadedAt: { type: Date, default: Date.now }
    }
  ],
  status: {
    type: String,
    enum: ['Active', 'On Leave', 'Terminated'],
    default: 'Active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Employee', EmployeeSchema);
