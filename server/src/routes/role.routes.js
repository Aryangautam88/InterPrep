const express = require('express');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const health = require('../controllers/health.controller');

const router = express.Router();

router.get('/student/ping', authenticate, authorize('student'), health.ping);
router.get('/mentor/ping', authenticate, authorize('mentor'), health.ping);
router.get('/admin/ping', authenticate, authorize('admin'), health.ping);

module.exports = router;
