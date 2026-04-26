import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Bolt, 
  Calendar, 
  Smile, 
  Headphones,
  CheckCircle2,
  Lock,
  Target
} from 'lucide-react';
import { Step } from '../types';
import { motion } from 'framer-motion';

interface PremiumPageProps {
  onNavigate: (step: Step) => void;
  setIsPremium: (val: boolean) => void;
  returnStep?: Step;
}

export default function PremiumPage({ onNavigate, setIsPremium, returnStep = 'dashboard' }: PremiumPageProps) {
  const [selectedPlan, setSelectedPlan] = useState<'2months' | '6months' | '1year'>('1year');

  const plans = [
    {
      id: '2months',
      title: '2 Aylık',
      totalPrice: '₺199',
      weeklyPrice: '₺22,80',
      popular: false,
      badge: null
    },
    {
      id: '6months',
      title: '6 Aylık',
      totalPrice: '₺450',
      weeklyPrice: '₺17,30',
      popular: true,
      badge: null
    },
    {
      id: '1year',
      title: '1 Yıllık',
      totalPrice: '₺599',
      weeklyPrice: '₺11,50',
      popular: false,
      badge: '✦ 3 GÜN ÜCRETSİZ'
    }
  ];

  const privileges = [
    {
      icon: Bolt,
      title: 'Sınırsız Kriz Desteği',
      desc: 'Kriz anlarında yapay zeka destekli sınırsız öneri ve rehberlik alın.'
    },
    {
      icon: Calendar,
      title: '30 Günlük Bırakma Programı',
      desc: 'Uzman içeriklerle hazırlanmış, adım adım kişisel sigara bırakma yolculuğu.'
    },
    {
      icon: Smile,
      title: 'Özel Premium Avatarlar',
      desc: 'Yalnızca premium üyelere özel koleksiyon avatarlarla profilinizi kişiselleştirin.'
    },
    {
      icon: Headphones,
      title: 'Sesli Blog İçerikleri',
      desc: 'Motivasyon ve farkındalık içeriklerini dinleyerek öğrenin, okumadan ilerleyin.'
    },
    {
      icon: Target,
      title: 'Kişisel Hedef Ekleme',
      desc: 'Kendi kişisel hedeflerinizi belirleyin ve ilerlemenizi takip edin.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 max-w-md mx-auto relative pb-24 overflow-x-hidden font-sans select-none">
      {/* Top Navigation Bar */}
      <header className="flex justify-between items-center w-full px-6 py-4 sticky top-0 z-50 bg-[#0f172a]/80 backdrop-blur-md">
        <button 
          onClick={() => onNavigate(returnStep)}
          className="flex items-center space-x-2 active:scale-95 duration-150 cursor-pointer text-slate-100"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={() => {
            setIsPremium(true);
            onNavigate('dashboard');
          }}
          className="text-[13px] font-semibold text-slate-400 hover:text-slate-100 transition-colors"
        >
          Satın Alımları Geri Yükle
        </button>
      </header>

      <main className="px-6">
        {/* Hero Section */}
        <section className="mt-4 mb-10 space-y-4">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5">
            <span className="text-[10px] font-extrabold tracking-widest text-blue-400 uppercase">● PREMIUM ÜYELİK</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold leading-tight tracking-tight text-slate-100">
            Sağlığınıza yapacağınız en iyi yatırım bugün başlar.
          </h1>
          <p className="text-[14px] text-slate-400 font-medium leading-relaxed">
            Kararlılık bağlılıktan doğar - ödeme yapmak kararınızı somutlaştırır.
          </p>
          <p className="text-[12px] italic text-blue-400/80 font-medium">
            Uygulamanın maliyeti tasarruf edeceğiniz miktarla kıyasladığınızda çok makul kalıyor.
          </p>
        </section>

        {/* Plan Selection */}
        <section className="space-y-6">
          <h2 className="text-[15px] font-extrabold text-slate-100 uppercase tracking-wider">TEKLİFİNİZİ SEÇİN</h2>
          <div className="space-y-3">
            {plans.map((plan) => (
              <label 
                key={plan.id}
                className="relative block cursor-pointer group"
                onClick={() => setSelectedPlan(plan.id as any)}
              >
                <div className={`flex items-center justify-between p-5 rounded-2xl transition-all duration-300 ${
                  selectedPlan === plan.id 
                    ? 'bg-slate-800/50 border border-blue-500/40 shadow-[inset_0_0_15px_rgba(0,201,255,0.05)]' 
                    : 'bg-slate-800/50 border border-white/5'
                }`}>
                  <div className="flex items-center space-x-4">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedPlan === plan.id ? 'border-blue-500 bg-blue-500 shadow-[0_0_10px_rgba(0,201,255,0.4)]' : 'border-outline'
                    }`}>
                      {selectedPlan === plan.id && <div className="w-2 h-2 rounded-full bg-on-primary"></div>}
                    </div>
                    <div className="text-left">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-bold text-slate-100">{plan.title}</p>
                        {plan.badge && (
                          <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-sm uppercase ${
                            plan.id === '6months' ? 'bg-amber-400 text-amber-950' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full'
                          }`}>
                            {plan.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[12px] text-slate-400">{plan.totalPrice} toplam</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[12px] font-semibold text-blue-400">haftalık {plan.weeklyPrice}</p>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-10 space-y-4">
          <button 
            onClick={() => {
              setIsPremium(true);
              onNavigate('dashboard');
            }}
            className="w-full bg-blue-500 shadow-[0_4px_14px_rgba(0,201,255,0.4)] h-14 rounded-2xl text-white font-extrabold text-[16px] flex items-center justify-center space-x-2 active:scale-[0.98] transition-all"
          >
            <Lock size={18} />
            <span>Satın Al</span>
          </button>
          <p className="text-[11px] text-slate-400 text-center leading-relaxed px-4 opacity-70">
            iTunes / Google Play hesabınızdan tahsil edilir. İstediğiniz zaman iptal edebilirsiniz.
          </p>
        </section>

        {/* Privileges Section */}
        <section className="mt-16 space-y-8">
          <h2 className="text-[15px] font-extrabold text-slate-100 uppercase tracking-wider">Premium Ayrıcalıkları</h2>
          <div className="space-y-6">
            {privileges.map((priv, i) => (
              <div key={i} className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl bg-slate-800/50 border border-white/5 flex items-center justify-center flex-shrink-0 text-blue-400">
                  <priv.icon size={24} fill="currentColor" fillOpacity={0.2} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-[14px] font-bold text-slate-100">{priv.title}</h3>
                  <p className="text-[12px] leading-relaxed text-slate-400">{priv.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
