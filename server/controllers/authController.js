const User = require('../models/User');
const Employee = require('../models/Employee');

// @desc    Register a new user & employee
// @route   POST /api/auth/register
// @access  Public (or Admin in production)
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, designation, department } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'employee'
    });

    // Auto-create associated employee record
    const empCount = await Employee.countDocuments();
    const employeeId = `EMP-${String(empCount + 1).padStart(4, '0')}`;

    const employee = await Employee.create({
      user: user._id,
      employeeId,
      designation: designation || 'Software Engineer',
      department: department || 'Engineering'
    });

    sendTokenResponse(user, employee, 201, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Login user with email and password
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const employee = await Employee.findOne({ user: user._id });
    sendTokenResponse(user, employee, 200, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get current logged in user & employee profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const employee = await Employee.findOne({ user: req.user.id });

    res.status(200).json({
      success: true,
      user,
      employee
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Forgot password simulation
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'No user registered with that email address.' });
    }

    res.status(200).json({
      success: true,
      message: 'Password reset link dispatched to your registered email address.'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Helper: Get token from model, create cookie and send response
const sendTokenResponse = (user, employee, statusCode, res) => {
  const token = user.getSignedJwtToken();

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    employee: employee ? {
      employeeId: employee.employeeId,
      designation: employee.designation,
      department: employee.department,
      avatar: employee.avatar
    } : null
  });
};
