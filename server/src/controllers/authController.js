const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'hostelcart_jwt_secret_dev_key_2026_nitjsr', {
    expiresIn: '30d'
  });
};

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, college, hostel, block, room, degreeYear, phone } = req.body;

    if (!name || !email || !password || !hostel || !block || !room) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, password, hostel, block, and room'
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists'
      });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      college: college || 'NIT Jamshedpur',
      hostel,
      block,
      room,
      degreeYear: degreeYear || 'B.Tech 4th Year',
      phone: phone || ''
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        hostel: user.hostel,
        block: user.block,
        room: user.room,
        degreeYear: user.degreeYear,
        phone: user.phone
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Login student
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        hostel: user.hostel,
        block: user.block,
        room: user.room,
        degreeYear: user.degreeYear,
        phone: user.phone
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in student profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        hostel: user.hostel,
        block: user.block,
        room: user.room,
        degreeYear: user.degreeYear,
        phone: user.phone
      }
    });
  } catch (err) {
    next(err);
  }
};
