import React from 'react';
import { Timer, ArrowUp, Mountain, Star, Ban, User, Sparkles, ArrowUpRight, Shield, Hand, TrendingUp, Heart, Flame, Bird, Target, Activity, Zap, CircleDollarSign, Coins, Wallet, Gem, Axe, Cigarette } from 'lucide-react';

export const BADGES_DATA = [
  { id: 'ilk_24', day: 1, title: 'İLK 24 SAAT', xpNeeded: 50, type: 'day', color: '#10b981' }, // emerald-500
  { id: 'kriz_zirve', day: 3, title: 'ZİRVE', xpNeeded: 150, type: 'day', color: '#f97316' }, // orange-500
  { id: 'motive', day: 7, title: 'MOTİVE', xpNeeded: 350, type: 'day', color: '#84cc16' }, // lime-500
  { id: 'kararli', day: 14, title: 'KARARLI', xpNeeded: 700, type: 'day', color: '#06b6d4' }, // cyan-500
  { id: 'istikrarli', day: 21, title: 'İSTİKRARLI', xpNeeded: 1050, type: 'day', color: '#d946ef' }, // fuchsia-500
  { id: 'yenilmez', day: 30, title: 'YENİLMEZ', xpNeeded: 1500, type: 'day', isTopTier: true, color: '#ef4444' }, // red-500

  { id: 'ilk_hedef', target: 1, title: 'İLK ADIM', type: 'first_goal', color: '#0ea5e9' }, // sky-500
  { id: 'saglik_5', target: 5, title: 'SAĞLIK SAVAŞÇISI', type: 'health', color: '#10b981' }, // emerald-500
  { id: 'saglik_10', target: 10, title: 'ŞİFA USTASI', type: 'health', color: '#eab308' }, // yellow-500
  { id: 'saglik_20', target: 20, title: 'YENİDEN DOĞUŞ', type: 'health', isTopTier: true, color: '#f43f5e' }, // rose-500

  { id: 'tasarruf_1', target: 1, title: 'İLK BİRİKİM', type: 'savings', color: '#14b8a6' }, // teal-500
  { id: 'tasarruf_5', target: 5, title: 'TUTUMLU', type: 'savings', color: '#3b82f6' }, // blue-500
  { id: 'tasarruf_10', target: 10, title: 'YATIRIMCI', type: 'savings', color: '#6366f1' }, // indigo-500
  { id: 'tasarruf_20', target: 20, title: 'FİNANSAL ÖZGÜR', type: 'savings', isTopTier: true, color: '#8b5cf6' }, // violet-500
  { id: 'sigara_katili', day: 30, title: 'SİGARA KATİLİ', type: 'special', isTopTier: true, color: '#450a0a' }, // dark red
];

