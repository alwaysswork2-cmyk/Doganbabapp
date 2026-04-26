import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ArrowLeft } from 'lucide-react';
import { Step } from '../types';

interface MoodSelectionProps {
  onNavigate: (step: Step) => void;
  onSelect: (mood: { emoji: string, label: string }) => void;
}

export function MoodSelection({ onNavigate, onSelect }: MoodSelectionProps) {
  const moods = [
    { emoji: '😟', label: 'huzursuz' },
    { emoji: '😡', label: 'sinirli' },
    { emoji: '😰', label: 'kaygılı' },
    { emoji: '😫', label: 'stresli' },
    { emoji: '😐', label: 'sıkılmış' },
    { emoji: '🥱', label: 'yorgun' },
    { emoji: '🤩', label: 'heyecanlı' },
    { emoji: '😊', label: 'mutlu' },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 max-w-md mx-auto px-6 py-12 select-none">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-slate-100">
            Bugün nasılsın?
          </h1>
          <button 
            onClick={() => onNavigate('mood_report')}
            className="text-xs font-bold text-blue-400 mt-1 hover:underline"
          >
            Gelişimini görüntüle
          </button>
        </div>
        <button 
          onClick={() => onNavigate('dashboard')}
          className="size-10 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-400"
        >
          <X size={24} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {moods.map((mood, idx) => (
          <motion.button
            key={idx}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(mood)}
            className="bg-slate-800/50 border border-white/5 rounded-3xl p-6 flex flex-col items-center gap-3 hover:border-blue-500/30 transition-all group select-none"
          >
            <span className="text-4xl group-hover:scale-110 transition-transform">{mood.emoji}</span>
            <span className="text-xs font-bold text-slate-400 group-hover:text-blue-400 transition-colors">{mood.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

interface MoodReportPageProps {
  onNavigate: (step: Step) => void;
  moodHistory: { day: number, emoji: string, entry?: string }[];
  currentDay: number;
}

export function MoodReportPage({ onNavigate, moodHistory, currentDay }: MoodReportPageProps) {
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  
  const allMoods = [
    { emoji: '😟', label: 'huzursuz' },
    { emoji: '😡', label: 'sinirli' },
    { emoji: '😰', label: 'kaygılı' },
    { emoji: '😫', label: 'stresli' },
    { emoji: '😐', label: 'sıkılmış' },
    { emoji: '🥱', label: 'yorgun' },
    { emoji: '🤩', label: 'heyecanlı' },
    { emoji: '😊', label: 'mutlu' },
  ];

  const filteredHistory = moodHistory.filter(item => {
    if (reportType === 'daily') return item.day === currentDay;
    if (reportType === 'weekly') return item.day > currentDay - 7;
    if (reportType === 'monthly') return item.day > currentDay - 30;
    return true;
  });

  const moodCounts = allMoods.map(m => ({
    ...m,
    count: filteredHistory.filter(h => h.emoji === m.emoji).length
  }));

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 max-w-md mx-auto px-6 py-12 flex flex-col select-none">
      <div className="flex justify-between items-center mb-8">
        <button 
          onClick={() => onNavigate('mood_selection')}
          className="size-10 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-400"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Duygu Raporu</h1>
        <div className="w-10"></div>
      </div>

      <div className="flex gap-2 mb-8 bg-slate-800/50 p-1 rounded-2xl">
        {[
          { id: 'daily', label: 'Günlük' },
          { id: 'weekly', label: 'Haftalık' },
          { id: 'monthly', label: 'Aylık' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setReportType(tab.id as any)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${reportType === tab.id ? 'bg-blue-500 text-on-primary shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-slate-100'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-6 overflow-y-auto no-scrollbar pb-10">
        <section className="bg-slate-800/50 border border-white/5 rounded-3xl p-6">
          <h3 className="text-sm font-bold text-slate-400 mb-6 uppercase tracking-widest">Duygu Analizi</h3>
          <div className="grid grid-cols-4 gap-4">
            {moodCounts.map((mood, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1">
                <span className="text-2xl">{mood.emoji}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">{mood.label}</span>
                <span className="text-xs font-black text-blue-400">{mood.count}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
