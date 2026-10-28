import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Grid, Shuffle, Heart, Clock, Send } from 'lucide-react';
import { PolaroidItem } from '../types';
import { PolaroidCard } from './PolaroidCard';
import { PolaroidLightbox } from './PolaroidLightbox';
import { calculateTimeTogether, romanticAudio, fireLoveConfetti } from '../utils/anniversary';

interface FloatingPolaroidsProps {
  polaroids: PolaroidItem[];
  likedIds: string[];
  onToggleLike: (id: string) => void;
  onOpenSafeSpace: () => void;
}

export const FloatingPolaroids: React.FC<FloatingPolaroidsProps> = ({
  polaroids,
  likedIds,
  onToggleLike,
  onOpenSafeSpace,
}) => {
  const [layoutMode, setLayoutMode] = useState<'scatter' | 'grid'>('scatter');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeLightbox, setActiveLightbox] = useState<PolaroidItem | null>(null);
  const [scatterKey, setScatterKey] = useState(0);

  // Time together state: starting ~90 days ago
  const [timeTogether, setTimeTogether] = useState(() => {
    // 90 days ago from now
    const ninetyDaysAgo = Date.now() - (90 * 24 * 3600 * 1000 + 4 * 3600 * 1000 + 22 * 60 * 1000);
    return calculateTimeTogether(ninetyDaysAgo);
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const ninetyDaysAgo = Date.now() - (90 * 24 * 3600 * 1000 + 4 * 3600 * 1000 + 22 * 60 * 1000);
      setTimeTogether(calculateTimeTogether(ninetyDaysAgo));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredPolaroids = polaroids.filter((p) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'favorites') return likedIds.includes(p.id);
    return p.category === selectedCategory;
  });

  const handleShuffle = () => {
    romanticAudio.playPop();
    setScatterKey((prev) => prev + 1);
    fireLoveConfetti(0.5, 0.4);
  };

  const handleNextPhoto = () => {
    if (!activeLightbox) return;
    const currentIndex = filteredPolaroids.findIndex((p) => p.id === activeLightbox.id);
    const nextIndex = (currentIndex + 1) % filteredPolaroids.length;
    setActiveLightbox(filteredPolaroids[nextIndex]);
    romanticAudio.playPop();
  };

  const handlePrevPhoto = () => {
    if (!activeLightbox) return;
    const currentIndex = filteredPolaroids.findIndex((p) => p.id === activeLightbox.id);
    const prevIndex = (currentIndex - 1 + filteredPolaroids.length) % filteredPolaroids.length;
    setActiveLightbox(filteredPolaroids[prevIndex]);
    romanticAudio.playPop();
  };

  return (
    <div className="relative min-h-screen pb-20">
      {/* Hero Header Section */}
      <section className="pt-10 pb-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        {/* Soft Kicker */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold mb-4 animate-in fade-in">
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          <span>Celebrating 3 Months of Loving Akshara</span>
        </div>

        <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-tight mb-4">
          Happy 3 Month Anniversary, <span className="text-rose-500 italic">Akshara!</span>
        </h1>

        <p className="max-w-2xl mx-auto text-slate-600 text-base sm:text-lg mb-8 leading-relaxed">
          Every floating polaroid below holds a piece of my heart for you, Akshara. Drag them around, flip them to read my secret handwritten notes, or tap to relive our happiest moments together.
        </p>

        {/* Live Relationship Counter Banner */}
        <div className="max-w-xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-rose-100 shadow-sm mb-10">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-rose-600 uppercase tracking-wider mb-3">
            <Clock className="w-4 h-4" />
            <span>Time Harsh & Akshara Have Been In Love</span>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
            <div className="p-2 sm:p-3 bg-rose-50/60 rounded-xl">
              <span className="block font-serif-display text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
                {timeTogether.days}
              </span>
              <span className="text-xs text-slate-500 font-medium">Days</span>
            </div>
            <div className="p-2 sm:p-3 bg-rose-50/60 rounded-xl">
              <span className="block font-serif-display text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
                {timeTogether.hours}
              </span>
              <span className="text-xs text-slate-500 font-medium">Hours</span>
            </div>
            <div className="p-2 sm:p-3 bg-rose-50/60 rounded-xl">
              <span className="block font-serif-display text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
                {timeTogether.minutes}
              </span>
              <span className="text-xs text-slate-500 font-medium">Minutes</span>
            </div>
            <div className="p-2 sm:p-3 bg-rose-50/60 rounded-xl">
              <span className="block font-serif-display text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
                {timeTogether.seconds}
              </span>
              <span className="text-xs text-slate-500 font-medium">Seconds</span>
            </div>
          </div>
        </div>

        {/* Gallery Controls & Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-2 bg-white/90 rounded-2xl border border-slate-200/80 shadow-xs max-w-4xl mx-auto">
          {/* Category Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1">
            {[
              { id: 'all', label: 'All Photos (9)' },
              { id: 'favorites', label: `My Favorites (${likedIds.length})` },
              { id: 'candid', label: 'Cute Candids' },
              { id: 'silly', label: 'Playful & Silly' },
              { id: 'date', label: 'Date Nights' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  romanticAudio.playPop();
                  setSelectedCategory(cat.id);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-rose-500 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Layout Mode Toggles & Scatter Action */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleShuffle}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-rose-50/70 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer"
              title="Scatter and toss polaroids across the board"
            >
              <Shuffle className="w-3.5 h-3.5 text-rose-500" />
              <span>Scatter Breeze</span>
            </button>

            <button
              onClick={() => {
                romanticAudio.playPop();
                setLayoutMode(layoutMode === 'scatter' ? 'grid' : 'scatter');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              aria-label={`Switch to ${layoutMode === 'scatter' ? 'grid' : 'scatter'} view`}
            >
              <Grid className="w-3.5 h-3.5 text-slate-600" />
              <span>{layoutMode === 'scatter' ? 'Neat Grid' : 'Free Scatter'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Scattered / Floating Polaroids Gallery Container */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${layoutMode}-${scatterKey}-${selectedCategory}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={
              layoutMode === 'scatter'
                ? 'flex flex-wrap items-center justify-center gap-10 sm:gap-14 py-8'
                : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 py-8 justify-items-center'
            }
          >
            {filteredPolaroids.map((polaroid, index) => (
              <PolaroidCard
                key={polaroid.id}
                polaroid={polaroid}
                index={index}
                layoutMode={layoutMode}
                onOpenLightbox={(item) => setActiveLightbox(item)}
                onToggleLike={onToggleLike}
                isLiked={likedIds.includes(polaroid.id)}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredPolaroids.length === 0 && (
          <div className="text-center py-16 bg-white/50 rounded-2xl border border-rose-100 max-w-md mx-auto">
            <Heart className="w-8 h-8 text-rose-300 mx-auto mb-2" />
            <h4 className="font-serif-display text-lg font-bold text-slate-800 mb-1">
              No photos in this view yet
            </h4>
            <p className="text-sm text-slate-500 mb-4">
              Tap the heart icon on any polaroid to add it to your cherished favorites!
            </p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="px-4 py-2 text-xs font-semibold text-rose-600 bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors"
            >
              Show All Photos
            </button>
          </div>
        )}
      </section>

      {/* Floating CTA Banner to Safe Space */}
      <div className="max-w-3xl mx-auto mt-12 px-4">
        <div className="bg-gradient-to-r from-rose-100/80 via-pink-50/90 to-amber-50/80 border border-rose-200/80 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
              A Special Anniversary Letter
            </span>
            <h3 className="font-serif-display text-2xl font-bold text-slate-900 mt-1">
              To My Safe Space, Dearest Akshara
            </h3>
            <p className="text-slate-600 text-sm mt-1 max-w-md">
              A deeply intimate letter from my whole heart on why you are my safe place, my home, and my everything, Akshara.
            </p>
          </div>

          <button
            onClick={() => {
              romanticAudio.playChime();
              onOpenSafeSpace();
            }}
            className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer whitespace-nowrap transform hover:scale-105 active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>Open Love Letter</span>
          </button>
        </div>
      </div>

      {/* Lightbox Modal */}
      <PolaroidLightbox
        polaroid={activeLightbox}
        onClose={() => setActiveLightbox(null)}
        onNext={handleNextPhoto}
        onPrev={handlePrevPhoto}
        onToggleLike={onToggleLike}
        isLiked={activeLightbox ? likedIds.includes(activeLightbox.id) : false}
      />
    </div>
  );
};
