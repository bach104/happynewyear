
import React from 'react';
import { TimeLeft } from '../types';

interface CountdownTimerProps {
  timeLeft: TimeLeft;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ timeLeft }) => {
  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  const TimeUnit: React.FC<{ value: number; label: string }> = ({ value, label }) => (
    <div className="flex flex-col items-center mx-2 md:mx-4">
      <div className="bg-red-700 bg-opacity-80 rounded-lg p-3 md:p-6 w-16 md:w-28 border-2 border-yellow-400 shadow-lg transform hover:scale-105 transition-transform">
        <span className="text-2xl md:text-5xl font-bold text-yellow-300">
          {formatNumber(value)}
        </span>
      </div>
      <span className="text-xs md:text-sm mt-2 uppercase tracking-widest text-yellow-200 font-bold">
        {label}
      </span>
    </div>
  );

  return (
    <div className="flex flex-col items-center animate-bounce">
      <h2 className="text-xl md:text-3xl text-yellow-400 font-bold mb-8 tracking-tighter uppercase drop-shadow-md">
        Đếm ngược tới 2026
      </h2>
      <div className="flex flex-wrap justify-center">
        <TimeUnit value={timeLeft.days} label="Ngày" />
        <TimeUnit value={timeLeft.hours} label="Giờ" />
        <TimeUnit value={timeLeft.minutes} label="Phút" />
        <TimeUnit value={timeLeft.seconds} label="Giây" />
      </div>
    </div>
  );
};

export default CountdownTimer;
