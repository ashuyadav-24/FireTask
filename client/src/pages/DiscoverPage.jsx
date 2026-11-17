import React, { useState, useEffect } from 'react';
import { Search, Filter, Compass, Building, Tag, RefreshCw, X, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { orderAPI } from '../services/api';
import OrderCard from '../components/OrderCard';

const DiscoverPage = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedHostel, setSelectedHostel] = useState('ALL');
  const [selectedPlatform, setSelectedPlatform] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ACTIVE');

  const fetchOrders = async () => {
    try {
      const params = {};
      if (selectedPlatform !== 'ALL') params.platform = selectedPlatform;
      if (selectedHostel !== 'ALL') params.hostel = selectedHostel;
      if (selectedStatus === 'ACTIVE') {
        params.status = ''; // default active
      } else if (selectedStatus !== 'ALL') {
        params.status = selectedStatus;
      } else {
        params.status = 'ALL';
      }
      if (search.trim()) params.search = search.trim();

      const response = await orderAPI.getOrders(params);
      if (response.data && response.data.data) {
        setOrders(response.data.data);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedHostel, selectedPlatform, selectedStatus]);

  // Real-time socket listener
  useEffect(() => {
    if (!socket) return;

    const handleUpdate = () => {
      fetchOrders();
    };

    socket.on('order:created', handleUpdate);
    socket.on('order:updated', handleUpdate);
    socket.on('order:status_changed', handleUpdate);

    return () => {
      socket.off('order:created', handleUpdate);
      socket.off('order:updated', handleUpdate);
      socket.off('order:status_changed', handleUpdate);
    };
  }, [socket, selectedHostel, selectedPlatform, selectedStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <Compass className="w-7 h-7 text-emerald-600" />
              Discover Nearby Group Orders
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Find student order requests in your hostel or adjacent blocks before they check out
            </p>
          </div>

          <Link
            to="/create-order"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm active:scale-95 transition-all self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            Start Order Request
          </Link>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by required items (e.g. milk, eggs, Maggi, coffee)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-sm transition-all"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    fetchOrders();
                  }}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl font-semibold bg-slate-900 text-white hover:bg-slate-800 text-sm active:scale-95 transition-all"
            >
              Search
            </button>
          </form>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
            {/* Hostel Selector */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
                <Building className="w-3.5 h-3.5" />
                Hostel:
              </span>
              {user?.hostel && (
                <button
                  onClick={() => setSelectedHostel(user.hostel)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedHostel === user.hostel
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  My Hostel ({user.hostel})
                </button>
              )}
              {['ALL', 'Hostel K', 'Hostel J', 'Hostel L', 'Hostel I'].map((h) => {
                if (user?.hostel && h === user.hostel) return null;
                return (
                  <button
                    key={h}
                    onClick={() => setSelectedHostel(h)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      selectedHostel === h
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {h === 'ALL' ? 'All Hostels' : h}
                  </button>
                );
              })}
            </div>

            {/* Platform Selector */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />
                App:
              </span>
              {[
                { id: 'ALL', label: 'All Platforms' },
                { id: 'Flipkart Minutes', label: 'Flipkart Minutes' },
                { id: 'Blinkit', label: 'Blinkit' },
                { id: 'Swiggy Instamart', label: 'Swiggy Instamart' }
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlatform(p.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedPlatform === p.id
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Status Selector */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'ACTIVE', label: 'Open / Joinable' },
                { id: 'TARGET_REACHED', label: 'Target Met' },
                { id: 'FINALIZED', label: 'Finalized' },
                { id: 'ALL', label: 'Show All' }
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStatus(s.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    selectedStatus === s.id
                      ? 'bg-slate-800 text-white font-bold'
                      : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {orders.length} {orders.length === 1 ? 'Order Found' : 'Orders Found'}
            </span>
            <button
              onClick={fetchOrders}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Refresh Feed
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 rounded-2xl bg-white border border-slate-200 animate-pulse"></div>
              ))}
            </div>
          ) : orders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {orders.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Compass className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No matching orders found</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                There are no orders matching your current filters. Try resetting the filters or create an order yourself!
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setSelectedHostel('ALL');
                    setSelectedPlatform('ALL');
                    setSelectedStatus('ACTIVE');
                    setSearch('');
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  Reset Filters
                </button>
                <Link
                  to="/create-order"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                >
                  Create Order Request
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscoverPage;
