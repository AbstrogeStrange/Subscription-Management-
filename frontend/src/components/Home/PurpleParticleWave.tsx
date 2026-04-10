import React, { useEffect, useRef } from 'react';

type Particle = {
  x: number;
  baseY: number;
  amplitude: number;
  size: number;
  speed: number;
  phase: number;
  alpha: number;
  drift: number;
  tint: string;
};

const PARTICLE_COUNT = 180;

const palette = ['#f3d6ff', '#d9a8ff', '#b46bff', '#8a4dff'];

const PurpleParticleWave: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    let animationFrame = 0;
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let devicePixelRatio = 1;

    const createParticle = (index: number): Particle => {
      const spread = index / PARTICLE_COUNT;
      return {
        x: spread * width + (Math.random() - 0.5) * 40,
        baseY: height * 0.7 - Math.sin(spread * Math.PI) * height * 0.18 + (Math.random() - 0.5) * 36,
        amplitude: 14 + Math.random() * 30,
        size: 1 + Math.random() * 2.8,
        speed: 0.6 + Math.random() * 1.4,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.2 + Math.random() * 0.7,
        drift: 0.08 + Math.random() * 0.3,
        tint: palette[Math.floor(Math.random() * palette.length)],
      };
    };

    const resize = () => {
      devicePixelRatio = window.devicePixelRatio || 1;
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      particles = Array.from({ length: PARTICLE_COUNT }, (_, index) => createParticle(index));
    };

    const drawGlow = () => {
      const gradient = context.createLinearGradient(0, height * 0.45, width, height * 0.88);
      gradient.addColorStop(0, 'rgba(112, 52, 201, 0)');
      gradient.addColorStop(0.25, 'rgba(165, 96, 255, 0.1)');
      gradient.addColorStop(0.5, 'rgba(213, 140, 255, 0.22)');
      gradient.addColorStop(0.75, 'rgba(155, 92, 255, 0.16)');
      gradient.addColorStop(1, 'rgba(112, 52, 201, 0)');

      context.beginPath();
      context.moveTo(0, height * 0.82);
      for (let x = 0; x <= width; x += 12) {
        const waveY =
          height * 0.72 -
          Math.sin((x / width) * Math.PI * 1.1) * height * 0.18 +
          Math.sin((x / width) * Math.PI * 5.2) * 10;
        context.lineTo(x, waveY);
      }
      context.lineTo(width, height);
      context.lineTo(0, height);
      context.closePath();
      context.fillStyle = gradient;
      context.filter = 'blur(18px)';
      context.fill();
      context.filter = 'none';
    };

    const render = (time: number) => {
      const t = time * 0.001;
      context.clearRect(0, 0, width, height);

      drawGlow();

      particles.forEach((particle, index) => {
        const progress = particle.x / Math.max(width, 1);
        const ridge =
          height * 0.72 -
          Math.sin(progress * Math.PI * 1.05) * height * 0.17 +
          Math.sin(progress * Math.PI * 4.8 + t * 0.9) * 10;
        const y =
          ridge +
          Math.sin(t * particle.speed + particle.phase) * particle.amplitude +
          Math.cos(t * 0.8 + particle.phase) * 8;

        particle.x += particle.drift;
        if (particle.x > width + 20) {
          particles[index] = {
            ...createParticle(index),
            x: -20,
          };
        }

        context.beginPath();
        context.fillStyle = particle.tint;
        context.globalAlpha = particle.alpha * (0.55 + Math.sin(t + particle.phase) * 0.2);
        context.shadowBlur = 18;
        context.shadowColor = particle.tint;
        context.arc(particle.x, y, particle.size, 0, Math.PI * 2);
        context.fill();
      });

      context.globalAlpha = 1;
      context.shadowBlur = 0;
      animationFrame = window.requestAnimationFrame(render);
    };

    resize();
    animationFrame = window.requestAnimationFrame(render);
    window.addEventListener('resize', resize);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
};

export default PurpleParticleWave;
