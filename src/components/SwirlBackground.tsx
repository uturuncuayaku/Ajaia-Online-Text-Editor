"use client";

import React, { useEffect, useRef } from "react";

export default function SwirlBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Dynamic wave parameters inspired by Ajaia's dark theme & fluid motions
    let time = 0;

    const waves = [
      { color: "rgba(0, 29, 107, 0.35)", speed: 0.003, frequency: 0.0012, amplitude: 140, yOffset: 0.4 },
      { color: "rgba(30, 27, 75, 0.45)", speed: 0.004, frequency: 0.0016, amplitude: 180, yOffset: 0.5 },
      { color: "rgba(49, 16, 66, 0.3)", speed: 0.002, frequency: 0.001, amplitude: 220, yOffset: 0.6 },
      { color: "rgba(151, 194, 248, 0.12)", speed: 0.005, frequency: 0.002, amplitude: 100, yOffset: 0.45 },
    ];

    const render = () => {
      time += 1;

      // Base deep dark gradient (#000000 to #030712 to #0a1128)
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, "#000000");
      bgGrad.addColorStop(0.5, "#030712");
      bgGrad.addColorStop(1, "#070d1e");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Render glowing floating orbs in background
      const orbX1 = width * 0.25 + Math.sin(time * 0.008) * 80;
      const orbY1 = height * 0.3 + Math.cos(time * 0.007) * 60;
      const orb1 = ctx.createRadialGradient(orbX1, orbY1, 10, orbX1, orbY1, 380);
      orb1.addColorStop(0, "rgba(0, 29, 107, 0.45)");
      orb1.addColorStop(0.5, "rgba(49, 16, 66, 0.2)");
      orb1.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = orb1;
      ctx.fillRect(0, 0, width, height);

      const orbX2 = width * 0.75 + Math.cos(time * 0.009) * 100;
      const orbY2 = height * 0.65 + Math.sin(time * 0.008) * 80;
      const orb2 = ctx.createRadialGradient(orbX2, orbY2, 10, orbX2, orbY2, 420);
      orb2.addColorStop(0, "rgba(151, 194, 248, 0.18)");
      orb2.addColorStop(0.6, "rgba(0, 29, 107, 0.15)");
      orb2.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = orb2;
      ctx.fillRect(0, 0, width, height);

      // Render flowing wave curves
      waves.forEach((wave, waveIdx) => {
        ctx.beginPath();
        ctx.fillStyle = wave.color;

        const baseHeight = height * wave.yOffset;
        ctx.moveTo(0, height);

        for (let x = 0; x <= width; x += 15) {
          const y =
            baseHeight +
            Math.sin(x * wave.frequency + time * wave.speed + waveIdx) * wave.amplitude +
            Math.cos(x * wave.frequency * 0.5 + time * wave.speed * 0.8) * (wave.amplitude * 0.4);

          ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fill();
      });

      // Subtle top vignette / ambient overlay
      const topGlow = ctx.createRadialGradient(width / 2, 0, 20, width / 2, 0, width * 0.6);
      topGlow.addColorStop(0, "rgba(151, 194, 248, 0.08)");
      topGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = topGlow;
      ctx.fillRect(0, 0, width, height * 0.5);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.95 }}
      aria-hidden="true"
    />
  );
}
