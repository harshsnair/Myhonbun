import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Send } from 'lucide-react';
import { romanticAudio, fireLoveConfetti } from '../utils/anniversary';

interface FlyingHeart {
  id: number;
  x: number;
  size: number;
  duration: number;
  color: string;
}

export const FloatingHearts: React.FC = () => {
  const [bursts, setBursts] = useState<FlyingHeart[]>([]);

  const handleSendHug = () => {
    romanticAudio.playPop();
    fireLoveConfetti(0.85, 0.85);

    const colors = ['#f43f5e', '#ec4899', '#fb7185', '#fda4af', '#f472b6'];
    const newHearts: FlyingHeart[] = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 80 + 10, // 10% to 90% screen width
      size: Math.random() * 20 + 18,
      duration: Math.random() * 2 + 2.5,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    setBursts((prev) => [...prev, ...newHearts]);

    // Clean up after animation finishes
    setTimeout(() => {
      setBursts((prev) => prev.filter((h) => !newHearts.some((nh) => nh.id === h.id)));
    }, 4500);
  };

  return (
    <>
      {/* Background Ambient Floating Particles (low opacity) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-rose-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-2/3 right-10 w-80 h-80 bg-pink-200/20 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Interactive Floating Hearts Shower */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <AnimatePresence>
          {bursts.map((heart) => (
            <motion.div
              key={heart.id}
              initial={{
                opacity: 0,
                y: '100vh',
                x: `${heart.x}vw`,
                scale: 0.5,
              }}
              animate={{
                opacity: [0, 0.9, 0.9, 0],
                y: '-10vh',
                x: `${heart.x + (Math.random() * 6 - 3)}vw`,
                scale: 1.2,
                rotate: Math.random() * 60 - 30,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: heart.duration,
                ease: 'easeOut',
              }}
              className="absolute"
            >
              <Heart
                style={{
                  width: heart.size,
                  height: heart.size,
                  color: heart.color,
                  fill: heart.color,
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Floating Bottom Action: Instant Hug & Kiss */}
      <div className="fixed bottom-5 right-5 z-40">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={handleSendHug}
          aria-label="Send an instant warm hug and kiss"
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-full shadow-lg border border-white/50 text-xs font-semibold cursor-pointer group"
        >
          <Heart className="w-4 h-4 fill-white animate-bounce" />
          <span className="hidden sm:inline">Send Instant Hug</span>
        </motion.button>
      </div>
    </>
  );
};
