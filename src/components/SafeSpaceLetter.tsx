import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Heart, Sparkles, Feather, Music, CheckCircle2, Send, MessageCircleHeart } from 'lucide-react';
import { SAFE_SPACE_LETTER } from '../data/anniversaryData';
import { romanticAudio, fireLoveConfetti } from '../utils/anniversary';

interface SafeSpaceLetterProps {
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
}

export const SafeSpaceLetter: React.FC<SafeSpaceLetterProps> = ({
  isMusicPlaying,
  onToggleMusic,
}) => {
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [selectedCharm, setSelectedCharm] = useState<number | null>(0);
  const [girlResponse, setGirlResponse] = useState('');
  const [responseSaved, setResponseSaved] = useState(false);
  const [savedNotes, setSavedNotes] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('anniversary_sweet_responses');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const handleOpenEnvelope = () => {
    romanticAudio.playChime();
    setIsEnvelopeOpen(true);
    fireLoveConfetti(0.5, 0.4);
    if (!isMusicPlaying) {
      onToggleMusic();
    }
  };

  const handleSaveResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!girlResponse.trim()) return;

    romanticAudio.playPop();
    const updated = [girlResponse.trim(), ...savedNotes];
    setSavedNotes(updated);
    try {
      localStorage.setItem('anniversary_sweet_responses', JSON.stringify(updated));
    } catch {
      // ignore
    }
    setGirlResponse('');
    setResponseSaved(true);
    fireLoveConfetti(0.5, 0.6);
    setTimeout(() => setResponseSaved(false), 4000);
  };

  const charms = [
    {
      title: 'When You Need To Cry',
      detail: 'Bury your face in my chest. You never have to explain or be strong around me; I will hold you tight until your tears stop and you feel safe.',
      icon: '🫂',
    },
    {
      title: 'Our Extraordinary Story',
      detail: 'What we have is rare, sacred, and so unmistakably real. You aren’t just my world, you are my everything, and people will speak about this love for decades.',
      icon: '✨',
    },
    {
      title: 'Never Going Anywhere',
      detail: 'I am staying right here with you every single day for the rest of our lives. I am not leaving, and I wouldn’t dream of being anywhere else.',
      icon: '🏡',
    },
    {
      title: 'I’d Do Anything For You',
      detail: 'I sure as hell mean it with every breath in me. We are going to be okay, because we will keep choosing each other forever and ever.',
      icon: '💍',
    },
  ];

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Title & Introduction Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold mb-3">
          <Feather className="w-3.5 h-3.5 text-rose-500" />
          <span>From My Whole Heart To Yours</span>
        </div>

        <h1 className="font-serif-display text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-4">
          You Are My Safe Space
        </h1>

        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          {SAFE_SPACE_LETTER.snippetIntro}
        </p>
      </div>

      {/* Wax-Sealed Envelope Interaction */}
      {!isEnvelopeOpen ? (
        <div className="max-w-xl mx-auto py-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleOpenEnvelope}
            className="cursor-pointer bg-gradient-to-b from-[#FFFDF8] to-[#FFF5EA] rounded-3xl p-8 sm:p-12 border-2 border-rose-200/90 shadow-xl relative overflow-hidden text-center group"
          >
            {/* Envelope Flap Accent */}
            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-rose-100/50 to-transparent pointer-events-none" />

            {/* Glowing Wax Seal Button */}
            <div className="relative mx-auto w-24 h-24 mb-6 flex items-center justify-center">
              <div className="absolute inset-0 bg-rose-500/20 rounded-full animate-ping" />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-rose-600 via-rose-700 to-rose-900 flex flex-col items-center justify-center text-white shadow-lg border-2 border-rose-400 group-hover:scale-110 transition-transform">
                <Heart className="w-7 h-7 fill-white/90 drop-shadow-sm mb-0.5" />
                <span className="font-serif-display text-[10px] uppercase tracking-widest font-bold">
                  Break Seal
                </span>
              </div>
            </div>

            <h3 className="font-serif-display text-2xl font-bold text-slate-800 mb-2">
              Sealed with All My Love
            </h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto mb-4">
              Tap the wax seal to open this 3-month anniversary letter written specifically for you.
            </p>

            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 group-hover:translate-x-1 transition-transform">
              <Sparkles className="w-3.5 h-3.5" /> Click to open letter
            </span>
          </motion.div>
        </div>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-10"
          >
            {/* Unrolled Letter Paper Container */}
            <article className="parchment-texture rounded-3xl p-6 sm:p-12 border border-amber-200/80 shadow-xl relative max-w-4xl mx-auto">
              {/* Decorative Corner Pins */}
              <div className="flex items-center justify-between pb-6 border-b border-amber-200/80 mb-8">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 uppercase tracking-widest">
                  <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                  <span>3 Months of Undeniable Love</span>
                </div>

                {/* Soundscape pill */}
                <button
                  onClick={onToggleMusic}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-100/80 text-amber-900 hover:bg-amber-200/80 transition-colors cursor-pointer"
                >
                  <Music className="w-3 h-3 text-rose-500" />
                  <span>{isMusicPlaying ? 'Melody Playing' : 'Play Music'}</span>
                </button>
              </div>

              {/* Letter Title */}
              <header className="mb-8">
                <p className="font-handwriting text-2xl sm:text-3xl text-rose-600 font-semibold mb-1">
                  {SAFE_SPACE_LETTER.kicker},
                </p>
                <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-slate-900">
                  {SAFE_SPACE_LETTER.headline}
                </h2>
              </header>

              {/* Core Snippet Paragraphs */}
              <div className="space-y-6 text-slate-700 text-base sm:text-lg leading-relaxed font-sans font-normal">
                {SAFE_SPACE_LETTER.paragraphs.map((p, idx) => (
                  <p key={idx} className="relative pl-0 sm:pl-2">
                    {p}
                  </p>
                ))}
              </div>

              {/* Handwritten Signoff */}
              <div className="mt-10 pt-8 border-t border-amber-200/80 text-right sm:pr-8">
                <p className="font-handwriting text-2xl text-slate-600">
                  {SAFE_SPACE_LETTER.signoff}
                </p>
                <p className="font-handwriting text-4xl text-rose-600 font-bold mt-1">
                  {SAFE_SPACE_LETTER.author}
                </p>
              </div>
            </article>

            {/* Three Pillars of Safe Space */}
            <section className="max-w-4xl mx-auto">
              <h3 className="font-serif-display text-2xl font-bold text-slate-900 text-center mb-6">
                What Makes You My Safe Haven
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {SAFE_SPACE_LETTER.safeSpacePillars.map((pillar, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl p-6 border border-rose-100 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
                      {i === 0 ? (
                        <ShieldCheck className="w-5 h-5" />
                      ) : i === 1 ? (
                        <Sparkles className="w-5 h-5" />
                      ) : (
                        <Heart className="w-5 h-5 fill-rose-500" />
                      )}
                    </div>
                    <h4 className="font-serif-display text-lg font-bold text-slate-900 mb-2">
                      {pillar.title}
                    </h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Interactive Memory Charms / Touchstones */}
            <section className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2 text-rose-500 text-xs font-semibold uppercase tracking-wider">
                <MessageCircleHeart className="w-4 h-4" />
                <span>Our Touchstones of Trust</span>
              </div>
              <h3 className="font-serif-display text-2xl font-bold text-slate-900 mb-2">
                Moments Where You Made Me Feel Safe
              </h3>
              <p className="text-slate-600 text-sm mb-6">
                Click each memory charm below to explore the quiet moments where your warmth meant the world to me.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {charms.map((charm, idx) => {
                  const isSelected = selectedCharm === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        romanticAudio.playPop();
                        setSelectedCharm(idx);
                      }}
                      className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-rose-50 border-rose-300 shadow-sm ring-1 ring-rose-300'
                          : 'bg-slate-50 border-slate-200/80 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      <span className="text-2xl mb-1.5 block">{charm.icon}</span>
                      <span className="text-xs font-bold text-slate-900 block leading-tight">
                        {charm.title}
                      </span>
                    </button>
                  );
                })}
              </div>

              {selectedCharm !== null && (
                <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/60">
                  <p className="font-handwriting text-2xl text-amber-950 leading-relaxed">
                    &ldquo;{charms[selectedCharm].detail}&rdquo;
                  </p>
                </div>
              )}
            </section>

            {/* Interactive Response / Love Capsule Note */}
            <section className="max-w-4xl mx-auto bg-gradient-to-br from-pink-50/60 to-rose-50/60 rounded-3xl p-6 sm:p-10 border border-rose-200/80 shadow-sm">
              <h3 className="font-serif-display text-2xl font-bold text-slate-900 mb-2">
                Leave a Little Note in Our Love Capsule
              </h3>
              <p className="text-slate-600 text-sm mb-6">
                Want to write a sweet reaction, inside joke, or message back to him? It will be saved right here in your browser!
              </p>

              <form onSubmit={handleSaveResponse} className="space-y-4">
                <textarea
                  value={girlResponse}
                  onChange={(e) => setGirlResponse(e.target.value)}
                  placeholder="Type a sweet message for him (e.g. 'I love you so much, thank you for making this!' or your favorite memory together)..."
                  rows={3}
                  className="w-full p-4 rounded-2xl bg-white border border-rose-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 outline-none text-slate-800 text-sm placeholder:text-slate-400 resize-none"
                />

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Saved privately in your keepsake time capsule
                  </span>

                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-sm cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Save Sweet Note</span>
                  </button>
                </div>
              </form>

              {responseSaved && (
                <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Your message was sealed into the love capsule with a kiss! 💕</span>
                </div>
              )}

              {savedNotes.length > 0 && (
                <div className="mt-8 pt-6 border-t border-rose-200/60 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800">
                    Notes Saved In Our Capsule ({savedNotes.length})
                  </h4>
                  {savedNotes.map((note, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-white rounded-xl border border-rose-100 shadow-2xs font-handwriting text-xl text-slate-800"
                    >
                      &ldquo;{note}&rdquo;
                    </div>
                  ))}
                </div>
              )}
            </section>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};
