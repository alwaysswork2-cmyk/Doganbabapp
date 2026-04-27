import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { 
  Timer, 
  Wind, 
  Droplets, 
  Zap, 
  CheckCircle2, 
  XCircle, 
  ChevronRight,
  AirVent,
  Footprints,
  Dumbbell,
  ShieldCheck,
  Wind as AirIcon,
  Trophy,
  Heart,
  Play,
  Brain,
  Clock
} from 'lucide-react';

import BottomNav from './BottomNav';
import { Step } from '../types';

interface CrisisOverlayProps {
  isOpen: boolean;
  onClose: (resolved: boolean) => void;
  techniqueId: string | null;
  onNavigate: (step: Step) => void;
}

type CrisisStep = 'delay' | 'delayTask' | 'breathe' | 'water' | 'waterTask' | 'suppress' | 'suppressTask' | 'distract' | 'distractTask' | 'success' | 'failed' | 'trigger' | 'triggerTask' | 'walk' | 'walkTask' | 'intro' | 'motivation' | 'motivationTask' | 'suggestion' | 'suggestionTask' | 'surf' | 'surfTask';

export default function CrisisOverlay({ isOpen, onClose, techniqueId, onNavigate }: CrisisOverlayProps) {
  // Compute the correct initial step synchronously so there's never a
  // one-frame flash of the wrong step when the overlay first opens.
  const getInitialStep = (id: string | null): CrisisStep => {
    if (id === 'trigger') return 'trigger';
    if (id === 'walk') return 'walk';
    if (id === '4d') return 'intro';
    if (id === 'breathing') return 'breathe';
    if (id === 'water') return 'waterTask';
    if (id === 'suppress') return 'suppress';
    if (id === 'motivation') return 'motivation';
    if (id === 'suggestion') return 'suggestion';
    if (id === 'air') return 'surf';
    return 'distractTask';
  };

  const [currentStep, setCurrentStep] = useState<CrisisStep>(() => getInitialStep(techniqueId));
  const [is4DFlow, setIs4DFlow] = useState(techniqueId === '4d');
  
  // Trigger Timer State
  const [triggerTime, setTriggerTime] = useState(300); // 5 minutes
  const [isTriggerRunning, setIsTriggerRunning] = useState(false);

  // Delay Timer State
  const [delayTime, setDelayTime] = useState(180); // 3 minutes
  const [isDelayRunning, setIsDelayRunning] = useState(false);

  // Breathing State
  const [breathePhase, setBreathePhase] = useState<'ready' | 'inhale' | 'hold' | 'exhale' | 'done'>('ready');
  const [breatheSecs, setBreatheSecs] = useState(0);
  const [breatheRep, setBreatheRep] = useState(0);

  // Water State
  const [waterDrank, setWaterDrank] = useState(false);

  // Distract State
  const [distractChecks, setDistractChecks] = useState<boolean[]>([false, false, false, false]);
  const distractItems = [
    { icon: Footprints, text: '50 adım yürü' },
    { icon: Dumbbell, text: '10 şinav çek' },
    { icon: Zap, text: 'Müzik dinle' },
  ];

  // Walk Timer State
  const [walkTime, setWalkTime] = useState(900); // 15 minutes
  const [isWalkRunning, setIsWalkRunning] = useState(false);

  // Motivation State
  const [selectedMood, setSelectedMood] = useState<{ emoji: string, label: string, fullLabel: string, message: string } | null>(null);

  // Suggestion State
  const [selectedSuggestion, setSelectedSuggestion] = useState<{ emoji: string, label: string, fullLabel: string, reason: string, suggestion: string } | null>(null);

  // Surf Timer State
  const [surfTime, setSurfTime] = useState(600); // 10 minutes
  const [isSurfRunning, setIsSurfRunning] = useState(false);

  const moods = [
    { emoji: '😫', label: 'Zorlanıyorum', fullLabel: 'Zorlanıyorum', message: 'Şu an hissettiğin bu baskı, vücudunun yıllardır alıştığı bir maddeden arınma mücadelesidir. Bu durumun geçici olduğunu ve aslında **iyileştiğinin bir işareti** olduğunu unutma. Sabret, her geçen dakika seni daha özgür bir hayata yaklaştırıyor.' },
    { emoji: '🥱', label: 'Sıkıldım', fullLabel: 'Sıkıldım', message: 'Beynindeki dopamin seviyeleri şu an sigaranın verdiği yapay artıştan yoksun olduğu için her zamanki işlerden keyif alamıyor olabilirsin. Bu \'beyin sisi\' ve boşluk hissi yakında dağılacak. Hemen zihnini meşgul edecek **yeni bir aktiviteye** (bulmaca çözmek, bir şeyler okumak) odaklan; dikkati dağıtmak krizin etkisini kırar.' },
    { emoji: '😡', label: 'Sinirlendim', fullLabel: 'Sinirlendim', message: 'Sigarayı bırakanlarda öfke ve huzursuzluk en yaygın duygulardır, bu senin suçun değil. Vücudun nikotin baskısından kurtulurken sinir sistemin yeniden kalibre oluyor. Hemen **derin bir nefes al**; bu patlayıcı duygu dalgası birkaç hafta içinde yerini sakinliğe bırakacak.' },
    { emoji: '🚬', label: 'Canım çok istiyor', fullLabel: 'Canım Çok İstiyor', message: 'Bu yoğun içme isteği aslında sadece bir dalga ve biyolojik olarak **en fazla 10-15 dakika sürer**. Teslim olmak zorunda değilsin, çünkü bu süre sonunda içsen de içmesen de o istek kendiliğinden sönecek. Şimdi bir bardak soğuk su iç ve sadece 10 dakika ertelemeyi dene.' },
    { emoji: '📉', label: 'Motivasyon azaldı', fullLabel: 'Motivasyonum Azaldı', message: 'Beynin şu an doğal dopamin üretmekte zorlandığı için \'pes et\' sinyalleri gönderiyor olabilir. Ancak unutma; eğer bu ilk **28 günü sigarasız geçirebilirsen**, kalıcı olarak bırakma şansın tam 5 kat artacak. Neden başladığını ve bugüne kadar ne kadar yol kat ettiğini kendine hatırlat!' },
    { emoji: '😰', label: 'Huzursuzum', fullLabel: 'Huzursuzum / Yerimde Duramıyorum', message: 'Vücudun nikotinin sahte uyarısına alışmıştı, şimdi kendi doğal ritmini bulmaya çalışırken \'tetikte\' hissediyor olabilirsin. Hemen ayağa kalk ve **10 dakikalık kısa bir yürüyüş yap**; fiziksel hareket bu fazla enerjiyi ve gerginliği atmanı sağlayan doğal bir ilaçtır.' },
    { emoji: '👥', label: 'Çevremden etki', fullLabel: 'Çevremden Etkileniyorum', message: 'Etrafında sigara içenleri gördüğünde bir mahrumiyet hissetmen normal ancak aldanma; **içenler aslında bir keyif sürmüyor**, sadece beyinlerindeki boş reseptörleri doyurmak için bir zehre muhtaçlar. Onlar bu bağımlılık döngüsünün esiriyken, sen zincirlerini kırdın ve özgürlüğünü ilan ettin. Onlara özenmek yerine, prangalarından kurtulduğun ve artık **özgür olduğun** için kendinle gurur duy.' },
    { emoji: '☕', label: 'Kahveyle içmek', fullLabel: 'Kahveyle İçmek İstiyorum', message: 'Kahve en güçlü rutin tetikleyicilerinden biridir ancak sigarayı bıraktığında vücudun kafeini eskisine göre **iki kat daha yavaş** metabolize eder. Bu durum, sigara içtiğin dönemdeki kadar kahve tüketmenin kanındaki kafein seviyesini aşırı yükselterek sende çarpıntı, uykusuzluk ve gerginlik yaratmasına neden olur. Bu huzursuzluğu nikotin yoksunluğu sanıp yanılma; beynindeki o eski bağı koparmak için kahve miktarını yarıya indir, farklı bir ortamda içmeyi dene veya bir süreliğine kahve yerine soğuk su tüket.' },
  ];

  const suggestions = [
    { 
      emoji: '🚬', 
      label: 'Zorlanıyorum', 
      fullLabel: 'Zorlanıyorum / Canım Çok İstiyor', 
      reason: 'Beynindeki nikotin reseptörleri yıllarca alıştığı dozu beklemekte ve bu "eksiklik" için şiddetli aşerme sinyalleri göndermektedir.',
      suggestion: 'Bir sigara krizi dalga gibidir ve biyolojik olarak genellikle **5-10 dakika** içinde azalır. Şimdi isteği ertele ve kriz anı sayfasını kullanmayı unutma.'
    },
    { 
      emoji: '😡', 
      label: 'Sinirliyim', 
      fullLabel: 'Sinirliyim / Gerginim', 
      reason: 'Vücudun nikotinsiz bir hayata uyum sağlarken sinir sistemin yeniden kalibre oluyor; bu huzursuzluk aslında bir iyileşme işaretidir.',
      suggestion: 'Sakinleşmek için hemen derin bir nefes al, kısa bir yürüyüşe çık veya odağını değiştir. Bu stres birazdan geçecek, kendine güven!'
    },
    { 
      emoji: '🧠', 
      label: 'Odaklanamıyorum', 
      fullLabel: 'Odaklanamıyorum / Beyin Sisi', 
      reason: 'Nikotinin çekilmesi, dopamin yollarını etkileyerek dikkat ve konsantrasyon mekanizmalarının geçici olarak aksamasına neden olur.',
      suggestion: 'Kendine zaman tanı ve zihinsel yükünü hafifletmek için işlerini 25 dakikalık bloklara böl, bol su iç ve en az 7 saat uyu.'
    },
    { 
      emoji: '🥱', 
      label: 'Sıkıldım', 
      fullLabel: 'Sıkıldım / Boşluktayım', 
      reason: 'Sigaranın sağladığı yapay dopamin deşarjları durduğu için beynin eski rutinlerden (molalar, sohbetler) aldığı keyif geçici olarak azalmıştır.',
      suggestion: 'Aktiviteler sıkıntıyı giderir; hemen yeni bir aktiviteye (şarkı dinlemek, bir arkadaşını aramak) odaklan. Egzersiz ve derin nefes ile Dopamin sistemini destekle.'
    },
    { 
      emoji: '😔', 
      label: 'Üzgünüm', 
      fullLabel: 'Üzgünüm / Motivasyonum Azaldı', 
      reason: 'Beyin nikotin eksikliğinde dopamin açlığı çektiği için kendini moralsiz veya çökkün hissetmen kimyasal bir süreçtir.',
      suggestion: 'Kendini ödüllendir (bir film izle, sevdiğin bir yemeği ye veya kendine küçük bir hediye al). Bıraktıktan sonra hayatında değişen, değişecek şeyleri yaz ve oku, Kriz anı sayfasından motivasyon almayı unutma.'
    },
    { 
      emoji: '🍽️', 
      label: 'Acıkıyorum', 
      fullLabel: 'Sürekli Acıkıyorum', 
      reason: 'Nikotinin iştah bastırıcı etkisi kalktı ve tat/koku duyuların keskinleştiği için yemekler artık çok daha cazip geliyor.',
      suggestion: 'Salata, baklagiller veya kuruyemiş gibi düşük kalorili ve tok tutan atıştırmalıklara yönel. Şekersiz sakız çiğneyerek ağzını meşgul tut ve yemek yerken sadece yemeğe odaklan.'
    },
    { 
      emoji: '☕', 
      label: 'Kahve/Çay', 
      fullLabel: 'Kahve / Çay ile İçmek İstiyorum', 
      reason: 'Beynin kahve ve sigara rutinini birbirine güçlü bir şekilde bağlamıştır (şartlanma).',
      suggestion: 'Rutini boz; kahveni her zamankinden **farklı bir odada veya farklı bir fincanla** iç. Eğer çok zorlanıyorsan bir süreliğine kahve yerine soğuk meyve suyu veya çayı (farklı bir şeyi) tercih et.'
    },
    { 
      emoji: '🚽', 
      label: 'Kabızlık Sorunu', 
      fullLabel: 'Kabızlık Sorunu', 
      reason: 'Nikotin bağırsak hareketlerini uyaran bir maddeydi; bırakınca vücut bu dış uyarıcıyı arar ve sindirim geçici olarak yavaşlar.',
      suggestion: 'Lifli gıdalar (Salata, Yulaf, Meyve) tüket, bol su iç ve metabolizmanı hızlandırmak için her gün kısa yürüyüşler yap.'
    },
  ];

  const renderMessage = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-blue-400 font-extrabold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  // Reset all transient state when a new technique is selected.
  // Since we removed the key prop from CrisisOverlay, we must update state here.
  useEffect(() => {
    if (techniqueId) {
      setIs4DFlow(techniqueId === '4d');
      setCurrentStep(getInitialStep(techniqueId));
      setBreathePhase('ready');
      setBreatheRep(0);
      setBreatheSecs(0);
      setWaterDrank(false);
      setDistractChecks([false, false, false, false]);
      setDelayTime(180);
      setIsDelayRunning(false);
      setTriggerTime(300);
      // Auto-start trigger timer for the trigger technique
      setIsTriggerRunning(techniqueId === 'trigger');
      setWalkTime(900);
      setIsWalkRunning(false);
      setSurfTime(600);
      setIsSurfRunning(false);
      setSelectedMood(null);
    }
  }, [techniqueId]);

  // Start delay timer when entering delayTask
  useEffect(() => {
    if (currentStep === 'delayTask') {
      setIsDelayRunning(true);
    }
  }, [currentStep]);

  // Trigger Timer Logic
  useEffect(() => {
    let interval: any;
    if (isTriggerRunning && triggerTime > 0) {
      interval = setInterval(() => {
        setTriggerTime(prev => prev - 1);
      }, 1000);
    } else if (triggerTime === 0) {
      setIsTriggerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTriggerRunning, triggerTime === 0]);

  // Delay Timer Logic
  useEffect(() => {
    let interval: any;
    if (isDelayRunning && delayTime > 0) {
      interval = setInterval(() => {
        setDelayTime(prev => prev - 1);
      }, 1000);
    } else if (delayTime === 0) {
      setIsDelayRunning(false);
    }
    return () => clearInterval(interval);
  }, [isDelayRunning, delayTime === 0]);

  // Walk Timer Logic
  useEffect(() => {
    let interval: any;
    if (isWalkRunning && walkTime > 0) {
      interval = setInterval(() => {
        setWalkTime(prev => prev - 1);
      }, 1000);
    } else if (walkTime === 0) {
      setIsWalkRunning(false);
    }
    return () => clearInterval(interval);
  }, [isWalkRunning, walkTime === 0]);

  // Surf Timer Logic
  useEffect(() => {
    let interval: any;
    if (isSurfRunning && surfTime > 0) {
      interval = setInterval(() => {
        setSurfTime(prev => prev - 1);
      }, 1000);
    } else if (surfTime === 0) {
      setIsSurfRunning(false);
    }
    return () => clearInterval(interval);
  }, [isSurfRunning, surfTime === 0]);

  // Breathing Logic
  const startBreathing = () => {
    setBreathePhase('inhale');
    setBreatheSecs(4);
    setBreatheRep(0);
  };

  useEffect(() => {
    let interval: any;
    if (breathePhase !== 'ready' && breathePhase !== 'done') {
      interval = setInterval(() => {
        setBreatheSecs(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [breathePhase]);

  useEffect(() => {
    if (breatheSecs <= 0 && breathePhase !== 'ready' && breathePhase !== 'done') {
      if (breathePhase === 'inhale') {
        setBreathePhase('hold');
        setBreatheSecs(7);
      } else if (breathePhase === 'hold') {
        setBreathePhase('exhale');
        setBreatheSecs(8);
      } else if (breathePhase === 'exhale') {
        if (breatheRep < 2) {
          setBreatheRep(r => r + 1);
          setBreathePhase('inhale');
          setBreatheSecs(4);
        } else {
          setBreathePhase('done');
        }
      }
    }
  }, [breatheSecs, breathePhase, breatheRep]);

  const renderDots = (step: CrisisStep) => {
    const steps: CrisisStep[] = ['delay', 'breathe', 'water', 'distract', 'trigger', 'walk'];
    const activeIdx = steps.indexOf(step as any);
    return (
      <div className="flex w-full flex-row items-center justify-center gap-3 py-8">
        {steps.map((_, i) => (
          <div 
            key={i} 
            className={`rounded-full transition-all duration-300 ${
              i === activeIdx 
                ? 'h-1.5 w-10 bg-blue-500 shadow-[0_0_15px_rgba(37,123,244,0.6)]' 
                : 'h-1.5 w-1.5 bg-slate-700'
            }`}
          />
        ))}
      </div>
    );
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="backdrop"
          className="fixed inset-0 z-[200] bg-[#0a0f18]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
        />
      )}
      
      {isOpen && (
        <motion.div
          key="panel"
          className="fixed inset-0 z-[201] flex flex-col bg-[#0a0f18] font-display will-change-transform"
          initial={{ x: '-100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        exit={{ x: '-100%', opacity: 0 }}
        transition={{
          x: { type: 'spring', stiffness: 260, damping: 30, mass: 0.9 },
          opacity: { duration: 0.2, ease: 'easeOut' },
        }}
      >
        
          {currentStep === 'intro' && (
            <div 
              key="intro"
              
              
              
              className="flex flex-col flex-1 px-6 pt-4 pb-10"
            >
              {/* Top Bar */}
              <div className="flex items-center py-2 justify-between mb-4">
                <div 
                  className="text-blue-400 flex size-12 shrink-0 items-center justify-start cursor-pointer"
                  onClick={() => onClose(false)}
                >
                  <Play size={24} className="rotate-180" />
                </div>
                <h2 className="text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 text-center font-display">4D Tekniği</h2>
                <div className="w-12" />
              </div>

              {/* Center Content */}
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-32 h-32 rounded-full bg-blue-500/20 flex items-center justify-center mb-8">
                  <ShieldCheck className="text-blue-400" size={64} />
                </div>
                <h3 className="text-slate-100 text-2xl font-extrabold mb-6 font-display uppercase tracking-tight">Kriz Yönetimi</h3>
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-3xl p-6 mb-8">
                  <p className="text-slate-300 text-base font-medium leading-relaxed font-display">
                    4D tekniği; Ertele, Derin Nefes Al, Su İç ve İstek Sörfü Yap adımlarından oluşan, kriz anlarını yönetmek için geliştirilmiş bilimsel bir yöntemdir.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-12 flex flex-col items-center">
                <button 
                  onClick={() => setCurrentStep('delayTask')}
                  className="w-[80%] h-14 rounded-full bg-gradient-to-r from-[#FFD700] via-[#FFEA00] to-[#F9D423] shadow-lg shadow-yellow-500/20 active:scale-[0.98] transition-all flex items-center justify-center"
                >
                  <span className="text-slate-900 text-lg font-extrabold leading-normal tracking-wide font-display uppercase">BAŞLA</span>
                </button>
              </div>
            </div>
          )}

          {currentStep === 'walk' && (
            <div 
              key="walk"
              
              
              
              className="flex flex-col flex-1 px-6 pt-4 pb-10"
            >
              {/* Top Bar */}
              <div className="flex items-center py-2 justify-between mb-4">
                <div 
                  className="text-blue-400 flex size-12 shrink-0 items-center justify-start cursor-pointer"
                  onClick={() => onClose(false)}
                >
                  <Play size={24} className="rotate-180" />
                </div>
                <h2 className="text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 text-center font-display">Kriz Anı</h2>
                <div className="w-12" />
              </div>

              {/* Instruction Text */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 mb-8">
                <p className="text-blue-400 text-sm font-medium leading-relaxed text-center font-display">
                  Yürüyüş Yap: Hemen ayağa kalk ve kısa bir yürüyüşe çık. Yürürken derin nefes al ve isteğin azalmasına izin ver.
                </p>
              </div>

              {/* Icon Section (Replaced Timer) */}
              <div className="flex-1 flex items-center justify-center relative">
                {/* Outer Ring Glow */}
                <div className="absolute w-64 h-64 rounded-full border-4 border-blue-500/20"></div>
                {/* Main Circle */}
                <div className="relative flex flex-col items-center justify-center w-60 h-60 rounded-full border-[6px] border-blue-500 shadow-[0_0_40px_rgba(37,123,244,0.3)] bg-slate-800/50">
                  <Footprints className="text-blue-400 mb-4" size={64} />
                  <span className="text-slate-100 text-2xl font-bold tracking-tight font-display uppercase">YÜRÜYÜŞ</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-12 flex flex-col items-center gap-4">
                <button 
                  onClick={() => setCurrentStep('walkTask')}
                  className="w-[80%] h-14 rounded-full bg-gradient-to-r from-[#FFD700] via-[#FFEA00] to-[#F9D423] shadow-lg shadow-yellow-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                  <span className="text-slate-900 text-lg font-extrabold leading-normal tracking-wide font-display uppercase">BAŞLA</span>
                </button>
                <button 
                  onClick={() => setCurrentStep('failed')}
                  className="w-full py-2 flex items-center justify-center"
                >
                  <span className="text-slate-500 text-xs font-bold uppercase tracking-widest hover:text-slate-300 transition-colors font-display">BU SEFER OLMADI</span>
                </button>
              </div>

              {/* Tips Section */}
              <div className="mt-8 grid grid-cols-4 gap-3">

              </div>
            </div>
          )}

          {currentStep === 'walkTask' && (
            <div 
              key="walkTask"
              
              
              
              className="flex flex-col flex-1 px-6 pt-4 pb-10"
            >
              {/* Top Bar */}
              <div className="flex items-center py-2 justify-between mb-4">
                <div 
                  className="text-blue-400 flex size-12 shrink-0 items-center justify-start cursor-pointer"
                  onClick={() => onClose(false)}
                >
                  <Play size={24} className="rotate-180" />
                </div>
                <h2 className="text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 text-center font-display">Kriz Anı</h2>
                <div className="w-12" />
              </div>

              {/* Instruction Text */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 mb-6">
                <p className="text-blue-400 text-sm font-medium leading-relaxed text-center font-display">
                  10 dakika yürüyüş yap.
                </p>
              </div>

              {/* Suggestions */}
              <div className="flex-1 flex flex-col gap-3">
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 flex items-center gap-4">
                  <div className="text-2xl w-10 h-10 flex items-center justify-center bg-slate-800/50 rounded-xl">🚶‍♂️</div>
                  <div className="flex-1">
                    <p className="text-slate-100 font-bold text-sm">Hemen ayağa kalk</p>
                    <p className="text-slate-400 text-xs text-balance">Kısa bir yürüyüşe çık</p>
                  </div>
                </div>
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 flex items-center gap-4">
                  <div className="text-2xl w-10 h-10 flex items-center justify-center bg-slate-800/50 rounded-xl">🌬️</div>
                  <div className="flex-1">
                    <p className="text-slate-100 font-bold text-sm">Derin nefes al</p>
                    <p className="text-slate-400 text-xs text-balance">Yürürken nefesine odaklan</p>
                  </div>
                </div>
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 flex items-center gap-4">
                  <div className="text-2xl w-10 h-10 flex items-center justify-center bg-slate-800/50 rounded-xl">🧠</div>
                  <div className="flex-1">
                    <p className="text-slate-100 font-bold text-sm">Zihnini serbest bırak</p>
                    <p className="text-slate-400 text-xs text-balance">Sigara isteğinin azalmasına izin ver</p>
                  </div>
                </div>
                
                <div className="mt-4 text-center px-4">
                  <p className="text-slate-300 text-sm font-medium italic leading-relaxed">
                    Yürüyüş dopamin salınımını destekleyerek isteği bastırır.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col items-center gap-4">
                <button 
                  onClick={() => setCurrentStep('success')}
                  className="w-[80%] h-14 rounded-full bg-gradient-to-r from-[#FFD700] via-[#FFEA00] to-[#F9D423] shadow-lg shadow-yellow-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                  <span className="text-slate-900 text-lg font-extrabold leading-normal tracking-wide font-display uppercase">TAMAMLANDI</span>
                </button>
                <button 
                  onClick={() => setCurrentStep('failed')}
                  className="w-full py-2 flex items-center justify-center"
                >
                  <span className="text-slate-500 text-xs font-bold uppercase tracking-widest hover:text-slate-300 transition-colors font-display">BU SEFER OLMADI</span>
                </button>
              </div>
            </div>
          )}

          {currentStep === 'trigger' && (
            <div 
              key="trigger"
              
              
              
              className="flex flex-col flex-1 px-6 pt-4 pb-10"
            >
              {/* Top Bar */}
              <div className="flex items-center py-2 justify-between mb-4">
                <div 
                  className="text-blue-400 flex size-12 shrink-0 items-center justify-start cursor-pointer"
                  onClick={() => onClose(false)}
                >
                  <Play size={24} className="rotate-180" />
                </div>
                <h2 className="text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 text-center font-display">Kriz Anı</h2>
                <div className="w-12" />
              </div>

              {/* Instruction Text */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 mb-8">
                <p className="text-blue-400 text-sm font-medium leading-relaxed text-center font-display">
                  Tetikleyici Değiştir: Sigara isteğini artıran tetikleyiciden kurtul. Bu bilimsel yöntem kriz anını atlatmanı sağlar.
                </p>
              </div>

              {/* Icon Section (Replaced Timer) */}
              <div className="flex-1 flex items-center justify-center relative">
                {/* Outer Ring Glow */}
                <div className="absolute w-64 h-64 rounded-full border-4 border-blue-500/20"></div>
                {/* Main Circle */}
                <div className="relative flex flex-col items-center justify-center w-60 h-60 rounded-full border-[6px] border-yellow-500 shadow-[0_0_40px_rgba(255,215,0,0.3)] bg-slate-800/50">
                  <Zap className="text-yellow-400 mb-4" size={64} />
                  <span className="text-slate-100 text-2xl font-bold tracking-tight font-display uppercase">DEĞİŞTİR</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-12 flex flex-col items-center gap-4">
                  <button 
                    onClick={() => selectedMood && setCurrentStep('motivationTask')}
                    className={`w-[80%] h-14 rounded-full shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-3 ${selectedMood ? 'bg-gradient-to-r from-[#FFD700] via-[#FFEA00] to-[#F9D423] shadow-yellow-500/20' : 'bg-slate-700 opacity-50 cursor-not-allowed'}`}
                  >
                    <span className={`${selectedMood ? 'text-slate-900' : 'text-slate-400'} text-lg font-extrabold leading-normal tracking-wide font-display uppercase`}>BAŞLA</span>
                  </button>
                <button 
                  onClick={() => setCurrentStep('failed')}
                  className="w-full py-2 flex items-center justify-center"
                >
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-slate-100 transition-colors font-display">BU SEFER OLMADI</span>
                </button>
              </div>


            </div>
          )}

          {currentStep === 'triggerTask' && (
            <div 
              key="triggerTask"
              
              
              
              className="flex flex-col flex-1 px-6 pt-4 pb-10"
            >
              {/* Top Bar */}
              <div className="flex items-center py-2 justify-between mb-4">
                <div 
                  className="text-blue-400 flex size-12 shrink-0 items-center justify-start cursor-pointer"
                  onClick={() => onClose(false)}
                >
                  <Play size={24} className="rotate-180" />
                </div>
                <h2 className="text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 text-center font-display">Kriz Anı</h2>
                <div className="w-12" />
              </div>

              {/* Instruction Text */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 mb-6">
                <p className="text-blue-400 text-sm font-medium leading-relaxed text-center font-display">
                  Sigara isteğini artıran tetikleyiciden kurtul.
                </p>
              </div>

              {/* Suggestions */}
              <div className="flex-1 flex flex-col gap-3">
                <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-4 flex items-center gap-4">
                  <div className="text-2xl w-10 h-10 flex items-center justify-center bg-slate-800/50 rounded-xl">☕</div>
                  <div className="flex-1">
                    <p className="text-slate-100 font-bold text-sm">Kahve içiyorsan</p>
                    <p className="text-slate-400 text-xs">→ Çay veya su iç</p>
                  </div>
                </div>
                <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-4 flex items-center gap-4">
                  <div className="text-2xl w-10 h-10 flex items-center justify-center bg-slate-800/50 rounded-xl">🚬</div>
                  <div className="flex-1">
                    <p className="text-slate-100 font-bold text-sm">Sigara kokusu varsa</p>
                    <p className="text-slate-400 text-xs">→ O ortamdan uzaklaş</p>
                  </div>
                </div>
                <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-4 flex items-center gap-4">
                  <div className="text-2xl w-10 h-10 flex items-center justify-center bg-slate-800/50 rounded-xl">🍽️</div>
                  <div className="flex-1">
                    <p className="text-slate-100 font-bold text-sm">Yemek sonrası</p>
                    <p className="text-slate-400 text-xs">→ Sevdiğin bir meyve ile değiştir</p>
                  </div>
                </div>
                
                <div className="mt-4 text-center px-4">
                  <p className="text-slate-400 text-sm font-medium italic leading-relaxed">
                    Şimdi tetikleyicini fark et ve değiştir.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col items-center gap-4">
                  <button 
                    onClick={() => setCurrentStep('triggerTask')}
                    className="w-[80%] h-14 rounded-full bg-gradient-to-r from-[#FFD700] via-[#FFEA00] to-[#F9D423] shadow-lg shadow-yellow-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                  >
                    <span className="text-slate-900 text-lg font-extrabold leading-normal tracking-wide font-display uppercase">BAŞLA</span>
                  </button>
                <button 
                  onClick={() => setCurrentStep('failed')}
                  className="w-full py-2 flex items-center justify-center"
                >
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-slate-100 transition-colors font-display">BU SEFER OLMADI</span>
                </button>
              </div>
            </div>
          )}

          {currentStep === 'delay' && (
            <div 
              key="delay"
              
              
              
              className="flex flex-col flex-1 px-6 pt-4 pb-10"
            >
              {/* Top App Bar */}
              <div className="flex items-center py-2 justify-between mb-4">
                <div 
                  className="text-blue-400 flex size-12 shrink-0 items-center justify-start cursor-pointer"
                  onClick={() => onClose(false)}
                >
                  <Play size={24} className="rotate-180" />
                </div>
                <h2 className="text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 text-center font-display">Kriz Anı</h2>
                <div className="w-12" />
              </div>

              {/* Instruction Text */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 mb-8">
                <p className="text-blue-400 text-sm font-medium leading-relaxed text-center font-display">
                  4D Tekniği: Ertele, Derin Nefes Al, Su İç, İstek Sörfü Yap. Bu bilimsel yöntem kriz anını atlatmanı sağlar.
                </p>
              </div>

              {/* Icon Section (Replaced Timer) */}
              <div className="flex-1 flex items-center justify-center relative">
                {/* Outer Ring Glow */}
                <div className="absolute w-64 h-64 rounded-full border-4 border-blue-500/20"></div>
                {/* Main Circle */}
                <div className="relative flex flex-col items-center justify-center w-60 h-60 rounded-full border-[6px] border-blue-500 shadow-[0_0_40px_rgba(0,201,255,0.3)] bg-slate-800/50">
                  <Clock className="text-blue-400 mb-4" size={64} />
                  <span className="text-slate-100 text-2xl font-bold tracking-tight font-display uppercase">ERTELE</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-12 flex flex-col items-center gap-4">
                {/* Primary Button with Yellow Gradient */}
                  <button 
                    onClick={() => {
                      setIsDelayRunning(true);
                      setCurrentStep('delayTask');
                    }}
                    className="w-[80%] h-14 rounded-full bg-gradient-to-r from-[#FFD700] via-[#FFEA00] to-[#F9D423] shadow-lg shadow-yellow-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                  >
                    <span className="text-slate-900 text-lg font-extrabold leading-normal tracking-wide font-display uppercase">BAŞLA</span>
                  </button>
                <button 
                  onClick={() => setCurrentStep('failed')}
                  className="w-full py-2 flex items-center justify-center"
                >
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-slate-100 transition-colors font-display">BU SEFER OLMADI</span>
                </button>
              </div>

              {/* Tips Section */}
              <div className="mt-8 grid grid-cols-4 gap-3">

              </div>
            </div>
          )}

          {currentStep === 'delayTask' && (
            <div 
              key="delayTask"
              
              
              
              className="flex flex-col flex-1 px-6 pt-4 pb-10"
            >
              {/* Top Bar */}
              <div className="flex items-center py-2 justify-between mb-4">
                <div 
                  className="text-blue-400 flex size-12 shrink-0 items-center justify-start cursor-pointer"
                  onClick={() => onClose(false)}
                >
                  <Play size={24} className="rotate-180" />
                </div>
                <h2 className="text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 text-center font-display">Kriz Anı</h2>
                <div className="w-12" />
              </div>

              {/* Instruction Text */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 mb-6">
                <p className="text-blue-400 text-sm font-medium leading-relaxed text-center font-display">
                  Sigara içme isteği dalga gibidir. Sadece 3 dakika bekle.
                </p>
              </div>

              {/* Timer Section */}
              <div className="flex-1 flex flex-col items-center justify-center relative">
                <div className="absolute w-64 h-64 rounded-full border-4 border-blue-500/20 animate-pulse"></div>
                <div className="relative flex flex-col items-center justify-center w-60 h-60 rounded-full border-[6px] border-blue-500 shadow-[0_0_40px_rgba(37,123,244,0.3)] bg-slate-800/50">
                  <div className="text-5xl font-black text-slate-100 mb-2 font-display tabular-nums">
                    {formatTime(delayTime)}
                  </div>
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">BEKLE</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-12 flex flex-col items-center gap-4">
                      {delayTime === 0 ? (
                  <button 
                    onClick={() => {
                      setIsDelayRunning(false);
                      setCurrentStep('breathe');
                    }}
                    className="w-[80%] h-14 rounded-full bg-gradient-to-r from-[#FFD700] via-[#FFEA00] to-[#F9D423] shadow-lg shadow-yellow-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                  >
                    <span className="text-slate-900 text-lg font-extrabold leading-normal tracking-wide font-display uppercase">TAMAMLANDI</span>
                  </button>
                ) : (
                  <div className="h-14 flex items-center justify-center">
                    <span className="text-blue-400 text-sm font-bold uppercase tracking-widest animate-pulse">Lütfen Bekleyin...</span>
                  </div>
                )}
                <button 
                  onClick={() => {
                    setIsDelayRunning(false);
                    setCurrentStep('failed');
                  }}
                  className="w-full py-2 flex items-center justify-center"
                >
                  <span className="text-slate-500 text-xs font-bold uppercase tracking-widest hover:text-slate-300 transition-colors font-display">BU SEFER OLMADI</span>
                </button>
              </div>
            </div>
          )}

          {currentStep === 'breathe' && (
            <div 
              key="breathe"
              
              
              
              className="flex flex-col flex-1 px-6 pt-4 pb-10"
            >
              {/* Top Bar */}
              <div className="flex items-center py-2 justify-between mb-4">
                <div 
                  className="text-blue-400 flex size-12 shrink-0 items-center justify-start cursor-pointer"
                  onClick={() => onClose(false)}
                >
                  <Play size={24} className="rotate-180" />
                </div>
                <h2 className="text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 text-center font-display">Kriz Anı</h2>
                <div className="w-12" />
              </div>

              {/* Instruction Text */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 mb-8">
                <p className="text-blue-400 text-sm font-medium leading-relaxed text-center font-display">
                  4-7-8 Tekniği: 4 saniye nefes al, 7 saniye tut ve 8 saniye ver. Bu döngüyü 3 kez tekrarla.
                </p>
              </div>

              {/* Timer Circle */}
              <div className="flex-1 flex items-center justify-center relative">
                {/* Outer Ring Glow */}
                <div 
                  
                  
                  className="absolute w-64 h-64 rounded-full border-4 border-blue-500/20"
                ></div>
                {/* Main Circle */}
                <div 
                  
                  
                  className="relative flex flex-col items-center justify-center w-60 h-60 rounded-full border-[6px] border-blue-500 shadow-[0_0_40px_rgba(37,123,244,0.3)] bg-slate-800/50"
                >
                  <span className="text-4xl font-extrabold text-slate-100 tracking-tighter font-display uppercase">
                    {breathePhase === 'ready' ? 'Hazır' : breathePhase === 'inhale' ? 'Nefes Al' : breathePhase === 'hold' ? 'Tut' : breathePhase === 'exhale' ? 'Nefes Ver' : 'Bitti'}
                  </span>
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mt-2">
                    {breathePhase === 'done' ? 3 : breatheRep + 1} / 3
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-12 flex flex-col items-center gap-4">
                {breathePhase === 'ready' ? (
                  <button 
                    onClick={startBreathing}
                    className="w-[80%] h-14 rounded-full bg-gradient-to-r from-[#FFD700] via-[#FFEA00] to-[#F9D423] shadow-lg shadow-yellow-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                  >
                    <span className="text-slate-900 text-lg font-extrabold leading-normal tracking-wide font-display uppercase">BAŞLA</span>
                  </button>
                ) : breathePhase === 'done' ? (
                  <button 
                    onClick={() => is4DFlow ? setCurrentStep('waterTask') : setCurrentStep('success')}
                    className="w-[80%] h-14 rounded-full bg-gradient-to-r from-[#FFD700] via-[#FFEA00] to-[#F9D423] shadow-lg shadow-yellow-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                  >
                    <span className="text-slate-900 text-lg font-extrabold leading-normal tracking-wide font-display uppercase">TAMAMLANDI</span>
                  </button>
                ) : (
                  <div className="h-14 flex items-center justify-center">
                    <span className="text-blue-400 text-sm font-bold uppercase tracking-widest animate-pulse">Nefesine Odaklan...</span>
                  </div>
                )}
                
                <button 
                  onClick={() => setCurrentStep('failed')}
                  className="w-full py-2 flex items-center justify-center"
                >
                  <span className="text-slate-500 text-xs font-bold uppercase tracking-widest hover:text-slate-300 transition-colors font-display">BU SEFER OLMADI</span>
                </button>
              </div>

              {/* Tips Section */}
              <div className="mt-8 grid grid-cols-4 gap-3">

              </div>
            </div>
          )}

          {currentStep === 'water' && (
            <div 
              key="water"
              
              
              
              className="flex flex-col flex-1 px-6 pt-4 pb-10"
            >
              {/* Top Bar */}
              <div className="flex items-center py-2 justify-between mb-4">
                <div 
                  className="text-blue-400 flex size-12 shrink-0 items-center justify-start cursor-pointer"
                  onClick={() => onClose(false)}
                >
                  <Play size={24} className="rotate-180" />
                </div>
                <h2 className="text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 text-center font-display">Kriz Anı</h2>
                <div className="w-12" />
              </div>

              {/* Instruction Text */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 mb-8">
                <p className="text-blue-400 text-sm font-medium leading-relaxed text-center font-display">
                  Su İç: Bir bardak soğuk suyu küçük yudumlarla, tadını alarak iç. Bu hem ağzını meşgul eder hem de toksinleri atar.
                </p>
              </div>

              {/* Icon Section (Replaced Timer) */}
              <div className="flex-1 flex items-center justify-center relative">
                {/* Outer Ring Glow */}
                <div className="absolute w-64 h-64 rounded-full border-4 border-blue-500/20 animate-pulse"></div>
                {/* Main Circle */}
                <div className="relative flex flex-col items-center justify-center w-60 h-60 rounded-full border-[6px] border-blue-500 shadow-[0_0_40px_rgba(37,123,244,0.3)] bg-slate-800/50">
                  <Droplets className="text-blue-400 mb-4" size={64} />
                  <span className="text-slate-100 text-2xl font-bold tracking-tight font-display uppercase">SU İÇ</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-12 flex flex-col items-center gap-4">
                <button 
                  onClick={() => setCurrentStep('waterTask')}
                  className="w-[80%] h-14 rounded-full bg-gradient-to-r from-[#FFD700] via-[#FFEA00] to-[#F9D423] shadow-lg shadow-yellow-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                  <span className="text-slate-900 text-lg font-extrabold leading-normal tracking-wide font-display uppercase">BAŞLA</span>
                </button>
                <button 
                  onClick={() => setCurrentStep('failed')}
                  className="w-full py-2 flex items-center justify-center"
                >
                  <span className="text-slate-500 text-xs font-bold uppercase tracking-widest hover:text-slate-300 transition-colors font-display">BU SEFER OLMADI</span>
                </button>
              </div>


            </div>
          )}

          {currentStep === 'waterTask' && (
            <div 
              key="waterTask"
              
              
              
              className="flex flex-col flex-1 px-6 pt-4 pb-10"
            >
              {/* Top Bar */}
              <div className="flex items-center py-2 justify-between mb-4">
                <div 
                  className="text-blue-400 flex size-12 shrink-0 items-center justify-start cursor-pointer"
                  onClick={() => onClose(false)}
                >
                  <Play size={24} className="rotate-180" />
                </div>
                <h2 className="text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 text-center font-display">Kriz Anı</h2>
                <div className="w-12" />
              </div>

              {/* Instruction Text */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 mb-6">
                <p className="text-blue-400 text-sm font-medium leading-relaxed text-center font-display">
                  Bir bardak soğuk suyu küçük yudumlarla, tadını alarak iç.
                </p>
              </div>

              {/* Icon Section */}
              <div className="flex-1 flex items-center justify-center relative">
                <div className="absolute w-64 h-64 rounded-full border-4 border-blue-500/20 animate-pulse"></div>
                <div className="relative flex flex-col items-center justify-center w-60 h-60 rounded-full border-[6px] border-blue-500 shadow-[0_0_40px_rgba(37,123,244,0.3)] bg-slate-800/50">
                  <Droplets className="text-blue-400 mb-4" size={64} />
                  <span className="text-slate-100 text-2xl font-bold tracking-tight font-display uppercase">YUDUMLA</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-12 flex flex-col items-center gap-4">
                <button 
                  onClick={() => {
                    setWaterDrank(true);
                    is4DFlow ? setCurrentStep('distractTask') : setCurrentStep('success');
                  }}
                  className="w-[80%] h-14 rounded-full bg-gradient-to-r from-[#FFD700] via-[#FFEA00] to-[#F9D423] shadow-lg shadow-yellow-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                  <span className="text-slate-900 text-lg font-extrabold leading-normal tracking-wide font-display uppercase">TAMAMLANDI</span>
                </button>
                <button 
                  onClick={() => setCurrentStep('failed')}
                  className="w-full py-2 flex items-center justify-center"
                >
                  <span className="text-slate-500 text-xs font-bold uppercase tracking-widest hover:text-slate-300 transition-colors font-display">BU SEFER OLMADI</span>
                </button>
              </div>
            </div>
          )}

          {currentStep === 'suppress' && (
            <div 
              key="suppress"
              
              
              
              className="flex flex-col flex-1 px-6 pt-4 pb-10"
            >
              {/* Top Bar */}
              <div className="flex items-center py-2 justify-between mb-4">
                <div 
                  className="text-blue-400 flex size-12 shrink-0 items-center justify-start cursor-pointer"
                  onClick={() => onClose(false)}
                >
                  <Play size={24} className="rotate-180" />
                </div>
                <h2 className="text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 text-center font-display">Kriz Anı</h2>
                <div className="w-12" />
              </div>

              {/* Instruction Text */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 mb-8">
                <p className="text-blue-400 text-sm font-medium leading-relaxed text-center font-display">
                  Nikotini Bastır: Ağzını sağlıklı seçeneklerle meşgul ederek sigara isteğini doğal yollarla azalt.
                </p>
              </div>

              {/* Icon Section */}
              <div className="flex-1 flex items-center justify-center relative">
                <div className="absolute w-64 h-64 rounded-full border-4 border-blue-500/20 animate-pulse"></div>
                <div className="relative flex flex-col items-center justify-center w-60 h-60 rounded-full border-[6px] border-blue-500 shadow-[0_0_40px_rgba(37,123,244,0.3)] bg-slate-800/50">
                  <ShieldCheck className="text-blue-400 mb-4" size={64} />
                  <span className="text-slate-100 text-2xl font-bold tracking-tight font-display uppercase">BASTIR</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-12 flex flex-col items-center gap-4">
                <button 
                  onClick={() => setCurrentStep('suppressTask')}
                  className="w-[80%] h-14 rounded-full bg-gradient-to-r from-[#FFD700] via-[#FFEA00] to-[#F9D423] shadow-lg shadow-yellow-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                  <span className="text-slate-900 text-lg font-extrabold leading-normal tracking-wide font-display uppercase">BAŞLA</span>
                </button>
                <button 
                  onClick={() => setCurrentStep('failed')}
                  className="w-full py-2 flex items-center justify-center"
                >
                  <span className="text-slate-500 text-xs font-bold uppercase tracking-widest hover:text-slate-300 transition-colors font-display">BU SEFER OLMADI</span>
                </button>
              </div>
            </div>
          )}

          {currentStep === 'suppressTask' && (
            <div 
              key="suppressTask"
              
              
              
              className="flex flex-col flex-1 px-6 pt-4 pb-10"
            >
              {/* Top Bar */}
              <div className="flex items-center py-2 justify-between mb-4">
                <div 
                  className="text-blue-400 flex size-12 shrink-0 items-center justify-start cursor-pointer"
                  onClick={() => onClose(false)}
                >
                  <Play size={24} className="rotate-180" />
                </div>
                <h2 className="text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 text-center font-display">Kriz Anı</h2>
                <div className="w-12" />
              </div>

              {/* Instruction Text */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 mb-6">
                <p className="text-blue-400 text-sm font-medium leading-relaxed text-center font-display">
                  Ağzını sağlıklı seçeneklerle meşgul et; çiğneme hareketi beyninde doğal dopamin salgısını destekleyerek isteği bastıracaktır.
                </p>
              </div>

              {/* Suggestions */}
              <div className="flex-1 flex flex-col gap-3">
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 flex items-center gap-4">
                  <div className="text-2xl w-10 h-10 flex items-center justify-center bg-slate-800/50 rounded-xl">🍬</div>
                  <div className="flex-1">
                    <p className="text-slate-100 font-bold text-sm">Sakız çiğne</p>
                    <p className="text-slate-400 text-xs text-balance">Şekersiz sakız tercih et</p>
                  </div>
                </div>
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 flex items-center gap-4">
                  <div className="text-2xl w-10 h-10 flex items-center justify-center bg-slate-800/50 rounded-xl">🥜</div>
                  <div className="flex-1">
                    <p className="text-slate-100 font-bold text-sm">Kuruyemiş ye</p>
                    <p className="text-slate-400 text-xs text-balance">Bir avuç çiğ kuruyemiş tüket</p>
                  </div>
                </div>
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 flex items-center gap-4">
                  <div className="text-2xl w-10 h-10 flex items-center justify-center bg-slate-800/50 rounded-xl">💧</div>
                  <div className="flex-1">
                    <p className="text-slate-100 font-bold text-sm">Su iç</p>
                    <p className="text-slate-400 text-xs text-balance">Bir bardak soğuk su iç</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col items-center gap-4">
                <button 
                  onClick={() => setCurrentStep('success')}
                  className="w-[80%] h-14 rounded-full bg-gradient-to-r from-[#FFD700] via-[#FFEA00] to-[#F9D423] shadow-lg shadow-yellow-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                  <span className="text-slate-900 text-lg font-extrabold leading-normal tracking-wide font-display uppercase">TAMAMLANDI</span>
                </button>
                <button 
                  onClick={() => setCurrentStep('failed')}
                  className="w-full py-2 flex items-center justify-center"
                >
                  <span className="text-slate-500 text-xs font-bold uppercase tracking-widest hover:text-slate-300 transition-colors font-display">BU SEFER OLMADI</span>
                </button>
              </div>
            </div>
          )}

          {currentStep === 'surf' && (
            <div 
              key="surf"
              
              
              
              className="flex flex-col flex-1 px-6 pt-2 pb-6"
            >
              {/* Top Bar */}
              <div className="flex items-center py-1 justify-between mb-2">
                <div 
                  className="text-blue-400 flex size-10 shrink-0 items-center justify-start cursor-pointer"
                  onClick={() => onClose(false)}
                >
                  <Play size={22} className="rotate-180" />
                </div>
                <h2 className="text-slate-100 text-base font-bold leading-tight tracking-tight flex-1 text-center font-display">İstek Sörfü Yap</h2>
                <div className="w-10" />
              </div>

              {/* Instruction Text */}
              <div className="mb-4">
                <h1 className="text-slate-100 text-xl font-extrabold leading-tight tracking-tight mb-2">
                  Sigara İsteğini İzle (Surfing)
                </h1>
                <p className="text-slate-400 text-xs font-medium leading-relaxed mb-4">
                  Sigara isteği bir dalga gibidir; onunla savaşmak yerine sadece izlerseniz birkaç dakika içinde kendiliğinden geçer.
                </p>
                
                <div className="space-y-2">
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 flex items-start gap-3">
                    <div className="text-lg w-7 h-7 flex items-center justify-center bg-slate-800/50 rounded-lg shrink-0">🎯</div>
                    <div>
                      <p className="text-slate-100 font-bold text-xs">Görev</p>
                      <p className="text-slate-400 text-[10px] leading-relaxed">10 dakikalık sayacı başlatın.</p>
                    </div>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 flex items-start gap-3">
                    <div className="text-lg w-7 h-7 flex items-center justify-center bg-slate-800/50 rounded-lg shrink-0">👀</div>
                    <div>
                      <p className="text-slate-400 text-[10px] leading-relaxed">Gelen sigara isteğini bastırmaya çalışmadan sadece gözlemleyin.</p>
                    </div>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 flex items-start gap-3">
                    <div className="text-lg w-7 h-7 flex items-center justify-center bg-slate-800/50 rounded-lg shrink-0">🫁</div>
                    <div>
                      <p className="text-slate-400 text-[10px] leading-relaxed">Nefesinize odaklanın ve isteğin yavaş yavaş azalmasını izleyin.</p>
                    </div>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 flex items-start gap-3">
                    <div className="text-lg w-7 h-7 flex items-center justify-center bg-slate-800/50 rounded-lg shrink-0">⏳</div>
                    <div>
                      <p className="text-slate-400 text-[10px] leading-relaxed">Sayaç bitene kadar sigara içmeden bekleyin</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 flex justify-center">
                <button 
                  onClick={() => {
                    setCurrentStep('surfTask');
                    setIsSurfRunning(true);
                  }}
                  className="w-[80%] h-12 rounded-full bg-gradient-to-r from-[#FFD700] via-[#FFEA00] to-[#F9D423] shadow-lg shadow-yellow-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                  <span className="text-slate-900 text-base font-extrabold leading-normal tracking-wide font-display uppercase">BAŞLA</span>
                </button>
              </div>
            </div>
          )}

          {currentStep === 'surfTask' && (
            <div 
              key="surfTask"
              
              
              
              className="flex flex-col flex-1 px-6 pt-4 pb-10"
            >
              {/* Top Bar */}
              <div className="flex items-center py-2 justify-between mb-4">
                <div 
                  className="text-blue-400 flex size-12 shrink-0 items-center justify-start cursor-pointer"
                  onClick={() => onClose(false)}
                >
                  <Play size={24} className="rotate-180" />
                </div>
                <h2 className="text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 text-center font-display">İstek Sörfü Yap</h2>
                <div className="w-12" />
              </div>

              {/* Timer Display */}
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="relative w-64 h-64 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      cx="128"
                      cy="128"
                      r="120"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-slate-800"
                    />
                    <circle
                      cx="128"
                      cy="128"
                      r="120"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeDasharray={754}
                      
                      
                      className="text-blue-400"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black text-white font-mono">
                      {Math.floor(surfTime / 60).toString().padStart(2, '0')}:{(surfTime % 60).toString().padStart(2, '0')}
                    </span>
                    <span className="text-slate-400 text-sm font-bold mt-2 uppercase tracking-widest">KALAN SÜRE</span>
                  </div>
                </div>

                <div className="mt-12 text-center">
                  <p className="text-slate-100 font-bold text-lg mb-2">Sörf Yapıyorsun...</p>
                  <p className="text-slate-400 text-sm">İsteğin gelip geçmesine izin ver.</p>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-auto flex flex-col items-center gap-4">
                <button 
                  onClick={() => {
                    setIsSurfRunning(false);
                    setCurrentStep('success');
                  }}
                  className="w-[80%] h-14 rounded-full bg-gradient-to-r from-[#FFD700] via-[#FFEA00] to-[#F9D423] shadow-lg shadow-yellow-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                  <span className="text-slate-900 text-lg font-extrabold leading-normal tracking-wide font-display uppercase">TAMAMLANDI</span>
                </button>
                <button 
                  onClick={() => {
                    setIsSurfRunning(false);
                    setCurrentStep('failed');
                  }}
                  className="w-full py-2 flex items-center justify-center"
                >
                  <span className="text-slate-500 text-xs font-bold uppercase tracking-widest hover:text-slate-300 transition-colors font-display">BU SEFER OLMADI</span>
                </button>
              </div>
            </div>
          )}

          {currentStep === 'motivation' && (
            <div 
              key="motivation"
              
              
              
              className="flex flex-col h-full overflow-hidden"
            >
              {/* Top Bar - Fixed */}
              <div className="px-6 pt-4">
                <div className="flex items-center py-2 justify-between mb-4">
                  <div 
                    className="text-blue-400 flex size-12 shrink-0 items-center justify-start cursor-pointer"
                    onClick={() => onClose(false)}
                  >
                    <Play size={24} className="rotate-180" />
                  </div>
                  <h2 className="text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 text-center font-display">Motivasyon Al</h2>
                  <div className="w-12" />
                </div>
              </div>

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto px-6 pb-32">
                {/* Header */}
                <div className="mb-6">
                  <h1 className="text-slate-100 text-2xl font-extrabold leading-tight tracking-tight mb-2">
                    Şu an nasıl hissediyorsun?
                  </h1>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed">
                    Sana özel bilimsel motivasyonu almak için birini seç.
                  </p>
                </div>

                {/* Mood Grid */}
                <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-3 pb-4">
                  {moods.map((mood, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedMood(mood);
                        setCurrentStep('motivationTask');
                      }}                      className="bg-slate-800/40 border border-white/5 shadow-sm active:bg-slate-800/60 active:border-blue-500/40 flex flex-col items-center justify-center py-5 px-4 rounded-2xl group cursor-pointer transition-colors duration-200"
                    >
                      <div className="w-10 h-10 flex items-center justify-center rounded-xl mb-2 text-xl transition-transform group-hover:scale-110 bg-blue-500/20">
                        {mood.emoji}
                      </div>
                      <p className="text-slate-100 text-xs font-semibold text-center leading-tight">
                        {mood.label}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottom Navigation */}
              <BottomNav 
                onNavigate={(s) => {
                  onClose(false);
                  onNavigate(s);
                }} 
                activeStep="crisis" 
              />
            </div>
          )}

          {currentStep === 'suggestion' && (
            <div 
              key="suggestion"
              
              
              
              className="flex flex-col h-full overflow-hidden"
            >
              {/* Top Bar - Fixed */}
              <div className="px-6 pt-4">
                <div className="flex items-center py-2 justify-between mb-4">
                  <div 
                    className="text-blue-400 flex size-12 shrink-0 items-center justify-start cursor-pointer"
                    onClick={() => onClose(false)}
                  >
                    <Play size={24} className="rotate-180" />
                  </div>
                  <h2 className="text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 text-center font-display">Öneri Al</h2>
                  <div className="w-12" />
                </div>
              </div>

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto px-6 pb-32">
                {/* Header */}
                <div className="mb-6">
                  <h1 className="text-slate-100 text-2xl font-extrabold leading-tight tracking-tight mb-2">
                    Neye ihtiyacın var?
                  </h1>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed">
                    Sana özel bilimsel önerileri almak için birini seç.
                  </p>
                </div>

                {/* Suggestion Grid */}
                <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-3 pb-4">
                  {suggestions.map((sug, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedSuggestion(sug);
                        setCurrentStep('suggestionTask');
                      }}
                      className="bg-slate-800/40 border border-white/5 shadow-sm active:bg-slate-800/60 active:border-blue-500/40 flex flex-col items-center justify-center py-5 px-4 rounded-2xl group cursor-pointer transition-colors duration-200"
                    >
                      <div className="w-10 h-10 flex items-center justify-center rounded-xl mb-2 text-xl transition-transform group-hover:scale-110 bg-blue-500/20">
                        {sug.emoji}
                      </div>
                      <p className="text-slate-100 text-xs font-semibold text-center leading-tight">
                        {sug.label}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottom Navigation */}
              <BottomNav 
                onNavigate={(s) => {
                  onClose(false);
                  onNavigate(s);
                }} 
                activeStep="crisis" 
              />
            </div>
          )}

          {currentStep === 'motivationTask' && selectedMood && (
            <div 
              key="motivationTask"
              
              
              
              className="flex flex-col h-full overflow-hidden"
            >
              {/* Top Bar - Fixed */}
              <div className="px-6 pt-4">
                <div className="flex items-center py-2 justify-between mb-4">
                  <div 
                    className="text-blue-400 flex size-12 shrink-0 items-center justify-start cursor-pointer"
                    onClick={() => setCurrentStep('motivation')}
                  >
                    <Play size={24} className="rotate-180" />
                  </div>
                  <h2 className="text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 text-center font-display">Motivasyonun</h2>
                  <div className="flex w-12 items-center justify-end"></div>
                </div>
              </div>

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto px-6 pb-32">
                <div className="flex flex-col items-center text-center py-4">
                  <div className="w-24 h-24 rounded-full bg-blue-500/20 flex items-center justify-center mb-8 text-4xl animate-bounce">
                    {selectedMood.emoji}
                  </div>
                  <h3 className="text-slate-100 text-xl font-extrabold mb-6 font-display uppercase tracking-wider">
                    {selectedMood.fullLabel}
                  </h3>
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-3xl p-6 shadow-2xl mb-8">
                    <p className="text-slate-100 text-sm font-medium leading-relaxed font-display italic">
                      "{renderMessage(selectedMood.message)}"
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="w-full flex flex-col items-center gap-4">
                    <button 
                      onClick={() => setCurrentStep('success')}
                      className="w-full h-14 rounded-full bg-gradient-to-r from-[#FFD700] via-[#FFEA00] to-[#F9D423] shadow-lg shadow-yellow-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                    >
                      <span className="text-slate-900 text-lg font-extrabold leading-normal tracking-wide font-display uppercase">TAMAMLANDI</span>
                    </button>
                    <button 
                      onClick={() => setCurrentStep('failed')}
                      className="w-full py-2 flex items-center justify-center"
                    >
                      <span className="text-slate-500 text-xs font-bold uppercase tracking-widest hover:text-slate-300 transition-colors font-display">BU SEFER OLMADI</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Navigation */}
              <BottomNav 
                onNavigate={(s) => {
                  onClose(false);
                  onNavigate(s);
                }} 
                activeStep="crisis" 
              />
            </div>
          )}

          {currentStep === 'suggestionTask' && selectedSuggestion && (
            <div 
              key="suggestionTask"
              
              
              
              className="flex flex-col h-full overflow-hidden"
            >
              {/* Top Bar - Fixed */}
              <div className="px-6 pt-4">
                <div className="flex items-center py-2 justify-between mb-4">
                  <div 
                    className="text-blue-400 flex size-12 shrink-0 items-center justify-start cursor-pointer"
                    onClick={() => setCurrentStep('suggestion')}
                  >
                    <Play size={24} className="rotate-180" />
                  </div>
                  <h2 className="text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 text-center font-display">Önerin</h2>
                  <div className="flex w-12 items-center justify-end"></div>
                </div>
              </div>

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto px-6 pb-32">
                <div className="flex flex-col items-center text-center py-4">
                  <div className="w-24 h-24 rounded-full bg-blue-500/20 flex items-center justify-center mb-8 text-4xl animate-bounce">
                    {selectedSuggestion.emoji}
                  </div>
                  <h3 className="text-slate-100 text-xl font-extrabold mb-6 font-display uppercase tracking-wider">
                    {selectedSuggestion.fullLabel}
                  </h3>
                  
                  {/* Scientific Reason */}
                  <div className="w-full text-left mb-4">
                    <h4 className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-2">Bilimsel Neden</h4>
                    <div className="bg-slate-800/50 border border-slate-700/30 rounded-2xl p-4">
                      <p className="text-slate-300 text-xs font-medium leading-relaxed">
                        {selectedSuggestion.reason}
                      </p>
                    </div>
                  </div>

                  {/* Suggestion */}
                  <div className="w-full text-left mb-8">
                    <h4 className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-2">Öneri</h4>
                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4">
                      <p className="text-slate-100 text-sm font-medium leading-relaxed">
                        {renderMessage(selectedSuggestion.suggestion)}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="w-full flex flex-col items-center gap-4">
                    <button 
                      onClick={() => setCurrentStep('success')}
                      className="w-full h-14 rounded-full bg-gradient-to-r from-[#FFD700] via-[#FFEA00] to-[#F9D423] shadow-lg shadow-yellow-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                    >
                      <span className="text-slate-900 text-lg font-extrabold leading-normal tracking-wide font-display uppercase">TAMAMLANDI</span>
                    </button>
                    <button 
                      onClick={() => setCurrentStep('failed')}
                      className="w-full py-2 flex items-center justify-center"
                    >
                      <span className="text-slate-500 text-xs font-bold uppercase tracking-widest hover:text-slate-300 transition-colors font-display">BU SEFER OLMADI</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Navigation */}
              <BottomNav 
                onNavigate={(s) => {
                  onClose(false);
                  onNavigate(s);
                }} 
                activeStep="crisis" 
              />
            </div>
          )}

          {currentStep === 'distract' && (
            <div 
              key="distract"
              
              
              
              className="flex flex-col flex-1 px-6 pt-4 pb-10"
            >
              {/* Top Bar */}
              <div className="flex items-center py-2 justify-between mb-4">
                <div 
                  className="text-blue-400 flex size-12 shrink-0 items-center justify-start cursor-pointer"
                  onClick={() => onClose(false)}
                >
                  <Play size={24} className="rotate-180" />
                </div>
                <h2 className="text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 text-center font-display">Kriz Anı</h2>
                <div className="w-12" />
              </div>

              {/* Instruction Text */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 mb-8">
                <p className="text-blue-400 text-sm font-medium leading-relaxed text-center font-display">
                  BAŞKA BİR ŞEY YAP: Hemen şu an yaptığın işi bırak. Bir arkadaşını ara, kısa bir yürüyüşe çık veya bir bulmaca çöz.
                </p>
              </div>

              {/* Icon Section (Replaced Timer) */}
              <div className="flex-1 flex items-center justify-center relative">
                {/* Outer Ring Glow */}
                <div className="absolute w-64 h-64 rounded-full border-4 border-blue-500/20 animate-pulse"></div>
                {/* Main Circle */}
                <div className="relative flex flex-col items-center justify-center w-60 h-60 rounded-full border-[6px] border-blue-500 shadow-[0_0_40px_rgba(37,123,244,0.3)] bg-slate-800/50">
                  <Zap className="text-blue-400 mb-4" size={64} />
                  <span className="text-slate-100 text-2xl font-bold tracking-tight font-display uppercase">ODAKLAN</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-12 flex flex-col items-center gap-4">
                <button 
                  onClick={() => setCurrentStep('distractTask')}
                  className="w-[80%] h-14 rounded-full bg-gradient-to-r from-[#FFD700] via-[#FFEA00] to-[#F9D423] shadow-lg shadow-yellow-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                  <span className="text-slate-900 text-lg font-extrabold leading-normal tracking-wide font-display uppercase">BAŞLA</span>
                </button>
                <button 
                  onClick={() => setCurrentStep('failed')}
                  className="w-full py-2 flex items-center justify-center"
                >
                  <span className="text-slate-500 text-xs font-bold uppercase tracking-widest hover:text-slate-300 transition-colors font-display">BU SEFER OLMADI</span>
                </button>
              </div>

              {/* Tips Section */}
              <div className="mt-8 grid grid-cols-4 gap-3">
                <div className="flex flex-col items-center gap-2 opacity-40">
                  <div className="w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center text-blue-400">
                    <Clock size={20} />
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Ertele</span>
                </div>
                <div className="flex flex-col items-center gap-2 opacity-40">
                  <div className="w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center text-blue-400">
                    <Wind size={20} />
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium text-center">Nefes Al</span>
                </div>
                <div className="flex flex-col items-center gap-2 opacity-40">
                  <div className="w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center text-blue-400">
                    <Droplets size={20} />
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Su İç</span>
                </div>
                <div className="flex flex-col items-center gap-2 opacity-100">
                  <div className="w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center text-blue-400">
                    <Brain size={20} />
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Odaklan</span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'distractTask' && (
            <div 
              key="distractTask"
              
              
              
              className="flex flex-col flex-1 px-6 pt-4 pb-10"
            >
              {/* Top Bar */}
              <div className="flex items-center py-2 justify-between mb-4">
                <div 
                  className="text-blue-400 flex size-12 shrink-0 items-center justify-start cursor-pointer"
                  onClick={() => onClose(false)}
                >
                  <Play size={24} className="rotate-180" />
                </div>
                <h2 className="text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 text-center font-display">Kriz Anı</h2>
                <div className="w-12" />
              </div>

              {/* Instruction Text */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 mb-6">
                <p className="text-blue-400 text-sm font-medium leading-relaxed text-center font-display">
                  Hemen şu an yaptığın işi bırak ve bunlardan birini yap.
                </p>
              </div>

              {/* Checklist */}
              <div className="flex-1 flex flex-col gap-3">
                {distractItems.map((item, idx) => (
                  <button 
                    key={idx}
                    onClick={() => {
                      const newChecks = [...distractChecks];
                      newChecks[idx] = !newChecks[idx];
                      setDistractChecks(newChecks);
                    }}
                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                      distractChecks[idx] 
                        ? 'bg-blue-500/20 border-blue-500/50 text-slate-100' 
                        : 'bg-slate-800/50 border-slate-700/50 text-slate-400'
                    }`}
                  >
                    <div className={`size-6 rounded-full border-2 flex items-center justify-center ${
                      distractChecks[idx] ? 'bg-blue-500 border-blue-500' : 'border-slate-600'
                    }`}>
                      {distractChecks[idx] && <CheckCircle2 size={14} className="text-slate-900" />}
                    </div>
                    <item.icon size={20} className={distractChecks[idx] ? 'text-blue-400' : 'text-slate-500'} />
                    <span className="text-sm font-bold font-display">{item.text}</span>
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col items-center gap-4">
                <button 
                  onClick={() => {
                    if (distractChecks.some(c => c)) {
                      setCurrentStep('success');
                    }
                  }}
                  className={`w-[80%] h-14 rounded-full shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-3 ${
                    distractChecks.some(c => c)
                      ? 'bg-gradient-to-r from-[#FFD700] via-[#FFEA00] to-[#F9D423] shadow-yellow-500/20'
                      : 'bg-slate-700 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <span className="text-slate-900 text-lg font-extrabold leading-normal tracking-wide font-display uppercase">GÖREV TAMAMLANDI</span>
                </button>
                <button 
                  onClick={() => setCurrentStep('failed')}
                  className="w-full py-2 flex items-center justify-center"
                >
                  <span className="text-slate-500 text-xs font-bold uppercase tracking-widest hover:text-slate-300 transition-colors font-display">BU SEFER OLMADI</span>
                </button>
              </div>
            </div>
          )}

          {currentStep === 'success' && (
            <div 
              key="success"
              
              
              className="flex flex-col flex-1 px-6 pt-4 pb-10"
            >
              {/* Top Bar */}
              <div className="flex items-center py-2 justify-between mb-4">
                <div 
                  className="text-blue-400 flex size-12 shrink-0 items-center justify-start cursor-pointer"
                  onClick={() => onClose(true)}
                >
                  <Play size={24} className="rotate-180" />
                </div>
                <h2 className="text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 text-center font-display">Tebrikler</h2>
                <div className="flex w-12 items-center justify-end"></div>
              </div>

              {/* Center Content */}
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-32 h-32 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                  <Trophy className="text-green-500" size={64} />
                </div>
                <h3 className="text-slate-100 text-3xl font-extrabold mb-2 font-display uppercase">BAŞARDIN!</h3>
                <p className="text-slate-400 text-lg font-medium leading-relaxed font-display">
                  Bir krizi daha başarıyla atlattın. Kendinle gurur duymalısın!
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-12">
                <button 
                  onClick={() => onClose(true)}
                  className="w-full h-16 rounded-full bg-gradient-to-r from-green-400 to-green-600 shadow-lg shadow-green-500/20 active:scale-[0.98] transition-all flex items-center justify-center"
                >
                  <span className="text-white text-lg font-extrabold leading-normal tracking-wide font-display uppercase">KAPAT</span>
                </button>
              </div>
            </div>
          )}

          {currentStep === 'failed' && (
            <div 
              key="failed"
              
              
              className="flex flex-col flex-1 px-6 pt-4 pb-10"
            >
              {/* Top Bar */}
              <div className="flex items-center py-2 justify-between mb-4">
                <div 
                  className="text-blue-400 flex size-12 shrink-0 items-center justify-start cursor-pointer"
                  onClick={() => onClose(false)}
                >
                  <Play size={24} className="rotate-180" />
                </div>
                <h2 className="text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 text-center font-display">Pes Etme</h2>
                <div className="flex w-12 items-center justify-end"></div>
              </div>

              {/* Center Content */}
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-32 h-32 rounded-full bg-red-500/20 flex items-center justify-center mb-6">
                  <XCircle className="text-red-500" size={64} />
                </div>
                <h3 className="text-slate-100 text-3xl font-extrabold mb-4 font-display uppercase">PES ETME!</h3>
                <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 w-full mb-4">
                  <p className="text-slate-400 text-sm font-medium leading-relaxed font-display">
                    Sorun değil, pes etme. <br/>
                    <span className="text-blue-400/80">Bir sonraki denemede başaracaksın.</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-12 space-y-4">
                <button 
                  onClick={() => {
                    setTriggerTime(300);
                    setDelayTime(180);
                    setBreatheRep(0);
                    setBreathePhase('ready');
                    setWaterDrank(false);
                    setDistractChecks([false, false, false, false]);
                    setCurrentStep(is4DFlow ? 'delay' : techniqueId || 'delay');
                  }}
                  className="w-full h-16 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all flex items-center justify-center"
                >
                  <span className="text-white text-lg font-extrabold leading-normal tracking-wide font-display uppercase">YENİDEN DENE</span>
                </button>
                <button 
                  onClick={() => onClose(false)}
                  className="w-full py-2 flex items-center justify-center"
                >
                  <span className="text-slate-500 text-xs font-bold uppercase tracking-widest hover:text-slate-300 transition-colors font-display">KAPAT</span>
                </button>
              </div>
            </div>
          )}
        
      </motion.div>
      )}
    </AnimatePresence>
  );
}
