/**
 * MarqueeBanner — diagonal infinite scrolling services ticker.
 *
 * How the seamless loop works:
 *   - The track contains [COPY_A] + [COPY_A] (identical, back-to-back).
 *   - CSS animates the track from translateX(0) to translateX(-50%).
 *   - At -50% the track has moved exactly one copy width to the left,
 *     and the second copy is visually identical to the first — no flash.
 *   - `direction: ltr` is forced on the track so RTL pages don't break the layout.
 */

import { type Locale } from '@/lib/i18n/config'

interface MarqueeBannerProps {
  locale: Locale
}

const SERVICES_AR = [
  'تطوير مواقع',
  'تسويق رقمي',
  'تطبيقات موبايل',
  'هوية بصرية',
  'تصوير احترافي',
  'مونتاج فيديو',
  'تصميم واجهات',
  'تحسين محركات البحث',
]

const SERVICES_EN = [
  'Web Development',
  'Digital Marketing',
  'Mobile Apps',
  'Branding',
  'Photography',
  'Video Editing',
  'UI / UX Design',
  'SEO Optimization',
]

const SEP = '✦'

function TrackItem({ text }: { text: string }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-3 whitespace-nowrap px-8 text-sm font-semibold tracking-wide text-white">
      <span className="text-[10px] text-indigo-300">{SEP}</span>
      <span>{text}</span>
    </span>
  )
}

export function MarqueeBanner({ locale }: MarqueeBannerProps) {
  const services = locale === 'ar' ? SERVICES_AR : SERVICES_EN

  return (
    /*
     * Outer: handles the diagonal tilt.
     * Negative marginInline makes the band bleed past both page edges
     * so the diagonal corners don't show a gap.
     */
    <div
      aria-hidden="true"
      className="relative z-10"
      style={{
        transform: 'rotate(-1.8deg)',
        marginInline: '-6%',
        marginBlock: '-0.5rem',
      }}
    >
      {/*
       * Band: clipping layer — overflow:hidden cuts the track at the edges.
       * direction:ltr ensures it is never affected by the page's RTL mode.
       */}
      <div
        style={{
          background: '#4f46e5',
          overflow: 'hidden',
          paddingBlock: '1rem',
          direction: 'ltr',
        }}
        className="shadow-lg"
      >
        {/*
         * Track: a single flex row containing COPY_A + COPY_A.
         * The CSS class animates it from translateX(0) → translateX(-50%).
         * At -50% the second copy is in view, which looks identical to the first.
         * The animation loops back to 0 invisibly.
         */}
        <div
          className="animate-marquee-ltr"
          style={{
            display: 'inline-flex',
            direction: 'ltr',
          }}
        >
          {/* First copy */}
          {services.map((s, i) => <TrackItem key={`a${i}`} text={s} />)}
          {/* Second copy — must be identical for the seamless loop */}
          {services.map((s, i) => <TrackItem key={`b${i}`} text={s} />)}
        </div>
      </div>
    </div>
  )
}
