'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface GsapRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number;
  duration?: number;
  stagger?: number;
  className?: string;
}

export function GsapReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.8,
  stagger = 0.1,
  className = '',
}: GsapRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;

      let x = 0;
      let y = 0;

      if (direction === 'up') y = 30;
      else if (direction === 'down') y = -30;
      else if (direction === 'left') x = 30;
      else if (direction === 'right') x = -30;

      gsap.from(el.children, {
        x,
        y,
        opacity: 0,
        duration,
        delay,
        stagger,
        ease: 'power3.out',
      });
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
