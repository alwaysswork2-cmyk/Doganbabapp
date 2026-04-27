import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  MessageSquare, 
  User, 
  Bell, 
  RotateCcw, 
  Ticket, 
  Send, 
  Scale, 
  LogOut,
  AlertTriangle,
  X,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Step } from '../types';
import { supabase } from '../../lib/supabase-quitfast';
import BottomNav from './BottomNav';

interface SettingsPageProps {
  onNavigate: (step: Step) => void;
  onResetData: () => void;
}

export default function SettingsPage({ onNavigate, onResetData }: SettingsPageProps) {
  const [feedbackType, setFeedbackType] = useState('like');
  const [showResetModal, setShowResetModal] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [showActivationModal, setShowActivationModal] = useState(false);
  const [activationCode, setActivationCode] = useState('');

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onNavigate('auth');
  };

  const handleResetConfirm = () => {
    onResetData();
    setShowConfirmReset(false);
    setShowResetModal(false);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'QuitSmoking App',
          text: 'Sigarayı bırakma yolculuğumda bana katıl! Birlikte bırakmak daha kolay.',
          url: window.location.origin,
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Paylaşım hatası:', error);
        }
      }
    }
  };

  const handleFeedback = () => {
    const email = 'doganaykng@gmail.com';
    const subjects: Record<string, string> = {
      like: 'Uygulama Geri Bildirimi: Beğeni',
      suggestion: 'Uygulama Geri Bildirimi: Öneri',
      issue: 'Uygulama Geri Bildirimi: Sorun Bildirimi'
    };
    
    const subject = subjects[feedbackType] || 'Uygulama Geri Bildirimi';
    const body = 'Merhaba,\n\n[Buraya mesajınızı yazın]\n\nTeşekkürler.';
    
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 max-w-md mx-auto relative pb-32 overflow-x-hidden font-sans select-none">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0f172a]/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center p-4 justify-between w-full">
          <button 
            onClick={() => onNavigate('profile')}
            className="text-slate-100 flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-800/50 transition-colors cursor-pointer"
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">Ayarlar</h2>
        </div>
      </header>

      <main className="px-4 py-6 space-y-8">
        {/* Feedback Section */}
        <section className="space-y-4">
          <h3 className="text-blue-400 text-sm font-bold uppercase tracking-widest px-1">Feedback</h3>
          <div className="flex flex-col gap-3">
            {[
              { id: 'like', label: 'Uygulamayı beğendiniz mi?' },
              { id: 'suggestion', label: 'Bir öneriniz var mı?' },
              { id: 'issue', label: 'Bir sorun mu yaşıyorsunuz?' }
            ].map((item) => (
              <label 
                key={item.id}
                className={`flex items-center gap-4 rounded-xl border border-solid p-4 cursor-pointer transition-all ${
                  feedbackType === item.id 
                    ? 'border-blue-500/40 bg-blue-500/10' 
                    : 'border-white/5 bg-slate-800/50 hover:border-blue-500/40'
                }`}
              >
                <input 
                  type="radio" 
                  name="feedback" 
                  checked={feedbackType === item.id}
                  onChange={() => setFeedbackType(item.id)}
                  className="h-5 w-5 border-2 border-blue-500/40 bg-transparent text-blue-400 focus:ring-blue-500 rounded-full" 
                />
                <div className="flex grow flex-col">
                  <p className="text-slate-100 text-sm font-medium leading-normal">{item.label}</p>
                </div>
              </label>
            ))}
          </div>
          <div className="space-y-3 pt-2">
            <button 
              onClick={handleFeedback}
              className="w-full bg-blue-500 hover:bg-blue-500/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
            >
              <MessageSquare size={20} />
              Bize Söyleyin
            </button>
            <p className="text-center text-slate-400 text-xs italic">En geç 3 gün içinde size geri dönüş yapacağız.</p>
          </div>
        </section>

        {/* Account Group */}
        <section>
          <h3 className="text-blue-400 text-sm font-bold uppercase tracking-widest px-1 mb-4">Hesap</h3>
          <div className="flex flex-col gap-2">
            {[
              { icon: User, label: 'Hesap Bilgileri', onClick: () => onNavigate('account_info') },
              { icon: Bell, label: 'Bildirimler', onClick: () => onNavigate('notifications') },
              { icon: RotateCcw, label: 'Yeniden Başla', onClick: () => setShowResetModal(true) },
              { icon: Ticket, label: 'Aktivasyon Kodu', onClick: () => setShowActivationModal(true) }
            ].map((item, i) => (
              <div 
                key={i}
                onClick={item.onClick}
                className="bg-slate-800/50 border border-white/5 rounded-xl p-4 flex items-center justify-between cursor-pointer group hover:bg-slate-800 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <item.icon size={20} />
                  </div>
                  <span className="font-medium text-slate-100">{item.label}</span>
                </div>
                <ChevronRight className="text-slate-400 group-hover:text-blue-400 transition-colors" size={20} />
              </div>
            ))}
          </div>
        </section>

        {/* Referral + Footer */}
        <section className="space-y-2 pb-6">
          <div 
            onClick={handleShare}
            className="bg-blue-500 rounded-xl p-4 shadow-lg shadow-blue-500/20 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform"
          >
            <div>
              <h3 className="text-white font-bold text-sm">Bir Arkadaşını Davet Et</h3>
              <p className="text-white/80 text-xs">Birlikte bırakmak daha kolay.</p>
            </div>
            <div className="bg-on-primary-fixed/20 p-1.5 rounded-full text-white">
              <Send size={18} />
            </div>
          </div>
          <div 
            onClick={() => onNavigate('legal')}
            className="bg-slate-800/50 border border-white/5 rounded-xl p-4 flex items-center justify-between cursor-pointer group hover:bg-slate-800 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                <Scale size={20} />
              </div>
              <span className="font-medium text-sm text-slate-100">Hizmet Şartları ve Gizlilik Politikası</span>
            </div>
            <ChevronRight className="text-slate-400 group-hover:text-blue-400 transition-colors" size={20} />
          </div>
          <button 
            onClick={handleLogout}
            className="w-full py-2.5 border border-error/30 text-red-500 hover:bg-red-600 hover:text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 mt-4"
          >
            <LogOut size={18} />
            Çıkış Yap
          </button>
        </section>
      </main>

      {/* Reset Data Modals */}
      <AnimatePresence>
        {showResetModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowResetModal(false)}
              className="fixed inset-0 bg-[#0f172a]/60 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[320px] bg-slate-800/50 border border-white/5 rounded-3xl p-6 z-[110] shadow-2xl"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-blue-500/10 p-2 rounded-xl text-blue-400">
                  <RotateCcw size={24} />
                </div>
                <button onClick={() => setShowResetModal(false)} className="text-slate-400 hover:text-slate-100">
                  <X size={20} />
                </button>
              </div>
              <h4 className="text-lg font-bold mb-2 text-slate-100">Yeniden Başla</h4>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                Tüm ilerlemeni sıfırlayarak yolculuğuna en baştan başlayabilirsin.
              </p>
              <button 
                onClick={() => setShowConfirmReset(true)}
                className="w-full bg-blue-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 text-sm mb-3"
              >
                Verilerimi Sıfırla
              </button>
              <button 
                onClick={() => setShowResetModal(false)}
                className="w-full bg-slate-800/50est text-slate-100 font-bold py-3.5 rounded-xl text-sm"
              >
                Vazgeç
              </button>
            </motion.div>
          </>
        )}

        {showConfirmReset && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#0f172a]/80 backdrop-blur-md z-[120]"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] max-w-[300px] bg-slate-800/50 border border-error/30 rounded-3xl p-6 z-[130] shadow-2xl text-center"
            >
              <div className="bg-red-600/10 w-16 h-16 rounded-full flex items-center justify-center text-red-500 mx-auto mb-4">
                <AlertTriangle size={32} />
              </div>
              <h4 className="text-lg font-bold mb-2 text-slate-100">Emin misiniz?</h4>
              <p className="text-sm text-slate-400 mb-6">
                Verilerini sıfırlamak ister misin? Bu işlem geri alınamaz.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setShowConfirmReset(false)}
                  className="bg-slate-800/50est text-slate-100 font-bold py-3 rounded-xl text-sm"
                >
                  İptal
                </button>
                <button 
                  onClick={handleResetConfirm}
                  className="bg-red-600 text-white font-bold py-3 rounded-xl text-sm shadow-lg shadow-error/20 flex items-center justify-center gap-2"
                >
                  <Check size={16} />
                  Evet
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Activation Code Modal */}
      <AnimatePresence>
        {showActivationModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowActivationModal(false)}
              className="fixed inset-0 bg-[#0f172a]/60 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[320px] bg-slate-800/50 border border-white/5 rounded-3xl p-6 z-[110] shadow-2xl"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-blue-500/10 p-2 rounded-xl text-blue-400">
                  <Ticket size={24} />
                </div>
                <button onClick={() => setShowActivationModal(false)} className="text-slate-400 hover:text-slate-100">
                  <X size={20} />
                </button>
              </div>
              <h4 className="text-lg font-bold mb-2 text-slate-100">Aktivasyon Kodu</h4>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                Ortaklarımızdan biri tarafından verilen aktivasyon kodunu girin.
              </p>
              
              <div className="space-y-4">
                <input 
                  type="text"
                  value={activationCode}
                  onChange={(e) => setActivationCode(e.target.value)}
                  placeholder="Kodunuzu buraya yazın"
                  className="w-full bg-slate-800/50est border border-white/5 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button 
                  onClick={() => {
                    // Handle activation logic here if needed
                    setShowActivationModal(false);
                    setActivationCode('');
                  }}
                  className="w-full bg-blue-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 text-sm"
                >
                  Aktive Et
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <BottomNav onNavigate={onNavigate} activeStep="profile" />
    </div>
  );
}
