import React from 'react';
import { ShoppingBag, ShieldCheck, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-800 text-base">HostelCart</span>
              <p className="text-xs text-slate-500">
                Collaborative Quick-Commerce Coordination • NIT Jamshedpur (Hostels I, J, K, L)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Not affiliated with Blinkit, Flipkart, or Swiggy
            </span>
            <span>•</span>
            <span>Peer-to-Peer Cart Pooling</span>
            <span>•</span>
            <span>Zero Delivery Surcharges</span>
          </div>

          <div className="text-xs text-slate-400">
            Built for hostel students with high grocery fees
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
