import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  CircleDollarSign, 
  CheckCircle2, 
  Gift, 
  Zap, 
  ArrowRight,
  Target,
  Award,
  Sparkles
} from 'lucide-react';
import { Step, Reward, OnboardingData } from '../types';
import { SAVINGS_GOALS } from '../constants';
import BottomNav from './BottomNav';
import { BADGES_DATA, BadgeIcon } from './Badges';

const CongratsModal = ({ isOpen, onClose, xp, title, badge }: { isOpen: boolean, onClose: () => void, xp: number, title: string, badge?: any }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-xs bg-slate-800/50 border border-blue-500/30 rounded-3xl p-8 text-center shadow-2xl shadow-blue-500/20"
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

interface CharacterSelectionPageProps {
  onNavigate: (step: Step) => void;
  onSelect: (avatar: string) => void;
}

export function CharacterSelectionPage({ onNavigate, onSelect }: CharacterSelectionPageProps) {
  const avatars = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4,c0aede&radius=50&eyes=default&eyebrows=default&mouth=default',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=b6e3f4,c0aede&radius=50&eyes=default&eyebrows=default&mouth=default',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Milo&backgroundColor=b6e3f4,c0aede&radius=50&eyes=default&eyebrows=default&mouth=default',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna&backgroundColor=b6e3f4,c0aede&radius=50&eyes=default&eyebrows=default&mouth=default',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Oscar&backgroundColor=b6e3f4,c0aede&radius=50&eyes=default&eyebrows=default&mouth=default',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Bella&backgroundColor=b6e3f4,c0aede&radius=50&eyes=default&eyebrows=default&mouth=default',
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 max-w-md mx-auto px-6 py-12 select-none">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-display font-bold tracking-tighter">
          Karakterini <span className="text-blue-400">Seç</span>
        </h1>
        <button 
          onClick={() => onNavigate('profile')}
          className="size-10 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-400"
        >
          <ChevronLeft size={24} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {avatars.map((avatar, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(avatar)}
            className="bg-slate-800/50 border border-white/5 rounded-3xl p-4 flex flex-col items-center gap-4 hover:border-blue-500/30 transition-all group"
          >
            <img src={avatar} alt={`Avatar ${idx}`} className="size-24 rounded-full border-4 border-white/5 group-hover:border-blue-500/30 transition-all" referrerPolicy="no-referrer" />
          </button>
        ))}
      </div>

      <button
        onClick={() => onNavigate('avatar_customizer')}
        className="w-full bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 text-blue-400 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all"
      >
        Kendi Avatarını Oluştur
      </button>
    </div>
  );
}

interface RewardsPageProps {
  onNavigate: (step: Step) => void;
  savedMoney: number;
  savedCigarettes: number;
  claimedGoals: number[];
  onClaimGoalXp: (goalId: number, xp: number, goalTitle?: string) => void;
  claimedBadges: string[];
  onClaimBadge: (badgeId: string) => void;
}

