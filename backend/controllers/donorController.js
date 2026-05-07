const Donor = require('../models/Donor');

// POST /api/donors - Register as donor
exports.registerDonor = async (req, res, next) => {
  try {
    const existing = await Donor.findOne({ user: req.user.id });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Already registered as donor' });
    }

    const donor = await Donor.create({ ...req.body, user: req.user.id });
    await donor.populate('user', 'name email phone');
    res.status(201).json({ success: true, data: donor });
  } catch (error) {
    next(error);
  }
};

// GET /api/donors/nearby?lat=&lng=&radius=10&bloodGroup=O+
exports.getNearbyDonors = async (req, res, next) => {
  try {
    const { lat, lng, radius = 10, bloodGroup } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: 'Latitude and longitude are required' });
    }

    const radiusInMeters = Number(radius) * 1000; // km to meters

    const query = {
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: radiusInMeters,
        },
      },
      isAvailable: true,
    };

    if (bloodGroup) {
      // Compatible blood groups logic
      const compatibility = {
        'O-': ['O-'],
        'O+': ['O-', 'O+'],
        'A-': ['O-', 'A-'],
        'A+': ['O-', 'O+', 'A-', 'A+'],
        'B-': ['O-', 'B-'],
        'B+': ['O-', 'O+', 'B-', 'B+'],
        'AB-': ['O-', 'A-', 'B-', 'AB-'],
        'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
      };
      query.bloodGroup = { $in: compatibility[bloodGroup] || [bloodGroup] };
    }

    const donors = await Donor.find(query)
      .populate('user', 'name phone')
      .limit(20)
      .select('-medicalInfo');

    res.status(200).json({
      success: true,
      count: donors.length,
      data: donors,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/donors/:id
exports.getDonor = async (req, res, next) => {
  try {
    const donor = await Donor.findById(req.params.id).populate('user', 'name email phone');
    if (!donor) {
      return res.status(404).json({ success: false, message: 'Donor not found' });
    }
    res.status(200).json({ success: true, data: donor });
  } catch (error) {
    next(error);
  }
};

// PUT /api/donors/me - Update my donor profile
exports.updateDonorProfile = async (req, res, next) => {
  try {
    const donor = await Donor.findOneAndUpdate(
      { user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    ).populate('user', 'name email phone');

    if (!donor) {
      return res.status(404).json({ success: false, message: 'Donor profile not found' });
    }

    res.status(200).json({ success: true, data: donor });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/donors/availability - Toggle availability
exports.toggleAvailability = async (req, res, next) => {
  try {
    const donor = await Donor.findOne({ user: req.user.id });
    if (!donor) {
      return res.status(404).json({ success: false, message: 'Donor profile not found' });
    }
    donor.isAvailable = !donor.isAvailable;
    await donor.save();
    res.status(200).json({ success: true, data: { isAvailable: donor.isAvailable } });
  } catch (error) {
    next(error);
  }
};

// GET /api/donors - All donors (admin)
exports.getAllDonors = async (req, res, next) => {
  try {
    const donors = await Donor.find().populate('user', 'name email phone').sort('-createdAt');
    res.status(200).json({ success: true, count: donors.length, data: donors });
  } catch (error) {
    next(error);
  }
};
