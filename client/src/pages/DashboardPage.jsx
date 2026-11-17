import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Compass, Users, Sparkles, Clock, CheckCircle2, TrendingUp, AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { orderAPI } from '../services/api';
import OrderCard from '../components/OrderCard';

const DashboardPage = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getOrders({ status: 'ALL' });
      if (response.data && response.data.data) {
        setOrders(response.data.data);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Real-time socket listener
  useEffect(() => {
    if (!socket) return;

    const handleOrderEvent = () => {
      fetchOrders();
    };

    socket.on('order:created', handleOrderEvent);
    socket.on('order:updated', handleOrderEvent);
    socket.on('order:status_changed', handleOrderEvent);

    return () => {
      socket.off('order:created', handleOrderEvent);
      socket.off('order:updated', handleOrderEvent);
      socket.off('order:status_changed', handleOrderEvent);
    };
  }, [socket]);

  // Compute metrics
  const activeOrders = orders.filter((o) => ['OPEN', 'TARGET_REACHED'].includes(o.status));
  const myHostelOrders = activeOrders.filter((o) => o.hostel === user?.hostel);
  const closingSoonOrders = activeOrders.filter((o) => {
    const diffMins = (new Date(o.joiningDeadline) - new Date()) / (1000 * 60);
    return diffMins > 0 && diffMins <= 30;
  });
  const closeToTargetOrders = activeOrders.filter((o) => {
    const remaining = (o.targetAmount || 199) - o.estimatedTotal;
    return remaining > 0 && remaining <= 80;
  });

  const totalParticipants = activeOrders.reduce(
    (sum, o) => sum + 1 + (o.participants?.length || 0),
    0
  );

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                NIT Jamshedpur Campus Hub
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome back, {user?.name?.split(' ')[0]}! 👋
              </h1>
              <p className="text-sm text-emerald-100/80 max-w-xl">
                You are registered in <strong className="text-white">{user?.hostel} ({user?.block}, Room {user?.room})</strong>. Coordinate with roommates and peers across Hostels I, J, K, and L to eliminate delivery charges!
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/create-order"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 active:scale-95 transition-all shadow-md shadow-emerald-500/20"
              >
                <PlusCircle className="w-4 h-4" />
                Start Group Order
              </Link>
              <Link
                to="/discover"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 active:scale-95 transition-all"
              >
                <Compass className="w-4 h-4" />
                Explore Nearby
              </Link>
              <button
                onClick={() => {
                  setRefreshing(true);
                  fetchOrders();
                }}
                title="Refresh order feed"
                className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* 4 Stat Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                My Hostel ({user?.hostel})
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">{myHostelOrders.length}</div>
            <p className="text-xs text-slate-500 mt-1">Active pooled orders</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Close to Free Delivery
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">{closeToTargetOrders.length}</div>
            <p className="text-xs text-slate-500 mt-1">&lt; ₹80 needed to hit target</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Closing Soon
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">{closingSoonOrders.length}</div>
            <p className="text-xs text-slate-500 mt-1">Under 30 mins remaining</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Active Participants
              </span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">{totalParticipants}</div>
            <p className="text-xs text-slate-500 mt-1">Hostel students pooling now</p>
          </div>
        </div>

        {/* Section 1: Orders in Student's Hostel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Orders Near Your Hostel ({user?.hostel})
              </h2>
              <p className="text-xs text-slate-500">
                Deliveries arriving at your hostel's central security gate
              </p>
            </div>
            <Link
              to="/discover"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              View All Hostels <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 rounded-2xl bg-white border border-slate-200 animate-pulse"></div>
              ))}
            </div>
          ) : myHostelOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {myHostelOrders.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
                <PlusCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                No open orders right now in {user?.hostel}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Be the first to create an order request! Add your essentials from Blinkit, Flipkart Minutes, or Instamart, and let students in your hostel join your cart.
              </p>
              <Link
                to="/create-order"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Start an Order in {user?.hostel}
              </Link>
            </div>
          )}
        </div>

        {/* Section 2: All Active Orders Across Campus (Hostel I, J, K, L) */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Active Orders Across Campus (Hostels I, J, K, L)
              </h2>
              <p className="text-xs text-slate-500">
                Walking between mega hostel gates takes under 3 minutes
              </p>
            </div>
          </div>

          {activeOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {activeOrders.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-sm text-slate-500">
              No active group orders across campus currently. Click "Start Group Order" to begin one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
