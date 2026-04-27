import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Bell, 
  Clock,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Step, NotificationSettings } from '../types';

interface NotificationsPageProps {
  onNavigate: (step: Step) => void;
  settings: NotificationSettings;
  onUpdateSettings: (settings: NotificationSettings) => void;
}

export default function NotificationsPage({ onNavigate, settings, onUpdateSettings }: NotificationsPageProps) {
  const [showTimePicker, setShowTimePicker] = useState<'daily' | 'program' | null>(null);
  const [tempTime, setTempTime] = useState('');
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const [showInstructions, setShowInstructions] = useState(false);

  const isIframe = window.self !== window.top;

  const requestPermission = async () => {
    if (typeof Notification !== 'undefined') {
      try {
        const status = await Notification.requestPermission();
        setPermissionStatus(status);
        if (status === 'denied') {
          setShowInstructions(true);
        } else {
          setShowInstructions(false);
        }
        return status;
      } catch (error) {
        console.error('Error requesting permission:', error);
        return 'denied';
      }
    }
    return 'denied';
  };

  const handleToggle = async (key: keyof NotificationSettings) => {
    const isTurningOn = !settings[key];
    
    if (isTurningOn && permissionStatus !== 'granted') {
      const status = await requestPermission();
      if (status !== 'granted') {
        // If still not granted, we can still toggle but it won't work
        // Maybe show a small toast or just let it be
      }
    }

    onUpdateSettings({
      ...settings,
      [key]: !settings[key]
    });
  };

  const handleTimeClick = (type: 'daily' | 'program') => {
    setTempTime(type === 'daily' ? settings.dailyTime : settings.programTime);
    setShowTimePicker(type);
  };

  const saveTime = () => {
    if (showTimePicker === 'daily') {
      onUpdateSettings({ ...settings, dailyTime: tempTime });
    } else if (showTimePicker === 'program') {
      onUpdateSettings({ ...settings, programTime: tempTime });
    }
    setShowTimePicker(null);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 max-w-md mx-auto relative pb-32 overflow-x-hidden font-display">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0f172a]/80 backdrop-blur-md border-b border-blue-500/10">
        <div className="flex items-center p-4 justify-between w-full">
          <button 
            onClick={() => onNavigate('settings')}
            className="text-slate-100 flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-blue-500/10 transition-colors cursor-pointer"
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">Bildirimler</h2>
        </div>
      </header>

      <main className="px-6 py-6 space-y-4">
        {/* Iframe Warning */}
        {isIframe && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 mb-2">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-500/20 rounded-xl text-blue-500">
                <Bell size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-blue-500">Yeni Sekmede Açın</h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  Bildirimlerin çalışması için uygulamayı yeni bir sekmede açmanız önerilir.
                </p>
                <a 
                  href={window.location.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block mt-3 bg-blue-500 text-white text-[11px] font-bold px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Yeni Sekmede Aç
                </a>
              </div>
            </div>
          </div>
        )}



        {/* Daily Check Notification */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-bold text-slate-100">Günlük Kontrol</h3>
            <button 
              onClick={() => handleToggle('dailyCheck')}
              className={`w-10 h-5 rounded-full transition-colors relative ${settings.dailyCheck ? 'bg-blue-500' : 'bg-slate-700'}`}
            >
              <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${settings.dailyCheck ? 'right-1' : 'left-1'}`} />
            </button>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
            Günlük duygu gelişimini kaydetmek için bildirim al.
          </p>
          {settings.dailyCheck && (
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <span className="text-[10px] text-slate-500 font-medium">Hangi saatte bildirim almak istersin?</span>
              <button 
                onClick={() => handleTimeClick('daily')}
                className="flex items-center gap-2 bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-500/20 transition-colors"
              >
                <Clock size={14} />
                {settings.dailyTime}
              </button>
            </div>
          )}
        </div>

        {/* Program Notification */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-bold text-slate-100">Program Bildirimleri</h3>
            <button 
              onClick={() => handleToggle('programNotifs')}
              className={`w-10 h-5 rounded-full transition-colors relative ${settings.programNotifs ? 'bg-blue-500' : 'bg-slate-700'}`}
            >
              <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${settings.programNotifs ? 'right-1' : 'left-1'}`} />
            </button>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
            Programını kullanmayı unutmamak için günlük bildirim al.
          </p>
          {settings.programNotifs && (
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <span className="text-[10px] text-slate-500 font-medium">Bildirim saati</span>
              <button 
                onClick={() => handleTimeClick('program')}
                className="flex items-center gap-2 bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-500/20 transition-colors"
              >
                <Clock size={14} />
                {settings.programTime}
              </button>
            </div>
          )}
        </div>

        {/* Goal Notification */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-bold text-slate-100">Hedef Bildirimleri</h3>
            <button 
              onClick={() => handleToggle('goalNotifs')}
              className={`w-10 h-5 rounded-full transition-colors relative ${settings.goalNotifs ? 'bg-blue-500' : 'bg-slate-700'}`}
            >
              <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${settings.goalNotifs ? 'right-1' : 'left-1'}`} />
            </button>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Başardığın hedeflerin bildirimlerini al.
          </p>
        </div>

        {/* Update Notification */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-bold text-slate-100">Güncelleme Bildirimi</h3>
            <button 
              onClick={() => handleToggle('updateNotifs')}
              className={`w-10 h-5 rounded-full transition-colors relative ${settings.updateNotifs ? 'bg-blue-500' : 'bg-slate-700'}`}
            >
              <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${settings.updateNotifs ? 'right-1' : 'left-1'}`} />
            </button>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Güncellemelerden anında haberdar ol.
          </p>
        </div>


      </main>

      {/* Time Picker Modal */}
      <AnimatePresence>
        {showTimePicker && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTimePicker(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] max-w-[280px] bg-slate-800/50 border border-white/10 rounded-3xl p-6 z-[110] shadow-2xl"
            >
              <h4 className="text-center font-bold mb-4 text-sm">Saat Seçin</h4>
              <div className="flex justify-center mb-6">
                <input 
                  type="time" 
                  value={tempTime}
                  onChange={(e) => setTempTime(e.target.value)}
                  className="bg-white/5 border border-blue-500/30 rounded-xl px-4 py-3 text-2xl font-bold text-center text-blue-400 focus:outline-none focus:border-blue-500 w-full"
                />
              </div>
              <button 
                onClick={saveTime}
                className="w-full bg-blue-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 text-sm"
              >
                <Check size={18} />
                Kaydet
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