export function RewardsPage({ 
  onNavigate, 
  savedMoney, 
  savedCigarettes,
  claimedGoals,
  onClaimGoalXp,
  claimedBadges,
  onClaimBadge
}: RewardsPageProps) {
  const [showCongrats, setShowCongrats] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<{ xp: number, title: string, badge?: any } | null>(null);

  // Auto-claim XP for completed goals that haven't been claimed yet
  useEffect(() => {
    SAVINGS_GOALS.forEach(goal => {
      const currentValue = goal.type === 'money' ? savedMoney : savedCigarettes;
      const isCompleted = currentValue >= goal.target;
      if (isCompleted && !claimedGoals.includes(goal.id)) {
        onClaimGoalXp(goal.id, goal.xp, goal.title);
      }
    });
  }, [savedMoney, savedCigarettes, claimedGoals, onClaimGoalXp]);

  const handleOpenGoal = (goal: any) => {
    let unlockedBadge = null;
    const newClaimedGoals = [...claimedGoals, goal.id];
    
    // Calculate how many savings goals are claimed
    const savingsClaimedCount = SAVINGS_GOALS.filter(g => newClaimedGoals.includes(g.id)).length;
    const potentialBadge = BADGES_DATA.find(b => b.type === 'savings' && b.target === savingsClaimedCount);
    if (potentialBadge && !claimedBadges.includes(potentialBadge.id)) {
      unlockedBadge = potentialBadge;
    }
    
    // Check for first goal badge
    if (newClaimedGoals.length === 1) {
      const firstGoalBadge = BADGES_DATA.find(b => b.type === 'first_goal');
      if (firstGoalBadge && !claimedBadges.includes(firstGoalBadge.id)) {
        unlockedBadge = firstGoalBadge;
      }
    }

    setSelectedGoal({ xp: goal.xp, title: goal.title, badge: unlockedBadge });
    setShowCongrats(true);
    if (!claimedGoals.includes(goal.id)) {
      onClaimGoalXp(goal.id, goal.xp, goal.title);
    }
    if (unlockedBadge) {
      onClaimBadge(unlockedBadge.id);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 max-w-md mx-auto relative pb-32 select-none">
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
          onClick={() => onNavigate('dashboard')}
          className="p-2 hover:bg-slate-800/50 rounded-full transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-center gap-2">
          <Target size={18} className="text-blue-400" />
          <div>
            <h1 className="text-sm font-bold text-slate-100">Tasarruf Hedefleri</h1>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Kişisel Hedeflerim</p>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Goals List */}
        <section className="space-y-4">
          <div className="space-y-3">
            {SAVINGS_GOALS.map((goal) => {
              const isCompleted = goal.type === 'money' ? savedMoney >= goal.target : savedCigarettes >= goal.target;
              const progress = Math.min(100, ((goal.type === 'money' ? savedMoney : savedCigarettes) / goal.target) * 100);
              const isClaimed = claimedGoals.includes(goal.id);
              const Icon = goal.type === 'money' ? CircleDollarSign : Zap;

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
                          {goal.title}
                        </h4>
                        <span className={`flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${isClaimed ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 bg-slate-800/50'}`}>
                          <Award size={10} /> +{goal.xp} XP
                        </span>
                      </div>
                      {goal.desc && (
                        <p className="text-[11px] text-slate-400 leading-relaxed mb-3 pr-6">
                          {goal.desc}
                        </p>
                      )}
                      
                      {/* Progress Bar */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[9px] font-black uppercase tracking-tighter">
                          <span className={isCompleted ? 'text-blue-400' : 'text-slate-400'}>
                            {isCompleted ? 'TAMAMLANDI' : 'İLERLEME'}
                          </span>
                          <span className={isCompleted ? 'text-blue-400' : 'text-slate-400'}>
                            {goal.type === 'money' ? `₺${Math.floor(savedMoney)} / ₺${goal.target}` : `${Math.floor(savedCigarettes)} / ${goal.target} Adet`}
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
      <BottomNav onNavigate={onNavigate} activeStep="rewards" />
    </div>
  );
}

interface AddRewardPageProps {
  onNavigate: (step: Step) => void;
  onAdd: (reward: Omit<Reward, 'id' | 'currentAmount'>) => void;
}

export function AddRewardPage({ onNavigate, onAdd }: AddRewardPageProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && price) {
      onAdd({ name, price: Number(price) });
      onNavigate('edit_rewards');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 max-w-md mx-auto px-6 py-12 select-none">
      <header className="flex justify-end items-center mb-12">
        <button 
          onClick={() => onNavigate('edit_rewards')}
          className="size-10 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-400"
        >
          <X className="size-6" />
        </button>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">HEDEF ADI</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Örn: Yeni Telefon"
              className="w-full bg-slate-800/50 border border-white/5 rounded-2xl px-6 py-4 text-slate-100 placeholder:text-slate-400/40 focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">FİYAT (TL)</label>
            <input 
              type="number" 
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0"
              className="w-full bg-slate-800/50 border border-white/5 rounded-2xl px-6 py-4 text-slate-100 placeholder:text-slate-400/40 focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white h-16 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
        >
          <span>Hedef Ekle</span>
          <ArrowRight size={20} />
        </button>
      </form>
    </div>
  );
}

interface EditRewardsPageProps {
  onNavigate: (step: Step) => void;
  rewards: Reward[];
  onDelete: (id: string) => void;
  onboardingData: OnboardingData;
  startDate: Date;
  onGoalComplete?: (title: string) => void;
}

export function EditRewardsPage({ onNavigate, rewards, onDelete, onboardingData, startDate, onGoalComplete }: EditRewardsPageProps) {
  const [completedGoals, setCompletedGoals] = useState<string[]>(() => {
    const saved = localStorage.getItem('completed_personal_goals');
    return saved ? JSON.parse(saved) : [];
  });

  const diffSec = Math.floor((Date.now() - startDate.getTime()) / 1000);
  const costPerCigarette = onboardingData.pricePerPack / onboardingData.cigarettesPerPack;
  const dailyCost = onboardingData.dailyCigarettes * costPerCigarette;
  const savedMoney = (diffSec * dailyCost) / 86400;

  React.useEffect(() => {
    rewards.forEach(reward => {
      const isCompleted = savedMoney >= reward.price;
      if (isCompleted && !completedGoals.includes(reward.id)) {
        setCompletedGoals(prev => {
          const next = [...prev, reward.id];
          localStorage.setItem('completed_personal_goals', JSON.stringify(next));
          return next;
        });
        if (onGoalComplete) {
          onGoalComplete(reward.name);
        }
      }
    });
  }, [savedMoney, rewards, completedGoals, onGoalComplete]);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 max-w-md mx-auto px-6 py-12 select-none">
      <header className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <Target size={20} className="text-blue-400" />
          <h1 className="text-sm font-bold text-slate-100 tracking-tight">
            Kişisel Hedeflerim
          </h1>
        </div>
        <button 
          onClick={() => onNavigate('dashboard')}
          className="size-10 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-400"
        >
          <ChevronLeft size={24} />
        </button>
      </header>

      <div className="space-y-4">
        {rewards.map((reward) => {
          const progress = Math.min(100, (savedMoney / reward.price) * 100);
          const isCompleted = savedMoney >= reward.price;
          
          return (
            <div key={reward.id} className="bg-slate-800/50 border border-white/5 rounded-3xl p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-slate-800/50 size-12 rounded-2xl flex items-center justify-center text-slate-400">
                    {reward.icon ? <reward.icon size={24} /> : <Gift size={24} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-100">{reward.name}</h3>
                      <Target size={12} className="text-blue-400/60" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">₺{reward.price}</p>
                  </div>
                </div>
                <button 
                  onClick={() => onDelete(reward.id)}
                  className="size-10 rounded-xl bg-red-600/10 flex items-center justify-center text-red-500 hover:bg-red-600/20 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-wider">
                  <span className={isCompleted ? "text-blue-400" : "text-slate-400"}>
                    {isCompleted ? "TAMAMLANDI" : "İLERLEME"}
                  </span>
                  <span className="text-slate-400">%{Math.floor(progress)}</span>
                </div>
                <div className="h-2 bg-[#0f172a] rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className={`h-full rounded-full ${isCompleted ? 'bg-blue-500 shadow-[0_0_10px_rgba(0,201,255,0.3)]' : 'bg-blue-500'}`}
                  />
                </div>
              </div>
            </div>
          );
        })}

        <button 
          onClick={() => onNavigate('add_reward')}
          className="w-full border-2 border-dashed border-white/5 rounded-3xl p-6 flex flex-col items-center gap-2 text-slate-400 hover:border-blue-500/30 hover:text-blue-400 transition-all mt-4"
        >
          <Plus size={32} />
          <span className="text-xs font-bold uppercase tracking-widest">Yeni Hedef Ekle</span>
        </button>
      </div>
    </div>
  );
}

const X = ({ className, size }: { className?: string, size?: number }) => (
  <svg 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);
