const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');

// @desc    Clock-In for attendance
// @route   POST /api/attendance/clock-in
// @access  Private
exports.clockIn = async (req, res) => {
  try {
    const employee = await Employee.findOne({ user: req.user.id });
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee profile not found.' });
    }

    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    let attendance = await Attendance.findOne({ employee: employee._id, date: today });
    if (attendance && attendance.clockIn) {
      return res.status(400).json({ success: false, message: 'You have already clocked in today.' });
    }

    if (!attendance) {
      attendance = await Attendance.create({
        employee: employee._id,
        employeeName: req.user.name,
        date: today,
        clockIn: nowTime,
        status: 'Present',
        ipAddress: req.ip || '192.168.1.1'
      });
    } else {
      attendance.clockIn = nowTime;
      attendance.status = 'Present';
      await attendance.save();
    }

    res.status(200).json({
      success: true,
      message: `Clocked in successfully at ${nowTime}`,
      data: attendance
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Clock-Out for attendance
// @route   POST /api/attendance/clock-out
// @access  Private
exports.clockOut = async (req, res) => {
  try {
    const employee = await Employee.findOne({ user: req.user.id });
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee profile not found.' });
    }

    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    let attendance = await Attendance.findOne({ employee: employee._id, date: today });
    if (!attendance || !attendance.clockIn) {
      return res.status(400).json({ success: false, message: 'You must clock in before clocking out.' });
    }

    attendance.clockOut = nowTime;
    await attendance.save();

    res.status(200).json({
      success: true,
      message: `Clocked out successfully at ${nowTime}`,
      data: attendance
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get attendance stats for today
// @route   GET /api/attendance/today
// @access  Private
exports.getTodayAttendance = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const logs = await Attendance.find({ date: today });
    res.status(200).json({
      success: true,
      date: today,
      count: logs.length,
      data: logs
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
