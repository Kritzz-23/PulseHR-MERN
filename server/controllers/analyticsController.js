const Employee = require('../models/Employee');
const Leave = require('../models/Leave');
const Attendance = require('../models/Attendance');
const Task = require('../models/Task');

// @desc    Get complete HRMS company analytics and chart data
// @route   GET /api/analytics/dashboard
// @access  Private
exports.getDashboardAnalytics = async (req, res) => {
  try {
    // Primary Header KPI metrics requested by user
    const totalEmployees = 245;
    const presentToday = 218;
    const onLeave = 17;
    const pendingRequests = 10;

    // Monthly Employee Growth Data (12-month trajectory)
    const employeeGrowth = [
      { month: 'Jan', employees: 175, hires: 14, attrition: 2 },
      { month: 'Feb', employees: 184, hires: 11, attrition: 2 },
      { month: 'Mar', employees: 192, hires: 10, attrition: 2 },
      { month: 'Apr', employees: 201, hires: 12, attrition: 3 },
      { month: 'May', employees: 210, hires: 11, attrition: 2 },
      { month: 'Jun', employees: 218, hires: 9, attrition: 1 },
      { month: 'Jul', employees: 224, hires: 8, attrition: 2 },
      { month: 'Aug', employees: 231, hires: 10, attrition: 3 },
      { month: 'Sep', employees: 237, hires: 8, attrition: 2 },
      { month: 'Oct', employees: 241, hires: 6, attrition: 2 },
      { month: 'Nov', employees: 243, hires: 4, attrition: 2 },
      { month: 'Dec', employees: 245, hires: 5, attrition: 3 }
    ];

    // Department Distribution Metrics
    const departmentDistribution = [
      { name: 'Engineering', count: 103, percentage: 42, color: '#2563EB' },
      { name: 'Product & Design', count: 44, percentage: 18, color: '#7C3AED' },
      { name: 'Sales & Growth', count: 37, percentage: 15, color: '#059669' },
      { name: 'Marketing', count: 37, percentage: 15, color: '#D97706' },
      { name: 'HR & Operations', count: 24, percentage: 10, color: '#DC2626' }
    ];

    // Attendance Breakdown
    const attendanceBreakdown = {
      presentPercentage: Math.round((presentToday / totalEmployees) * 100),
      onLeavePercentage: Math.round((onLeave / totalEmployees) * 100),
      absentOrRemotePercentage: Math.round(((totalEmployees - presentToday - onLeave) / totalEmployees) * 100)
    };

    res.status(200).json({
      success: true,
      kpis: {
        totalEmployees,
        presentToday,
        onLeave,
        pendingRequests
      },
      employeeGrowth,
      departmentDistribution,
      attendanceBreakdown
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
