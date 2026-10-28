import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';
import { romanticAudio, fireLoveConfetti } from '../utils/anniversary';

interface LoveIntroLoaderProps {
  onComplete: () => void;
}

export const LoveIntroLoader: React.FC<LoveIntroLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsReady(true);
          return 100;
        }
        const increment = Math.floor(Math.random() * 8) + 4;
        return Math.min(100, prev + increment);
      });
    }, 120);

    return () => clearInterval(interval);
  }, []);

  const getStatusText = () => {
    if (progress < 25) return 'Gathering 90 days of beautiful smiles...';
    if (progress < 50) return 'Tucking the white flower behind your ear...';
    if (progress < 75) return 'Wax-sealing your safe space love letter...';
    if (progress < 99) return 'Scattering our favorite floating polaroids...';
    return 'Welcome home to your safe space, Akshara ♡';
  };

  const handleEnter = () => {
    romanticAudio.playChime();
    fireLoveConfetti(0.5, 0.4);
    onComplete();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        className="fixed inset-0 z-50 bg-[#FFFBF8] flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden"
      >
        {/* Ambient background glow */}
        <div className="absolute w-[500px] h-[500px] bg-rose-200/40 rounded-full blur-3xl animate-pulse -top-20" />
        <div className="absolute w-[450px] h-[450px] bg-amber-200/30 rounded-full blur-3xl animate-pulse -bottom-20" />

        <div className="relative z-10 max-w-md w-full flex flex-col items-center">
          {/* Animated Beating Heart Emblem with Concentric Rings */}
          <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
            <motion.div
              animate={{
                scale: [1, 1.35, 1],
                opacity: [0.6, 0.1, 0.6],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 rounded-full bg-rose-400/20"
            />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.8, 0.2, 0.8],
              }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute inset-2 rounded-full bg-rose-500/20"
            />

            <motion.div
              animate={{
                scale: [1, 1.12, 1],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-rose-500 via-rose-600 to-pink-500 shadow-xl flex items-center justify-center border-2 border-white/80"
            >
              <Heart className="w-10 h-10 fill-white text-white drop-shadow-sm" />
            </motion.div>
          </div>

          {/* Kicker badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-spin" />
            <span>Harsh & Akshara · 3-Month Anniversary</span>
          </div>

          <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-slate-900 mb-3 tracking-tight">
            Unwrapping Our World, <span className="text-rose-500 italic">Akshara</span>
          </h2>

          <p className="text-slate-500 text-xs sm:text-sm h-6 mb-8 transition-all">
            {getStatusText()}
          </p>

          {/* Progress Bar with Shimmer */}
          <div className="w-full bg-rose-100/70 h-2.5 rounded-full overflow-hidden p-0.5 mb-6 border border-rose-200/60 shadow-inner">
            <motion.div
              className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 rounded-full relative overflow-hidden"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut' }}
            >
              <div className="absolute inset-0 bg-white/30 animate-[shimmer_1.5s_infinite] -skew-x-12" />
            </motion.div>
          </div>

          {/* Percentage */}
          <div className="text-xs font-mono font-semibold text-rose-600 mb-8 tabular-nums">
            {progress}% Loaded
          </div>

          {/* Enter Action Button */}
          {isReady ? (
            <motion.button
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEnter}
              className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-rose-600 via-rose-500 to-pink-500 hover:from-rose-700 hover:to-pink-600 text-white rounded-full font-semibold text-sm shadow-xl hover:shadow-rose-200/60 transition-all cursor-pointer group"
            >
              <span>Enter Our Sanctuary</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          ) : (
            <button
              onClick={handleEnter}
              className="text-xs text-slate-400 hover:text-rose-600 transition-colors cursor-pointer py-2"
            >
              Skip to Memories →
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
