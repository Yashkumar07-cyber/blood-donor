const express = require('express');
const router = express.Router();
const {
  registerDonor,
  getNearbyDonors,
  getDonor,
  updateDonorProfile,
  toggleAvailability,
  getAllDonors,
} = require('../controllers/donorController');
const { protect, authorize } = require('../middleware/auth');

router.get('/nearby', getNearbyDonors);
router.get('/', protect, authorize('admin'), getAllDonors);
router.post('/', protect, registerDonor);
router.get('/:id', getDonor);
router.put('/me', protect, updateDonorProfile);
router.patch('/availability', protect, toggleAvailability);

module.exports = router;
