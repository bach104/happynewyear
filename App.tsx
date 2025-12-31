
import React, { useState, useEffect, useRef } from 'react';
import FireworksDisplay from './components/FireworksDisplay';
import GreetingMessage from './components/GreetingMessage';
import CountdownTimer from './components/CountdownTimer';
import { TimeLeft } from './types';

const TARGET_DATE = new Date('2026-01-01T00:00:00').getTime();

const App: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: false });
  const [isNewYear, setIsNewYear] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [key, setKey] = useState(0); 
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = TARGET_DATE - now;

      if (distance < 0) {
        setIsNewYear(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true });
        clearInterval(timer);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
          isPassed: false
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const toggleMusic = () => {
    setHasInteracted(true);
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Cần tương tác người dùng"));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const triggerTest = () => {
    setHasInteracted(true);
    setIsNewYear(true);
    setKey(prev => prev + 1);
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden select-none bg-black">
      {/* Nhạc nền */}
      <audio 
        ref={audioRef}
        src="./tet_xum_vay.mp3" 
        loop 
      />

      {/* Điều khiển & Hướng dẫn âm thanh */}
      <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2">
        <div className="flex gap-2">
          <button 
            onClick={triggerTest}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-yellow-300 font-bold rounded-full border-2 border-yellow-400 shadow-[0_0_15px_rgba(255,215,0,0.5)] transition-all hover:scale-110 flex items-center gap-2"
          >
            <span>🎆 BẮN PHÁO HOA THỬ</span>
          </button>
          <button 
            onClick={toggleMusic}
            className={`p-3 rounded-full border-2 border-yellow-400 shadow-xl transition-all hover:scale-110 ${isPlaying ? 'bg-red-600 text-yellow-300' : 'bg-gray-800 text-gray-400'}`}
          >
            {isPlaying ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>
        </div>
        {!hasInteracted && (
          <div className="bg-yellow-400 text-red-900 text-[10px] md:text-xs font-bold px-2 py-1 rounded-md animate-pulse">
            Chạm để bật nhạc & pháo hoa 🎶
          </div>
        )}
      </div>

      {/* Trang trí */}
      <div className="fixed top-0 left-0 p-4 z-20 pointer-events-none">
        <div className="text-4xl md:text-6xl animate-bounce">🏮</div>
      </div>
      <div className="fixed top-0 right-0 p-4 z-20 pointer-events-none mt-20 md:mt-0">
        <div className="text-4xl md:text-6xl animate-bounce" style={{ animationDelay: '0.5s' }}>🏮</div>
      </div>

      <FireworksDisplay isActive={isNewYear} />

      <div className="z-10 flex flex-col items-center gap-12 w-full max-w-4xl text-center">
        {!isNewYear ? (
          <div className="animate-fadeIn">
            <div className="mb-6">
               <span className="text-7xl md:text-9xl drop-shadow-[0_0_20px_rgba(255,215,0,0.5)]">🎍</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-500 mb-12 drop-shadow-lg tracking-[0.2em] uppercase">
              Tết Ất Tỵ 2026
            </h1>
            <CountdownTimer timeLeft={timeLeft} />
            <div className="mt-12 text-yellow-300 font-cursive text-2xl md:text-4xl opacity-80">
              Xuân sang phú quý - Vạn thọ vô cương
            </div>
          </div>
        ) : (
          <GreetingMessage key={key} />
        )}
      </div>

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20 text-yellow-500 font-bold tracking-widest text-xs md:text-sm opacity-60 flex items-center gap-2">
        <span>🎊</span> HAPPY NEW YEAR 2026 <span>🎊</span>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; max-height: 0; }
          to { opacity: 1; max-height: 1000px; }
        }
        .animate-fadeIn {
          animation: fadeIn 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .animate-slideDown {
          animation: slideDown 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
