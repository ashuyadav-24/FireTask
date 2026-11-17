const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  joinOrder,
  leaveOrder,
  updateContribution,
  updateOrderStatus,
  removeParticipant
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

// Public read or authenticated query
router.get('/', getOrders);
router.get('/:id', getOrderById);

// Protected routes
router.post('/', protect, createOrder);
router.put('/:id', protect, updateOrder);
router.delete('/:id', protect, deleteOrder);

// Participation routes
router.post('/:id/join', protect, joinOrder);
router.post('/:id/leave', protect, leaveOrder);
router.put('/:id/contribution', protect, updateContribution);

// Creator order management
router.patch('/:id/status', protect, updateOrderStatus);
router.delete('/:id/participants/:participantUserId', protect, removeParticipant);

module.exports = router;
