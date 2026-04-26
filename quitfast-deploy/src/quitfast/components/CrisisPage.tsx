import React, { useState, useCallback, memo, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { 
  Timer, ZapOff, Wind, Footprints, ShieldCheck,
  Sparkles, Lightbulb, Cloud, ChevronRight, Shield, Puzzle
} from 'lucide-react';
import { Step } from '../types';
import BottomNav from './BottomNav';
import CrisisOverlay from './CrisisOverlay';

interface CrisisPageProps {
  onNavigate: (step: Step) => void;
  crisisCount: number;
  setCrisisCount: React.Dispatch<React.SetStateAction<number>>;
  isPremium: boolean;
}

const techniques = [
  {
    id: '4d', title: "4D Tekniği", description: "Erteleyerek krizi atla",
    icon: Timer,
    gradient: "from-emerald-500/25 to-teal-500/15", border: "border-emerald-500/30",
    iconBg: "from-emerald-500 to-teal-400", textColor: "text-emerald-300",
  },
  {
    id: 'trigger', title: "Tetikleyici Değiştir", description: "İsteği farklı yöne çek",
    icon: ZapOff,
    gradient: "from-purple-500/25 to-fuchsia-500/15", border: "border-purple-500/30",
    iconBg: "from-purple-500 to-fuchsia-400", textColor: "text-purple-300",
  },
  {
    id: 'breathing', title: "Derin Nefes", description: "Nefesle sakinleş",
    icon: Wind,
    gradient: "from-blue-500/25 to-cyan-500/15", border: "border-blue-500/30",
    iconBg: "from-blue-500 to-cyan-400", textColor: "text-blue-300",
  },
  {
    id: 'walk', title: "Yürüyüş", description: "Hareketle dağıt",
    icon: Footprints,
    gradient: "from-amber-500/25 to-yellow-500/15", border: "border-amber-500/30",
    iconBg: "from-amber-500 to-yellow-400", textColor: "text-amber-300",
  },
  {
    id: 'suppress', title: "Nikotini Bastır", description: "Bağımlılığa karşı dur",
    icon: ShieldCheck,
    gradient: "from-rose-500/25 to-red-500/15", border: "border-rose-500/30",
    iconBg: "from-rose-500 to-red-400", textColor: "text-rose-300",
  },
  {
    id: 'motivation', title: "Motivasyon Al", description: "Kendini güçlendir",
    icon: Sparkles,
    gradient: "from-violet-500/25 to-indigo-500/15", border: "border-violet-500/30",
    iconBg: "from-violet-500 to-indigo-400", textColor: "text-violet-300",
  },
  {
    id: 'suggestion', title: "Öneri Al", description: "Durumuna özel çözüm",
    icon: Lightbulb,
    gradient: "from-orange-500/25 to-amber-500/15", border: "border-orange-500/30",
    iconBg: "from-orange-500 to-amber-400", textColor: "text-orange-300",
  },
  {
    id: 'air', title: "İstek Sörfü Yap", description: "İsteği gözlemle, geç",
    icon: Cloud,
    gradient: "from-sky-500/25 to-blue-500/15", border: "border-sky-500/30",
    iconBg: "from-sky-500 to-blue-400", textColor: "text-sky-300",
  },
  {
    id: 'puzzle', title: "Kafa Dağıt", description: "Zincirleri kırarak uzaklaş",
    icon: Puzzle,
    gradient: "from-pink-500/25 to-rose-500/15", border: "border-pink-500/30",
    iconBg: "from-pink-500 to-rose-400", textColor: "text-pink-300",
  },
];

// Sade Kwit tarzı kart — scale animasyonu
const TechCard = memo(({ tech, index, onClick, isLocked }: {
  tech: typeof techniques[0];
  index: number;
  onClick: (id: string) => void;
  isLocked?: boolean;
}) => {
  const Icon = tech.icon;
  
  // React Native Reanimated'a benzer şekilde scale değerini yönetiyoruz
  const scale = useMotionValue(1);
  const animatedScale = useSpring(scale, { stiffness: 400, damping: 25 });

  return (
    <motion.div
      style={{ scale: animatedScale }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut", delay: index * 0.04 }}
      className="will-change-transform"
    >
      <button
        onPointerDown={() => scale.set(1.05)}
        onPointerUp={() => scale.set(1)}
        onPointerLeave={() => scale.set(1)}
        onPointerCancel={() => scale.set(1)}
        onTouchStart={() => scale.set(1.05)}
        onTouchEnd={() => scale.set(1)}
        onTouchCancel={() => scale.set(1)}
        onClick={() => onClick(tech.id)}
        className={`
          w-full h-full
          relative bg-gradient-to-br ${tech.gradient}
          border ${tech.border}
          rounded-2xl p-4 flex flex-col items-start gap-3
          shadow-lg text-left overflow-hidden
          cursor-pointer select-none
        `}
      >
        {/* Köşe parlaklığı — statik, animasyonsuz */}
        <div className="absolute top-0 right-0 w-16 h-16 rounded-full blur-2xl opacity-25 bg-slate-700 pointer-events-none" />

        {/* İkon */}
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${tech.iconBg} flex items-center justify-center shadow-lg relative z-10`}>
          {isLocked ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400/80"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          ) : (
            <Icon size={22} className="text-white" strokeWidth={2} />
          )}
        </div>

        {/* Metin */}
        <div className="flex-1 w-full relative z-10">
          <p className="text-sm font-black text-white leading-tight mb-0.5">{tech.title}</p>
          <p className={`text-[11px] font-medium ${tech.textColor} opacity-80 leading-snug`}>
            {tech.description}
          </p>
        </div>

        {/* Ok */}
        <div className={`self-end ${tech.textColor} opacity-60 relative z-10`}>
          <ChevronRight size={15} />
        </div>
      </button>
    </motion.div>
  );
});

TechCard.displayName = 'TechCard';

export default function CrisisPage({ onNavigate, crisisCount, setCrisisCount, isPremium }: CrisisPageProps) {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isProcessingClick = useRef(false);

  const handleTechniqueClick = useCallback((id: string) => {
    if (isProcessingClick.current) return;
    isProcessingClick.current = true;
    
    if ((id === 'suggestion' || id === 'puzzle') && !isPremium) {
      onNavigate('premium');
      isProcessingClick.current = false;
      return;
    }

    if (id === 'puzzle') {
      onNavigate('puzzle');
      isProcessingClick.current = false;
      return;
    }

    setSelectedTech(id);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsOverlayOpen(true);
      // Reset processing state slightly after the overlay starts opening
      setTimeout(() => { isProcessingClick.current = false; }, 300);
    }, 120);
  }, [onNavigate]);

  const handleOverlayClose = useCallback((resolved: boolean) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOverlayOpen(false);
    setSelectedTech(null);
    if (resolved) setCrisisCount(prev => prev + 1);
  }, [setCrisisCount]);

  return (
    <>
      <style>{`
        .crisis-scroll::-webkit-scrollbar { display: none; }
        .crisis-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div
        className="crisis-scroll min-h-screen text-slate-100 max-w-md mx-auto relative pb-28 overflow-x-hidden font-sans select-none"
        style={{ background: 'var(--color-surface)' }}
      >
        {/* Header — sade, animasyonsuz */}
        <header className="px-6 pt-7 pb-4">
          <div className="flex items-center gap-3 mb-1">
            <div
              className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center"
              style={{ boxShadow: '0 0 14px rgba(0,201,255,0.45)' }}
            >
              <Shield size={16} className="text-white" />
            </div>
            <h1 className="text-2xl font-display font-bold text-slate-100 tracking-tight">Kriz Anı</h1>
          </div>
          <p className="text-sm text-slate-400 font-medium ml-11">
            Sakinleşmek için bir teknik seç
          </p>

          <AnimatePresence>
            {crisisCount > 0 && (
              <motion.div
                key="counter"
                initial={{ opacity: 0, scale: 0.8, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 6 }}
                transition={{ type: 'spring', stiffness: 400, damping: 24 }}
                className="mt-3 ml-11 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20"
              >
                <ShieldCheck size={11} className="text-blue-400" />
                <span className="text-[11px] font-bold text-blue-400">
                  {crisisCount} krizi atlattın
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* Kart Grid */}
        <main className="px-5">
          <div className="grid grid-cols-2 gap-3">
            {techniques.map((tech, i) => (
              <TechCard 
                key={tech.id} 
                tech={tech} 
                index={i} 
                onClick={handleTechniqueClick} 
                isLocked={(tech.id === 'suggestion' || tech.id === 'puzzle') && !isPremium}
              />
            ))}
          </div>
        </main>

        <CrisisOverlay
          isOpen={isOverlayOpen}
          onClose={handleOverlayClose}
          techniqueId={selectedTech}
          onNavigate={onNavigate}
        />

        <BottomNav onNavigate={onNavigate} activeStep="crisis" />
      </div>
    </>
  );
}
