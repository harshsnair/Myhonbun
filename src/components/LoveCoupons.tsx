import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Ticket,
  CheckCircle2,
  Utensils,
  HeartHandshake,
  Sparkles,
  Crown,
  Flame,
  Compass,
  Tv,
  Star,
  RotateCcw,
} from 'lucide-react';
import { LOVE_COUPONS_DATA } from '../data/anniversaryData';
import { LoveCoupon } from '../types';
import { canRedeemCoupon, romanticAudio, fireLoveConfetti } from '../utils/anniversary';

export const LoveCoupons: React.FC = () => {
  const [redeemedMap, setRedeemedMap] = useState<Record<string, string>>(() => {
    try {
      const stored = localStorage.getItem('anniversary_redeemed_coupons');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const [filterMode, setFilterMode] = useState<'all' | 'available' | 'redeemed'>('all');

  const handleRedeem = (couponId: string) => {
    const redeemedIds = Object.keys(redeemedMap);
    if (!canRedeemCoupon(couponId, redeemedIds)) return;

    romanticAudio.playChime();
    fireLoveConfetti(0.5, 0.5);

    const nowStr = new Date().toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const updated = {
      ...redeemedMap,
      [couponId]: nowStr,
    };
    setRedeemedMap(updated);
    try {
      localStorage.setItem('anniversary_redeemed_coupons', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleResetCoupons = () => {
    romanticAudio.playPop();
    setRedeemedMap({});
    try {
      localStorage.removeItem('anniversary_redeemed_coupons');
    } catch {
      // ignore
    }
    fireLoveConfetti(0.5, 0.5);
  };

  const getCouponIcon = (iconName: string) => {
    switch (iconName) {
      case 'Utensils':
        return <Utensils className="w-5 h-5 text-rose-500" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-5 h-5 text-rose-500" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-rose-500" />;
      case 'Crown':
        return <Crown className="w-5 h-5 text-rose-500" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-rose-500" />;
      case 'Compass':
        return <Compass className="w-5 h-5 text-rose-500" />;
      case 'Tv':
        return <Tv className="w-5 h-5 text-rose-500" />;
      case 'Star':
      default:
        return <Star className="w-5 h-5 text-rose-500" />;
    }
  };

  const redeemedCount = Object.keys(redeemedMap).length;

  const filteredCoupons = LOVE_COUPONS_DATA.filter((coupon) => {
    const isRedeemed = Boolean(redeemedMap[coupon.id]);
    if (filterMode === 'available') return !isRedeemed;
    if (filterMode === 'redeemed') return isRedeemed;
    return true;
  });

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold mb-3">
          <Ticket className="w-3.5 h-3.5 text-rose-500" />
          <span>Non-Expiring Romantic Passes</span>
        </div>

        <h1 className="font-serif-display text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-4">
          Anniversary Love Coupons
        </h1>

        <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-6">
          Handcrafted vouchers you can redeem whenever you desire. Whenever you click redeem, it is guaranteed by my word of honor!
        </p>

        {/* Counter and Filter toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-white/90 rounded-2xl border border-slate-200/80 shadow-xs max-w-2xl mx-auto">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-semibold text-slate-800">
              {Math.max(0, LOVE_COUPONS_DATA.length - redeemedCount)} Available
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-rose-600 font-semibold">{redeemedCount} Redeemed</span>
          </div>

          <div className="flex items-center gap-1">
            {(['all', 'available', 'redeemed'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  romanticAudio.playPop();
                  setFilterMode(mode);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-all cursor-pointer ${
                  filterMode === mode
                    ? 'bg-rose-500 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {redeemedCount > 0 && (
            <button
              onClick={handleResetCoupons}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
              title="Re-issue and unseal all coupons"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Re-issue All</span>
            </button>
          )}
        </div>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {filteredCoupons.map((coupon) => {
            const redeemedDate = redeemedMap[coupon.id];
            const isRedeemed = Boolean(redeemedDate);

            return (
              <motion.div
                key={coupon.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className={`relative rounded-3xl p-6 sm:p-7 border overflow-hidden flex flex-col justify-between transition-all duration-300 ${
                  isRedeemed
                    ? 'bg-slate-50/80 border-slate-200/80 opacity-80'
                    : 'bg-white border-rose-200/90 shadow-sm hover:shadow-md'
                }`}
              >
                {/* Coupon Ticket Notches on sides */}
                <div className="absolute top-1/2 -left-3.5 -translate-y-1/2 w-7 h-7 rounded-full bg-[#FFFDFB] border border-slate-200" />
                <div className="absolute top-1/2 -right-3.5 -translate-y-1/2 w-7 h-7 rounded-full bg-[#FFFDFB] border border-slate-200" />

                {/* Stamped Watermark when redeemed */}
                {isRedeemed && (
                  <div className="absolute top-4 right-4 z-20 pointer-events-none transform rotate-12">
                    <div className="border-2 border-rose-500/80 text-rose-600 font-bold px-3 py-1 rounded-lg text-xs uppercase tracking-widest bg-rose-50/90 shadow-xs">
                      Redeemed with Love
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center">
                      {getCouponIcon(coupon.icon)}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500">
                        Pass #{coupon.id.replace('coupon-', '')}
                      </span>
                      <h3 className="font-serif-display text-xl font-bold text-slate-900 leading-snug">
                        {coupon.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    {coupon.description}
                  </p>

                  <div className="p-3 bg-rose-50/40 rounded-xl border border-rose-100/60 mb-6 text-xs text-rose-900">
                    <span className="font-semibold">Terms: </span>
                    {coupon.terms}
                  </div>
                </div>

                <div className="pt-4 border-t border-dashed border-slate-200 flex items-center justify-between">
                  <div className="text-xs text-slate-400">
                    {isRedeemed ? (
                      <span className="text-emerald-700 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Used on {redeemedDate}
                      </span>
                    ) : (
                      <span>Valid anytime with zero hesitation</span>
                    )}
                  </div>

                  {!isRedeemed ? (
                    <button
                      onClick={() => handleRedeem(coupon.id)}
                      className="px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 rounded-full shadow-sm hover:shadow transition-all cursor-pointer transform hover:scale-105 active:scale-95"
                    >
                      Redeem Now
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-rose-500 uppercase tracking-wider">
                      Already Promised
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
