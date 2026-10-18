'use client';

import React from 'react';
import {
  ShieldCheck,
  Zap,
  Sparkles,
  Smartphone,
  Layers,
  Database,
  ArrowRight,
} from 'lucide-react';
import { Container } from '@/components/shared/container';
import { Section } from '@/components/shared/section';
import { BentoGrid, BentoCard } from '@/components/shared/magic/BentoGrid';
import { ShinyText } from '@/components/shared/magic/ShinyText';
import { GsapReveal } from '@/components/shared/motion/GsapReveal';
import { type Locale } from '@/lib/i18n/config';

interface BentoShowcaseProps {
  locale: Locale;
}

export function BentoShowcase({ locale }: BentoShowcaseProps) {
  const isArabic = locale === 'ar';

  return (
    <Section id="capabilities" noContainer className="relative overflow-hidden py-24 bg-[#030712]">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-[500px] w-[800px] rounded-full bg-gradient-to-tr from-indigo-600/15 via-purple-600/10 to-transparent blur-[120px]" />
      </div>

      <Container>
        <GsapReveal direction="up" className="mx-auto max-w-3xl text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs backdrop-blur-md mb-4">
            <Sparkles className="size-3.5 text-indigo-400" />
            <ShinyText text={isArabic ? 'معايير التطوير العالمية 2026' : 'Elite Engineering 2026'} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {isArabic ? 'بنية تقنية متطورة وقوة لا تضاهى' : 'Next-Generation Tech Stack'}
          </h2>
          <p className="mt-4 text-base text-zinc-400 sm:text-lg">
            {isArabic
              ? 'نجمع بين أحدث تقنيات الويب، والواجهات السينمائية، وأعلى مستويات الحماية البرمجية لنقدم لك أنظمة تفوق التوقعات.'
              : 'Combining cinematic interfaces, reactive performance, and audited security to engineer software that scales effortlessly.'}
          </p>
        </GsapReveal>

        <BentoGrid className="lg:grid-rows-2">
          {/* Card 1: Fast Execution */}
          <BentoCard
            className="md:col-span-2"
            icon={<Zap className="size-6" />}
            title={isArabic ? 'أداء فائق وسرعة استجابة مذهلة' : 'Ultra-Low Latency & Speed'}
            description={
              isArabic
                ? 'استخدام أحدث بنى Next.js و NestJS المحسنة، مع تجربة تصفح انسيابية مدعومة بمحركات Lenis و GSAP لحركة فائقة النعومة.'
                : 'Engineered with Next.js 16 and NestJS, synchronized with Lenis inertial scrolling and GSAP for fluid 120fps responsiveness.'
            }
            header={
              <div className="relative flex size-full items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/5 p-6">
                <div className="flex items-center gap-3 rounded-xl bg-black/40 px-5 py-3 border border-white/10 backdrop-blur-md">
                  <span className="size-3 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-sm font-mono text-emerald-300">99.98% Lighthouse Performance</span>
                </div>
              </div>
            }
          />

          {/* Card 2: Security */}
          <BentoCard
            icon={<ShieldCheck className="size-6" />}
            title={isArabic ? 'حماية مشددة وفحص أمني' : 'Enterprise-Grade Security'}
            description={
              isArabic
                ? 'تطبيق أعلى معايير الأمان لمنع هجمات XSS، وCSRF، وعزل الصلاحيات ومنع ثغرات IDOR وتسريب البيانات الحساسة.'
                : 'Strict JWT isolation, parameterized access guards, hardened MIME sanitization, and security headers applied across all layers.'
            }
          />

          {/* Card 3: Mobile & Apps */}
          <BentoCard
            icon={<Smartphone className="size-6" />}
            title={isArabic ? 'تطبيقات هاتف ذكية وشاملة' : 'Native Mobile Apps'}
            description={
              isArabic
                ? 'تطوير تطبيقات iOS و Android عصرية بتقنيات Flutter و React Native تضمن تجربة مستخدم استثنائية.'
                : 'Cross-platform native applications crafted for iOS & Android with delightful micro-interactions.'
            }
          />

          {/* Card 4: Architecture */}
          <BentoCard
            className="md:col-span-2"
            icon={<Layers className="size-6" />}
            title={isArabic ? 'بنية تحتية مرنة وقابلة للتوسع' : 'Cloud Native Scalability'}
            description={
              isArabic
                ? 'قواعد بيانات سحابية متقدمة مع Prisma و PostgreSQL، مصممة لاستيعاب مئات الآلاف من الزوار والعمليات بدون أي انقطاع.'
                : 'Robust PostgreSQL and Prisma data layers with connection pooling, ready to serve high-concurrency traffic.'
            }
            header={
              <div className="flex h-32 items-center justify-around rounded-2xl bg-white/[0.02] border border-white/5 p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-400">0.05s</div>
                  <div className="text-xs text-zinc-400">Response Time</div>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">100%</div>
                  <div className="text-xs text-zinc-400">Data Integrity</div>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400">24/7</div>
                  <div className="text-xs text-zinc-400">Uptime SLA</div>
                </div>
              </div>
            }
          />
        </BentoGrid>
      </Container>
    </Section>
  );
}
