const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
      maxlength: [60, 'Name cannot exceed 60 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },
    college: {
      type: String,
      default: 'NIT Jamshedpur',
      trim: true
    },
    hostel: {
      type: String,
      required: [true, 'Please select your hostel'],
      enum: ['Hostel K', 'Hostel J', 'Hostel L', 'Hostel I'],
      default: 'Hostel K'
    },
    block: {
      type: String,
      required: [true, 'Please provide your block'],
      enum: ['Block A', 'Block B', 'Block C', 'Block D', 'Block E'],
      default: 'Block A'
    },
    room: {
      type: String,
      required: [true, 'Please provide your room number'],
      trim: true
    },
    degreeYear: {
      type: String,
      default: 'B.Tech 4th Year',
      enum: [
        'B.Tech 1st Year',
        'B.Tech 2nd Year',
        'B.Tech 3rd Year',
        'B.Tech 4th Year',
        'MCA 1st Year',
        'MCA 2nd Year',
        'MCA 3rd Year',
        'M.Tech 1st Year',
        'M.Tech 2nd Year'
      ]
    },
    phone: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method to check password validity
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
