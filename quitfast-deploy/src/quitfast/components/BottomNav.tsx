import React from 'react';
import { 
  Home, 
  BookOpen, 
  Shield, 
  Trophy
} from 'lucide-react';
import { Step } from '../types';
import { Goal30DIcon } from './Icons';

interface BottomNavProps {
  onNavigate: (step: Step) => void;
  activeStep: Step;
}

export default function BottomNav({ onNavigate, activeStep }: BottomNavProps) {
  const effectiveActiveStep = (activeStep === 'badges' || activeStep === 'rewards') ? 'dashboard' : activeStep;

  const navItems = [
    { id: 'dashboard', label: 'Ana Sayfa', icon: Home },
    { id: 'program',   label: 'Program',   icon: Goal30DIcon, isSpecial: true },
    { id: 'crisis',    label: 'Kriz Anı',  icon: Shield, isCrisis: true },
    { id: 'blogs',     label: 'Bloglar',   icon: BookOpen },
    { id: 'ranking',   label: 'Sıralama',  icon: Trophy },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0f172a]/90 backdrop-blur-xl border-t border-white/5 px-2 pb-6 pt-3 flex justify-around items-center z-50 max-w-md mx-auto">
      {navItems.map((item) => {
        const isActive = effectiveActiveStep === item.id;
        const Icon = item.icon;
        const isCrisis = item.id === 'crisis';

        return (
          <button 
            key={item.id}
            onClick={() => onNavigate(item.id as Step)} 
            className="flex flex-col items-center gap-1 group"
          >
            {isCrisis ? (
              <div className={`size-10 rounded-full flex items-center justify-center transition-all bg-red-600 ${
                isActive ? 'shadow-[0_0_15px_rgba(220,38,38,0.6)]' : 'opacity-90'
              }`}>
                <Icon className="text-white" size={20} />
              </div>
            ) : (
              <Icon 
                className={`${
                  isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'
                } transition-colors`} 
                size={24} 
              />
            )}
            <span className={`text-[10px] ${
              isActive 
                ? `font-bold ${isCrisis ? 'text-red-500' : 'text-blue-400'}` 
                : 'font-medium text-slate-500 group-hover:text-blue-400'
            } transition-colors`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
