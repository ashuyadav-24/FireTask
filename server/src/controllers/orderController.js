const GroupOrder = require('../models/GroupOrder');
const { getIO } = require('../sockets/socketHandler');

// Helper to check & expire outdated orders
const checkOrderExpiry = async (order) => {
  if (
    ['OPEN', 'TARGET_REACHED'].includes(order.status) &&
    new Date() > new Date(order.joiningDeadline)
  ) {
    order.status = 'EXPIRED';
    await order.save();
  }
  return order;
};

// @desc    Create a new group order request
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const {
      platform,
      hostel,
      block,
      deliverySpot,
      items,
      targetAmount,
      joiningDeadline,
      instructions
    } = req.body;

    if (!platform || !hostel || !block || !joiningDeadline) {
      return res.status(400).json({
        success: false,
        message: 'Platform, hostel, block, and joining deadline are required'
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please add at least one required item to start the group order'
      });
    }

    // Validate deadline is in the future
    const deadlineDate = new Date(joiningDeadline);
    if (isNaN(deadlineDate.getTime()) || deadlineDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Joining deadline must be a valid future time'
      });
    }

    // Clean and validate items
    const sanitizedItems = items.map((item) => ({
      name: String(item.name).trim(),
      quantity: Math.max(1, parseInt(item.quantity, 10) || 1),
      price: Math.max(1, parseFloat(item.price) || 1),
      note: item.note ? String(item.note).trim() : ''
    }));

    const order = new GroupOrder({
      creator: req.user._id,
      platform,
      hostel,
      block,
      deliverySpot: deliverySpot || 'Central Security Gate',
      items: sanitizedItems,
      targetAmount: parseFloat(targetAmount) || 199,
      joiningDeadline: deadlineDate,
      instructions: instructions ? String(instructions).trim() : '',
      status: 'OPEN',
      participants: []
    });

    await order.save();
    const populatedOrder = await GroupOrder.findById(order._id)
      .populate('creator', 'name email hostel block room degreeYear phone')
      .populate('participants.user', 'name email hostel block room degreeYear phone');

    // Real-time broadcast
    try {
      const io = getIO();
      if (io) io.emit('order:created', populatedOrder);
    } catch (e) {
      console.warn('Socket broadcast skipped:', e.message);
    }

    res.status(201).json({
      success: true,
      data: populatedOrder
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all group orders with filters
// @route   GET /api/orders
// @access  Public / Private
exports.getOrders = async (req, res, next) => {
  try {
    const { hostel, nearby, platform, status, search } = req.query;
    let query = {};

    // Filter by platform
    if (platform && ['Blinkit', 'Flipkart Minutes', 'Swiggy Instamart'].includes(platform)) {
      query.platform = platform;
    }

    // Filter by status (default to active orders if not specified)
    if (status) {
      if (status !== 'ALL') {
        query.status = status;
      }
    } else {
      query.status = { $in: ['OPEN', 'TARGET_REACHED'] };
    }

    // Filter by hostel
    if (hostel) {
      query.hostel = hostel;
    }

    // Nearby hostel logic: Hostels I, J, K, L are clustered adjacent
    if (nearby && !hostel) {
      query.hostel = { $in: ['Hostel K', 'Hostel J', 'Hostel L', 'Hostel I'] };
    }

    // Keyword search in instructions or items
    if (search) {
      query.$or = [
        { 'items.name': { $regex: search, $options: 'i' } },
        { instructions: { $regex: search, $options: 'i' } }
      ];
    }

    let orders = await GroupOrder.find(query)
      .populate('creator', 'name email hostel block room degreeYear phone')
      .populate('participants.user', 'name email hostel block room degreeYear phone')
      .sort({ createdAt: -1 });

    // Auto-expire outdated orders dynamically
    const now = new Date();
    orders = await Promise.all(
      orders.map(async (order) => {
        if (
          ['OPEN', 'TARGET_REACHED'].includes(order.status) &&
          now > new Date(order.joiningDeadline)
        ) {
          order.status = 'EXPIRED';
          await order.save();
        }
        return order;
      })
    );

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single order details
// @route   GET /api/orders/:id
// @access  Public / Private
exports.getOrderById = async (req, res, next) => {
  try {
    let order = await GroupOrder.findById(req.params.id)
      .populate('creator', 'name email hostel block room degreeYear phone')
      .populate('participants.user', 'name email hostel block room degreeYear phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Group order not found'
      });
    }

    order = await checkOrderExpiry(order);

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Join an open group order
// @route   POST /api/orders/:id/join
// @access  Private
exports.joinOrder = async (req, res, next) => {
  try {
    const { items } = req.body;
    const userId = req.user._id;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please add at least one item to join this group order'
      });
    }

    const order = await GroupOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Group order not found' });
    }

    // Check expiry
    await checkOrderExpiry(order);

    // Rule 1: Cannot join finalized, completed, cancelled, or expired orders
    if (!['OPEN', 'TARGET_REACHED'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot join order. This order is already ${order.status.toLowerCase()}`
      });
    }

    // Rule 2: Order creator cannot join as a participant
    if (order.creator.toString() === userId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You are the creator of this order. Use edit order to update your items.'
      });
    }

    // Rule 3: Prevent students from joining the same order multiple times
    const alreadyJoined = order.participants.some(
      (p) => p.user.toString() === userId.toString()
    );
    if (alreadyJoined) {
      return res.status(400).json({
        success: false,
        message: 'You have already joined this order. You can edit your contribution instead.'
      });
    }

    // Clean and validate items
    const sanitizedItems = items.map((item) => ({
      name: String(item.name).trim(),
      quantity: Math.max(1, parseInt(item.quantity, 10) || 1),
      price: Math.max(1, parseFloat(item.price) || 1),
      note: item.note ? String(item.note).trim() : ''
    }));

    const contributionAmount = sanitizedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    order.participants.push({
      user: userId,
      items: sanitizedItems,
      contributionAmount,
      joinedAt: new Date()
    });

    await order.save();

    const updatedOrder = await GroupOrder.findById(order._id)
      .populate('creator', 'name email hostel block room degreeYear phone')
      .populate('participants.user', 'name email hostel block room degreeYear phone');

    // Real-time broadcast
    try {
      const io = getIO();
      if (io) io.emit('order:updated', updatedOrder);
    } catch (e) {
      console.warn('Socket broadcast skipped:', e.message);
    }

    res.status(200).json({
      success: true,
      message: 'Successfully joined group order',
      data: updatedOrder
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Leave a group order before finalization
// @route   POST /api/orders/:id/leave
// @access  Private
exports.leaveOrder = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const order = await GroupOrder.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Group order not found' });
    }

    // Cannot leave if already finalized or completed
    if (['FINALIZED', 'COMPLETED'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot leave an order that has already been finalized or completed'
      });
    }

    const participantIndex = order.participants.findIndex(
      (p) => p.user.toString() === userId.toString()
    );

    if (participantIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'You are not a participant in this order'
      });
    }

    order.participants.splice(participantIndex, 1);
    await order.save();

    const updatedOrder = await GroupOrder.findById(order._id)
      .populate('creator', 'name email hostel block room degreeYear phone')
      .populate('participants.user', 'name email hostel block room degreeYear phone');

    try {
      const io = getIO();
      if (io) io.emit('order:updated', updatedOrder);
    } catch (e) {
      console.warn('Socket broadcast skipped:', e.message);
    }

    res.status(200).json({
      success: true,
      message: 'Successfully left the group order',
      data: updatedOrder
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update participant contribution before deadline
// @route   PUT /api/orders/:id/contribution
// @access  Private
exports.updateContribution = async (req, res, next) => {
  try {
    const { items } = req.body;
    const userId = req.user._id;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one item'
      });
    }

    const order = await GroupOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Group order not found' });
    }

    await checkOrderExpiry(order);

    if (!['OPEN', 'TARGET_REACHED'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot update contribution. Order is ${order.status.toLowerCase()}`
      });
    }

    const participant = order.participants.find(
      (p) => p.user.toString() === userId.toString()
    );

    if (!participant) {
      return res.status(400).json({
        success: false,
        message: 'You have not joined this group order'
      });
    }

    participant.items = items.map((item) => ({
      name: String(item.name).trim(),
      quantity: Math.max(1, parseInt(item.quantity, 10) || 1),
      price: Math.max(1, parseFloat(item.price) || 1),
      note: item.note ? String(item.note).trim() : ''
    }));

    await order.save();

    const updatedOrder = await GroupOrder.findById(order._id)
      .populate('creator', 'name email hostel block room degreeYear phone')
      .populate('participants.user', 'name email hostel block room degreeYear phone');

    try {
      const io = getIO();
      if (io) io.emit('order:updated', updatedOrder);
    } catch (e) {
      console.warn('Socket broadcast skipped:', e.message);
    }

    res.status(200).json({
      success: true,
      message: 'Contribution updated successfully',
      data: updatedOrder
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Creator updates order details (items, deadline, instructions)
// @route   PUT /api/orders/:id
// @access  Private (Creator only)
exports.updateOrder = async (req, res, next) => {
  try {
    const order = await GroupOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Group order not found' });
    }

    if (order.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the order creator is authorized to edit this order'
      });
    }

    if (['FINALIZED', 'COMPLETED'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot edit an order that has already been finalized or completed'
      });
    }

    const { items, instructions, deliverySpot, joiningDeadline, targetAmount } = req.body;

    if (Array.isArray(items) && items.length > 0) {
      order.items = items.map((item) => ({
        name: String(item.name).trim(),
        quantity: Math.max(1, parseInt(item.quantity, 10) || 1),
        price: Math.max(1, parseFloat(item.price) || 1),
        note: item.note ? String(item.note).trim() : ''
      }));
    }

    if (instructions !== undefined) order.instructions = String(instructions).trim();
    if (deliverySpot !== undefined) order.deliverySpot = String(deliverySpot).trim();
    if (targetAmount !== undefined) order.targetAmount = parseFloat(targetAmount) || 199;
    if (joiningDeadline) {
      const newDeadline = new Date(joiningDeadline);
      if (newDeadline > new Date()) order.joiningDeadline = newDeadline;
    }

    await order.save();

    const updatedOrder = await GroupOrder.findById(order._id)
      .populate('creator', 'name email hostel block room degreeYear phone')
      .populate('participants.user', 'name email hostel block room degreeYear phone');

    try {
      const io = getIO();
      if (io) io.emit('order:updated', updatedOrder);
    } catch (e) {
      console.warn('Socket broadcast skipped:', e.message);
    }

    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      data: updatedOrder
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Creator changes order status (FINALIZED, COMPLETED, CANCELLED)
// @route   PATCH /api/orders/:id/status
// @access  Private (Creator only)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['FINALIZED', 'COMPLETED', 'CANCELLED'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${allowedStatuses.join(', ')}`
      });
    }

    const order = await GroupOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Group order not found' });
    }

    if (order.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the order creator can change the order status'
      });
    }

    order.status = status;
    await order.save();

    const updatedOrder = await GroupOrder.findById(order._id)
      .populate('creator', 'name email hostel block room degreeYear phone')
      .populate('participants.user', 'name email hostel block room degreeYear phone');

    try {
      const io = getIO();
      if (io) io.emit('order:status_changed', { orderId: order._id, status, order: updatedOrder });
    } catch (e) {
      console.warn('Socket broadcast skipped:', e.message);
    }

    res.status(200).json({
      success: true,
      message: `Order marked as ${status}`,
      data: updatedOrder
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Creator removes an invalid/inappropriate participant contribution
// @route   DELETE /api/orders/:id/participants/:participantUserId
// @access  Private (Creator only)
exports.removeParticipant = async (req, res, next) => {
  try {
    const order = await GroupOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Group order not found' });
    }

    if (order.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the creator can remove participant contributions'
      });
    }

    if (['FINALIZED', 'COMPLETED'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot remove participants once order is finalized or completed'
      });
    }

    const initialCount = order.participants.length;
    order.participants = order.participants.filter(
      (p) => p.user.toString() !== req.params.participantUserId
    );

    if (order.participants.length === initialCount) {
      return res.status(404).json({
        success: false,
        message: 'Participant not found in this order'
      });
    }

    await order.save();

    const updatedOrder = await GroupOrder.findById(order._id)
      .populate('creator', 'name email hostel block room degreeYear phone')
      .populate('participants.user', 'name email hostel block room degreeYear phone');

    try {
      const io = getIO();
      if (io) io.emit('order:updated', updatedOrder);
    } catch (e) {
      console.warn('Socket broadcast skipped:', e.message);
    }

    res.status(200).json({
      success: true,
      message: 'Participant contribution removed',
      data: updatedOrder
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Creator deletes/cancels order
// @route   DELETE /api/orders/:id
// @access  Private (Creator only)
exports.deleteOrder = async (req, res, next) => {
  try {
    const order = await GroupOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Group order not found' });
    }

    if (order.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the creator can delete this order'
      });
    }

    order.status = 'CANCELLED';
    await order.save();

    try {
      const io = getIO();
      if (io) io.emit('order:status_changed', { orderId: order._id, status: 'CANCELLED' });
    } catch (e) {
      console.warn('Socket broadcast skipped:', e.message);
    }

    res.status(200).json({
      success: true,
      message: 'Group order has been cancelled'
    });
  } catch (err) {
    next(err);
  }
};
