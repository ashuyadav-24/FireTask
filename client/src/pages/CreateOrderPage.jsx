import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Trash2, Clock, MapPin, Tag, ShoppingBag, ArrowRight, AlertCircle, Info, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';

const platforms = [
  {
    id: 'Flipkart Minutes',
    label: 'Flipkart Minutes',
    desc: '10–15 min grocery delivery',
    badge: 'Popular at NIT JSR',
    color: 'border-blue-500 bg-blue-50/50 text-blue-900',
    target: 199
  },
  {
    id: 'Blinkit',
    label: 'Blinkit',
    desc: 'Late-night essentials & snacks',
    badge: 'Zero delivery > ₹199',
    color: 'border-amber-500 bg-amber-50/50 text-amber-900',
    target: 199
  },
  {
    id: 'Swiggy Instamart',
    label: 'Swiggy Instamart',
    desc: 'Broadest midnight catalog',
    badge: 'Free delivery > ₹249',
    color: 'border-orange-500 bg-orange-50/50 text-orange-900',
    target: 249
  }
];

const CreateOrderPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [platform, setPlatform] = useState('Flipkart Minutes');
  const [hostel, setHostel] = useState(user?.hostel || 'Hostel K');
  const [block, setBlock] = useState(user?.block || 'Block E');
  const [deliverySpot, setDeliverySpot] = useState(`${user?.hostel || 'Hostel K'} Central Security Gate`);
  const [targetAmount, setTargetAmount] = useState(199);
  const [deadlineMinutes, setDeadlineMinutes] = useState(30);
  const [instructions, setInstructions] = useState('');

  const [items, setItems] = useState([
    { name: '', quantity: 1, price: '', note: '' }
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle platform change and update default target
  const handlePlatformChange = (selected) => {
    setPlatform(selected.id);
    setTargetAmount(selected.target);
  };

  // Item list handlers
  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const addItemRow = () => {
    setItems([...items, { name: '', quantity: 1, price: '', note: '' }]);
  };

  const removeItemRow = (index) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  // Calculate creator subtotal
  const creatorSubtotal = items.reduce((sum, item) => {
    const p = parseFloat(item.price) || 0;
    const q = parseInt(item.quantity, 10) || 1;
    return sum + p * q;
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    const validItems = items.filter((it) => it.name.trim() && parseFloat(it.price) > 0);
    if (validItems.length === 0) {
      setError('Please add at least one item with a valid name and price.');
      return;
    }

    const joiningDeadline = new Date(Date.now() + deadlineMinutes * 60 * 1000);

    setLoading(true);

    try {
      const payload = {
        platform,
        hostel,
        block,
        deliverySpot,
        targetAmount: parseFloat(targetAmount) || 199,
        joiningDeadline,
        instructions,
        items: validItems.map((it) => ({
          name: it.name.trim(),
          quantity: parseInt(it.quantity, 10) || 1,
          price: parseFloat(it.price),
          note: it.note ? it.note.trim() : ''
        }))
      };

      const response = await orderAPI.createOrder(payload);
      if (response.data && response.data.data) {
        navigate(`/orders/${response.data.data._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create group order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Title */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Hostel Group Order Initiation
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Start a Group Order
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Specify what you need, set a joining window, and let students in {hostel} pool their items with yours.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Select Platform */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Tag className="w-4 h-4 text-emerald-600" />
              1. Choose Quick-Commerce Platform
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {platforms.map((p) => {
                const isSelected = platform === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handlePlatformChange(p)}
                    className={`p-4 rounded-2xl text-left border-2 transition-all relative ${
                      isSelected
                        ? `${p.color} ring-2 ring-emerald-500/20 shadow-sm`
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-sm text-slate-900">{p.label}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{p.desc}</div>
                    <div className="mt-3 inline-block px-2 py-0.5 rounded-md bg-white text-[10px] font-extrabold text-slate-700 border border-slate-200">
                      Target: ₹{p.target}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Hostel & Pick-up Location */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <MapPin className="w-4 h-4 text-emerald-600" />
              2. Hostel &amp; Pickup Point
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Hostel *
                </label>
                <select
                  value={hostel}
                  onChange={(e) => {
                    setHostel(e.target.value);
                    setDeliverySpot(`${e.target.value} Central Security Gate`);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                >
                  <option value="Hostel K">Hostel K (B.Tech 4th / MCA 3rd)</option>
                  <option value="Hostel J">Hostel J (B.Tech 3rd / MCA 2nd)</option>
                  <option value="Hostel L">Hostel L (M.Tech 1st)</option>
                  <option value="Hostel I">Hostel I (Senior Mega Hostel)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Hostel Block *
                </label>
                <select
                  value={block}
                  onChange={(e) => setBlock(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                >
                  <option value="Block A">Block A</option>
                  <option value="Block B">Block B</option>
                  <option value="Block C">Block C</option>
                  <option value="Block D">Block D</option>
                  <option value="Block E">Block E</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Delivery Gate Meeting Spot
                </label>
                <input
                  type="text"
                  value={deliverySpot}
                  onChange={(e) => setDeliverySpot(e.target.value)}
                  placeholder="Hostel Central Gate"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Required Items */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <ShoppingBag className="w-4 h-4 text-emerald-600" />
                3. Your Required Items
              </div>
              <span className="text-xs text-slate-500">
                Subtotal: <strong className="text-slate-900 text-sm">₹{creatorSubtotal}</strong>
              </span>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center gap-3"
                >
                  <div className="flex-1 w-full">
                    <input
                      type="text"
                      required
                      placeholder="Item name (e.g. Amul Toned Milk 500ml)"
                      value={item.name}
                      onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="w-20">
                      <input
                        type="number"
                        min="1"
                        required
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                      />
                    </div>

                    <div className="w-28 relative">
                      <span className="absolute left-3 top-2 text-slate-400 text-sm">₹</span>
                      <input
                        type="number"
                        min="1"
                        required
                        placeholder="Price"
                        value={item.price}
                        onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                        className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                      />
                    </div>

                    <div className="flex-1 sm:w-44">
                      <input
                        type="text"
                        placeholder="Note (optional)"
                        value={item.note}
                        onChange={(e) => handleItemChange(index, 'note', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                      />
                    </div>

                    <button
                      type="button"
                      disabled={items.length <= 1}
                      onClick={() => removeItemRow(index)}
                      className="p-2 text-slate-400 hover:text-rose-600 disabled:opacity-30 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addItemRow}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Add Another Item
            </button>
          </div>

          {/* Step 4: Deadline & Target Settings */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Clock className="w-4 h-4 text-emerald-600" />
              4. Order Timing &amp; Target Threshold
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Deadline Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Joining Countdown (Order Finalization Window)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[15, 30, 45, 60].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setDeadlineMinutes(mins)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                        deadlineMinutes === mins
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {mins} mins
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Order locks in {deadlineMinutes} minutes for final checkout.
                </p>
              </div>

              {/* Target Threshold */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Target Cart Value for Free Delivery
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm">₹</span>
                  <input
                    type="number"
                    min="1"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Usually ₹199 on Blinkit/Flipkart, ₹249 on Instamart.
                </p>
              </div>
            </div>

            {/* Additional instructions */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Special Instructions for Group (Optional)
              </label>
              <textarea
                rows="2"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g. Placing order promptly at 11:45 PM. Please meet at Hostel K main gate when rider calls."
                className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              ></textarea>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>You will place the final order on {platform} once the group cart closes.</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/25 active:scale-95 transition-all text-sm disabled:opacity-50"
            >
              {loading ? 'Creating Order Request...' : 'Publish Group Order'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOrderPage;
