"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface SplashScreenProps {
  onFinish?: () => void;
  durationMs?: number;
}

export function SplashScreen({ onFinish, durationMs = 1000 }: SplashScreenProps) {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Start fading out slightly before duration ends
    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, Math.max(durationMs - 250, 750));

    // Completely dismiss
    const dismissTimer = setTimeout(() => {
      setVisible(false);
      onFinish?.();
    }, durationMs);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(dismissTimer);
    };
  }, [durationMs, onFinish]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-paper transition-opacity duration-300 ease-out ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
        {/* D' POOL Logo */}
        <div className="relative w-28 h-28 rounded-2xl overflow-hidden shadow-md border border-border bg-surface p-1">
          <Image
            src="/logo.jpg"
            alt="D' POOL Logo"
            fill
            sizes="112px"
            priority
            className="object-cover rounded-xl"
          />
        </div>

        {/* Brand Text */}
        <h1 className="font-serif font-bold text-2xl tracking-tight text-ink mt-4">
          D&apos; POOL
        </h1>
        <p className="text-xs uppercase tracking-widest font-semibold text-accent mt-1">
          Campus Exchange
        </p>

        {/* Pilot Campus Tag */}
        <div className="mt-6 flex items-center gap-1.5 text-[11px] text-ink-sec bg-surface border border-border/80 px-3 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          <span>SPAV Vijayawada Pilot</span>
        </div>
      </div>
    </div>
  );
}
