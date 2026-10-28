import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Maximize2, RotateCw, Pin } from 'lucide-react';
import { PolaroidItem } from '../types';
import { romanticAudio, fireLoveConfetti } from '../utils/anniversary';

interface PolaroidCardProps {
  polaroid: PolaroidItem;
  onOpenLightbox: (polaroid: PolaroidItem) => void;
  onToggleLike: (id: string) => void;
  isLiked: boolean;
  layoutMode: 'scatter' | 'grid';
  index: number;
}

export const PolaroidCard: React.FC<PolaroidCardProps> = ({
  polaroid,
  onOpenLightbox,
  onToggleLike,
  isLiked,
  layoutMode,
  index,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const tapeClass =
    polaroid.tapeColor === 'pink'
      ? 'washi-tape'
      : polaroid.tapeColor === 'yellow'
      ? 'washi-tape-yellow'
      : 'washi-tape-lavender';

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    romanticAudio.playPop();
    setIsFlipped(!isFlipped);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    romanticAudio.playPop();
    onToggleLike(polaroid.id);
    if (!isLiked) {
      fireLoveConfetti(0.5, 0.7);
    }
  };

  const handleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    romanticAudio.playChime();
    onOpenLightbox(polaroid);
  };

  // Rotation and gentle floating animation in scatter mode
  const baseRotation = layoutMode === 'scatter' ? polaroid.rotation : (index % 2 === 0 ? -1.5 : 1.5);

  return (
    <motion.div
      layout
      drag={layoutMode === 'scatter'}
      dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
      whileHover={{ scale: 1.04, zIndex: 30 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        rotate: isHovered ? 0 : baseRotation,
      }}
      className={`relative cursor-grab active:cursor-grabbing select-none transition-shadow duration-300 ${
        isHovered ? 'shadow-2xl' : 'shadow-lg'
      }`}
    >
      {/* Decorative Washi Tape on top */}
      <div
        className={`absolute -top-3.5 left-1/2 -translate-x-1/2 w-24 h-6 ${tapeClass} z-20 rounded-xs transform -rotate-1 pointer-events-none opacity-90`}
      />

      {/* Little pin on scatter mode */}
      {layoutMode === 'scatter' && index % 3 === 0 && (
        <div className="absolute -top-4 right-6 z-20 pointer-events-none">
          <Pin className="w-5 h-5 text-rose-500 fill-rose-400 drop-shadow-sm transform -rotate-12" />
        </div>
      )}

      {/* Card container with 3D Flip */}
      <div
        className="w-[280px] sm:w-[300px] h-[390px] relative preserve-3d transition-transform duration-700"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* FRONT: Authentic Polaroid Frame */}
        <div
          className="absolute inset-0 bg-white rounded-lg p-3.5 pb-6 flex flex-col justify-between border border-slate-100 shadow-xs backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Photo frame */}
          <div
            className="w-full h-[270px] bg-slate-900 rounded-sm overflow-hidden relative group cursor-pointer"
            onClick={handleExpand}
          >
            <img
              src={polaroid.src}
              alt={polaroid.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
              <span className="text-xs text-white/90 font-medium flex items-center gap-1">
                <Maximize2 className="w-3.5 h-3.5" /> Click to enlarge
              </span>
              <span className="text-xs text-white/80">{polaroid.date}</span>
            </div>
          </div>

          {/* Handwritten Caption Zone */}
          <div className="pt-2.5 px-1 flex flex-col justify-between">
            <h4 className="font-handwriting text-2xl font-bold text-slate-800 leading-tight truncate">
              {polaroid.title}
            </h4>
            <p className="font-handwriting text-lg text-slate-500 truncate leading-none">
              {polaroid.caption}
            </p>
          </div>

          {/* Action pill bar */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <button
              onClick={handleLike}
              aria-label={isLiked ? 'Unlike photo' : 'Like photo'}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                isLiked
                  ? 'text-rose-500 hover:text-rose-600 bg-rose-50'
                  : 'text-slate-400 hover:text-rose-500'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
            </button>

            <button
              onClick={handleFlip}
              aria-label={`Read secret note for ${polaroid.title}`}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Flip to read secret love note"
            >
              <RotateCw className="w-3 h-3" />
              <span>Read note</span>
            </button>

            <button
              onClick={handleExpand}
              aria-label="View photo in lightbox"
              className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* BACK: Intimate Love Note on Parchment */}
        <div
          className="absolute inset-0 bg-[#FFFDF8] rounded-lg p-5 flex flex-col justify-between border border-amber-200/60 shadow-xs parchment-texture backface-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-amber-200/60 text-xs text-amber-800 font-medium">
              <span>Keepsake #{index + 1}</span>
              <span>{polaroid.date}</span>
            </div>

            <div className="pt-4">
              <h4 className="font-serif-display text-lg font-bold text-amber-950 mb-2">
                {polaroid.title}
              </h4>
              <p className="font-handwriting text-2xl text-amber-900 leading-relaxed overflow-y-auto max-h-[220px] pr-1">
                &ldquo;{polaroid.noteOnBack}&rdquo;
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-amber-200/60 flex items-center justify-between">
            <span className="font-handwriting text-xl text-rose-600 font-bold">
              Forever Yours ♡
            </span>

            <button
              onClick={handleFlip}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 transition-colors cursor-pointer"
            >
              <RotateCw className="w-3 h-3" />
              <span>Back to photo</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
