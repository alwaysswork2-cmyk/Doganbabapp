import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Target, Award, CheckCircle2, X, Sparkles } from 'lucide-react';
import { Step } from '../types';
import { NICOTINE_GOALS, HEALTH_GOALS } from '../constants';
import { BADGES_DATA, BadgeIcon } from './Badges';

interface GoalsPageProps {
  onNavigate: (step: Step) => void;
  startDate: Date;
  userXp: number;
  category: 'nicotine' | 'health';
  claimedGoals: number[];
  onClaimGoalXp: (goalId: number, xp: number, goalTitle?: string) => void;
  claimedBadges: string[];
  onClaimBadge: (badgeId: string) => void;
}

const CongratsModal = ({ isOpen, onClose, xp, title, badge }: { isOpen: boolean, onClose: () => void, xp: number, title: string, badge?: any }) => (
  <AnimatePresence>
    {isOpen && (
      <div key={badge?.id || title} className="fixed inset-0 z-[100] flex items-center justify-center p-6 will-change-[opacity]">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#0f172a]/90"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 20, stiffness: 150 }}
          className="relative w-full max-w-xs bg-slate-800/50 border border-blue-500/30 rounded-3xl p-8 text-center shadow-2xl shadow-blue-500/20 will-change-transform"
        >
          <div className="absolute -top-12 left-1/2 -translate-x-1/2">
            <div className="bg-blue-500 size-24 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/40">
              <Award size={48} className="text-on-primary" />
            </div>
          </div>
          
          <div className="mt-12 space-y-4">
            <h2 className="text-lg font-bold text-slate-100 tracking-tight">Tebrikler!</h2>
            {badge ? (
              <>
                <p className="text-slate-400 text-xs font-medium">
                  <span className="text-blue-400 font-bold">{badge.title}</span> rozetini kazandınız!
                </p>
                <div className="flex justify-center my-4">
                  <BadgeIcon id={badge.id} className="size-20" />
                </div>
              </>
            ) : (
              <p className="text-slate-400 text-xs font-medium">
                <span className="text-blue-400 font-bold">{title}</span> hedefini başarıyla tamamladın!
              </p>
            )}
            
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl py-4 px-6 inline-block">
              <div className="flex items-center justify-center gap-2">
                <Sparkles size={20} className="text-blue-400" />
                <span className="text-2xl font-black text-blue-400">+{xp} XP</span>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-2xl transition-all shadow-lg shadow-blue-500/20 mt-4 text-sm"
            >
              Harika!
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export default function GoalsPage({ 
  onNavigate, 
  startDate, 
  category, 
  claimedGoals, 
  onClaimGoalXp,
  claimedBadges,
  onClaimBadge
}: GoalsPageProps) {
  const [showCongrats, setShowCongrats] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<{ xp: number, title: string, badge?: any } | null>(null);
  
  const now = new Date();
  const diffMs = now.getTime() - startDate.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  const goals = category === 'nicotine' ? NICOTINE_GOALS : HEALTH_GOALS;
  const title = category === 'nicotine' ? 'Nikotin Temizliği' : 'Sağlık Gelişimi';

  // Auto-claim XP for completed goals that haven't been claimed yet
  useEffect(() => {
    goals.forEach(goal => {
      const isCompleted = diffHours >= goal.hours;
      if (isCompleted && !claimedGoals.includes(goal.id)) {
        onClaimGoalXp(goal.id, goal.xp, goal.time);
      }
    });
  }, [diffHours, goals, claimedGoals, onClaimGoalXp]);

  const handleOpenGoal = (goal: any) => {
    let unlockedBadge = null;
    const newClaimedGoals = [...claimedGoals, goal.id];
    
    if (category === 'health') {
      const healthClaimedCount = HEALTH_GOALS.filter(g => newClaimedGoals.includes(g.id)).length;
      const potentialBadge = BADGES_DATA.find(b => b.type === 'health' && b.target === healthClaimedCount);
      if (potentialBadge && !claimedBadges.includes(potentialBadge.id)) {
        unlockedBadge = potentialBadge;
      }
    }
    
    if (newClaimedGoals.length === 1) {
      const firstGoalBadge = BADGES_DATA.find(b => b.type === 'first_goal');
      if (firstGoalBadge && !claimedBadges.includes(firstGoalBadge.id)) {
        unlockedBadge = firstGoalBadge;
      }
    }

    setSelectedGoal({ xp: goal.xp, title: goal.time, badge: unlockedBadge });
    setShowCongrats(true);
    if (!claimedGoals.includes(goal.id)) {
      onClaimGoalXp(goal.id, goal.xp, goal.time);
    }
    if (unlockedBadge) {
      onClaimBadge(unlockedBadge.id);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 max-w-md mx-auto relative pb-10 select-none">
      <CongratsModal 
        isOpen={showCongrats} 
        onClose={() => setShowCongrats(false)} 
        xp={selectedGoal?.xp || 0} 
        title={selectedGoal?.title || ''} 
        badge={selectedGoal?.badge}
      />
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0f172a]/80 backdrop-blur-md px-4 py-4 border-b border-white/5 flex items-center gap-4">
        <button 
          onClick={() => onNavigate('back' as any)}
          className="p-2 hover:bg-slate-800/50 rounded-full transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-center gap-2">
          <Target size={18} className="text-blue-400" />
          <div>
            <h1 className="text-sm font-bold text-slate-100">{title}</h1>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Kişisel Hedeflerim</p>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Goals List */}
        <section className="space-y-4">
          <div className="space-y-3">
            {goals.map((goal) => {
              const isCompleted = diffHours >= goal.hours;
              const progress = Math.min(100, (diffHours / goal.hours) * 100);
              const Icon = goal.icon;
              const isClaimed = claimedGoals.includes(goal.id);

              return (
                <motion.div 
                  key={goal.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-slate-800/50 border ${isCompleted ? 'border-blue-500/30' : 'border-white/5'} rounded-2xl p-4 transition-all relative overflow-hidden`}
                >
                  {isCompleted && (
                    <div className="absolute top-0 right-0 p-3">
                      <CheckCircle2 size={16} className="text-blue-400" />
                    </div>
                  )}
                  
                  <div className="flex items-start gap-4">
                    <div className={`${isCompleted ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800/50 text-slate-400'} p-2.5 rounded-xl shrink-0`}>
                      <Icon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className={`text-sm font-bold ${isCompleted ? 'text-blue-400' : 'text-slate-100'}`}>
                          {goal.time}
                        </h4>
                        <span className={`flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${isClaimed ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 bg-slate-800/50'}`}>
                          <Award size={10} /> +{goal.xp} XP
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed mb-3 pr-6">
                        {goal.description}
                      </p>
                      
                      {/* Progress Bar */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[9px] font-black uppercase tracking-tighter">
                          <span className={isCompleted ? 'text-blue-400' : 'text-slate-400'}>
                            {isCompleted ? 'TAMAMLANDI' : 'İLERLEME'}
                          </span>
                          <span className={isCompleted ? 'text-blue-400' : 'text-slate-400'}>
                            {Math.round(progress)}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-[#0f172a] rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className={`h-full ${isCompleted ? 'bg-blue-500 shadow-[0_0_8px_rgba(0,201,255,0.4)]' : 'bg-blue-500/60'}`}
                          />
                        </div>
                      </div>
                      
                      {isCompleted && !isClaimed && (
                        <div className="mt-4 flex justify-end">
                          <button 
                            onClick={() => handleOpenGoal(goal)}
                            className="text-[11px] font-bold text-blue-400 hover:text-blue-400 transition-colors bg-blue-500/10 px-4 py-2 rounded-xl border border-blue-500/20 flex items-center gap-1.5"
                          >
                            <Sparkles size={14} />
                            Şimdi Aç
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
