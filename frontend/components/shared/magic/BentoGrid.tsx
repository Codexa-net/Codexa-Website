'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export function BentoGrid({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'grid w-full auto-rows-[22rem] grid-cols-1 gap-4 md:grid-cols-3',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function BentoCard({
  className,
  title,
  description,
  header,
  icon,
  cta,
  href,
}: {
  className?: string;
  title: string;
  description: string;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  cta?: string;
  href?: string;
}) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, isHovered: false });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      isHovered: true,
    });
  }

  function handleMouseLeave() {
    setMousePos((prev) => ({ ...prev, isHovered: false }));
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/50 hover:shadow-indigo-500/10',
        className,
      )}
    >
      {/* 21st.dev Spotlight Glow Effect */}
      {mousePos.isHovered && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300"
          style={{
            background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.15), transparent 70%)`,
          }}
        />
      )}

      {header && <div className="relative z-10 w-full flex-1">{header}</div>}

      <div className="relative z-10 flex flex-col gap-2">
        {icon && (
          <div className="flex size-11 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20 group-hover:bg-indigo-500/20 group-hover:text-indigo-300 transition-colors">
            {icon}
          </div>
        )}
        <h3 className="text-xl font-bold tracking-tight text-white transition-colors group-hover:text-indigo-200">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-zinc-400">{description}</p>

        {cta && href && (
          <a
            href={href}
            className="mt-2 inline-flex items-center text-xs font-semibold text-indigo-400 hover:text-indigo-300 group-hover:translate-x-1 transition-transform"
          >
            {cta} &rarr;
          </a>
        )}
      </div>
    </div>
  );
}
