import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, ShieldCheck, Zap, Users, Sparkles, AlertTriangle, TrendingDown, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-gradient-to-b from-emerald-50/70 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Campus Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-bold border border-emerald-200 shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
              Live for NIT Jamshedpur • Hostels I, J, K, L
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Stop paying <span className="text-rose-600">₹65 in fees</span> for a{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                ₹28 packet of milk
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
              HostelCart is a peer-to-peer quick-commerce coordination platform. Discover and pool orders on{' '}
              <strong className="text-slate-800">Flipkart Minutes</strong>,{' '}
              <strong className="text-slate-800">Blinkit</strong>, and{' '}
              <strong className="text-slate-800">Swiggy Instamart</strong> with students in your hostel to unlock free delivery.
            </p>

            {/* Primary CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to={isAuthenticated ? '/dashboard' : '/register'}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/25 active:scale-95 transition-all text-base"
              >
                {isAuthenticated ? 'Open Dashboard' : 'Join Your Hostel Hub'}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/discover"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-xs active:scale-95 transition-all text-base"
              >
                Browse Active Orders
              </Link>
            </div>

            {/* Micro reassurance */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                No App Download Needed
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Zero Commission Platform
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Meet at Central Security Gate
              </span>
            </div>
          </div>

          {/* Interactive Surcharge Comparison Card */}
          <div className="mt-14 max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
            <div className="p-4 sm:p-6 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
                  Late-Night Ordering Reality at NIT JSR
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  Ordering alone vs. Pooling with HostelCart
                </h3>
              </div>
              <div className="text-xs text-slate-300 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                Survey of 22 students in Hostels J, K & L
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              {/* Individual Ordering Box */}
              <div className="p-6 sm:p-8 bg-rose-50/30">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    Individual Order (Blinkit / Flipkart Minutes)
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 font-bold">
                    Trap
                  </span>
                </div>

                <div className="space-y-2.5 text-sm text-slate-700 mb-6">
                  <div className="flex justify-between py-1 border-b border-rose-100">
                    <span>1x Amul Toned Milk (500ml)</span>
                    <span className="font-semibold text-slate-900">₹28</span>
                  </div>
                  <div className="flex justify-between text-xs text-rose-600 font-medium">
                    <span>Delivery Fee</span>
                    <span>+ ₹25</span>
                  </div>
                  <div className="flex justify-between text-xs text-rose-600 font-medium">
                    <span>Small Cart Surcharge (&lt; ₹149)</span>
                    <span>+ ₹20</span>
                  </div>
                  <div className="flex justify-between text-xs text-rose-600 font-medium">
                    <span>Platform &amp; Night Surge Fee</span>
                    <span>+ ₹20</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-rose-200 flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-slate-500 block">Total Check-out Amount</span>
                    <span className="text-2xl font-black text-rose-600">₹93</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-rose-600 block">+232% Markup</span>
                    <span className="text-[11px] text-slate-400">₹65 pure dead loss</span>
                  </div>
                </div>
              </div>

              {/* Pooled HostelCart Box */}
              <div className="p-6 sm:p-8 bg-emerald-50/40">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    Pooled Cart via HostelCart
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold">
                    Smart Solution
                  </span>
                </div>

                <div className="space-y-2.5 text-sm text-slate-700 mb-6">
                  <div className="flex justify-between py-1 border-b border-emerald-100">
                    <span>Student A (Aman, K-E601): Milk</span>
                    <span className="font-semibold text-slate-900">₹28</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-emerald-100">
                    <span>Student B (Rishabh, K-C305): 6 Eggs + Pav</span>
                    <span className="font-semibold text-slate-900">₹75</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-emerald-100">
                    <span>Student C (Saurav, K-A201): Bread + Butter</span>
                    <span className="font-semibold text-slate-900">₹82</span>
                  </div>
                  <div className="flex justify-between text-xs text-emerald-700 font-semibold">
                    <span>Delivery &amp; Small Cart Surcharges</span>
                    <span>₹0 (Waived)</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-emerald-200 flex items-baseline justify-between shadow-xs">
                  <div>
                    <span className="text-xs text-slate-500 block">Pooled Total (₹185 &gt; Target)</span>
                    <span className="text-2xl font-black text-emerald-700">₹28</span>
                    <span className="text-xs text-slate-400 ml-1">for Student A</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-700 block">0% Surcharge</span>
                    <span className="text-[11px] text-emerald-600 font-semibold">₹65 saved instantly</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Dead Simple 3-Step Process
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              How HostelCart coordinates your orders
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              No complex grocery delivery logistics. We simply connect students who are ordering from the same app at the same time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 relative group hover:border-emerald-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 font-black text-xl flex items-center justify-center mb-5 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Create an Order Request</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Need milk, eggs, or Maggi? Select your platform (Blinkit, Flipkart Minutes, or Swiggy Instamart), add your items, and set a 15–45 minute countdown window.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 relative group hover:border-emerald-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 font-black text-xl flex items-center justify-center mb-5 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Peers Join Your Cart</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Students in Hostel K, J, L, or I discover your order in their feed and add their daily necessities. The pooled cart progress bar updates live until the free delivery mark is hit.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 relative group hover:border-emerald-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 font-black text-xl flex items-center justify-center mb-5 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Pick Up at Central Gate</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                The creator places the consolidated order on the quick-commerce app. When the rider reaches your hostel's central gate, students collect their items with zero delivery fees.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Fieldwork Evidence Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
            <div className="max-w-3xl">
              <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">
                Data From Our NIT JSR Campus Study
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-white mt-1 mb-4">
                ₹2,617 Wasted in a Single Night Across 22 Orders
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-8">
                Our observational fieldwork in Hostels J, K, and L showed that students either lost ₹557 in flat delivery and small-cart fees, or forced themselves to spend ₹2,060 on chips, sodas, and chocolates they never wanted just to qualify for free delivery tiers.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-700">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">22</div>
                  <div className="text-xs text-slate-400">Late-Night Orders Tracked</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">+87.6%</div>
                  <div className="text-xs text-slate-400">Avg Small Cart Fee Markup</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">₹171</div>
                  <div className="text-xs text-slate-400">Avg Forced Spending/Student</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">4 Hostels</div>
                  <div className="text-xs text-slate-400">Hostel I, J, K, L Connected</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
