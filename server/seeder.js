const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Employee = require('./models/Employee');
const Department = require('./models/Department');
const Leave = require('./models/Leave');
const Attendance = require('./models/Attendance');
const Task = require('./models/Task');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/pulsehr_db');
    console.log('MongoDB Connected for Seeder...');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const seedData = async () => {
  await connectDB();

  try {
    // Clear existing
    await User.deleteMany();
    await Employee.deleteMany();
    await Department.deleteMany();
    await Leave.deleteMany();
    await Attendance.deleteMany();
    await Task.deleteMany();

    console.log('Cleared existing records...');

    // Seed Departments
    const departments = await Department.create([
      { name: 'Engineering', code: 'ENG', headOfDepartment: 'Vikram Sengupta', headCount: 103, budget: 1200000 },
      { name: 'Product & Design', code: 'PRD', headOfDepartment: 'Ananya Roy', headCount: 44, budget: 600000 },
      { name: 'Sales & Growth', code: 'SLS', headOfDepartment: 'Rajesh Sharma', headCount: 37, budget: 500000 },
      { name: 'Marketing', code: 'MKT', headOfDepartment: 'Sneha Bose', headCount: 37, budget: 450000 },
      { name: 'HR & Operations', code: 'HRO', headOfDepartment: 'Pooja Kapoor', headCount: 24, budget: 350000 }
    ]);

    // Seed 4 Role Users
    const users = [
      {
        name: 'Kritika Giri (Admin)',
        email: 'admin@pulsehr.io',
        password: 'Password@123',
        role: 'admin'
      },
      {
        name: 'Pooja Kapoor (HR Lead)',
        email: 'hr@pulsehr.io',
        password: 'Password@123',
        role: 'hr'
      },
      {
        name: 'Vikram Sengupta (Engineering Manager)',
        email: 'manager@pulsehr.io',
        password: 'Password@123',
        role: 'manager'
      },
      {
        name: 'Aarav Mukherjee (Senior Software Engineer)',
        email: 'employee@pulsehr.io',
        password: 'Password@123',
        role: 'employee'
      }
    ];

    for (const u of users) {
      const user = await User.create(u);
      const empId = `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
      await Employee.create({
        user: user._id,
        employeeId: empId,
        designation: u.role === 'admin' ? 'Chief Technology Officer' : u.role === 'hr' ? 'Director of People' : u.role === 'manager' ? 'Engineering Lead' : 'Senior Backend Engineer',
        department: u.role === 'hr' ? 'HR & Operations' : 'Engineering',
        manager: u.role === 'employee' ? 'Vikram Sengupta' : 'Board of Directors',
        phone: '+91 98301 23456',
        location: 'Kolkata, IN'
      });
    }

    console.log('Seeded Users, Employees, and Departments!');
    process.exit();
  } catch (err) {
    console.error('Seeder Error:', err);
    process.exit(1);
  }
};

seedData();
