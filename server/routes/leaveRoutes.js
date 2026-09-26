const express = require('express');
const { getLeaves, applyLeave, updateLeaveStatus } = require('../controllers/leaveController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getLeaves)
  .post(applyLeave);

router
  .route('/:id/status')
  .put(authorize('admin', 'hr', 'manager'), updateLeaveStatus);

module.exports = router;
