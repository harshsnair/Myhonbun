import React from 'react';
import { Volume2, VolumeX, Sparkles, Heart } from 'lucide-react';
import { romanticAudio, fireLoveConfetti } from '../utils/anniversary';

interface HeaderNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMusicPlaying: boolean;
  setIsMusicPlaying: (playing: boolean) => void;
  onSurprise: () => void;
  onReplayIntro?: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeTab,
  setActiveTab,
  isMusicPlaying,
  setIsMusicPlaying,
  onSurprise,
  onReplayIntro,
}) => {
  const toggleMusic = () => {
    const newState = !isMusicPlaying;
    romanticAudio.toggleAmbience(newState);
    setIsMusicPlaying(newState);
    if (newState) {
      romanticAudio.playChime();
    }
  };

  const navItems = [
    { id: 'polaroids', label: 'Our Polaroids' },
    { id: 'safespace', label: 'My Safe Space' },
    { id: 'reasons', label: '30 Reasons' },
    { id: 'coupons', label: 'Love Coupons' },
    { id: 'chat', label: 'Mini Harsh' },
    { id: 'quiz', label: 'Love Lock & Quiz' },
  ];

  const handleSurpriseClick = () => {
    romanticAudio.playChime();
    fireLoveConfetti(0.85, 0.2);
    onSurprise();
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDFB]/90 backdrop-blur-md border-b border-rose-100/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title wordmark */}
        <button
          onClick={() => setActiveTab('polaroids')}
          className="flex items-center gap-2 text-left cursor-pointer group whitespace-nowrap shrink-0 focus-visible:outline-rose-400"
          aria-label="Go to home polaroids page"
        >
          <span className="font-serif-display text-xl sm:text-2xl font-bold tracking-tight text-rose-950 group-hover:text-rose-600 transition-colors">
            3 Months With Akshara
          </span>
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500 transition-transform group-hover:scale-125" />
        </button>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  romanticAudio.playPop();
                  setActiveTab(item.id);
                }}
                className={`text-sm font-medium transition-colors whitespace-nowrap shrink-0 relative py-1 cursor-pointer focus-visible:outline-rose-400 ${
                  isActive
                    ? 'text-rose-600 font-semibold'
                    : 'text-slate-600 hover:text-rose-700'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action + audio toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={toggleMusic}
            aria-label={isMusicPlaying ? 'Mute ambient lofi melody' : 'Play ambient lofi melody'}
            title={isMusicPlaying ? 'Pause Melody' : 'Play Romantic Lofi Melody'}
            className={`p-2 rounded-full border transition-all cursor-pointer focus-visible:outline-rose-400 ${
              isMusicPlaying
                ? 'bg-rose-50 border-rose-300 text-rose-600 shadow-sm'
                : 'bg-white border-slate-200 text-slate-500 hover:text-rose-600'
            }`}
          >
            {isMusicPlaying ? (
              <div className="flex items-center gap-1.5 px-1">
                <Volume2 className="w-4 h-4 animate-pulse text-rose-600" />
                <span className="text-xs font-medium text-rose-700 hidden lg:inline">Lofi On</span>
              </div>
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={handleSurpriseClick}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 rounded-full shadow-sm hover:shadow transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap shrink-0 focus-visible:outline-rose-400"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Surprise Me</span>
          </button>
        </div>
      </div>

      {/* Mobile nav scroll strip */}
      <div className="md:hidden flex items-center overflow-x-auto px-4 py-2 gap-2 border-t border-rose-50 bg-rose-50/40 no-scrollbar">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                romanticAudio.playPop();
                setActiveTab(item.id);
              }}
              className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'bg-white/80 text-slate-700 hover:bg-white'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
