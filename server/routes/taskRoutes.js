const express = require('express');
const { getTasks, createTask, updateTaskStatus } = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getTasks)
  .post(authorize('admin', 'hr', 'manager'), createTask);

router
  .route('/:id/status')
  .put(updateTaskStatus);

module.exports = router;
