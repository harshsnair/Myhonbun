import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, Shuffle, Star, Check } from 'lucide-react';
import { REASONS_LIST } from '../data/anniversaryData';
import { romanticAudio, fireLoveConfetti } from '../utils/anniversary';

export const ReasonsDeck: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [starredIds, setStarredIds] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem('anniversary_starred_reasons');
      return stored ? JSON.parse(stored) : [1, 2, 7, 12, 30];
    } catch {
      return [1, 2, 7, 12, 30];
    }
  });
  const [highlightedId, setHighlightedId] = useState<number | null>(null);

  const toggleStar = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    romanticAudio.playPop();
    const updated = starredIds.includes(id)
      ? starredIds.filter((item) => item !== id)
      : [...starredIds, id];
    setStarredIds(updated);
    try {
      localStorage.setItem('anniversary_starred_reasons', JSON.stringify(updated));
    } catch {
      // ignore
    }
    if (!starredIds.includes(id)) {
      fireLoveConfetti(0.5, 0.6);
    }
  };

  const handleRandomPick = () => {
    romanticAudio.playChime();
    const randomIdx = Math.floor(Math.random() * REASONS_LIST.length);
    const chosen = REASONS_LIST[randomIdx];
    setHighlightedId(chosen.id);
    fireLoveConfetti(0.5, 0.4);

    // Scroll to the highlighted card
    const element = document.getElementById(`reason-card-${chosen.id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const filteredReasons = REASONS_LIST.filter((r) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'starred') return starredIds.includes(r.id);
    return r.category === selectedCategory;
  });

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold mb-3">
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
          <span>10 Reasons For Every Month Together</span>
        </div>

        <h1 className="font-serif-display text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-4">
          30 Reasons Why I Adore You, Akshara
        </h1>

        <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-6">
          To celebrate our 3rd month together, here are 30 reasons (and counting) why falling in love with you, Akshara, has been the easiest and best thing I ever did.
        </p>

        {/* Progress & Random Action bar */}
        <div className="flex flex-wrap items-center justify-center gap-4 bg-white/90 p-3 rounded-2xl border border-rose-100 shadow-xs max-w-xl mx-auto">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span>{starredIds.length} / 30 Reasons Starred</span>
          </div>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          <button
            onClick={handleRandomPick}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Surprise Reason</span>
          </button>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {[
          { id: 'all', label: 'All 30 Reasons' },
          { id: 'starred', label: `Starred (${starredIds.length})` },
          { id: 'comfort', label: 'My Safe Space & Comfort' },
          { id: 'sweet', label: 'Sweet Habits & Looks' },
          { id: 'heart', label: 'Your Golden Heart' },
          { id: 'chaos', label: 'Playful Chaos & Silly Faces' },
        ].map((tab) => {
          const isActive = selectedCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                romanticAudio.playPop();
                setSelectedCategory(tab.id);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-rose-500 text-white shadow-sm font-semibold'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Grid of 30 Reasons Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredReasons.map((reason) => {
            const isStarred = starredIds.includes(reason.id);
            const isHighlighted = highlightedId === reason.id;

            return (
              <motion.article
                key={reason.id}
                id={`reason-card-${reason.id}`}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`bg-white rounded-2xl p-6 border transition-all duration-300 relative flex flex-col justify-between group hover:shadow-md ${
                  isHighlighted
                    ? 'border-rose-400 ring-4 ring-rose-100 shadow-lg'
                    : isStarred
                    ? 'border-rose-200 shadow-xs'
                    : 'border-slate-200/80 shadow-2xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-serif-display text-sm font-bold text-rose-500">
                      #{reason.id.toString().padStart(2, '0')}
                    </span>
                    <span className="text-2xl">{reason.emoji}</span>
                  </div>

                  <h3 className="font-serif-display text-xl font-bold text-slate-900 mb-2 group-hover:text-rose-600 transition-colors">
                    {reason.title}
                  </h3>

                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    {reason.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="capitalize text-slate-400">
                    {reason.category}
                  </span>

                  <button
                    onClick={(e) => toggleStar(reason.id, e)}
                    aria-label={isStarred ? 'Unstar reason' : 'Star reason'}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                      isStarred
                        ? 'bg-amber-50 text-amber-800'
                        : 'text-slate-400 hover:text-amber-500 hover:bg-slate-50'
                    }`}
                  >
                    <Star
                      className={`w-3.5 h-3.5 ${
                        isStarred ? 'fill-amber-400 text-amber-500' : ''
                      }`}
                    />
                    <span>{isStarred ? 'Favorite' : 'Star'}</span>
                  </button>
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredReasons.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-rose-100 max-w-md mx-auto">
          <Heart className="w-8 h-8 text-rose-300 mx-auto mb-2" />
          <h4 className="font-serif-display text-lg font-bold text-slate-800 mb-1">
            No reasons found
          </h4>
          <p className="text-sm text-slate-500 mb-4">
            Try choosing a different category or star a few reasons first!
          </p>
          <button
            onClick={() => setSelectedCategory('all')}
            className="px-4 py-2 text-xs font-semibold text-rose-600 bg-rose-50 rounded-xl"
          >
            View All 30 Reasons
          </button>
        </div>
      )}
    </div>
  );
};