export const BadgeIcon = React.memo(({ id, className = "size-16" }: { id: string, className?: string }) => {
  switch (id) {
    case 'ilk_24':
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          {/* Outer Glow */}
          <div className="absolute inset-0 bg-emerald-500/10 blur-lg rounded-full"></div>
          {/* Glass Base */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900 border border-white/10 rounded-full shadow-lg"></div>
          {/* Inner Neon Ring */}
          <div className="absolute inset-1 border-2 border-emerald-400/30 rounded-full"></div>
          {/* Icon */}
          <div className="relative z-10 flex flex-col items-center justify-center text-emerald-300">
            <Timer size={26} strokeWidth={2} />
            <span className="text-[9px] font-black mt-0.5 tracking-wider">24H</span>
          </div>
        </div>
      );
    case 'kriz_zirve':
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <div className="absolute inset-0 bg-orange-500/10 blur-lg rounded-2xl"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 shadow-lg" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
          <div className="absolute inset-0.5 bg-gradient-to-b from-orange-500/10 to-transparent" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
          <div className="absolute inset-1 border border-orange-500/30" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
          <div className="relative z-10 flex flex-col items-center justify-center text-orange-400">
            <Star size={12} className="text-yellow-300 fill-yellow-300 mb-0.5" />
            <Mountain size={26} strokeWidth={2} />
          </div>
        </div>
      );
    case 'motive':
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <div className="absolute inset-0 bg-lime-500/10 blur-lg rounded-2xl"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 to-slate-800 border border-white/10 rounded-2xl transform rotate-3 shadow-lg"></div>
          <div className="absolute inset-1 border border-lime-400/30 rounded-xl transform -rotate-3 bg-gradient-to-br from-lime-500/5 to-transparent"></div>
          <div className="relative z-10 flex items-center justify-center text-lime-300">
            <User size={26} strokeWidth={2} />
            <Sparkles size={14} className="absolute -top-2 -right-2 text-yellow-300" />
          </div>
        </div>
      );
    case 'kararli':
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <div className="absolute inset-0 bg-cyan-500/10 blur-lg rounded-2xl"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900 border border-white/10 shadow-lg" style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' }}></div>
          <div className="absolute inset-1 border-2 border-cyan-400/30 bg-cyan-500/5" style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' }}></div>
          <div className="relative z-10 flex items-center justify-center text-cyan-300">
            <Shield size={28} strokeWidth={1.5} className="absolute opacity-20" />
            <Hand size={20} strokeWidth={2} className="z-10" />
          </div>
        </div>
      );
    case 'istikrarli':
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <div className="absolute inset-0 bg-fuchsia-500/10 blur-lg rounded-full"></div>
          <div className="absolute inset-0 bg-[#0f172a] border border-white/10 rounded-full shadow-lg"></div>
          <div className="relative z-10 flex flex-col items-center justify-center text-fuchsia-300">
            <Heart size={12} className="fill-fuchsia-400 text-fuchsia-400 mb-0.5" />
            <TrendingUp size={22} strokeWidth={2} />
          </div>
        </div>
      );
    case 'yenilmez':
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <div className="absolute inset-0 bg-red-500/10 blur-lg rounded-full"></div>
          {/* Circular Base */}
          <div className="absolute inset-0 bg-[#0f172a] border border-red-500/20 rounded-full shadow-lg"></div>
          {/* Inner Glow */}
          <div className="absolute inset-1 border-2 border-red-500/10 rounded-full"></div>
          
          <div className="relative z-10 flex flex-col items-center justify-center text-red-400">
            <Axe size={26} strokeWidth={2.5} />
          </div>
          
          <Sparkles size={10} className="absolute top-1 right-1 text-red-400/30" />
        </div>
      );

    // NEW GOAL BADGES
    case 'ilk_hedef':
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <div className="absolute inset-0 bg-sky-500/10 blur-lg rounded-full"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900 border border-white/10 rounded-full shadow-lg"></div>
          <div className="absolute inset-1 border-2 border-sky-400/30 rounded-full"></div>
          <div className="relative z-10 flex flex-col items-center justify-center text-sky-300">
            <Target size={26} strokeWidth={2} />
            <Star size={10} className="absolute -top-1 -right-1 text-yellow-300 fill-yellow-300" />
          </div>
        </div>
      );
    case 'saglik_5':
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <div className="absolute inset-0 bg-emerald-500/10 blur-lg rounded-xl"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-xl shadow-lg transform rotate-45"></div>
          <div className="absolute inset-1 border border-emerald-400/30 rounded-xl transform rotate-45"></div>
          <div className="relative z-10 flex flex-col items-center justify-center text-emerald-300">
            <Activity size={26} strokeWidth={2} />
          </div>
        </div>
      );
    case 'saglik_10':
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <div className="absolute inset-0 bg-yellow-500/10 blur-lg rounded-full"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900 border border-white/10 rounded-full shadow-lg"></div>
          <div className="absolute inset-1 border-2 border-yellow-400/40 rounded-full"></div>
          <div className="absolute inset-2 bg-gradient-to-tr from-yellow-500/10 to-transparent rounded-full"></div>
          <div className="relative z-10 flex flex-col items-center justify-center text-yellow-300">
            <Heart size={24} className="fill-yellow-400/10" strokeWidth={2} />
            <Zap size={12} className="absolute text-yellow-200 fill-yellow-200" />
          </div>
        </div>
      );
    case 'saglik_20':
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <div className="absolute inset-0 bg-rose-500/20 blur-lg rounded-2xl"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900 border border-white/10 shadow-lg" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
          <div className="absolute inset-0.5 bg-gradient-to-tr from-rose-500/20 via-transparent to-pink-400/20" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
          <div className="absolute inset-1 border-2 border-rose-400/50" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
          <div className="relative z-10 flex flex-col items-center justify-center text-rose-300">
            <Shield size={28} strokeWidth={1.5} className="absolute opacity-20 text-rose-200" />
            <Heart size={20} className="fill-rose-400 z-10" strokeWidth={2} />
            <Sparkles size={14} className="absolute -top-2 -right-2 text-white" />
          </div>
        </div>
      );

    case 'tasarruf_1':
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <div className="absolute inset-0 bg-teal-500/10 blur-lg rounded-full"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900 border border-white/10 rounded-full shadow-lg"></div>
          <div className="absolute inset-1 border-2 border-teal-400/30 rounded-full"></div>
          <div className="relative z-10 flex flex-col items-center justify-center text-teal-300">
            <Coins size={26} strokeWidth={2} />
          </div>
        </div>
      );
    case 'tasarruf_5':
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <div className="absolute inset-0 bg-blue-500/10 blur-lg rounded-xl"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-xl shadow-lg transform rotate-45"></div>
          <div className="absolute inset-1 border border-blue-400/30 rounded-xl transform rotate-45"></div>
          <div className="relative z-10 flex flex-col items-center justify-center text-blue-300">
            <Wallet size={26} strokeWidth={2} />
          </div>
        </div>
      );
    case 'tasarruf_10':
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <div className="absolute inset-0 bg-indigo-500/10 blur-lg rounded-full"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900 border border-white/10 rounded-full shadow-lg"></div>
          <div className="absolute inset-1 border-2 border-indigo-400/40 rounded-full"></div>
          <div className="absolute inset-2 bg-gradient-to-tr from-indigo-500/10 to-transparent rounded-full"></div>
          <div className="relative z-10 flex flex-col items-center justify-center text-indigo-300">
            <CircleDollarSign size={28} strokeWidth={2} />
            <ArrowUp size={12} className="absolute text-indigo-200" strokeWidth={3} />
          </div>
        </div>
      );
    case 'tasarruf_20':
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <div className="absolute inset-0 bg-violet-500/20 blur-lg rounded-2xl"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900 border border-white/10 shadow-lg" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
          <div className="absolute inset-0.5 bg-gradient-to-tr from-violet-500/20 via-transparent to-purple-400/20" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
          <div className="absolute inset-1 border-2 border-violet-400/60" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
          <div className="relative z-10 flex flex-col items-center justify-center text-violet-300">
            <Gem size={26} className="fill-violet-400/10" strokeWidth={2} />
            <Sparkles size={14} className="absolute -top-2 -right-2 text-white" />
          </div>
        </div>
      );

    case 'sigara_katili':
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          {/* Rotating dashed circle */}
          <div className="absolute -inset-1 border-2 border-dashed border-red-600/30 rounded-full animate-[spin_10s_linear_infinite] z-20 pointer-events-none will-change-transform"></div>
          <div className="absolute inset-0 bg-red-950/20 blur-lg rounded-full"></div>
          {/* Dark Metallic Base */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-black border-2 border-red-900/40 rounded-full shadow-xl"></div>
          {/* Blood Red Glow */}
          <div className="absolute inset-1 border border-red-600/10 rounded-full"></div>
          
          <div className="relative z-10 flex flex-col items-center justify-center text-red-500">
            <div className="relative flex items-center justify-center">
              <Cigarette size={24} className="text-slate-400 opacity-60" />
              <Ban size={32} strokeWidth={2.5} className="absolute text-red-600" />
              <Flame size={14} className="absolute -top-2 -right-2 text-orange-500" />
            </div>
            <Sparkles size={10} className="absolute -bottom-3 text-red-400 opacity-30" />
          </div>
          
          {/* Crosshair effect */}
          <div className="absolute inset-0 border border-red-500/5 rounded-full scale-110"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-full bg-red-500/5"></div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-full bg-red-500/5"></div>
        </div>
      );

    default:
      return null;
  }
});
