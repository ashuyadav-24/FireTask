import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Clock, MapPin, ArrowRight, ShoppingCart } from 'lucide-react';
import StatusBadge from './StatusBadge';

const platformStyles = {
  'Flipkart Minutes': {
    bg: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-600',
    bar: 'bg-blue-500'
  },
  'Blinkit': {
    bg: 'bg-amber-50 text-amber-800 border-amber-200',
    dot: 'bg-amber-500',
    bar: 'bg-amber-500'
  },
  'Swiggy Instamart': {
    bg: 'bg-orange-50 text-orange-800 border-orange-200',
    dot: 'bg-orange-500',
    bar: 'bg-orange-500'
  }
};

const formatTimeRemaining = (deadline) => {
  const diffMs = new Date(deadline) - new Date();
  if (diffMs <= 0) return 'Expired';
  const mins = Math.floor(diffMs / (1000 * 60));
  if (mins < 60) return `${mins}m left`;
  const hours = Math.floor(mins / 60);
  const remMins = mins % 60;
  return `${hours}h ${remMins}m left`;
};

const OrderCard = ({ order }) => {
  const platformStyle = platformStyles[order.platform] || {
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-500',
    bar: 'bg-emerald-500'
  };

  const progressPercent = Math.min(100, Math.round((order.estimatedTotal / (order.targetAmount || 199)) * 100));
  const participantCount = 1 + (order.participants?.length || 0);
  const timeRemaining = formatTimeRemaining(order.joiningDeadline);
  const isExpiringSoon = timeRemaining.includes('m left') && parseInt(timeRemaining, 10) <= 20;

  // Extract a few item names for preview
  const allItems = [
    ...(order.items || []),
    ...(order.participants || []).flatMap((p) => p.items || [])
  ];
  const previewItems = allItems.slice(0, 3).map((it) => it.name).join(', ');

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between overflow-hidden group">
      <div className="p-5">
        {/* Top Meta: Platform & Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${platformStyle.bg}`}
          >
            <span className={`w-2 h-2 rounded-full ${platformStyle.dot}`}></span>
            {order.platform}
          </span>
          <StatusBadge status={order.status} />
        </div>

        {/* Order Title / Creator */}
        <div className="mb-3">
          <div className="flex items-baseline justify-between">
            <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
              {order.orderCode || 'Order'}
            </h3>
            <span className="text-xs font-mono font-medium text-slate-400">
              by {order.creator?.name || 'Student'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-semibold text-slate-700">{order.hostel}</span>
            <span>•</span>
            <span>{order.block}</span>
            <span>({order.deliverySpot || 'Central Gate'})</span>
          </div>
        </div>

        {/* Items Preview */}
        <div className="bg-slate-50 rounded-xl p-2.5 mb-4 border border-slate-100 text-xs text-slate-600 line-clamp-1">
          <span className="font-semibold text-slate-700">Items: </span>
          {previewItems || 'Daily essentials'}
          {allItems.length > 3 && ` +${allItems.length - 3} more`}
        </div>

        {/* Progress Towards Free Delivery Target */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-baseline text-xs">
            <span className="text-slate-500">
              Pooled Total: <span className="font-bold text-slate-800">₹{order.estimatedTotal}</span>
            </span>
            <span className="font-semibold text-slate-600">
              Target: ₹{order.targetAmount || 199} ({progressPercent}%)
            </span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                progressPercent >= 100 ? 'bg-emerald-500' : 'bg-emerald-400'
              }`}
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          {progressPercent < 100 ? (
            <p className="text-[11px] text-emerald-600 font-medium">
              Needs ₹{(order.targetAmount || 199) - order.estimatedTotal} more to eliminate delivery fees
            </p>
          ) : (
            <p className="text-[11px] text-blue-600 font-semibold flex items-center gap-1">
              ✓ Free delivery threshold unlocked!
            </p>
          )}
        </div>
      </div>

      {/* Footer Info & Action */}
      <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3 text-slate-500">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <strong className="text-slate-700">{participantCount}</strong> {participantCount === 1 ? 'person' : 'people'}
          </span>
          <span className="flex items-center gap-1">
            <Clock className={`w-3.5 h-3.5 ${isExpiringSoon ? 'text-amber-500' : 'text-slate-400'}`} />
            <span className={isExpiringSoon ? 'font-bold text-amber-600' : ''}>{timeRemaining}</span>
          </span>
        </div>

        <Link
          to={`/orders/${order._id}`}
          className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-800 group-hover:translate-x-0.5 transition-all"
        >
          View & Join
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default OrderCard;
