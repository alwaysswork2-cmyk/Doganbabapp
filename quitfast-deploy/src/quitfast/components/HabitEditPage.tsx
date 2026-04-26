import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Zap, 
  Package, 
  Wallet,
  X,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Step, OnboardingData } from '../types';
import BottomNav from './BottomNav';

interface HabitEditPageProps {
  onNavigate: (step: Step) => void;
  onboardingData: OnboardingData;
  setOnboardingData: React.Dispatch<React.SetStateAction<OnboardingData>>;
  startDate: Date;
  setStartDate: React.Dispatch<React.SetStateAction<Date>>;
}

export default function HabitEditPage({ 
  onNavigate, 
  onboardingData, 
  setOnboardingData, 
  startDate, 
  setStartDate 
}: HabitEditPageProps) {
  const [activeModal, setActiveModal] = useState<'date' | 'daily' | 'pack_size' | 'price' | null>(null);
  const [tempValue, setTempValue] = useState<any>(null);

  const months = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  const formatDate = (date: Date) => {
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const handleOpenModal = (id: 'date' | 'daily' | 'pack_size' | 'price') => {
    setActiveModal(id);
    if (id === 'date') {
      setTempValue({
        day: startDate.getDate(),
        month: startDate.getMonth(),
        year: startDate.getFullYear()
      });
    } else if (id === 'daily') {
      setTempValue(onboardingData.dailyCigarettes);
    } else if (id === 'pack_size') {
      setTempValue(onboardingData.cigarettesPerPack);
    } else if (id === 'price') {
      setTempValue(onboardingData.pricePerPack);
    }
  };

  const handleSave = () => {
    if (activeModal === 'date') {
      const newDate = new Date(tempValue.year, tempValue.month, tempValue.day);
      setStartDate(newDate);
    } else if (activeModal === 'daily') {
      setOnboardingData(prev => ({ ...prev, dailyCigarettes: Number(tempValue) }));
    } else if (activeModal === 'pack_size') {
      setOnboardingData(prev => ({ ...prev, cigarettesPerPack: Number(tempValue) }));
    } else if (activeModal === 'price') {
      setOnboardingData(prev => ({ ...prev, pricePerPack: Number(tempValue) }));
    }
    setActiveModal(null);
  };

  const habitItems = [
    {
      id: 'date' as const,
      label: 'Sigarayı Bırakma Tarihi',
      value: formatDate(startDate),
      icon: Calendar,
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-500'
    },
    {
      id: 'daily' as const,
      label: 'Günlük İçilen Sigara',
      value: `${onboardingData.dailyCigarettes} Adet`,
      icon: Zap,
      iconBg: 'bg-yellow-500/20',
      iconColor: 'text-yellow-500'
    },
    {
      id: 'pack_size' as const,
      label: 'Paketteki Sigara Sayısı',
      value: `${onboardingData.cigarettesPerPack} Adet`,
      icon: Package,
      iconBg: 'bg-teal-500/20',
      iconColor: 'text-teal-500'
    },
    {
      id: 'price' as const,
      label: 'Paket Fiyatı',
      value: `${onboardingData.pricePerPack.toFixed(2)} ₺`,
      icon: Wallet,
      iconBg: 'bg-emerald-500/20',
      iconColor: 'text-emerald-500'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 max-w-md mx-auto relative pb-32 overflow-x-hidden font-display">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0f172a]/80 backdrop-blur-md border-b border-blue-500/10">
        <div className="flex items-center p-4 justify-between w-full">
          <button 
            onClick={() => onNavigate('profile')}
            className="text-slate-100 flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-blue-500/10 transition-colors cursor-pointer"
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">Alışkanlık Bilgileri</h2>
        </div>
      </header>

      <main className="px-6 py-8 space-y-4">
        {habitItems.map((item) => (
          <button 
            key={item.id}
            onClick={() => handleOpenModal(item.id)}
            className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] p-5 flex items-center justify-between group cursor-pointer hover:bg-slate-700 transition-all text-left"
          >
            <div className="flex items-center gap-5">
              <div className={`w-14 h-14 rounded-full ${item.iconBg} flex items-center justify-center ${item.iconColor}`}>
                <item.icon size={28} />
              </div>
              <div>
                <p className="text-slate-400 text-sm font-medium mb-0.5">{item.label}</p>
                <p className="text-slate-100 font-bold text-xl">{item.value}</p>
              </div>
            </div>
            <ChevronRight className="text-slate-600 group-hover:text-slate-400 transition-colors" size={24} />
          </button>
        ))}
      </main>

      {/* Modals */}
      <AnimatePresence>
        {activeModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-800/50 rounded-t-[2.5rem] z-[70] p-6 border-t border-white/10 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-100">
                  {habitItems.find(i => i.id === activeModal)?.label}
                </h3>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="p-1.5 rounded-full bg-white/5 text-slate-400 hover:text-slate-100 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="mb-8">
                {activeModal === 'date' && (
                  <div className="grid grid-cols-3 gap-3">
                    {/* Day */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase tracking-widest text-slate-500 font-bold ml-1">GÜN</label>
                      <select 
                        value={tempValue.day}
                        onChange={(e) => setTempValue({ ...tempValue, day: parseInt(e.target.value) })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-slate-100 font-bold focus:outline-none focus:border-blue-500/50 appearance-none text-sm"
                      >
                        {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                          <option key={d} value={d} className="bg-slate-800/50">{d}</option>
                        ))}
                      </select>
                    </div>
                    {/* Month */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase tracking-widest text-slate-500 font-bold ml-1">AY</label>
                      <select 
                        value={tempValue.month}
                        onChange={(e) => setTempValue({ ...tempValue, month: parseInt(e.target.value) })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-slate-100 font-bold focus:outline-none focus:border-blue-500/50 appearance-none text-sm"
                      >
                        {months.map((m, i) => (
                          <option key={i} value={i} className="bg-slate-800/50">{m}</option>
                        ))}
                      </select>
                    </div>
                    {/* Year */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase tracking-widest text-slate-500 font-bold ml-1">YIL</label>
                      <select 
                        value={tempValue.year}
                        onChange={(e) => setTempValue({ ...tempValue, year: parseInt(e.target.value) })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-slate-100 font-bold focus:outline-none focus:border-blue-500/50 appearance-none text-sm"
                      >
                        {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map(y => (
                          <option key={y} value={y} className="bg-slate-800/50">{y}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {(activeModal === 'daily' || activeModal === 'pack_size' || activeModal === 'price') && (
                  <div className="relative">
                    <input 
                      type="number"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-2xl font-bold text-slate-100 focus:outline-none focus:border-blue-500/50 text-center"
                      autoFocus
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">
                      {activeModal === 'price' ? '₺' : 'Adet'}
                    </div>
                  </div>
                )}
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                className="w-full bg-blue-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all text-sm"
              >
                <Check size={20} />
                <span>Değişiklikleri Kaydet</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <BottomNav onNavigate={onNavigate} activeStep="profile" />
    </div>
  );
}
