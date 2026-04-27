import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  CheckCircle2, 
  Lock, 
  Target, 
  Zap, 
  Lightbulb, 
  Brain, 
  ShieldCheck, 
  Home, 
  BookOpen, 
  Trophy,
  Star
} from 'lucide-react';
import { Step, ProgramDay } from '../types';
import { Goal30DIcon } from './Icons';
import BottomNav from './BottomNav';
import { BADGES_DATA, BadgeIcon } from './Badges';

interface ProgramPageProps {
  onNavigate: (step: Step) => void;
  currentDay: number;
  completedDays: number[];
  programDays: ProgramDay[];
  onCompleteDay: (day: number, xp: number) => void;
  userXp: number;
  claimedBadges: string[];
  onClaimBadge: (badgeId: string) => void;
  isPremium: boolean;
}

export default function ProgramPage({ 
  onNavigate, 
  currentDay, 
  completedDays, 
  programDays, 
  onCompleteDay,
  userXp,
  claimedBadges,
  onClaimBadge,
  isPremium
}: ProgramPageProps) {
  const [selectedDay, setSelectedDay] = useState(currentDay);
  const [showSurvey, setShowSurvey] = useState(false);
  const [earnedXp, setEarnedXp] = useState<number | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<any>(null);
  const [surveyAnswers, setSurveyAnswers] = useState({
    task: null as 'yes' | 'no' | 'little' | null,
    smoke: null as 'no' | 'little' | 'yes' | null
  });

  useEffect(() => {
    if (earnedXp !== null) {
      const timer = setTimeout(() => {
        setEarnedXp(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [earnedXp]);

  const currentDayData = programDays.find(d => d.day === selectedDay) || programDays[0];
  const isCompleted = completedDays.includes(selectedDay);
  const isLocked = !isPremium && selectedDay > currentDay;

  const handleSurveySubmit = () => {
    if (surveyAnswers.task && surveyAnswers.smoke) {
      let xp = 0;
      
      // Task XP
      if (surveyAnswers.task === 'yes') xp += 50;
      else if (surveyAnswers.task === 'little') xp += 30;
      
      // Smoke XP
      if (surveyAnswers.smoke === 'no') xp += 50;
      else if (surveyAnswers.smoke === 'little') xp += 30;

      onCompleteDay(selectedDay, xp);
      setEarnedXp(xp);
      setShowSurvey(false);
      setSurveyAnswers({ task: null, smoke: null });
    }
  };

  const handleClaimBadge = (badge: any) => {
    setSelectedBadge(badge);
    onClaimBadge(badge.id);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 max-w-md mx-auto relative pb-32">
      {/* XP Toast Notification */}
      <AnimatePresence>
        {earnedXp !== null && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] w-[200px]"
          >
            <div className="bg-emerald-500 text-white rounded-full py-3 px-6 flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/30 border border-white/20">
              <div className="bg-white/20 p-1 rounded-full">
                <Star size={16} fill="currentColor" />
              </div>
              <span className="font-black text-sm">+{earnedXp} XP KAZANDIN!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Survey Modal */}
      {showSurvey && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-[#0f172a] border border-white/10 rounded-[32px] w-full p-8 space-y-8 shadow-2xl">
            <div className="text-center space-y-2">
              <div className="bg-blue-500/20 size-16 rounded-3xl flex items-center justify-center text-blue-400 mx-auto mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-black italic text-white">
                Günlük Değerlendirme
              </h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">GÜN {selectedDay}</p>
            </div>

            <div className="space-y-6">
              {/* Question 1 */}
              <div className="space-y-4">
                <p className="text-sm font-bold text-slate-300">Bugünkü görevini tamamladın mı?</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'yes', label: 'Evet', xp: '+50' },
                    { id: 'little', label: 'Biraz', xp: '+30' },
                    { id: 'no', label: 'Hayır', xp: '+0' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setSurveyAnswers(prev => ({ ...prev, task: opt.id as any }))}
                      className={`py-3 rounded-2xl border transition-all flex flex-col items-center gap-1 ${
                        surveyAnswers.task === opt.id 
                          ? 'bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/20' 
                          : 'bg-slate-800/50 border-white/5 text-slate-400'
                      }`}
                    >
                      <span className="text-xs font-black">{opt.label}</span>
                      <span className="text-[8px] font-bold opacity-60">{opt.xp} XP</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2 */}
              <div className="space-y-4">
                <p className="text-sm font-bold text-slate-300">Bugün hiç sigara içtin mi?</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'no', label: 'İçmedim', xp: '+50' },
                    { id: 'little', label: 'Az İçtim', xp: '+30' },
                    { id: 'yes', label: 'İçtim', xp: '+0' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setSurveyAnswers(prev => ({ ...prev, smoke: opt.id as any }))}
                      className={`py-3 rounded-2xl border transition-all flex flex-col items-center gap-1 ${
                        surveyAnswers.smoke === opt.id 
                          ? 'bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/20' 
                          : 'bg-slate-800/50 border-white/5 text-slate-400'
                      }`}
                    >
                      <span className="text-xs font-black">{opt.label}</span>
                      <span className="text-[8px] font-bold opacity-60">{opt.xp} XP</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button 
                onClick={() => setShowSurvey(false)}
                className="flex-1 py-4 rounded-2xl bg-slate-800/50 text-slate-400 font-black text-sm"
              >
                İPTAL
              </button>
              <button 
                onClick={handleSurveySubmit}
                disabled={!surveyAnswers.task || !surveyAnswers.smoke}
                className="flex-[2] py-4 rounded-2xl bg-blue-500 text-white font-black text-sm shadow-xl shadow-blue-500/20 disabled:opacity-50 disabled:grayscale"
              >
                KAYDET VE TAMAMLA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 bg-[#0f172a]/80 backdrop-blur-md z-50 border-b border-white/5">
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div className="size-10"></div>

          <div className="flex flex-col items-center gap-1">
            <h1 className="text-xl font-bold tracking-tight text-white font-sans">
              30 Günlük Program
            </h1>
            <div className="flex items-center gap-1.5">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-blue-500/60" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-400/70">
                Sigarayı Bırakma Yolculuğun
              </span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-blue-500/60" />
            </div>
          </div>

          <div className="size-10" />
        </div>
      </header>

      <main className="px-6 space-y-8">
        {/* Days Horizontal Scroll */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar py-4 -mx-6 px-6 items-center">
          {programDays.map((d) => {
            const isDayCompleted = completedDays.includes(d.day);
            const isDaySelected = selectedDay === d.day;
            const isDayLocked = !isPremium && d.day > 1;
            
            const badgesForDay = BADGES_DATA.filter(b => b.day === d.day);

            return (
              <React.Fragment key={d.day}>
                <button
                  onClick={() => {
                    if (isDayLocked) {
                      onNavigate('premium');
                    } else {
                      setSelectedDay(d.day);
                    }
                  }}
                  className={`flex-shrink-0 size-14 rounded-2xl flex flex-col items-center justify-center transition-all border relative ${
                    isDaySelected 
                      ? 'bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/20 scale-110' 
                      : isDayCompleted 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' 
                        : isDayLocked
                          ? 'bg-[#0f172a]/20 border-white/5 text-slate-600 opacity-50'
                          : 'bg-slate-800/50/40 border-white/5 text-slate-400'
                  }`}
                >
                  {isDayLocked ? (
                    <Lock size={14} />
                  ) : (
                    <>
                      <span className="text-[10px] font-black uppercase tracking-tighter">GÜN</span>
                      <span className="text-lg font-black">{d.day}</span>
                    </>
                  )}
                  {isDayCompleted && !isDaySelected && (
                    <div className="absolute -top-1 -right-1 bg-emerald-500 rounded-full p-0.5 border-2 border-[#0f172a]">
                      <CheckCircle2 size={10} className="text-white" />
                    </div>
                  )}
                </button>

                {badgesForDay.map(badge => {
                  const isBadgeClaimed = claimedBadges.includes(badge.id);
                  const isBadgeUnlocked = completedDays.includes(badge.day!);

                  return (
                    <div key={badge.id} className="flex-shrink-0 flex flex-col items-center gap-1 px-1">
                      <button
                        disabled={!isBadgeUnlocked || isBadgeClaimed}
                        onClick={() => isBadgeUnlocked && !isBadgeClaimed && handleClaimBadge(badge)}
                        className={`size-12 rounded-full flex items-center justify-center transition-all relative ${
                          isBadgeClaimed 
                            ? '' 
                            : isBadgeUnlocked
                              ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-[#0f172a]'
                              : 'opacity-40 grayscale'
                        }`}
                      >
                        {isBadgeClaimed ? (
                          <BadgeIcon id={badge.id} className="size-12" />
                        ) : (
                          <div className="size-10 rounded-full bg-slate-800/50/80 border-2 border-slate-700 flex items-center justify-center">
                            <Lock size={14} className="text-slate-500" />
                          </div>
                        )}
                      </button>
                      
                      {isBadgeUnlocked && !isBadgeClaimed ? (
                        <button 
                          onClick={() => handleClaimBadge(badge)}
                          className="text-[7px] font-black text-blue-400 uppercase animate-bounce mt-0.5 animate-pulse"
                        >
                          Ödülü Al
                        </button>
                      ) : (
                        <span className={`text-[8px] font-bold uppercase tracking-tighter ${isBadgeClaimed ? 'text-white' : 'text-slate-600'}`}>
                          {badge.title}
                        </span>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            );
          })}
        </div>

        {/* Day Content */}
        <div className="space-y-6">
          <div className="bg-slate-800/50/40 rounded-3xl p-6 border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-3xl -mr-16 -mt-16"></div>
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-blue-500/20 size-12 rounded-2xl flex items-center justify-center text-blue-400">
                <Target size={24} />
              </div>
              <div>
                  <h2
                    className="text-2xl font-black text-white leading-tight"
                    style={{ textShadow: '0 0 20px rgba(56,189,248,0.25)' }}
                  >
                    {currentDayData.title}
                  </h2>
                  <p
                    className="text-[10px] font-black uppercase tracking-[0.25em] mt-0.5"
                    style={{
                      background: 'linear-gradient(90deg, #38bdf8, #257bf4)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      filter: 'drop-shadow(0 0 6px rgba(56,189,248,0.6))'
                    }}
                  >
                    GÜN {selectedDay} HEDEFİ
                  </p>
                </div>
            </div>

            {isLocked ? (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <div className="bg-[#0f172a]/50 size-16 rounded-full flex items-center justify-center text-slate-600 border-2 border-white/5">
                  <Lock size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Bu Gün Henüz Kilitli</h3>
                  <p className="text-sm text-slate-500 max-w-[200px] mx-auto">Bu hedefe ulaşmak için önceki günü tamamlamanız gerekiyor.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <div
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider"
                    style={{
                      background: 'linear-gradient(90deg, #34d399, #10b981)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      filter: 'drop-shadow(0 0 5px rgba(52,211,153,0.5))'
                    }}
                  >
                    Bilimsel Durum
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed font-medium">{currentDayData.scientificStatus}</p>
                </div>

                <div className="space-y-2">
                  <div
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider"
                    style={{
                      background: 'linear-gradient(90deg, #38bdf8, #257bf4)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      filter: 'drop-shadow(0 0 5px rgba(56,189,248,0.6))'
                    }}
                  >
                    <Zap size={12} className="text-blue-400 shrink-0" /> Günlük Görev
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
                    <p className="text-sm text-white font-bold leading-relaxed">{currentDayData.task}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#0f172a]/40 rounded-2xl p-4 border border-white/5">
                    <div
                      className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider mb-2"
                      style={{
                        background: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        filter: 'drop-shadow(0 0 4px rgba(251,191,36,0.5))'
                      }}
                    >
                      <Lightbulb size={12} className="text-yellow-400 shrink-0" /> Öneri
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-medium">{currentDayData.suggestion}</p>
                  </div>
                  <div className="bg-[#0f172a]/40 rounded-2xl p-4 border border-white/5">
                    <div
                      className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider mb-2"
                      style={{
                        background: 'linear-gradient(90deg, #fb7185, #f43f5e)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        filter: 'drop-shadow(0 0 4px rgba(251,113,133,0.5))'
                      }}
                    >
                      <Brain size={12} className="text-rose-400 shrink-0" /> İpucu
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-medium">{currentDayData.tip}</p>
                  </div>
                </div>

                <button 
                  onClick={() => setShowSurvey(true)}
                  disabled={isCompleted}
                  className={`w-full py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-xl ${
                    isCompleted 
                      ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 cursor-default' 
                      : 'bg-blue-500 hover:bg-blue-500/90 text-white shadow-blue-500/20 active:scale-[0.98]'
                  }`}
                >
                  {isCompleted ? (
                    <>
                      <ShieldCheck size={24} />
                      <span>TAMAMLANDI</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={24} />
                      <span>GÖREVİ TAMAMLA</span>
                    </>
                  )}
                </button>

                {/* Achievements for specific days */}
                {(() => {
                  const badgesForDay = BADGES_DATA.filter(b => b.day === selectedDay);
                  if (badgesForDay.length === 0) return null;

                  return (
                    <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider"
                          style={{
                            background: 'linear-gradient(90deg, #38bdf8, #a78bfa)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            filter: 'drop-shadow(0 0 6px rgba(56,189,248,0.5))'
                          }}
                        >
                          <Trophy size={12} className="text-blue-400 shrink-0" /> Özel Başarı
                        </div>
                      </div>
                      
                      {badgesForDay.map(badge => {
                        const isUnlocked = completedDays.includes(badge.day!);
                        const isClaimed = claimedBadges.includes(badge.id);
                        
                        return (
                          <div key={badge.id} className={`relative overflow-hidden rounded-3xl border p-5 transition-all ${
                            isClaimed 
                              ? 'bg-slate-800/50/40 border-blue-500/20' 
                              : isUnlocked
                                ? 'bg-blue-500/5 border-blue-500/30'
                                : 'bg-[#0f172a]/20 border-white/5 opacity-60'
                          }`}>
                            <div className="flex items-center gap-4">
                              <div className={`${isClaimed || isUnlocked ? 'bg-blue-500/10' : 'bg-slate-700'} size-16 rounded-2xl flex items-center justify-center shadow-lg relative`}>
                                {isClaimed ? (
                                  <BadgeIcon id={badge.id} className="size-16" />
                                ) : (
                                  <div className="relative">
                                    <BadgeIcon id={badge.id} className="size-16 opacity-20 grayscale" />
                                    <Lock className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-500" size={24} />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className="text-sm font-black text-white mb-1">{badge.title}</h4>
                                <p className="text-[10px] font-medium text-slate-400 leading-tight">
                                  {isClaimed 
                                    ? 'Bu rozeti başarıyla kazandın!' 
                                    : isUnlocked 
                                      ? 'Tebrikler! Rozetin kilidi açıldı.' 
                                      : 'Bu günün hedefini tamamlayarak rozeti kazan.'}
                                </p>
                              </div>
                              {isUnlocked && !isClaimed && (
                                <button 
                                  onClick={() => handleClaimBadge(badge)}
                                  className="bg-blue-500 text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase shadow-lg shadow-blue-500/20"
                                >
                                  Ödülü Al
                                </button>
                              )}
                              {isClaimed && (
                                <div className="bg-emerald-500/20 text-emerald-500 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase">
                                  ALINDI
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      </main>

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
              className="bg-slate-800/50 border border-white/10 rounded-3xl p-8 w-full max-w-sm flex flex-col items-center relative overflow-hidden shadow-2xl will-change-transform"
            >
              {/* Glow effect - simplified */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 blur-2xl rounded-full pointer-events-none"></div>
              
              <h2 className="text-2xl font-black italic tracking-tighter mb-8 relative z-10 text-center text-white">
                YENİ ROZET KAZANDIN!
              </h2>
              
              <div className="relative z-10 mb-8 transform scale-150 transition-transform duration-500">
                <BadgeIcon id={selectedBadge.id} className="size-24" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2 relative z-10">{selectedBadge.title}</h3>
              <p className="text-slate-400 text-center text-sm mb-8 relative z-10 leading-relaxed">
                Tebrikler!{' '}
                {selectedBadge.type === 'day' && (
                  <><span className="text-white font-bold">{selectedBadge.day}. gün</span> hedefini tamamlayarak bu özel rozeti kazandın.</>
                )}
                {selectedBadge.type === 'first_goal' && (
                  <>İlk hedefini tamamlayarak bu özel rozeti kazandın.</>
                )}
                {selectedBadge.type === 'health' && (
                  <><span className="text-white font-bold">{selectedBadge.target}. sağlık hedefini</span> tamamlayarak bu özel rozeti kazandın.</>
                )}
                {selectedBadge.type === 'savings' && (
                  <><span className="text-white font-bold">{selectedBadge.target}. tasarruf hedefini</span> tamamlayarak bu özel rozeti kazandın.</>
                )}
              </p>
              
              <button
                onClick={() => setSelectedBadge(null)}
                className="w-full py-4 rounded-2xl bg-blue-500 text-white font-black text-sm shadow-xl shadow-blue-500/20 relative z-10 transition-all active:scale-95"
              >
                TAMAM
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav onNavigate={onNavigate} activeStep="program" />
    </div>
  );
}
