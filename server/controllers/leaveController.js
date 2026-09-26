const Leave = require('../models/Leave');
const Employee = require('../models/Employee');

// @desc    Get all leave requests
// @route   GET /api/leaves
// @access  Private
exports.getLeaves = async (req, res) => {
  try {
    let query = {};
    // If employee role, only show their own leaves
    if (req.user.role === 'employee') {
      const employee = await Employee.findOne({ user: req.user.id });
      if (employee) {
        query.employee = employee._id;
      }
    }

    if (req.query.status && req.query.status !== 'All') {
      query.status = req.query.status;
    }

    const leaves = await Leave.find(query).sort({ appliedAt: -1 });
    res.status(200).json({ success: true, count: leaves.length, data: leaves });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Apply for a leave
// @route   POST /api/leaves
// @access  Private (Employee, Manager, HR)
exports.applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, days, reason } = req.body;
    const employee = await Employee.findOne({ user: req.user.id });

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee profile not located.' });
    }

    const leave = await Leave.create({
      employee: employee._id,
      employeeName: req.user.name,
      department: employee.department,
      leaveType,
      startDate,
      endDate,
      days: days || 1,
      reason
    });

    res.status(201).json({
      success: true,
      message: 'Leave application submitted for managerial approval.',
      data: leave
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Approve or reject leave application
// @route   PUT /api/leaves/:id/status
// @access  Private (Manager, HR, Admin)
exports.updateLeaveStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    let leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave request not found.' });
    }

    leave.status = status;
    leave.reviewedBy = req.user.name;
    leave.reviewRemarks = remarks || '';
    leave.reviewedAt = Date.now();

    await leave.save();

    res.status(200).json({
      success: true,
      message: `Leave request marked as ${status}.`,
      data: leave
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
