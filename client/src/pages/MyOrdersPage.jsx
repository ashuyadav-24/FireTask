import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, PlusCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { userAPI } from '../services/api';
import OrderCard from '../components/OrderCard';

const MyOrdersPage = () => {
  const [data, setData] = useState({ created: [], joined: [] });
  const [activeTab, setActiveTab] = useState('created');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const response = await userAPI.getMyOrders();
        if (response.data && response.data.data) {
          setData(response.data.data);
        }
      } catch (err) {
        console.error('Failed to load my orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, []);

  const displayList = activeTab === 'created' ? data.created : data.joined;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <Package className="w-7 h-7 text-emerald-600" />
              My Orders &amp; Contributions
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Track the group orders you created and the pooled carts you joined
            </p>
          </div>

          <Link
            to="/create-order"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm active:scale-95 transition-all self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            Start New Order
          </Link>
        </div>

        {/* Tab Toggle */}
        <div className="flex gap-2 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('created')}
            className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'created'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Orders I Created
            <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-700">
              {data.created.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('joined')}
            className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'joined'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Carts I Joined
            <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-700">
              {data.joined.length}
            </span>
          </button>
        </div>

        {/* Orders Feed */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-2xl bg-white border border-slate-200 animate-pulse"></div>
            ))}
          </div>
        ) : displayList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayList.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {activeTab === 'created' ? 'No orders created yet' : 'You have not joined any group orders yet'}
            </h3>
            <p className="text-xs text-slate-500">
              {activeTab === 'created'
                ? 'Create a group order whenever you need groceries from Blinkit, Flipkart Minutes, or Instamart.'
                : 'Browse the discover feed to find active order requests in your hostel.'}
            </p>
            <Link
              to={activeTab === 'created' ? '/create-order' : '/discover'}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white"
            >
              {activeTab === 'created' ? 'Start Group Order' : 'Discover Nearby Orders'}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
