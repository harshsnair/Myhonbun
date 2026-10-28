import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Unlock, Heart, Award, Sparkles, CheckCircle2, Milestone as MilestoneIcon } from 'lucide-react';
import { QUIZ_QUESTIONS, MILESTONES } from '../data/anniversaryData';
import { romanticAudio, fireLoveConfetti } from '../utils/anniversary';

export const CouplesQuizAndLock: React.FC = () => {
  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [revealedQuestions, setRevealedQuestions] = useState<number[]>([]);

  // Love lock state
  const [initials, setInitials] = useState(() => {
    try {
      return localStorage.getItem('anniversary_initials') || 'Harsh + Akshara';
    } catch {
      return 'Harsh + Akshara';
    }
  });

  const [isLocked, setIsLocked] = useState(() => {
    try {
      return localStorage.getItem('anniversary_is_locked') === 'true';
    } catch {
      return false;
    }
  });

  const [showCertificate, setShowCertificate] = useState(false);

  const handleSelectOption = (questionId: number, optionIdx: number) => {
    romanticAudio.playPop();
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
    if (!revealedQuestions.includes(questionId)) {
      setRevealedQuestions((prev) => [...prev, questionId]);
    }
    fireLoveConfetti(0.5, 0.6);
  };

  const handleToggleLock = () => {
    romanticAudio.playChime();
    const nextState = !isLocked;
    setIsLocked(nextState);
    try {
      localStorage.setItem('anniversary_is_locked', String(nextState));
      localStorage.setItem('anniversary_initials', initials);
    } catch {
      // ignore
    }

    if (nextState) {
      fireLoveConfetti(0.5, 0.4);
      setTimeout(() => setShowCertificate(true), 600);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-16">
      {/* SECTION 1: Love Lock Bridge */}
      <section className="bg-gradient-to-b from-[#FFFDF8] to-[#FFF3EC] rounded-3xl p-6 sm:p-12 border border-rose-200 shadow-md text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-semibold mb-4">
          <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
          <span>Our Sacred Anniversary Promise</span>
        </div>

        <h1 className="font-serif-display text-4xl sm:text-5xl font-bold text-slate-900 mb-3">
          The Anniversary Love Lock
        </h1>

        <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto mb-8">
          Just like the padlocks on Paris’s Pont des Arts bridge, carve our names onto this golden lock and seal our love for the next 3 months, 3 years, and beyond.
        </p>

        {/* The Golden Padlock Visual */}
        <div className="max-w-xs mx-auto mb-8">
          <motion.div
            animate={{
              scale: isLocked ? [1, 1.05, 1] : 1,
            }}
            transition={{ duration: 0.4 }}
            className={`relative rounded-3xl p-6 border-4 flex flex-col items-center justify-center transition-all duration-500 shadow-xl ${
              isLocked
                ? 'bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 border-amber-500 text-amber-950'
                : 'bg-gradient-to-br from-amber-100 via-amber-200 to-amber-300 border-amber-300 text-amber-900'
            }`}
          >
            {/* Padlock Shackle */}
            <div
              className={`w-24 h-20 border-8 border-slate-400 rounded-t-full -mt-16 mb-2 transition-all duration-500 ${
                isLocked ? 'translate-y-4 border-amber-600' : 'translate-y-0 rotate-12'
              }`}
            />

            {/* Engraved Initials on Lock */}
            <div className="w-full text-center py-2 border-b border-amber-600/30 mb-3">
              <span className="font-serif-display text-2xl font-bold tracking-wider block">
                {initials || 'H + HER'}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest opacity-80">
                3 Months & Eternity
              </span>
            </div>

            {/* Keyhole / Lock Icon */}
            <div className="my-2">
              {isLocked ? (
                <div className="p-3 bg-amber-600/20 rounded-full">
                  <Lock className="w-8 h-8 text-amber-950 fill-amber-900" />
                </div>
              ) : (
                <div className="p-3 bg-amber-600/20 rounded-full">
                  <Unlock className="w-8 h-8 text-amber-900" />
                </div>
              )}
            </div>

            <span className="text-xs font-semibold mt-2">
              {isLocked ? 'Locked & Sealed Forever 🔒' : 'Unlocked · Ready to Seal'}
            </span>
          </motion.div>
        </div>

        {/* Initials Input & Lock Action */}
        <div className="max-w-md mx-auto space-y-4">
          {!isLocked && (
            <div>
              <label
                htmlFor="initials-input"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Carve our initials or nickname:
              </label>
              <input
                id="initials-input"
                type="text"
                value={initials}
                onChange={(e) => setInitials(e.target.value)}
                maxLength={24}
                className="w-full px-4 py-2.5 rounded-xl border border-rose-200 bg-white text-center font-serif-display text-lg text-slate-800 focus:outline-rose-400"
                placeholder="e.g. Harsh + Akshara"
              />
            </div>
          )}

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleToggleLock}
              className={`px-8 py-3 rounded-full text-sm font-semibold transition-all shadow-md cursor-pointer transform hover:scale-105 active:scale-95 ${
                isLocked
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white'
              }`}
            >
              {isLocked ? 'Unlock to re-engrave' : 'Lock Our Love Forever 🔒'}
            </button>

            {isLocked && (
              <button
                onClick={() => setShowCertificate(true)}
                className="px-5 py-3 rounded-full text-sm font-semibold bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 transition-colors shadow-xs"
              >
                View Certificate 📜
              </button>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 2: 3-Month Milestones Timeline */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm">
        <div className="flex items-center gap-2 text-rose-600 text-xs font-semibold uppercase tracking-wider mb-2">
          <MilestoneIcon className="w-4 h-4" />
          <span>Our Journey Step by Step</span>
        </div>
        <h2 className="font-serif-display text-3xl font-bold text-slate-900 mb-2">
          3 Months of Memories
        </h2>
        <p className="text-slate-600 text-sm mb-10">
          From that initial spark to our deep, tender bond today.
        </p>

        <div className="relative border-l-2 border-rose-200 ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-10">
          {MILESTONES.map((m, idx) => (
            <div key={m.id} className="relative group">
              {/* Dot icon on timeline */}
              <div className="absolute -left-[35px] sm:-left-[43px] top-1 w-6 h-6 rounded-full bg-rose-500 border-4 border-white flex items-center justify-center text-white text-[10px] shadow-xs">
                {idx + 1}
              </div>

              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                  {m.period}
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-500">{m.date}</span>
              </div>

              <h3 className="font-serif-display text-xl font-bold text-slate-900 mb-2">
                {m.title}
              </h3>

              <p className="text-slate-600 text-sm leading-relaxed mb-3 max-w-2xl">
                {m.description}
              </p>

              <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100 text-xs font-medium text-rose-900 inline-block">
                ✨ {m.highlight}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: Sweet Couple's Mini Quiz */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm">
        <div className="flex items-center gap-2 text-rose-600 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>For Fun & Giggles</span>
        </div>
        <h2 className="font-serif-display text-3xl font-bold text-slate-900 mb-2">
          How Well Do You Know Us?
        </h2>
        <p className="text-slate-600 text-sm mb-8">
          Answer these sweet little questions and unlock loving messages!
        </p>

        <div className="space-y-8">
          {QUIZ_QUESTIONS.map((q) => {
            const hasAnswered = selectedAnswers[q.id] !== undefined;
            const chosenIdx = selectedAnswers[q.id];

            return (
              <div
                key={q.id}
                className="p-5 sm:p-6 bg-slate-50/70 rounded-2xl border border-slate-200/80"
              >
                <h3 className="font-serif-display text-lg font-bold text-slate-900 mb-4">
                  {q.id}. {q.question}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {q.options.map((option, optIdx) => {
                    const isSelected = chosenIdx === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        className={`p-3 rounded-xl text-left text-xs font-medium border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-rose-300 hover:bg-rose-50/40'
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>

                {hasAnswered && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-900 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{q.sweetMessage}</span>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Certificate Modal */}
      {showCertificate && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Official 3-Month Love Certificate"
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowCertificate(false)}
        >
          <div
            className="bg-[#FFFDF7] border-4 border-amber-300 rounded-3xl p-8 sm:p-12 max-w-lg w-full text-center shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 rounded-full bg-rose-50 border-2 border-rose-200 mx-auto flex items-center justify-center mb-4">
              <Award className="w-8 h-8 text-rose-600" />
            </div>

            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-800">
              Certificate of Infinite Devotion
            </span>

            <h3 className="font-serif-display text-3xl font-bold text-slate-900 my-2">
              Happy 3-Month Anniversary
            </h3>

            <p className="font-handwriting text-2xl text-rose-600 mb-4">
              Presented with all my heart to {initials}
            </p>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
              This hereby certifies that Akshara is officially recognized as Harsh’s safe space, the keeper of his heart, and his favorite human being in the entire universe.
            </p>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 mb-6 text-xs text-amber-900 font-medium">
              Validity: 90 Days Completed · Lifetime Renewal Activated
            </div>

            <button
              onClick={() => {
                romanticAudio.playPop();
                setShowCertificate(false);
              }}
              className="px-6 py-2.5 rounded-full text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-xs cursor-pointer"
            >
              Keep Close to My Heart ♡
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
