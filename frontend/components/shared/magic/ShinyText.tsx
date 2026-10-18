'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

export function ShinyText({
  text,
  disabled = false,
  speed = 5,
  className = '',
}: ShinyTextProps) {
  const animationDuration = `${speed}s`;

  return (
    <span
      className={cn(
        'inline-block bg-clip-text text-transparent bg-gradient-to-r from-neutral-200 via-white to-neutral-400',
        !disabled && 'animate-shimmer',
        className,
      )}
      style={{
        backgroundImage:
          'linear-gradient(120deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0.4) 100%)',
        backgroundSize: '200% 100%',
        animation: !disabled ? `shimmer ${animationDuration} infinite linear` : 'none',
      }}
    >
      {text}
    </span>
  );
}
