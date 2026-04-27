import React, { useState } from 'react';
import { 
  ChevronLeft, 
  User, 
  Mail, 
  Calendar, 
  Trash2, 
  X, 
  Check,
  Edit2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Step, OnboardingData } from '../types';
import { supabase } from '../../lib/supabase-quitfast';
import { PROFANITY_LIST } from '../profanityList';
import { checkProfanity } from '../profanityStub';

interface AccountInfoPageProps {
  onNavigate: (step: Step) => void;
  userName: string;
  setUserName: (name: string) => void;
  onboardingData: OnboardingData;
  userEmail: string;
  onDeleteAccount: () => Promise<void>;
}

export default function AccountInfoPage({ 
  onNavigate, 
  userName, 
  setUserName, 
  onboardingData, 
  userEmail,
  onDeleteAccount
}: AccountInfoPageProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  // Calculate birth year roughly from age
  const birthYear = new Date().getFullYear() - onboardingData.age;
  
  const handleSaveName = async () => {
    const trimmedName = tempName.trim().toLowerCase();
    const wordsInName = trimmedName.split(/[\s\-_.]+/);
    
    // 0. Check for forbidden characters
    const forbiddenChars = /[.,:;*?!+_(&/₺#@\-\/*+%]/;
    if (forbiddenChars.test(tempName)) {
      setNameError('İsimde özel karakter kullanılamaz.');
      return;
    }

    // 1. Check with glin-profanity (comprehensive library)
    const glinResult = checkProfanity(trimmedName, { 
      languages: ['turkish'],
      detectLeetspeak: true,
      normalizeUnicode: true
    });

    // 2. Check with custom list (for specific words or short standalone words)
    const hasCustomProfanity = PROFANITY_LIST.some(forbidden => {
      const f = forbidden.toLowerCase();
      if (f.length <= 3) {
        // For short words (like 'am', 'sik', 'ana'), only block if they are standalone words
        return wordsInName.includes(f);
      } else {
        // For longer words/phrases, check if they are contained anywhere
        return trimmedName.includes(f);
      }
    });

    if (glinResult.containsProfanity || hasCustomProfanity) {
      setNameError('Bu isim uygunsuz içerik barındırdığı için kullanılamaz.');
      return;
    }

    if (tempName.trim() && tempName !== userName) {
      setUserName(tempName);
      // Update in Supabase metadata if possible
      await supabase.auth.updateUser({
        data: { full_name: tempName }
      });
    }
    setIsEditingName(false);
    setNameError(null);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDeleteAccount();
    // App.tsx will handle the navigation to auth after deletion
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
          <h2 className="text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">Hesap Bilgileri</h2>
        </div>
      </header>

      <main className="px-6 py-6 space-y-4">
        {/* Info Cards */}
        <div className="space-y-3">
          {/* Name Card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2.5 text-slate-400">
                <User size={16} />
                <span className="text-[10px] font-bold uppercase tracking-widest">İSİM</span>
              </div>

            </div>
            
            <p className="text-lg font-bold text-slate-100 ml-0.5">{userName}</p>
          </div>

          {/* Birth Date Card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 opacity-80">
            <div className="flex items-center gap-2.5 text-slate-400 mb-1.5">
              <Calendar size={16} />
              <span className="text-[10px] font-bold uppercase tracking-widest">DOĞUM YILI (YAKLAŞIK)</span>
            </div>
            <p className="text-lg font-bold text-slate-100 ml-0.5">{birthYear}</p>
            <p className="text-[9px] text-slate-500 mt-1.5 italic">* Yaşınıza göre hesaplanmıştır.</p>
          </div>

          {/* Email Card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 opacity-80">
            <div className="flex items-center gap-2.5 text-slate-400 mb-1.5">
              <Mail size={16} />
              <span className="text-[10px] font-bold uppercase tracking-widest">E-POSTA</span>
            </div>
            <p className="text-base font-bold text-slate-100 ml-0.5 truncate">{userEmail}</p>
          </div>
        </div>

        {/* Delete Account Button */}
        <div className="pt-6">
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center justify-center gap-2.5 text-rose-500 font-bold py-3.5 rounded-2xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 transition-all active:scale-[0.98] text-sm"
          >
            <Trash2 size={18} />
            Hesabı Sil
          </button>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isDeleting && setShowDeleteConfirm(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-slate-800/50 border border-white/10 rounded-[2.5rem] p-8 z-[110] shadow-2xl"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-500 mb-6">
                  <Trash2 size={40} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Hesabı Sil?</h3>
                <p className="text-slate-400 mb-8 leading-relaxed">
                  Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz ve tüm verileriniz kalıcı olarak silinir.
                </p>
                
                <div className="grid grid-cols-2 gap-4 w-full">
                  <button 
                    disabled={isDeleting}
                    onClick={() => setShowDeleteConfirm(false)}
                    className="py-4 rounded-2xl bg-white/5 text-slate-300 font-bold hover:bg-slate-700 transition-colors disabled:opacity-50"
                  >
                    Hayır
                  </button>
                  <button 
                    disabled={isDeleting}
                    onClick={handleDelete}
                    className="py-4 rounded-2xl bg-rose-500 text-white font-bold shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    {isDeleting ? (
                      <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      'Evet, Sil'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
