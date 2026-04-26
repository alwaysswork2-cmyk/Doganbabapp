import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  Smile, 
  Lock, 
  Wallet, 
  Calendar, 
  Hourglass, 
  Zap, 
  Shield, 
  Edit2, 
  Home, 
  BookOpen, 
  Trophy,
  Heart,
  Activity,
  TrendingUp,
  ChevronRight,
  User,
  PiggyBank,
  Activity as Pulse,
  Crown,
  Target
} from 'lucide-react';
import { Step, OnboardingData } from '../types';
import { Goal30DIcon } from './Icons';
import BottomNav from './BottomNav';

interface DashboardProps {
  onNavigate: (step: Step) => void;
  moodHistory: { day: number, emoji: string }[];
  currentDay: number;
  startDate: Date;
  userAvatar: string;
  completedDays: number[];
  onboardingData: OnboardingData;
  crisisCount: number;
  rewards?: any[];
  isPremium: boolean;
  scrollPos?: number;
}

export default function Dashboard({ 
  onNavigate, 
  moodHistory, 
  currentDay, 
  startDate, 
  userAvatar, 
  completedDays, 
  onboardingData,
  crisisCount,
  rewards = [],
  isPremium,
  scrollPos = 0
}: DashboardProps) {
  const isValidDate = (d: any) => d instanceof Date && !isNaN(d.getTime());
  const formattedStartDate = isValidDate(startDate) 
    ? startDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Bilinmiyor';
  const [now, setNow] = useState(Date.now());
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    const flipTimer = setInterval(() => setIsFlipped(prev => !prev), 6000);
    
    if (scrollPos > 0) {
      window.scrollTo(0, scrollPos);
    }

    return () => {
      clearInterval(timer);
      clearInterval(flipTimer);
    };
  }, []);

  const diffMs = Math.max(0, now - startDate.getTime());
  const diffSec = Math.floor(diffMs / 1000);
  
  const getTimeUnits = (totalSeconds: number) => {
    const months = Math.floor(totalSeconds / (30 * 24 * 60 * 60));
    let remaining = totalSeconds % (30 * 24 * 60 * 60);
    const weeks = Math.floor(remaining / (7 * 24 * 60 * 60));
    remaining %= (7 * 24 * 60 * 60);
    const days = Math.floor(remaining / (24 * 60 * 60));
    remaining %= (24 * 60 * 60);
    const hours = Math.floor(remaining / (60 * 60));
    remaining %= (60 * 60);
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    return { months, weeks, days, hours, minutes, seconds };
  };

  const units = getTimeUnits(diffSec);

  const costPerCigarette = onboardingData.pricePerPack / onboardingData.cigarettesPerPack;
  const dailyCost = onboardingData.dailyCigarettes * costPerCigarette;
  const savedMoney = (diffSec * dailyCost) / 86400;
  const avoidedCigarettes = Math.floor((diffSec * onboardingData.dailyCigarettes) / 86400);
  const lifeMinutesSaved = (diffSec * onboardingData.dailyCigarettes * 20) / 86400;
  const lifeSecondsSaved = Math.floor(lifeMinutesSaved * 60);
  const lifeUnits = getTimeUnits(lifeSecondsSaved);

  const moneySideA = (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold leading-none">{Math.floor(savedMoney)}</span>
        <span className="text-[10px] font-black uppercase opacity-60">TL</span>
      </div>
    </div>
  );

  const moneySideB = (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold leading-none">
          {Math.round((savedMoney % 1) * 100).toString().padStart(2, '0')}
        </span>
        <span className="text-[10px] font-black uppercase opacity-60">Kr</span>
      </div>
    </div>
  );

  const smokeFreeSideA = (
    <div className="flex items-center justify-center gap-3 h-full">
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold leading-none">{Math.floor(diffSec / 86400)}</span>
        <span className="text-[8px] font-black uppercase opacity-60">Gün</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold leading-none">{Math.floor((diffSec % 86400) / 3600)}</span>
        <span className="text-[8px] font-black uppercase opacity-60">Saat</span>
      </div>
    </div>
  );

  const smokeFreeSideB = (
    <div className="flex items-center justify-center gap-3 h-full">
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold leading-none">{Math.floor((diffSec % 3600) / 60)}</span>
        <span className="text-[8px] font-black uppercase opacity-60">Dakika</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold leading-none">{diffSec % 60}</span>
        <span className="text-[8px] font-black uppercase opacity-60">Saniye</span>
      </div>
    </div>
  );

  const lifeSideA = (
    <div className="flex items-center justify-center gap-3 h-full">
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold leading-none">{Math.floor(lifeSecondsSaved / 86400)}</span>
        <span className="text-[8px] font-black uppercase opacity-60">Gün</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold leading-none">{Math.floor((lifeSecondsSaved % 86400) / 3600)}</span>
        <span className="text-[8px] font-black uppercase opacity-60">Saat</span>
      </div>
    </div>
  );

  const lifeSideB = (
    <div className="flex items-center justify-center gap-3 h-full">
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold leading-none">{Math.floor((lifeSecondsSaved % 3600) / 60)}</span>
        <span className="text-[8px] font-black uppercase opacity-60">Dakika</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold leading-none">{lifeSecondsSaved % 60}</span>
        <span className="text-[8px] font-black uppercase opacity-60">Saniye</span>
      </div>
    </div>
  );
  
  const msPerCigarette = (24 * 60 * 60 * 1000) / onboardingData.dailyCigarettes;
  const msSinceLastCigarette = diffMs % msPerCigarette;
  const msUntilNextCigarette = msPerCigarette - msSinceLastCigarette;
  const progressToNextCigarette = (msSinceLastCigarette / msPerCigarette) * 100;
  const nextCigMin = Math.floor(msUntilNextCigarette / (1000 * 60));
  const nextCigSec = Math.floor((msUntilNextCigarette % (1000 * 60)) / 1000);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 max-w-md mx-auto relative pb-32 overflow-x-hidden">
      {/* Top Navigation */}
      <nav className="flex items-center justify-between px-4 py-2 sticky top-0 bg-[#0f172a]/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate('profile')}
            className="size-10 rounded-full border-2 border-primary/20 p-0.5"
          >
            <img 
              alt="User avatar" 
              className="w-full h-full rounded-full object-cover" 
              src={userAvatar}
              referrerPolicy="no-referrer"
            />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate('premium')}
            className="bg-gradient-to-tr from-blue-500 via-blue-400 to-cyan-300 text-white size-10 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.6)] border border-cyan-200/50 active:scale-95 transition-transform"
          >
            <Crown size={20} className="fill-current" />
          </button>
        </div>
      </nav>

      <main className="px-4 space-y-4">
        <div className="flex justify-center items-center mt-4 mb-2">
          <button 
            onClick={() => onNavigate('mood_selection')}
            className="text-[12px] font-black text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-[0.2em] flex items-center gap-2 bg-emerald-500/10 px-5 py-2 rounded-full border border-emerald-500/20 shadow-lg shadow-emerald-500/5"
          >
            <Smile size={14} /> Bugün nasılsın?
          </button>
        </div>

        {/* Duygu Gelişimi Card */}
        <section 
          onClick={() => onNavigate('mood_selection')}
          className="bg-primary/15 border border-primary/30 rounded-2xl p-5 relative overflow-hidden shadow-lg shadow-primary/5 cursor-pointer hover:bg-primary/20 transition-colors group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl -mr-16 -mt-16"></div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">Duygu Gelişimi</h3>
            <span className="text-xs text-white font-bold px-1 py-1">Bugün {currentDay}. Gün</span>
          </div>
          <div className="flex justify-between items-center px-2">
            {[...Array(4)].map((_, i) => {
              const targetDay = currentDay + i;
              const historyItem = moodHistory.find(h => h.day === targetDay);
              const isToday = targetDay === currentDay;
              const isFuture = targetDay > currentDay;
              
              return (
                <div key={i} className={`flex flex-col items-center gap-2 ${isFuture ? 'opacity-25' : 'relative'}`}>
                  {isToday && historyItem && (
                    <div className="absolute inset-0 bg-primary/50 blur-xl scale-150 rounded-full -z-10"></div>
                  )}
                  <div className="flex flex-col items-center">
                    <span className="text-[8px] font-black text-slate-500 uppercase mb-1">
                      {isToday ? 'Bugün' : `G${targetDay}`}
                    </span>
                    <div className="h-8 flex items-center justify-center">
                      {historyItem ? (
                        <span className={`${isToday ? 'text-3xl scale-110 drop-shadow-[0_0_12px_rgba(37,99,235,0.6)]' : 'text-2xl opacity-80'}`}>
                          {historyItem.emoji}
                        </span>
                      ) : isFuture ? (
                        <Lock size={14} className="text-slate-600" />
                      ) : isToday ? (
                        <span className="text-2xl font-black text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">?</span>
                      ) : null}
                    </div>
                  </div>
                  <div className={`h-1 ${isToday ? 'w-10 bg-primary shadow-[0_0_10px_rgba(37,99,235,1)]' : 'w-8 bg-slate-700'} rounded-full mt-1`}></div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Gelişim Section */}
        <section>
          <h3 className="text-[11px] font-bold text-white uppercase tracking-[0.2em] mb-4 px-1">Gelişim</h3>
          <div className="grid grid-cols-2 gap-3">
            {/* Card 1: Money */}
            <div className="bg-slate-800/40 border border-emerald-500/20 rounded-2xl p-3 h-[110px] flex flex-col relative overflow-hidden">
              <div className="bg-emerald-500/20 size-8 rounded-lg flex items-center justify-center mb-1">
                <Wallet className="text-emerald-500" size={16} />
              </div>
              <div className="flex-1 relative -mt-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isFlipped ? 'moneySideB' : 'moneySideA'}
                    initial={{ rotateX: -90, opacity: 0 }}
                    animate={{ rotateX: 0, opacity: 1 }}
                    exit={{ rotateX: 90, opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="absolute inset-0 flex flex-col justify-center"
                  >
                    {isFlipped ? moneySideB : moneySideA}
                  </motion.div>
                </AnimatePresence>
              </div>
              <p className="text-[9px] font-bold text-emerald-500/80 tracking-wider uppercase mt-auto text-center">Kazanılan Para</p>
            </div>
            {/* Card 2: Calendar */}
            <div className="bg-slate-800/40 border border-primary/20 rounded-2xl p-3 h-[110px] flex flex-col relative overflow-hidden">
              <div className="bg-primary/20 size-8 rounded-lg flex items-center justify-center mb-1">
                <Calendar className="text-primary" size={16} />
              </div>
              <div className="flex-1 relative -mt-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isFlipped ? 'smokeFreeSideB' : 'smokeFreeSideA'}
                    initial={{ rotateX: -90, opacity: 0 }}
                    animate={{ rotateX: 0, opacity: 1 }}
                    exit={{ rotateX: 90, opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="absolute inset-0 flex flex-col justify-center"
                  >
                    {isFlipped ? smokeFreeSideB : smokeFreeSideA}
                  </motion.div>
                </AnimatePresence>
              </div>
              <p className="text-[9px] font-bold text-primary/80 tracking-wider uppercase mt-auto text-center">SİGARASIZ</p>
            </div>
            {/* Card 3: Hourglass */}
            <div className="bg-slate-800/40 border border-rose-500/20 rounded-2xl p-3 h-[110px] flex flex-col relative overflow-hidden">
              <div className="bg-rose-500/20 size-8 rounded-lg flex items-center justify-center mb-1">
                <Hourglass className="text-rose-500" size={16} />
              </div>
              <div className="flex-1 relative -mt-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isFlipped ? 'lifeSideB' : 'lifeSideA'}
                    initial={{ rotateX: -90, opacity: 0 }}
                    animate={{ rotateX: 0, opacity: 1 }}
                    exit={{ rotateX: 90, opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="absolute inset-0 flex flex-col justify-center"
                  >
                    {isFlipped ? lifeSideB : lifeSideA}
                  </motion.div>
                </AnimatePresence>
              </div>
              <p className="text-[9px] font-bold text-rose-500/80 tracking-wider uppercase mt-auto text-center">Kazanılan Ömür</p>
            </div>
            {/* Card 4: Unsmoked Cigarettes */}
            <div className="bg-slate-800/40 border border-yellow-500/20 rounded-2xl p-3 h-[110px] flex flex-col relative overflow-hidden">
              <div className="bg-yellow-500/20 size-8 rounded-lg flex items-center justify-center mb-1">
                <Zap className="text-yellow-500" size={16} />
              </div>
              <div className="flex-1 flex flex-col items-center justify-center -mt-1">
                <span className="text-2xl font-bold leading-none">{avoidedCigarettes}</span>
                <span className="text-[8px] font-black uppercase opacity-60">Adet</span>
              </div>
              <p className="text-[9px] font-bold text-yellow-500/80 tracking-wider uppercase mt-auto text-center">İçilmeyen Sigara</p>
            </div>
          </div>
        </section>

        {/* Kriz Sayaç Kartı */}
        <section>
          <div className="bg-slate-800/40 border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-4">
            <div className="bg-emerald-500/20 size-10 rounded-xl flex items-center justify-center">
              <Shield className="text-emerald-500" size={20} />
            </div>
            <div className="flex-1">
              <p className="text-xl font-bold text-white leading-none mb-1">{crisisCount}</p>
              <p className="text-[10px] font-bold text-emerald-500 tracking-wider uppercase">Atlatılan Kriz Sayısı</p>
            </div>
          </div>
        </section>

        {/* Hedeflerim Section */}
        <section className="space-y-3">
          <h3 className="text-[11px] font-bold text-white uppercase tracking-[0.2em] mb-4 px-1">HEDEFLERİM</h3>
          
          <div className="space-y-3">
            {/* Sağlık - Green */}
            <button 
              onClick={() => onNavigate('health_goals')}
              className="w-full bg-slate-800/40 border border-white/5 rounded-[40px] p-4 flex items-center gap-4 hover:bg-slate-800/60 transition-colors group"
            >
              <div className="bg-emerald-500/20 size-14 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/10">
                <Pulse className="text-emerald-500" size={28} />
              </div>
              <div className="flex-1 text-left">
                <h4 className="text-lg font-bold text-white">Sağlık</h4>
                <p className="text-xs text-slate-500 font-medium">Gelişiminizi takip edin</p>
              </div>
              <ChevronRight className="text-slate-600 group-hover:text-slate-400 transition-colors" size={20} />
            </button>

            {/* Tasarruf - Yellow */}
            <button 
              onClick={() => onNavigate('rewards')}
              className="w-full bg-slate-800/40 border border-white/5 rounded-[40px] p-4 flex items-center gap-4 hover:bg-slate-800/60 transition-colors group"
            >
              <div className="bg-yellow-500/20 size-14 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/10">
                <PiggyBank className="text-yellow-500" size={28} />
              </div>
              <div className="flex-1 text-left">
                <h4 className="text-lg font-bold text-white">Tasarruf</h4>
                <p className="text-xs text-slate-500 font-medium">Biriktirdiğiniz miktar</p>
              </div>
              <ChevronRight className="text-slate-600 group-hover:text-slate-400 transition-colors" size={20} />
            </button>

            {/* Rozetler - Blue */}
            <button 
              onClick={() => onNavigate('badges')}
              className="w-full bg-slate-800/40 border border-white/5 rounded-[40px] p-4 flex items-center gap-4 hover:bg-slate-800/60 transition-colors group"
            >
              <div className="bg-blue-600/20 size-14 rounded-full flex items-center justify-center shadow-lg shadow-blue-600/10">
                <Trophy className="text-blue-500" size={28} />
              </div>
              <div className="flex-1 text-left">
                <h4 className="text-lg font-bold text-white">Rozetler</h4>
                <p className="text-xs text-slate-500 font-medium">Kazandığınız başarılar</p>
              </div>
              <ChevronRight className="text-slate-600 group-hover:text-slate-400 transition-colors" size={20} />
            </button>

            {/* Kişisel Hedeflerim - Indigo/Purple */}
            <button 
              onClick={() => {
                if (!isPremium) {
                  onNavigate('premium');
                } else {
                  onNavigate('edit_rewards');
                }
              }}
              className={`w-full ${!isPremium ? 'bg-[#0f172a] opacity-60' : 'bg-slate-800/40 hover:bg-slate-800/60'} border border-white/5 rounded-[40px] p-4 flex items-center gap-4 transition-colors group relative`}
            >
              <div className="bg-indigo-500/20 size-14 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/10">
                <Target className="text-indigo-400" size={28} />
              </div>
              <div className="flex-1 text-left">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  Kişisel Hedeflerim
                  {!isPremium && <Lock size={14} className="text-slate-400" />}
                </h4>
                <p className="text-xs text-slate-500 font-medium">Kendine özel ödüllerini yönet</p>
              </div>
              <ChevronRight className="text-slate-600 group-hover:text-slate-400 transition-colors" size={20} />
            </button>
          </div>
        </section>

        {/* Motivation Message */}
        <div className="mt-6 px-2">
          <div className="bg-blue-600/5 border border-blue-500/10 p-4 rounded-2xl flex items-center gap-4">
            <div className="bg-blue-600/10 size-10 rounded-full flex items-center justify-center shrink-0">
              <span className="text-lg">✨</span>
            </div>
            <p className="text-sm font-medium text-blue-300/80 leading-tight">
              Başaracaksın! <span className="text-blue-500 italic font-bold">Güçlüsün</span>, devam et 💪
            </p>
          </div>
        </div>
      </main>

      <BottomNav onNavigate={onNavigate} activeStep="dashboard" />
    </div>
  );
}
