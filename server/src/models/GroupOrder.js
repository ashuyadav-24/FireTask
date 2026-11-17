const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1'],
    default: 1
  },
  price: {
    type: Number,
    required: [true, 'Approximate item price is required'],
    min: [1, 'Price must be greater than 0']
  },
  note: {
    type: String,
    trim: true,
    default: ''
  }
});

const participantSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [itemSchema],
  contributionAmount: {
    type: Number,
    required: true,
    default: 0
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
});

const groupOrderSchema = new mongoose.Schema(
  {
    orderCode: {
      type: String,
      unique: true,
      index: true
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    platform: {
      type: String,
      required: [true, 'Quick-commerce platform is required'],
      enum: ['Blinkit', 'Flipkart Minutes', 'Swiggy Instamart']
    },
    hostel: {
      type: String,
      required: [true, 'Hostel is required'],
      enum: ['Hostel K', 'Hostel J', 'Hostel L', 'Hostel I']
    },
    block: {
      type: String,
      required: [true, 'Hostel block is required'],
      enum: ['Block A', 'Block B', 'Block C', 'Block D', 'Block E']
    },
    deliverySpot: {
      type: String,
      default: 'Central Security Gate'
    },
    items: [itemSchema], // Creator's initial items
    participants: [participantSchema],
    estimatedTotal: {
      type: Number,
      default: 0
    },
    targetAmount: {
      type: Number,
      default: 199 // Standard free delivery threshold
    },
    joiningDeadline: {
      type: Date,
      required: [true, 'Joining deadline is required']
    },
    instructions: {
      type: String,
      trim: true,
      default: ''
    },
    status: {
      type: String,
      enum: ['OPEN', 'TARGET_REACHED', 'FINALIZED', 'COMPLETED', 'CANCELLED', 'EXPIRED'],
      default: 'OPEN',
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Generate unique readable order code before saving
groupOrderSchema.pre('save', function (next) {
  if (!this.orderCode) {
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    this.orderCode = `HC-${this.platform.substring(0, 2).toUpperCase()}-${randomHex}`;
  }

  // Recalculate estimatedTotal strictly on the backend
  let creatorTotal = 0;
  if (Array.isArray(this.items)) {
    creatorTotal = this.items.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity) || 0), 0);
  }

  let participantsTotal = 0;
  if (Array.isArray(this.participants)) {
    this.participants.forEach((p) => {
      p.contributionAmount = (p.items || []).reduce(
        (sum, item) => sum + (Number(item.price) * Number(item.quantity) || 0),
        0
      );
      participantsTotal += p.contributionAmount;
    });
  }

  this.estimatedTotal = Math.round((creatorTotal + participantsTotal) * 100) / 100;

  // Auto-update status if target reached and order is currently OPEN
  if (this.status === 'OPEN' && this.estimatedTotal >= this.targetAmount) {
    this.status = 'TARGET_REACHED';
  } else if (this.status === 'TARGET_REACHED' && this.estimatedTotal < this.targetAmount) {
    this.status = 'OPEN';
  }

  // Check if expired
  if (['OPEN', 'TARGET_REACHED'].includes(this.status) && new Date() > new Date(this.joiningDeadline)) {
    this.status = 'EXPIRED';
  }

  next();
});

module.exports = mongoose.model('GroupOrder', groupOrderSchema);
