const Task = require('../models/Task');
const Employee = require('../models/Employee');

// @desc    Get tasks
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'employee') {
      const employee = await Employee.findOne({ user: req.user.id });
      if (employee) {
        query.assignedTo = employee._id;
      }
    }

    if (req.query.status && req.query.status !== 'All') {
      query.status = req.query.status;
    }

    const tasks = await Task.find(query).sort({ dueDate: 1 });
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private (Manager, HR, Admin)
exports.createTask = async (req, res) => {
  try {
    const { title, description, assignedToId, priority, dueDate } = req.body;
    const employee = await Employee.findById(assignedToId).populate('user', 'name');

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Assignee employee record not found.' });
    }

    const task = await Task.create({
      title,
      description,
      assignedTo: employee._id,
      assignedToName: employee.user ? employee.user.name : 'Team Member',
      assignedBy: req.user.name,
      priority: priority || 'Medium',
      dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    res.status(201).json({
      success: true,
      message: 'Task assigned successfully.',
      data: task
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update task status
// @route   PUT /api/tasks/:id/status
// @access  Private
exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    task.status = status;
    await task.save();

    res.status(200).json({
      success: true,
      message: `Task updated to ${status}.`,
      data: task
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
