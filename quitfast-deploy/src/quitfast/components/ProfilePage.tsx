import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  ChevronRight, 
  UserCog,
  FileText,
  Crown,
  Zap,
  Lock
} from 'lucide-react';
import { Step, OnboardingData } from '../types';
import { supabase } from '../../lib/supabase-quitfast';
import BottomNav from './BottomNav';
import { BADGES_DATA, BadgeIcon } from './Badges';
import { HEALTH_GOALS, SAVINGS_GOALS } from '../constants';

interface ProfilePageProps {
  onNavigate: (step: Step) => void;
  userAvatar: string;
  currentDay: number;
  userName: string;
  userXp: number;
  onboardingData: OnboardingData;
  completedDays: number[];
  startDate: Date;
  claimedBadges: string[];
}

function getLevelInfo(xp: number) {
  const thresholds = [0, 100, 250, 500, 1000, 2000, 4000, 8000, 15000, 30000];
  const labels = ['Başlangıç', 'Azimli', 'Kararlı', 'Güçlü', 'Savaşçı', 'Kahraman', 'Efsane', 'Usta', 'Şampiyon', 'Özgür'];
  let level = 0;
  for (let i = 0; i < thresholds.length; i++) {
    if (xp >= thresholds[i]) level = i;
    else break;
  }
  const current = thresholds[level];
  const next = thresholds[level + 1] ?? thresholds[thresholds.length - 1];
  const progress = next > current ? Math.min(((xp - current) / (next - current)) * 100, 100) : 100;
  return { level: level + 1, label: labels[level], progress, nextXp: next, currentXp: xp };
}

