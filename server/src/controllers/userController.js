const User = require('../models/User');
const GroupOrder = require('../models/GroupOrder');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, hostel, block, room, degreeYear, phone } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (hostel) user.hostel = hostel;
    if (block) user.block = block;
    if (room) user.room = room;
    if (degreeYear) user.degreeYear = degreeYear;
    if (phone !== undefined) user.phone = phone;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all orders created or joined by user
// @route   GET /api/users/my-orders
// @access  Private
exports.getMyOrders = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const createdOrders = await GroupOrder.find({ creator: userId })
      .populate('creator', 'name email hostel block room degreeYear phone')
      .populate('participants.user', 'name email hostel block room degreeYear phone')
      .sort({ createdAt: -1 });

    const joinedOrders = await GroupOrder.find({
      'participants.user': userId,
      creator: { $ne: userId }
    })
      .populate('creator', 'name email hostel block room degreeYear phone')
      .populate('participants.user', 'name email hostel block room degreeYear phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        created: createdOrders,
        joined: joinedOrders,
        totalCreated: createdOrders.length,
        totalJoined: joinedOrders.length
      }
    });
  } catch (err) {
    next(err);
  }
};
