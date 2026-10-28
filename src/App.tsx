import React, { useState, useEffect } from 'react';
import { HeaderNav } from './components/HeaderNav';
import { FloatingPolaroids } from './components/FloatingPolaroids';
import { SafeSpaceLetter } from './components/SafeSpaceLetter';
import { ReasonsDeck } from './components/ReasonsDeck';
import { LoveCoupons } from './components/LoveCoupons';
import { CouplesQuizAndLock } from './components/CouplesQuizAndLock';
import { FloatingHearts } from './components/FloatingHearts';
import { AnimatedRomanticCanvas } from './components/AnimatedRomanticCanvas';
import { LoveIntroLoader } from './components/LoveIntroLoader';
import { MiniHarshChatbot } from './components/MiniHarshChatbot';
import { POLAROID_DATA } from './data/anniversaryData';
import { romanticAudio, fireLoveConfetti } from './utils/anniversary';
import { Heart, Sparkles, X, Gift, MessageCircleHeart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('polaroids');
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);
  const [showSurpriseModal, setShowSurpriseModal] = useState<boolean>(false);
  const [isChatWidgetOpen, setIsChatWidgetOpen] = useState<boolean>(false);

  // Intro loader state (honors autostart=1 for headless testing)
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        if (params.get('autostart') === '1') return false;
        return !sessionStorage.getItem('anniversary_seen_intro');
      }
    } catch {
      // ignore
    }
    return false;
  });

  // Sync liked polaroids with localStorage
  const [likedIds, setLikedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('anniversary_liked_polaroids');
      return stored ? JSON.parse(stored) : ['polaroid-1', 'polaroid-2', 'polaroid-4', 'polaroid-5', 'polaroid-8', 'polaroid-9'];
    } catch {
      return ['polaroid-1', 'polaroid-2', 'polaroid-4', 'polaroid-5', 'polaroid-8', 'polaroid-9'];
    }
  });

  const handleToggleLike = (id: string) => {
    const updated = likedIds.includes(id)
      ? likedIds.filter((item) => item !== id)
      : [...likedIds, id];
    setLikedIds(updated);
    try {
      localStorage.setItem('anniversary_liked_polaroids', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleSurprise = () => {
    setShowSurpriseModal(true);
  };

  const toggleMusicState = () => {
    const newState = !isMusicPlaying;
    romanticAudio.toggleAmbience(newState);
    setIsMusicPlaying(newState);
  };

  const handleCompleteIntro = () => {
    setShowIntro(false);
    try {
      sessionStorage.setItem('anniversary_seen_intro', 'true');
    } catch {
      // ignore
    }
  };

  const handleReplayIntro = () => {
    romanticAudio.playChime();
    setShowIntro(true);
  };

  // Support autostart or tab query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam && ['polaroids', 'safespace', 'reasons', 'coupons', 'chat', 'quiz'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDFB] text-slate-800 relative selection:bg-rose-200 selection:text-rose-900 overflow-x-hidden">
      {/* Intro Unwrapping Screen */}
      {showIntro && <LoveIntroLoader onComplete={handleCompleteIntro} />}

      {/* Animated Luxury Background with Floating Petals & Hearts */}
      <AnimatedRomanticCanvas />

      {/* Interactive Floating Hearts Shower Effect */}
      <FloatingHearts />

      {/* Top Bar Navigation */}
      <HeaderNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMusicPlaying={isMusicPlaying}
        setIsMusicPlaying={setIsMusicPlaying}
        onSurprise={handleSurprise}
        onReplayIntro={handleReplayIntro}
      />

      {/* Main Dynamic View Area */}
      <main className="flex-1 z-10">
        {activeTab === 'polaroids' && (
          <FloatingPolaroids
            polaroids={POLAROID_DATA}
            likedIds={likedIds}
            onToggleLike={handleToggleLike}
            onOpenSafeSpace={() => setActiveTab('safespace')}
          />
        )}

        {activeTab === 'safespace' && (
          <SafeSpaceLetter
            isMusicPlaying={isMusicPlaying}
            onToggleMusic={toggleMusicState}
          />
        )}

        {activeTab === 'reasons' && <ReasonsDeck />}

        {activeTab === 'coupons' && <LoveCoupons />}

        {activeTab === 'chat' && (
          <div className="py-8">
            <MiniHarshChatbot
              isOpen={true}
              onClose={() => setActiveTab('polaroids')}
              isWidgetMode={false}
            />
          </div>
        )}

        {activeTab === 'quiz' && <CouplesQuizAndLock />}
      </main>

      {/* Floating Mini Harsh Companion Toggle at Bottom Right */}
      {activeTab !== 'chat' && (
        <div className="fixed bottom-20 right-5 z-40">
          <button
            onClick={() => {
              romanticAudio.playPop();
              setIsChatWidgetOpen(!isChatWidgetOpen);
            }}
            className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-rose-600 via-rose-500 to-pink-500 hover:from-rose-700 hover:to-pink-600 text-white rounded-full shadow-xl hover:shadow-2xl border border-white/60 text-xs font-semibold cursor-pointer transform hover:scale-105 active:scale-95 transition-all group"
            aria-label="Chat with Mini Harsh"
          >
            <div className="relative">
              <MessageCircleHeart className="w-4 h-4 fill-white text-white group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
            </div>
            <span className="font-medium">Mini Harsh 💬</span>
          </button>
        </div>
      )}

      {/* Mini Harsh Chatbot Modal Widget */}
      <MiniHarshChatbot
        isOpen={isChatWidgetOpen}
        onClose={() => setIsChatWidgetOpen(false)}
        isWidgetMode={true}
      />

      {/* Clean Romantic Footer */}
      <footer className="z-10 border-t border-rose-100/80 bg-white/70 backdrop-blur-md py-8 px-4 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 font-medium">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            <span>3 Months Down, Forever to Go · Happy Anniversary, Akshara ♡</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Akshara will always be my safe space</span>
            <span>·</span>
            <button
              onClick={handleReplayIntro}
              className="hover:text-rose-600 transition-colors cursor-pointer font-medium"
            >
              Replay Intro ✨
            </button>
            <span>·</span>
            <button
              onClick={() => {
                romanticAudio.playChime();
                fireLoveConfetti(0.5, 0.9);
              }}
              className="hover:text-rose-600 transition-colors cursor-pointer font-medium"
            >
              Send Another Kiss 💋
            </button>
          </div>
        </div>
      </footer>

      {/* Surprise Popup Modal */}
      {showSurpriseModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Anniversary Surprise"
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowSurpriseModal(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-rose-200 shadow-2xl relative text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowSurpriseModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close surprise modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto mb-4">
              <Gift className="w-8 h-8 text-rose-500 animate-bounce" />
            </div>

            <h3 className="font-serif-display text-2xl font-bold text-slate-900 mb-2">
              A Special Surprise For Akshara!
            </h3>

            <p className="font-handwriting text-2xl text-rose-600 mb-4 leading-snug">
              &ldquo;I fall in love with you more and more every single day, Akshara.&rdquo;
            </p>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
              Thank you for the most magical 90 days of my life, Akshara. You bring peace to my heart, joy to my days, and endless warmth to my soul. I love you more than words could ever say.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  romanticAudio.playChime();
                  fireLoveConfetti(0.5, 0.5);
                  setShowSurpriseModal(false);
                  setActiveTab('safespace');
                }}
                className="px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-sm cursor-pointer"
              >
                Read Safe Space Letter
              </button>

              <button
                onClick={() => {
                  romanticAudio.playPop();
                  setShowSurpriseModal(false);
                }}
                className="px-4 py-2.5 rounded-full text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
