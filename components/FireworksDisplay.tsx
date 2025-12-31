
import React, { useEffect, useRef, useCallback } from 'react';
import { Particle } from '../types';

interface FireworksDisplayProps {
  isActive: boolean;
}

interface FireworkShell {
  x: number;
  y: number;
  targetY: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
}

const FIREWORK_SOUND = 'tieng_phao_hoa.mp3';
const POOL_SIZE = 10;

const FireworksDisplay: React.FC<FireworksDisplayProps> = ({ isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const shellsRef = useRef<FireworkShell[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const flashAlpha = useRef(0);
  
  // Audio Pool để phát nhiều tiếng pháo chồng lấp mà không bị lag
  const audioPool = useRef<HTMLAudioElement[]>([]);
  const poolIndex = useRef(0);

  useEffect(() => {
    // Khởi tạo pool âm thanh
    for (let i = 0; i < POOL_SIZE; i++) {
      const audio = new Audio(FIREWORK_SOUND);
      audio.preload = 'auto';
      audioPool.current.push(audio);
    }
  }, []);

  const playFireworkSound = () => {
    const audio = audioPool.current[poolIndex.current];
    if (audio) {
      audio.currentTime = 0;
      audio.volume = 0.5;
      audio.play().catch(() => {
        // Trình duyệt có thể chặn nếu chưa có tương tác người dùng
      });
      poolIndex.current = (poolIndex.current + 1) % POOL_SIZE;
    }
  };

  const explode = useCallback((x: number, y: number, color: string) => {
    const particleCount = 120 + Math.floor(Math.random() * 100);
    flashAlpha.current = 0.2; // Tạo hiệu ứng lóe sáng màn hình khi nổ

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 7 + 1;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color,
        size: Math.random() * 3 + 0.5,
        gravity: 0.07,
        friction: 0.96,
      });
    }
  }, []);

  const launchShell = useCallback((targetX?: number, targetY?: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    playFireworkSound();

    const x = targetX ?? (Math.random() * (canvas.width * 0.8) + canvas.width * 0.1);
    const y = canvas.height;
    const ty = targetY ?? (Math.random() * (canvas.height * 0.5) + canvas.height * 0.1);
    
    const distance = y - ty;
    const vy = -Math.sqrt(2 * 0.12 * distance);

    shellsRef.current.push({
      x,
      y,
      targetY: ty,
      vx: (Math.random() - 0.5) * 1.5,
      vy: vy,
      color: `hsl(${Math.random() * 360}, 100%, 65%)`,
      alpha: 1
    });
  }, []);

  const update = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Vẽ hiệu ứng Flash lóe sáng
    if (flashAlpha.current > 0) {
      ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha.current})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      flashAlpha.current -= 0.02;
    }

    // Cập nhật Shells (Bắn lên)
    shellsRef.current = shellsRef.current.filter(shell => {
      shell.x += shell.vx;
      shell.y += shell.vy;
      shell.vy += 0.1;

      // Vẽ tia lửa đuôi
      ctx.beginPath();
      ctx.arc(shell.x, shell.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(shell.x, shell.y);
      ctx.lineTo(shell.x - shell.vx * 4, shell.y - shell.vy * 4);
      ctx.strokeStyle = shell.color;
      ctx.lineWidth = 2;
      ctx.stroke();

      if (shell.vy >= 0 || shell.y <= shell.targetY) {
        explode(shell.x, shell.y, shell.color);
        return false;
      }
      return true;
    });

    // Cập nhật Particles (Nổ ra)
    particlesRef.current = particlesRef.current.filter((p) => {
      p.vx *= p.friction;
      p.vy *= p.friction;
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.007;

      if (p.alpha <= 0) return false;

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return true;
    });

    if (isActive && Math.random() < 0.035) {
      launchShell();
    }

    animationFrameRef.current = requestAnimationFrame(update);
  }, [isActive, explode, launchShell]);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    animationFrameRef.current = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [update]);

  const handleClick = (e: React.MouseEvent) => {
    if (isActive) {
      launchShell(e.clientX, e.clientY);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 touch-none cursor-crosshair"
      onClick={handleClick}
    />
  );
};

export default FireworksDisplay;
