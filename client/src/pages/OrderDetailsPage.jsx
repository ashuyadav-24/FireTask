import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, Users, Clock, MapPin, CheckCircle2, Lock, ArrowLeft, Trash2, Edit3, PlusCircle, AlertCircle, Phone, Sparkles, CheckCheck, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { orderAPI } from '../services/api';
import StatusBadge from '../components/StatusBadge';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { socket } = useSocket();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Join order form state
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinItems, setJoinItems] = useState([
    { name: '', quantity: 1, price: '', note: '' }
  ]);
  const [joinError, setJoinError] = useState('');

  // Edit contribution state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editItems, setEditItems] = useState([]);

  // Time remaining countdown
  const [timeRemainingStr, setTimeRemainingStr] = useState('');

  const fetchOrder = async () => {
    try {
      const response = await orderAPI.getOrderById(id);
      if (response.data && response.data.data) {
        setOrder(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  // Real-time listener for this specific order
  useEffect(() => {
    if (!socket || !id) return;

    socket.emit('join:order', id);

    const handleUpdate = (updatedOrder) => {
      if (updatedOrder._id === id) {
        setOrder(updatedOrder);
      }
    };

    const handleStatusChanged = ({ orderId, order: updated }) => {
      if (orderId === id) {
        if (updated) setOrder(updated);
        else fetchOrder();
      }
    };

    socket.on('order:updated', handleUpdate);
    socket.on('order:status_changed', handleStatusChanged);

    return () => {
      socket.off('order:updated', handleUpdate);
      socket.off('order:status_changed', handleStatusChanged);
    };
  }, [socket, id]);

  // Live countdown timer ticker
  useEffect(() => {
    if (!order || !order.joiningDeadline) return;

    const updateTimer = () => {
      const diffMs = new Date(order.joiningDeadline) - new Date();
      if (diffMs <= 0) {
        setTimeRemainingStr('Deadline Expired');
        return;
      }
      const mins = Math.floor(diffMs / (1000 * 60));
      const secs = Math.floor((diffMs % (1000 * 60)) / 1000);
      setTimeRemainingStr(`${mins}m ${secs}s remaining`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [order]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-slate-600">Loading group order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4">
        <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Order Not Found</h2>
          <p className="text-xs text-slate-500">{error || 'This order request does not exist or has been removed.'}</p>
          <Link
            to="/discover"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 text-white"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Discover
          </Link>
        </div>
      </div>
    );
  }

  // Identity checks
  const isCreator = user && order.creator?._id === user.id;
  const myParticipantRecord = user && order.participants?.find((p) => p.user?._id === user.id);
  const isParticipant = !!myParticipantRecord;
  const isJoinable = ['OPEN', 'TARGET_REACHED'].includes(order.status) && new Date() <= new Date(order.joiningDeadline);

  const progressPercent = Math.min(100, Math.round((order.estimatedTotal / (order.targetAmount || 199)) * 100));
  const amountNeeded = Math.max(0, (order.targetAmount || 199) - order.estimatedTotal);

  // Join Order Handlers
  const handleAddJoinRow = () => {
    setJoinItems([...joinItems, { name: '', quantity: 1, price: '', note: '' }]);
  };

  const handleRemoveJoinRow = (idx) => {
    if (joinItems.length <= 1) return;
    setJoinItems(joinItems.filter((_, i) => i !== idx));
  };

  const handleJoinChange = (idx, field, val) => {
    const updated = [...joinItems];
    updated[idx][field] = val;
    setJoinItems(updated);
  };

  const submitJoinOrder = async (e) => {
    e.preventDefault();
    setJoinError('');

    const validItems = joinItems.filter((it) => it.name.trim() && parseFloat(it.price) > 0);
    if (validItems.length === 0) {
      setJoinError('Please add at least one item with a valid name and price.');
      return;
    }

    setActionLoading(true);
    try {
      const response = await orderAPI.joinOrder(order._id, {
        items: validItems.map((it) => ({
          name: it.name.trim(),
          quantity: parseInt(it.quantity, 10) || 1,
          price: parseFloat(it.price),
          note: it.note ? it.note.trim() : ''
        }))
      });
      if (response.data && response.data.data) {
        setOrder(response.data.data);
        setShowJoinModal(false);
      }
    } catch (err) {
      setJoinError(err.response?.data?.message || 'Failed to join group order.');
    } finally {
      setActionLoading(false);
    }
  };

  // Leave Order Handler
  const handleLeaveOrder = async () => {
    if (!window.confirm('Are you sure you want to leave this group order?')) return;
    setActionLoading(true);
    try {
      const response = await orderAPI.leaveOrder(order._id);
      if (response.data && response.data.data) {
        setOrder(response.data.data);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to leave order');
    } finally {
      setActionLoading(false);
    }
  };

  // Status Transitions (Creator)
  const handleUpdateStatus = async (newStatus) => {
    const confirmationMessages = {
      FINALIZED: 'Finalize and lock this order? No more students will be able to join or leave.',
      COMPLETED: 'Mark this order as completed and delivered?',
      CANCELLED: 'Cancel this order request?'
    };

    if (!window.confirm(confirmationMessages[newStatus] || 'Proceed?')) return;

    setActionLoading(true);
    try {
      const response = await orderAPI.updateStatus(order._id, newStatus);
      if (response.data && response.data.data) {
        setOrder(response.data.data);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setActionLoading(false);
    }
  };

  // Remove Participant (Creator)
  const handleRemoveParticipant = async (participantUserId, participantName) => {
    if (!window.confirm(`Remove ${participantName}'s contribution from this group order?`)) return;

    setActionLoading(true);
    try {
      const response = await orderAPI.removeParticipant(order._id, participantUserId);
      if (response.data && response.data.data) {
        setOrder(response.data.data);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove participant');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Back Link */}
        <Link
          to="/discover"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Discover Feed
        </Link>

        {/* Order Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-3 mb-1.5">
                <span className="text-xs font-bold px-3 py-1 rounded-lg bg-slate-900 text-white font-mono tracking-wider">
                  {order.orderCode}
                </span>
                <span className="text-xs font-bold px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {order.platform}
                </span>
                <StatusBadge status={order.status} />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {order.hostel} Group Order
              </h1>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Pickup at <strong className="text-slate-700">{order.deliverySpot || 'Central Gate'}</strong> • {order.block}
              </p>
            </div>

            {/* Live Countdown & Creator pill */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 sm:text-right space-y-1">
              <div className="flex items-center sm:justify-end gap-1.5 text-xs text-slate-500">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-semibold">{timeRemainingStr}</span>
              </div>
              <div className="text-xs font-medium text-slate-700">
                Created by: <strong className="text-slate-900">{order.creator?.name}</strong>
              </div>
              <div className="text-[11px] text-slate-400">
                {order.creator?.degreeYear} • Room {order.creator?.room}
              </div>
            </div>
          </div>

          {/* Target Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline text-sm">
              <span className="text-slate-600">
                Current Pooled Total:{' '}
                <strong className="text-slate-900 text-base">₹{order.estimatedTotal}</strong>
              </span>
              <span className="font-bold text-slate-700">
                Free Delivery Target: ₹{order.targetAmount || 199} ({progressPercent}%)
              </span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  progressPercent >= 100 ? 'bg-emerald-500' : 'bg-emerald-400'
                }`}
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center text-xs">
              {progressPercent >= 100 ? (
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Free Delivery Target Reached! Delivery fees unlocked as ₹0.
                </span>
              ) : (
                <span className="text-slate-500">
                  Needs <strong className="text-emerald-700">₹{amountNeeded}</strong> more to waive delivery fees
                </span>
              )}

              <span className="text-slate-400 font-medium">
                {1 + (order.participants?.length || 0)} Students Pooling
              </span>
            </div>
          </div>

          {/* Instructions if any */}
          {order.instructions && (
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 space-y-1">
              <span className="font-bold block">Creator Notes:</span>
              <p>{order.instructions}</p>
            </div>
          )}

          {/* Creator Control Bar */}
          {isCreator && (
            <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs">
                <span className="font-bold block text-emerald-400">Creator Management Controls</span>
                <span className="text-slate-400">You lead this group order. Finalize when ready to checkout.</span>
              </div>

              <div className="flex items-center gap-2">
                {['OPEN', 'TARGET_REACHED'].includes(order.status) && (
                  <button
                    onClick={() => handleUpdateStatus('FINALIZED')}
                    disabled={actionLoading}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors shadow-xs"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    Finalize Order (Lock)
                  </button>
                )}

                {order.status === 'FINALIZED' && (
                  <button
                    onClick={() => handleUpdateStatus('COMPLETED')}
                    disabled={actionLoading}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-purple-500 text-white hover:bg-purple-600 transition-colors shadow-xs"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Mark Order Completed
                  </button>
                )}

                {!['COMPLETED', 'CANCELLED'].includes(order.status) && (
                  <button
                    onClick={() => handleUpdateStatus('CANCELLED')}
                    disabled={actionLoading}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Itemized Group Contributions List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-600" />
              Complete Order Breakdown ({1 + (order.participants?.length || 0)} Contributors)
            </h2>

            {/* Action button: Join or Leave */}
            {!isCreator && isJoinable && (
              <>
                {!isParticipant ? (
                  <button
                    onClick={() => {
                      if (!isAuthenticated) {
                        navigate('/login');
                        return;
                      }
                      setShowJoinModal(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition-all"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    Join This Order
                  </button>
                ) : (
                  <button
                    onClick={handleLeaveOrder}
                    disabled={actionLoading}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
                  >
                    Leave Order
                  </button>
                )}
              </>
            )}
          </div>

          {/* Section 1: Creator's Contribution */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-5 sm:p-6 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  {order.creator?.name?.charAt(0) || 'C'}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    {order.creator?.name}
                    <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Order Creator
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    {order.creator?.hostel} ({order.creator?.block}, Room {order.creator?.room})
                  </div>
                </div>
              </div>

              <span className="text-sm font-bold text-slate-900">
                ₹{order.items?.reduce((s, it) => s + it.price * it.quantity, 0)}
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {order.items?.map((it, idx) => (
                <div key={idx} className="py-2.5 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-semibold text-slate-800">{it.name}</span>
                    <span className="text-slate-400 ml-2">x {it.quantity}</span>
                    {it.note && <span className="text-slate-400 italic ml-2">({it.note})</span>}
                  </div>
                  <span className="font-medium text-slate-700">₹{it.price * it.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Participants Contributions */}
          {order.participants && order.participants.length > 0 ? (
            <div className="space-y-3">
              {order.participants.map((p, idx) => {
                const isMe = user && p.user?._id === user.id;
                return (
                  <div
                    key={p._id || idx}
                    className={`bg-white rounded-3xl border shadow-xs p-5 sm:p-6 space-y-3 transition-all ${
                      isMe ? 'border-emerald-300 ring-2 ring-emerald-500/10' : 'border-slate-200/90'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                          {p.user?.name?.charAt(0) || 'P'}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                            {p.user?.name}
                            {isMe && (
                              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                                You
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400">
                            {p.user?.hostel} ({p.user?.block}, Room {p.user?.room})
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-slate-900">
                          ₹{p.contributionAmount}
                        </span>

                        {isCreator && ['OPEN', 'TARGET_REACHED'].includes(order.status) && (
                          <button
                            onClick={() => handleRemoveParticipant(p.user?._id, p.user?.name)}
                            disabled={actionLoading}
                            title="Remove contribution"
                            className="p-1 text-slate-300 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {p.items?.map((it, iIdx) => (
                        <div key={iIdx} className="py-2.5 flex justify-between items-center text-xs">
                          <div>
                            <span className="font-semibold text-slate-800">{it.name}</span>
                            <span className="text-slate-400 ml-2">x {it.quantity}</span>
                            {it.note && <span className="text-slate-400 italic ml-2">({it.note})</span>}
                          </div>
                          <span className="font-medium text-slate-700">₹{it.price * it.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center text-xs text-slate-500">
              No other students have joined this order yet.
            </div>
          )}
        </div>

        {/* Join Order Modal */}
        {showJoinModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Join {order.hostel} Order</h3>
                  <p className="text-xs text-slate-500">Ordering from {order.platform}</p>
                </div>
                <button
                  onClick={() => setShowJoinModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {joinError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {joinError}
                </div>
              )}

              <form onSubmit={submitJoinOrder} className="space-y-4">
                <div className="space-y-3">
                  {joinItems.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          placeholder="Item name (e.g. 6x Eggs, Bread)"
                          value={item.name}
                          onChange={(e) => handleJoinChange(idx, 'name', e.target.value)}
                          className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                        />
                        <button
                          type="button"
                          disabled={joinItems.length <= 1}
                          onClick={() => handleRemoveJoinRow(idx)}
                          className="p-2 text-slate-400 hover:text-rose-600 disabled:opacity-30"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <input
                            type="number"
                            min="1"
                            required
                            placeholder="Qty"
                            value={item.quantity}
                            onChange={(e) => handleJoinChange(idx, 'quantity', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs"
                          />
                        </div>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1.5 text-slate-400 text-xs">₹</span>
                          <input
                            type="number"
                            min="1"
                            required
                            placeholder="Price"
                            value={item.price}
                            onChange={(e) => handleJoinChange(idx, 'price', e.target.value)}
                            className="w-full pl-6 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleAddJoinRow}
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Add Another Item
                </button>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowJoinModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs"
                  >
                    {actionLoading ? 'Joining...' : 'Confirm & Join Cart'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailsPage;
