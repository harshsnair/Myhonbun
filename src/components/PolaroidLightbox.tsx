import React from 'react';
import { X, Heart, ChevronLeft, ChevronRight, Calendar, Sparkles } from 'lucide-react';
import { PolaroidItem } from '../types';
import { romanticAudio, fireLoveConfetti } from '../utils/anniversary';

interface PolaroidLightboxProps {
  polaroid: PolaroidItem | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onToggleLike: (id: string) => void;
  isLiked: boolean;
}

export const PolaroidLightbox: React.FC<PolaroidLightboxProps> = ({
  polaroid,
  onClose,
  onNext,
  onPrev,
  onToggleLike,
  isLiked,
}) => {
  if (!polaroid) return null;

  const handleLike = () => {
    romanticAudio.playPop();
    onToggleLike(polaroid.id);
    if (!isLiked) {
      fireLoveConfetti(0.5, 0.5);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Photo viewer: ${polaroid.title}`}
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 transition-opacity animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-rose-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close photo viewer"
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Previous & Next arrows */}
        <button
          onClick={onPrev}
          aria-label="Previous photo"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/80 text-slate-800 hover:bg-white shadow-md transition-all cursor-pointer hover:scale-110"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={onNext}
          aria-label="Next photo"
          className="absolute right-3 md:right-[390px] top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/80 text-slate-800 hover:bg-white shadow-md transition-all cursor-pointer hover:scale-110"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Image Container */}
        <div className="md:w-3/5 bg-slate-900 flex items-center justify-center p-4 min-h-[340px] max-h-[580px] overflow-hidden">
          <img
            src={polaroid.src}
            alt={polaroid.title}
            className="w-full h-full object-contain max-h-[520px] rounded-lg shadow-sm"
          />
        </div>

        {/* Narrative & Note details */}
        <div className="md:w-2/5 p-6 sm:p-8 flex flex-col justify-between bg-[#FFFCF8]">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3 text-xs text-rose-500 font-medium">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {polaroid.date}
              </span>
              <span className="capitalize px-2 py-0.5 rounded-md bg-rose-50 text-rose-700">
                {polaroid.category}
              </span>
            </div>

            <h3 className="font-serif-display text-2xl font-bold text-slate-900 mb-2">
              {polaroid.title}
            </h3>

            <p className="text-slate-600 text-sm italic mb-6">
              &ldquo;{polaroid.caption}&rdquo;
            </p>

            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-100 mb-6">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Secret Note from My Heart
              </div>
              <p className="font-handwriting text-xl text-amber-950 leading-relaxed">
                {polaroid.noteOnBack}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-rose-100 flex items-center justify-between">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                isLiked
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-white' : ''}`} />
              <span>{isLiked ? 'Cherished Forever' : 'Send Love'}</span>
            </button>

            <span className="text-xs text-slate-400">
              Anniversary Keepsake
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
