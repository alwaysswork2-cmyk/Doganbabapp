import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  Lock,
  Trophy,
  Sparkles,
  Shield,
  Heart,
  Zap,
  Award
} from 'lucide-react';
import { Step } from '../types';
import BottomNav from './BottomNav';
import { BADGES_DATA, BadgeIcon } from './Badges';

interface BadgesPageProps {
  onNavigate: (step: Step) => void;
  claimedBadges: string[];
}

export default function BadgesPage({ 
  onNavigate, 
  claimedBadges
}: BadgesPageProps) {
  const [selectedBadge, setSelectedBadge] = useState<any>(null);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 max-w-md mx-auto relative pb-32 overflow-x-hidden font-sans select-none">
      {/* Header Section */}
      <header className="flex items-center justify-between p-6 sticky top-0 bg-[#0f172a]/80 backdrop-blur-xl z-30">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('back' as any)}
            className="p-2 rounded-full hover:bg-slate-800/50 transition-colors"
          >
            <ChevronLeft size={24} className="text-slate-100" />
          </button>
          <h1 className="text-2xl font-bold tracking-tight">Rozetlerim</h1>
        </div>
        <div className="p-2 bg-blue-500/10 rounded-full">
          <Award size={24} className="text-blue-400" />
        </div>
      </header>

      {/* Stats Summary */}
      <section className="px-6 mb-8">
        <div className="bg-slate-800/50 border border-white/5 p-6 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Trophy size={80} className="text-slate-100" />
          </div>
          <div className="relative z-10">
            <p className="text-slate-400 text-sm font-medium mb-1">Toplam Kazanılan</p>
            <h2 className="text-3xl font-black text-slate-100 flex items-baseline gap-2">
              {claimedBadges.length} <span className="text-slate-400 text-lg font-bold">/ {BADGES_DATA.length}</span>
            </h2>
            <div className="mt-4 w-full bg-slate-800/50est h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 shadow-[0_0_10px_rgba(0,201,255,0.5)] transition-all duration-1000"
                style={{ width: `${(claimedBadges.length / BADGES_DATA.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* Badges Grid */}
      <section className="px-6 pb-24">
        <div className="grid grid-cols-3 gap-y-10 gap-x-4">
          {BADGES_DATA.map((badge) => {
            const isClaimed = claimedBadges.includes(badge.id);

            return (
              <button 
                key={badge.id} 
                onClick={() => isClaimed && setSelectedBadge(badge)}
                className={`flex flex-col items-center gap-3 relative group transition-transform active:scale-95 ${!isClaimed ? 'cursor-default' : ''}`}
              >
                <div className="relative">
                  {isClaimed && (
                    <div 
                      className="absolute -inset-1 border-2 border-dashed rounded-full animate-[spin_10s_linear_infinite] z-20 pointer-events-none will-change-transform"
                      style={{ borderColor: `${badge.color}80` }}
                    ></div>
                  )}
                  <div className={!isClaimed ? 'opacity-20 grayscale' : ''}>
                    <BadgeIcon id={badge.id} className="size-16" />
                  </div>
                  {!isClaimed && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <Lock size={20} className="text-slate-400" />
                    </div>
                  )}
                  {isClaimed && (
                    <div 
                      className="absolute -inset-1 blur-sm rounded-full -z-10"
                      style={{ backgroundColor: `${badge.color}10` }}
                    ></div>
                  )}
                </div>
                <div className="flex flex-col items-center">
                  <p className={`text-[10px] text-center font-bold tracking-tight transition-colors ${isClaimed ? 'text-slate-100 group-hover:text-blue-400' : 'text-slate-400/60'}`}>
                    {badge.title}
                  </p>
                  {!isClaimed && badge.day && (
                    <span className="text-[8px] text-slate-400/40 mt-0.5 font-black uppercase tracking-widest">
                      {badge.day}. GÜN
                    </span>
                  )}
                </div>
              </button>
            );
          })}
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
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 20, stiffness: 150 }}
              className="bg-slate-800/50 border border-white/5 rounded-3xl p-8 w-full max-w-sm flex flex-col items-center relative overflow-hidden shadow-2xl will-change-transform"
            >
              {/* Glow effect - simplified for performance */}
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 blur-2xl rounded-full opacity-10 pointer-events-none"
                style={{ backgroundColor: selectedBadge.color }}
              ></div>
              
              <div className="relative z-20 flex flex-col items-center w-full">
                <h2 className="text-2xl font-display font-bold tracking-tighter mb-14 text-center text-slate-100 drop-shadow-lg">
                  ROZET DETAYI
                </h2>
                
                <div className="relative mb-14 transform scale-[1.5] transition-transform duration-500">
                  <BadgeIcon id={selectedBadge.id} className="size-24" />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-100 mb-3 text-center">{selectedBadge.title}</h3>
                
                <p className="text-slate-400 text-center text-sm mb-10 leading-relaxed max-w-[240px]">
                  {selectedBadge.type === 'day' && (
                    <><span className="text-slate-100 font-bold">{selectedBadge.day}. gün</span> hedefini tamamlayarak bu özel rozeti kazandın.</>
                  )}
                  {selectedBadge.type === 'first_goal' && (
                    <>İlk hedefini tamamlayarak bu özel rozeti kazandın.</>
                  )}
                  {selectedBadge.type === 'health' && (
                    <><span className="text-slate-100 font-bold">{selectedBadge.target}. sağlık hedefini</span> tamamlayarak bu özel rozeti kazandın.</>
                  )}
                  {selectedBadge.type === 'savings' && (
                    <><span className="text-slate-100 font-bold">{selectedBadge.target}. tasarruf hedefini</span> tamamlayarak bu özel rozeti kazandın.</>
                  )}
                  {selectedBadge.type === 'special' && (
                    <><span className="text-slate-100 font-bold">1. Aylık programı</span> başarıyla tamamlayarak bu efsanevi rozeti kazandın.</>
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
                  KAPAT
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav onNavigate={onNavigate} activeStep="badges" />
    </div>
  );
}
