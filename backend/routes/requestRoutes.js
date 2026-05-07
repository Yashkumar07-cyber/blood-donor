const express = require('express');
const router = express.Router();
const {
  createRequest,
  getRequests,
  getRequest,
  respondToRequest,
  updateRequestStatus,
  getMyRequests,
} = require('../controllers/requestController');
const { protect } = require('../middleware/auth');

router.get('/', getRequests);
router.post('/', protect, createRequest);
router.get('/my', protect, getMyRequests);
router.get('/:id', getRequest);
router.patch('/:id/respond', protect, respondToRequest);
router.patch('/:id/status', protect, updateRequestStatus);

module.exports = router;
