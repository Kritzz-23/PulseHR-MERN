const Employee = require('../models/Employee');
const User = require('../models/User');

// @desc    Get all employees with filters, search, and pagination
// @route   GET /api/employees
// @access  Private (Admin, HR, Manager)
exports.getEmployees = async (req, res) => {
  try {
    const { department, status, search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (department && department !== 'All') {
      query.department = department;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    const employees = await Employee.find(query)
      .populate('user', 'name email role')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Employee.countDocuments(query);

    res.status(200).json({
      success: true,
      count: employees.length,
      total,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      },
      data: employees
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get single employee details
// @route   GET /api/employees/:id
// @access  Private
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate('user', 'name email role');
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }
    res.status(200).json({ success: true, data: employee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create new employee
// @route   POST /api/employees
// @access  Private (Admin, HR)
exports.createEmployee = async (req, res) => {
  try {
    const { name, email, password, designation, department, manager, salary, phone, location } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this email already exists.' });
    }

    const user = await User.create({
      name,
      email,
      password: password || 'PulseHR@2026',
      role: 'employee'
    });

    const empCount = await Employee.countDocuments();
    const employeeId = `EMP-${String(empCount + 1).padStart(4, '0')}`;

    const employee = await Employee.create({
      user: user._id,
      employeeId,
      designation,
      department,
      manager: manager || 'Direct to Executive',
      salary: salary || { basic: 60000, hra: 24000, allowances: 12000, total: 96000 },
      phone: phone || '+91 98765 43210',
      location: location || 'Kolkata, IN'
    });

    res.status(201).json({
      success: true,
      message: 'Employee successfully created and provisioned.',
      data: employee
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private (Admin, HR)
exports.updateEmployee = async (req, res) => {
  try {
    let employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee record not found.' });
    }

    employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: employee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete employee (soft or hard delete)
// @route   DELETE /api/employees/:id
// @access  Private (Admin only)
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee record not found.' });
    }

    await User.findByIdAndDelete(employee.user);
    await Employee.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Employee and user authentication profile removed.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