export default function ProfilePage({ 
  onNavigate, 
  userAvatar, 
  currentDay, 
  userName, 
  userXp,
  onboardingData,
  completedDays,
  startDate,
  claimedBadges
}: ProfilePageProps) {
  const [selectedBadge, setSelectedBadge] = useState<any>(null);

  const diffSec = Math.max(0, Math.floor((Date.now() - startDate.getTime()) / 1000));
  const costPerCigarette = onboardingData.pricePerPack / onboardingData.cigarettesPerPack;
  const dailyCost = onboardingData.dailyCigarettes * costPerCigarette;
  const savedMoney = Math.floor((diffSec * dailyCost) / 86400);
  const savedCigarettes = Math.floor((diffSec * onboardingData.dailyCigarettes) / 86400);
  const lifeMinutesSaved = Math.floor((diffSec * onboardingData.dailyCigarettes * 20) / 86400);
  const hoursPassed = diffSec / 3600;

  const completedHealthCount = HEALTH_GOALS.filter(g => hoursPassed >= g.hours).length;
  const completedSavingsCount = SAVINGS_GOALS.filter(goal => {
    const currentValue = goal.type === 'money' ? savedMoney : savedCigarettes;
    return currentValue >= goal.target;
  }).length;

  const levelInfo = getLevelInfo(userXp);

  const badgesWithStatus = BADGES_DATA.slice(0, 6).map(badge => ({
    ...badge,
    claimed: claimedBadges.includes(badge.id),
  }));

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 max-w-md mx-auto relative overflow-x-hidden font-sans select-none">

      {/* Background glow */}
      <div className="fixed inset-0 max-w-md mx-auto pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 bg-[#0f172a]/80 backdrop-blur-md z-50 border-b border-white/5">
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h1 className="text-2xl font-display font-bold tracking-tight text-slate-100">
            Profil
          </h1>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => onNavigate('premium')}
              className="bg-blue-500 text-on-primary size-10 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,201,255,0.4)] border border-blue-500-container/50 active:scale-95 transition-transform shrink-0"
            >
              <Crown size={20} className="fill-current" />
            </button>
            <button 
              onClick={() => onNavigate('settings')}
              className="bg-slate-800/50 text-slate-400 hover:text-slate-100 size-10 rounded-full flex items-center justify-center transition-colors shrink-0"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Profile Hero */}
      <section className="flex flex-col items-center pt-5 pb-2 px-6 relative z-10">

        {/* Avatar */}
        <motion.div 
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="relative mb-4"
        >
          <div className="w-24 h-24 rounded-full bg-slate-800/50 border-[2.5px] border-blue-500/60 shadow-[0_0_30px_rgba(0,201,255,0.2)] overflow-hidden">
            <img 
              alt="User Profile Picture" 
              className="w-full h-full object-cover" 
              src={userAvatar}
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>

        {/* Name, streak pill, XP */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.35 }}
          className="flex flex-col items-center gap-2 mb-5"
        >
          <h2 className="text-xl font-extrabold text-slate-100">{userName}</h2>

          {/* Streak pill */}
          <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold text-xs tracking-wide">
            🔥 {currentDay}. Gündür Sigarasız
          </span>

          {/* XP compact */}
          <div className="flex items-center gap-1.5">
            <Zap size={11} className="text-blue-400 fill-blue-500" />
            <span className="text-xs font-bold text-blue-400">
              {userXp.toLocaleString()} XP
            </span>
            <span className="text-slate-400/40 text-xs">·</span>
            <span className="text-xs text-slate-400 font-medium">{levelInfo.label}</span>
          </div>
        </motion.div>

        {/* Edit buttons */}
        <motion.div
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.18, duration: 0.35 }}
          className="flex gap-3 w-full mb-2"
        >
          <button 
            onClick={() => onNavigate('character_selection')}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-800/50 border border-white/5 text-slate-400 text-xs font-semibold hover:text-slate-100 hover:border-blue-500/40 hover:bg-slate-800 transition-all active:scale-95"
          >
            <UserCog size={12} />
            Profili Düzenle
          </button>
          <button 
            onClick={() => onNavigate('habit_edit')}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-800/50 border border-white/5 text-slate-400 text-xs font-semibold hover:text-slate-100 hover:border-blue-500/40 hover:bg-slate-800 transition-all active:scale-95"
          >
            <FileText size={12} />
            Alışkanlıklarım
          </button>
        </motion.div>
      </section>

      {/* Badges Section */}
      <section className="px-6 mt-6 mb-6 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-black text-slate-100 uppercase tracking-wide">Rozetlerim</h3>
          <button 
            onClick={() => onNavigate('badges')}
            className="text-blue-400 drop-shadow-[0_0_8px_rgba(0,201,255,0.4)] text-xs font-bold flex items-center gap-0.5 hover:opacity-80 transition-opacity"
          >
            Tümünü Gör <ChevronRight size={13} />
          </button>
        </div>

        <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-5 overflow-x-auto no-scrollbar">
          <div className="flex gap-5">
            {badgesWithStatus.map((badge, i) => {
              const isClaimed = badge.claimed;
              return (
                <motion.button 
                  key={badge.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06 }}
                  onClick={() => setSelectedBadge(badge)}
                  className="flex flex-col items-center gap-2 shrink-0 active:scale-95 transition-transform relative"
                >
                  <div className={`relative transition-all ${!isClaimed ? 'opacity-35 grayscale' : ''}`}>
                    {isClaimed && (
                      <div 
                        className="absolute -inset-1 border-2 border-dashed rounded-full animate-[spin_10s_linear_infinite] z-20 pointer-events-none"
                        style={{ borderColor: `${badge.color}80` }}
                      />
                    )}
                    <BadgeIcon id={badge.id} className="size-14" />
                  </div>

                  {!isClaimed && (
                    <div className="absolute top-0 right-0 bg-slate-800/50est rounded-full p-0.5 border border-white/5">
                      <Lock size={9} className="text-slate-400" />
                    </div>
                  )}

                  <p className={`text-[9px] text-center font-bold tracking-tight whitespace-nowrap ${isClaimed ? 'text-slate-100' : 'text-slate-400/40'}`}>
                    {badge.title}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Badge Detail Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <motion.div
            key={selectedBadge.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0f172a]/90 p-6 will-change-[opacity]"
            onClick={() => setSelectedBadge(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 20, stiffness: 150 }}
              onClick={e => e.stopPropagation()}
              className="bg-slate-800/50 border border-white/5 rounded-3xl p-8 w-full max-w-sm flex flex-col items-center relative overflow-hidden shadow-2xl will-change-transform"
            >
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 blur-2xl rounded-full opacity-10 pointer-events-none"
                style={{ backgroundColor: selectedBadge.color }}
              />
              
              <div className="relative z-20 flex flex-col items-center w-full">
                <h2 className="text-xl font-display font-bold tracking-tighter mb-14 text-center text-slate-100 drop-shadow-lg">
                  {claimedBadges.includes(selectedBadge.id) ? '🏆 ROZET KAZANDIN!' : '🔒 KİLİTLİ ROZET'}
                </h2>
                
                <div className={`relative mb-14 transform scale-[1.5] transition-transform duration-500 ${!claimedBadges.includes(selectedBadge.id) ? 'opacity-40 grayscale' : ''}`}>
                  <BadgeIcon id={selectedBadge.id} className="size-24" />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-100 mb-3 text-center">{selectedBadge.title}</h3>
                
                <p className="text-slate-400 text-center text-sm mb-10 leading-relaxed max-w-[240px]">
                  {claimedBadges.includes(selectedBadge.id) ? (
                    <>
                      Tebrikler!{' '}
                      {selectedBadge.type === 'day' && <><span className="text-slate-100 font-bold">{selectedBadge.day}. gün</span> hedefini tamamlayarak bu özel rozeti kazandın.</>}
                      {selectedBadge.type === 'first_goal' && <>İlk hedefini tamamlayarak bu özel rozeti kazandın.</>}
                      {selectedBadge.type === 'health' && <><span className="text-slate-100 font-bold">{selectedBadge.target}. sağlık hedefini</span> tamamlayarak bu özel rozeti kazandın.</>}
                      {selectedBadge.type === 'savings' && <><span className="text-slate-100 font-bold">{selectedBadge.target}. tasarruf hedefini</span> tamamlayarak bu özel rozeti kazandın.</>}
                      {selectedBadge.type === 'special' && <><span className="text-slate-100 font-bold">1. Aylık programı</span> başarıyla tamamlayarak bu efsanevi rozeti kazandın.</>}
                    </>
                  ) : (
                    <>Bu rozeti henüz kazanmadın. Devam et, yakında senindir!</>
                  )}
                </p>
                
                <button
                  onClick={() => setSelectedBadge(null)}
                  className="w-full py-4 rounded-2xl text-white font-black text-sm shadow-xl transition-all active:scale-95"
                  style={{ 
                    backgroundColor: selectedBadge.color,
                    boxShadow: `0 10px 20px ${selectedBadge.color}30`
                  }}
                >
                  TAMAM
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-20" />
      <BottomNav onNavigate={onNavigate} activeStep="profile" />
    </div>
  );
}
