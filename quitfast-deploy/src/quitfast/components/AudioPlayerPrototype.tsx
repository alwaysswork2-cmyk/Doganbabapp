import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  ChevronLeft, 
  Volume2, 
  Music,
  Share2,
  Heart,
  MoreHorizontal
} from 'lucide-react';
import { Step } from '../types';

interface AudioPlayerPrototypeProps {
  onNavigate: (step: Step) => void;
}

export default function AudioPlayerPrototype({ onNavigate }: AudioPlayerPrototypeProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  const audioUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(err => {
          console.error("Autoplay blocked or error:", err);
          setError("Tarayıcı otomatik oynatmayı engelledi. Lütfen oynat butonuna tekrar basın.");
          setTimeout(() => setError(null), 5000);
        });
        setIsPlaying(true);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 10, duration);
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 10, 0);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30 overflow-hidden relative">
      {/* Immersive Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 flex items-center justify-between">
        <button 
          onClick={() => onNavigate('settings')}
          className="size-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-slate-700 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Şu An Oynatılıyor</p>
          <h1 className="text-sm font-bold text-slate-200">Sesli Blog Prototipi</h1>
        </div>
        <button className="size-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-slate-700 transition-colors">
          <Share2 size={18} />
        </button>
      </header>

      <main className="relative z-10 px-8 pt-4 pb-12 flex flex-col items-center max-w-md mx-auto h-[calc(100vh-88px)] justify-between">
        {/* Album Art / Visualizer Area */}
        <div className="w-full aspect-square relative group">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full h-full rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/10 border border-white/5 relative animate-pulse"
          >
            <img 
              src="https://picsum.photos/seed/music/800/800" 
              alt="Cover" 
              className={`w-full h-full object-cover transition-transform duration-[10s] ease-linear ${isPlaying ? 'scale-110' : 'scale-100'}`}
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Overlay Icon */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="size-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Music className="text-white" size={32} />
              </div>
            </div>
          </motion.div>

          {/* Floating Badge */}
          <div className="absolute -top-3 -right-3 px-4 py-1.5 bg-blue-500 rounded-full text-[10px] font-bold tracking-wider shadow-lg shadow-blue-500/30">
            HI-RES AUDIO
          </div>
        </div>

        {/* Info & Actions */}
        <div className="w-full space-y-6">
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <motion.h2 
                layoutId="title"
                className="text-3xl font-bold tracking-tight text-white"
              >
                SoundHelix Song 1
              </motion.h2>
              <p className="text-slate-400 font-medium">Modern Blog Oynatıcı</p>
            </div>
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className={`p-3 rounded-2xl transition-all ${isLiked ? 'bg-rose-500/10 text-rose-500' : 'bg-white/5 text-slate-400'}`}
            >
              <Heart size={24} fill={isLiked ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="relative h-1.5 w-full bg-slate-700 rounded-full overflow-hidden group cursor-pointer">
              <input 
                type="range" 
                min="0" 
                max={duration || 100} 
                value={progress}
                onChange={handleSeek}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <motion.div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full"
                style={{ width: `${(progress / duration) * 100}%` }}
              />
              {/* Glow effect for progress head */}
              <div 
                className="absolute top-1/2 -translate-y-1/2 size-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] pointer-events-none"
                style={{ left: `calc(${(progress / duration) * 100}% - 6px)` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-bold text-slate-500 tracking-widest">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between px-4">
            <button className="text-slate-500 hover:text-white transition-colors">
              <Volume2 size={20} />
            </button>
            
            <div className="flex items-center gap-8">
              <button 
                onClick={skipBackward}
                className="text-slate-400 hover:text-white transition-colors active:scale-90"
              >
                <SkipBack size={28} fill="currentColor" />
              </button>
              
              <button 
                onClick={togglePlay}
                className="size-20 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-all"
              >
                {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
              </button>

              <button 
                onClick={skipForward}
                className="text-slate-400 hover:text-white transition-colors active:scale-90"
              >
                <SkipForward size={28} fill="currentColor" />
              </button>
            </div>

            <button className="text-slate-500 hover:text-white transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>
        </div>

        {/* Error Message Toast */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="fixed bottom-10 left-6 right-6 bg-rose-500 text-white p-4 rounded-2xl text-xs font-bold text-center shadow-xl z-50"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <audio ref={audioRef} src={audioUrl} />
    </div>
  );
}
