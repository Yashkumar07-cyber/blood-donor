const BloodRequest = require('../models/BloodRequest');
const Donor = require('../models/Donor');

// POST /api/requests - Create blood request
exports.createRequest = async (req, res, next) => {
  try {
    const request = await BloodRequest.create({ ...req.body, requester: req.user.id });

    // Find nearby donors and notify via socket
    const { coordinates } = request.hospital.location;
    const nearbyDonors = await Donor.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates },
          $maxDistance: 15000, // 15km
        },
      },
      bloodGroup: request.bloodGroup,
      isAvailable: true,
    }).populate('user', 'name');

    // Add matched donors to request
    request.matchedDonors = nearbyDonors.map((d) => ({ donor: d._id }));
    await request.save();

    // Emit socket event (io is attached to req.app)
    const io = req.app.get('io');
    if (io) {
      nearbyDonors.forEach((donor) => {
        io.to(`donor_${donor._id}`).emit('new_blood_request', {
          requestId: request._id,
          bloodGroup: request.bloodGroup,
          urgency: request.urgency,
          hospital: request.hospital.name,
          message: `Emergency: ${request.bloodGroup} blood needed at ${request.hospital.name}`,
        });
      });
    }

    res.status(201).json({
      success: true,
      data: request,
      notifiedDonors: nearbyDonors.length,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/requests - Get all open requests near location
exports.getRequests = async (req, res, next) => {
  try {
    const { lat, lng, radius = 20 } = req.query;
    let query = { status: 'open', expiresAt: { $gt: new Date() } };

    if (lat && lng) {
      query['hospital.location'] = {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: Number(radius) * 1000,
        },
      };
    }

    const requests = await BloodRequest.find(query)
      .populate('requester', 'name phone')
      .sort('-createdAt')
      .limit(30);

    res.status(200).json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    next(error);
  }
};

// GET /api/requests/:id
exports.getRequest = async (req, res, next) => {
  try {
    const request = await BloodRequest.findById(req.params.id)
      .populate('requester', 'name phone email')
      .populate('matchedDonors.donor');

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }
    res.status(200).json({ success: true, data: request });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/requests/:id/respond - Donor responds to request
exports.respondToRequest = async (req, res, next) => {
  try {
    const { status } = req.body; // 'accepted' | 'declined'
    const donor = await Donor.findOne({ user: req.user.id });
    if (!donor) {
      return res.status(404).json({ success: false, message: 'Donor profile not found' });
    }

    const request = await BloodRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    const match = request.matchedDonors.find(
      (m) => m.donor.toString() === donor._id.toString()
    );

    if (match) {
      match.status = status;
    } else {
      request.matchedDonors.push({ donor: donor._id, status });
    }

    await request.save();
    res.status(200).json({ success: true, message: `Response recorded: ${status}` });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/requests/:id/status - Update request status (owner)
exports.updateRequestStatus = async (req, res, next) => {
  try {
    const request = await BloodRequest.findOne({
      _id: req.params.id,
      requester: req.user.id,
    });

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    request.status = req.body.status;
    await request.save();
    res.status(200).json({ success: true, data: request });
  } catch (error) {
    next(error);
  }
};

// GET /api/requests/my - My requests
exports.getMyRequests = async (req, res, next) => {
  try {
    const requests = await BloodRequest.find({ requester: req.user.id }).sort('-createdAt');
    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    next(error);
  }
};
