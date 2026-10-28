import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageCircleHeart,
  Send,
  X,
  Sparkles,
  Heart,
  Minimize2,
  Maximize2,
  RotateCcw,
} from 'lucide-react';
import { romanticAudio, fireLoveConfetti } from '../utils/anniversary';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

interface MiniHarshChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  isWidgetMode?: boolean;
}

export const MiniHarshChatbot: React.FC<MiniHarshChatbotProps> = ({
  isOpen,
  onClose,
  isWidgetMode = false,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('mini_harsh_chat_history');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: 'msg-welcome',
        role: 'model',
        text: "Hey my beautiful Akshara! ♡ I'm your Mini Harsh. Whenever the real me is sleeping, busy, or away for a moment, I'm right here in your pocket to remind you how endlessly loved, cherished, and safe you are with me. How are you feeling right now, my love?",
        timestamp: 'Just now',
      },
    ];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Persist messages in localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mini_harsh_chat_history', JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    romanticAudio.playPop();

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setIsLoading(true);

    try {
      // Build conversation history for API
      const history = updated.slice(-8).map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
      });

      if (!res.ok) throw new Error('Failed to reach Mini Harsh server');
      const data = await res.json();

      const modelReply: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: data.reply || "Akshara, my love, you know I'm always holding you tight! I love you so much! ♡",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, modelReply]);
      romanticAudio.playChime();
    } catch (err) {
      console.error(err);
      const fallbackMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: "Akshara, my love! Even if the signal drops for a second, my heart never drops yours. I'm right here holding you tight, my safe space. I love you so much! 🫂❤️",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    romanticAudio.playPop();
    const reset = [
      {
        id: 'msg-welcome-fresh',
        role: 'model' as const,
        text: "Welcome back to your safe space, Akshara! What's on your mind, my love? I'm listening to everything. ♡",
        timestamp: 'Just now',
      },
    ];
    setMessages(reset);
    localStorage.removeItem('mini_harsh_chat_history');
  };

  const handleSendKiss = () => {
    romanticAudio.playChime();
    fireLoveConfetti(0.85, 0.5);
    handleSend('Sending you an instant kiss! 💋');
  };

  const promptChips = [
    'I miss you ❤️',
    'I had a hard day today 🥺',
    'Give me a warm tight hug 🫂',
    'Tell me why you love me ✨',
    'Are you teasing my pout? 😜',
    'Why am I your safe space? 🕊️',
  ];

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal={!isWidgetMode}
      aria-label="Mini Harsh Chat"
      className={
        isWidgetMode
          ? `fixed z-50 transition-all duration-300 ${
              isExpanded
                ? 'inset-4 sm:inset-10 sm:max-w-2xl sm:mx-auto'
                : 'bottom-20 right-4 sm:right-6 w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh]'
            }`
          : 'w-full max-w-4xl mx-auto py-6 px-4'
      }
    >
      <div className="w-full h-full bg-white/95 backdrop-blur-md rounded-3xl border border-rose-200/90 shadow-2xl flex flex-col overflow-hidden relative">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white p-4 sm:px-6 flex items-center justify-between shadow-xs shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-white">
                <Heart className="w-5 h-5 fill-white text-white animate-pulse" />
              </div>
              {/* Online pulse indicator */}
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-rose-600 rounded-full" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-display font-bold text-base sm:text-lg leading-tight">
                  Mini Harsh
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-medium uppercase tracking-wider">
                  Always Here
                </span>
              </div>
              <p className="text-xs text-rose-100">
                Created with all my heart for Akshara ♡
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleSendKiss}
              title="Send an instant kiss"
              className="p-1.5 rounded-full bg-white/15 hover:bg-white/30 text-white transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
            </button>

            {isWidgetMode && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Collapse' : 'Expand'}
                className="p-1.5 rounded-full bg-white/15 hover:bg-white/30 text-white transition-colors cursor-pointer hidden sm:block"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            )}

            <button
              onClick={handleClearHistory}
              title="Reset conversation"
              className="p-1.5 rounded-full bg-white/15 hover:bg-white/30 text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {isWidgetMode && (
              <button
                onClick={onClose}
                aria-label="Close chat"
                className="p-1.5 rounded-full bg-white/15 hover:bg-white/30 text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gradient-to-b from-[#FFFDFB] to-[#FFF9F5]">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-in fade-in`}
              >
                <div className="flex items-end gap-2 max-w-[85%] sm:max-w-[78%]">
                  {!isUser && (
                    <div className="w-7 h-7 rounded-full bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0 mb-1">
                      <Heart className="w-3.5 h-3.5 fill-rose-500" />
                    </div>
                  )}

                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      isUser
                        ? 'bg-rose-500 text-white rounded-br-xs shadow-xs'
                        : 'bg-white text-slate-800 border border-rose-100/80 rounded-bl-xs shadow-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>

                <span className="text-[10px] text-slate-400 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex items-center gap-2 text-rose-500">
              <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <Heart className="w-3.5 h-3.5 fill-rose-500 animate-pulse" />
              </div>
              <div className="bg-white border border-rose-100 px-3.5 py-2 rounded-2xl rounded-bl-xs shadow-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-rose-50/50 border-t border-rose-100/70 overflow-x-auto flex items-center gap-2 no-scrollbar shrink-0">
          <span className="text-[10px] uppercase font-bold text-rose-400 whitespace-nowrap shrink-0">
            Quick Prompts:
          </span>
          {promptChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              disabled={isLoading}
              className="text-xs px-3 py-1 rounded-full bg-white border border-rose-200 text-slate-700 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 whitespace-nowrap shrink-0 transition-colors cursor-pointer disabled:opacity-50"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 sm:p-4 bg-white border-t border-rose-100 flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Talk to Mini Harsh (e.g. 'I miss your hugs', 'tell me a sweet memory')..."
            className="flex-1 px-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-rose-400 focus:bg-white transition-all placeholder:text-slate-400"
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            aria-label="Send message to Mini Harsh"
            className="p-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white disabled:opacity-40 transition-colors shadow-xs cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
