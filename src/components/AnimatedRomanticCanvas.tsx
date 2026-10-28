import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  type: 'petal' | 'heart' | 'sparkle';
  color: string;
}

export const AnimatedRomanticCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Color palette for romantic petals & hearts
    const colors = [
      'rgba(244, 63, 94, 0.45)', // Rose
      'rgba(251, 113, 133, 0.45)', // Soft rose
      'rgba(253, 164, 175, 0.45)', // Rose water
      'rgba(244, 114, 182, 0.4)', // Pink
      'rgba(254, 205, 211, 0.5)', // Pastel blush
      'rgba(254, 240, 138, 0.4)', // Warm champagne
    ];

    // Initialize 35 particles
    const particlesCount = 35;
    const particles: Particle[] = Array.from({ length: particlesCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 8 + 6,
      speedY: -(Math.random() * 0.7 + 0.3), // Float gently upwards
      speedX: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.3,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      type: Math.random() > 0.6 ? 'heart' : Math.random() > 0.3 ? 'petal' : 'sparkle',
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    // Draw little heart shape
    const drawHeart = (c: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) => {
      c.save();
      c.translate(x, y);
      c.fillStyle = color;
      c.beginPath();
      const topCurveHeight = size * 0.3;
      c.moveTo(0, topCurveHeight);
      // top left curve
      c.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
      // bottom left curve
      c.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, size * 0.8, 0, size);
      // bottom right curve
      c.bezierCurveTo(0, size * 0.8, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
      // top right curve
      c.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
      c.closePath();
      c.fill();
      c.restore();
    };

    // Draw gentle floral petal shape
    const drawPetal = (c: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number, color: string) => {
      c.save();
      c.translate(x, y);
      c.rotate(rotation);
      c.fillStyle = color;
      c.beginPath();
      c.ellipse(0, 0, size * 0.6, size * 1.2, 0, 0, Math.PI * 2);
      c.fill();
      c.restore();
    };

    // Draw 4-point sparkle star
    const drawSparkle = (c: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) => {
      c.save();
      c.translate(x, y);
      c.fillStyle = color;
      c.beginPath();
      for (let i = 0; i < 4; i++) {
        c.lineTo(Math.cos((i * Math.PI) / 2) * size, Math.sin((i * Math.PI) / 2) * size);
        c.lineTo(Math.cos((i * Math.PI) / 2 + Math.PI / 4) * (size * 0.25), Math.sin((i * Math.PI) / 2 + Math.PI / 4) * (size * 0.25));
      }
      c.closePath();
      c.fill();
      c.restore();
    };

    let step = 0;

    const render = () => {
      step += 0.01;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(step + p.y * 0.01) * 0.3; // Gentle wind sway
        p.rotation += p.rotationSpeed;

        // Reset if floated above screen
        if (p.y < -30) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }
        if (p.x < -30) p.x = width + 20;
        if (p.x > width + 30) p.x = -20;

        if (p.type === 'heart') {
          drawHeart(ctx, p.x, p.y, p.size, p.color);
        } else if (p.type === 'petal') {
          drawPetal(ctx, p.x, p.y, p.size, p.rotation, p.color);
        } else {
          drawSparkle(ctx, p.x, p.y, p.size * 0.7, p.color);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* 4 Soft Floating Glowing Gradient Orbs */}
      <div className="absolute -top-20 -left-20 w-[480px] h-[480px] rounded-full bg-gradient-to-br from-rose-200/40 via-pink-100/30 to-transparent blur-3xl animate-pulse" />
      <div className="absolute top-1/3 -right-24 w-[520px] h-[520px] rounded-full bg-gradient-to-bl from-amber-200/30 via-rose-100/30 to-transparent blur-3xl animate-pulse [animation-duration:8s]" />
      <div className="absolute -bottom-24 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-purple-100/35 via-rose-100/30 to-transparent blur-3xl animate-pulse [animation-duration:10s]" />
      <div className="absolute top-2/3 left-10 w-[380px] h-[380px] rounded-full bg-gradient-to-r from-pink-200/30 to-rose-200/20 blur-3xl animate-pulse [animation-duration:6s]" />

      {/* Floating Canvas Petals & Hearts */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};
