# 🚀 Codexa Website & Dashboard — Frontend Engineering & Architecture Handover

> **Welcome Developers!** 👋  
> This documentation serves as the comprehensive engineering guide and architecture foundation for the Codexa Web Application (Public Bilingual Agency Site + Admin Dashboard).  
> Everything built in this foundation is production-ready, strictly typed, and aligned with modern Next.js App Router patterns, Framer Motion animations, Shadcn UI, and bidirectional (RTL/LTR) internationalization.

---

## 📑 Table of Contents
1. [Tech Stack & Standards](#-tech-stack--standards)
2. [Project Architecture & Directory Structure](#-project-architecture--directory-structure)
3. [Routing & Internationalization (i18n) Guide](#-routing--internationalization-i18n-guide)
4. [Design System, Theming & Tokens](#-design-system-theming--tokens)
5. [Core Shared Components Library](#-core-shared-components-library)
6. [Motion, Scroll Animations & Sticky Mechanics](#-motion-scroll-animations--sticky-mechanics)
7. [Data Models & Types Reference](#-data-models--types-reference)
8. [Page Breakdown & Implementation Status](#-page-breakdown--implementation-status)
9. [⚠️ Critical Gotchas & Common Pitfalls (Read Before Coding!)](#️-critical-gotchas--common-pitfalls-read-before-coding)
10. [Development Workflow & Scripts](#-development-workflow--scripts)

---

## 🛠 Tech Stack & Standards

| Layer | Technology | Key Details |
|---|---|---|
| **Framework** | Next.js 15+ (App Router) | Turbopack, Server Components (RSC) first, static pre-rendering |
| **Language** | TypeScript 5 | Strict mode, zero `any` policy, type inference |
| **Styling** | Tailwind CSS v4 + Tailwind Animate | Logical properties (`ms`, `me`, `start`, `end`), CSS custom properties |
| **UI Components** | Shadcn UI + Radix UI + Lucide Icons | Accessible headless primitives |
| **Animations** | Framer Motion | Smooth sticky transitions, `AnimatePresence`, reveal masks |
| **i18n** | Custom Dictionary-based System | Server-side dictionary loading, zero client bundle bloat |
| **Forms & State** | React Hook Form + Zod + Zustand | Client validation and global state management |

---

## 📁 Project Architecture & Directory Structure

```
├── app/
│   ├── (dashboard)/            # 🛡️ Admin Dashboard Route Group
│   │   ├── dashboard/
│   │   │   ├── messages/       # Inquiries & Contact Submissions
│   │   │   ├── projects/       # CMS Project Manager
│   │   │   └── page.tsx        # Dashboard Overview Analytics
│   │   └── layout.tsx          # Dashboard Authenticated Shell & Sidebar
│   ├── (website)/              # 🌐 Public Website Route Group
│   │   └── [lang]/             # Dynamic Locale Root ('ar' | 'en')
│   │       ├── about/          # About Agency Page
│   │       ├── clients/        # Clients Showcase Page
│   │       ├── contact/        # Contact Us Page & Interactive Form
│   │       ├── our-work/       # Dedicated Portfolio & Projects Page
│   │       ├── layout.tsx      # Website Root Layout (Navbar, Footer, Providers)
│   │       └── page.tsx        # Landing / Home Page
│   ├── globals.css             # Tailwind v4 theme variables, animations & fonts
│   └── not-found.tsx           # Global 404 handler
├── components/
│   ├── providers/              # React Context Providers (ThemeProvider)
│   ├── shared/                 # 🧱 Reusable cross-page UI components
│   │   ├── codexa-logo.tsx     # Brand SVG Logo with signature C+x mark
│   │   ├── container.tsx       # Standard responsive width wrapper
│   │   ├── language-switcher.tsx # Instant AR/EN route switcher
│   │   ├── section.tsx         # Standard section spacing & anchor wrapper
│   │   ├── theme-toggle.tsx    # Hydration-safe Dark/Light toggle
│   │   └── motion/             # Framer Motion animation primitives
│   │       ├── fade-in.tsx     # Directional fade wrapper
│   │       ├── reveal.tsx      # Masked clip reveal for headings
│   │       ├── stagger.tsx     # Stagger container for list items
│   │       └── sticky-scroll.tsx # Pin-and-scroll engine with AnimatePresence
│   ├── ui/                     # Shadcn UI base primitives (Button, Input, etc.)
│   └── website/                # Feature-specific website components
│       ├── clients/            # ClientCard, ClientsGrid
│       ├── home/               # HeroSection, MarqueeBanner, ServicesSection, WhyChooseUsSection
│       ├── layout/             # Navbar, Footer, MobileNav
│       └── projects/           # WorkSlide, WorksShowcase, ProjectsGrid
├── data/                       # Mock data repositories & getter functions
│   ├── clients.ts              # Client entities & mock queries
│   ├── projects.ts             # Featured projects data & metadata
│   └── team.ts                 # Team members data for About page
├── lib/
│   ├── i18n/                   # Config, dictionary loader & route helpers
│   └── utils.ts                # cn() class utility wrapper
├── messages/                   # Translation JSON dictionaries
│   ├── ar.json                 # Arabic source of truth
│   └── en.json                 # English mirror dictionary
├── types/                      # TypeScript definitions (Project, Client, Team, i18n)
└── proxy.ts                    # Edge middleware / locale routing handler
```

---

## 🌐 Routing & Internationalization (i18n) Guide

### How Locales Work
- Supported locales: `ar` (Arabic, default, `dir="rtl"`) and `en` (English, `dir="ltr"`).
- Routing structure: All website routes live inside `app/(website)/[lang]/...`.
- Static Generation: `generateStaticParams()` in `layout.tsx` pre-renders both `/ar` and `/en` routes at build time.

### Loading Dictionaries in Server Components
Always load translations using `getDictionary(locale)` in Server Components:
```tsx
import { isValidLocale, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { notFound } from 'next/navigation'

export default async function Page(props: PageProps<'/[lang]/your-page'>) {
  const { lang } = await props.params // Next.js 15 async params!

  if (!isValidLocale(lang)) notFound()

  const locale = lang as Locale
  const dict = await getDictionary(locale)

  return <h1>{dict.about.hero.title}</h1>
}
```

---

## 🎨 Design System, Theming & Tokens

### 1. Typography & Fonts
- **Arabic**: `Cairo` and `Alexandria` loaded via Google Fonts.
- **English/Latin**: `Inter` and `Geist Mono`.
- Apply via CSS variables or utility classes (`font-sans`, `font-arabic`, `font-display`).

### 2. Brand Colors
- Primary Accent: `--brand-500: #4f46e5` (Indigo / Blurple).
- Text & Surfaces: Automatically adapt based on theme mode (`dark` vs `light`).
- Figma Surface Tokens: `--figma-surface-bright`, `--figma-surface`, `--figma-title-dark`.

### 3. Codexa Logo (`<CodexaLogo />`)
The official brand mark consists of an open **`C`** circle arc with an integrated **`×`** cross mark:
```tsx
import { CodexaLogo } from '@/components/shared/codexa-logo'

// In navbar / headers:
<CodexaLogo size="md" showText={true} />
```

---

## 🧩 Core Shared Components Library

| Component | Path | Description & Props |
|---|---|---|
| `<Container />` | `components/shared/container.tsx` | Standard layout constraint. `wide` (1400px), `narrow` (800px), default (1200px). |
| `<Section />` | `components/shared/section.tsx` | Standardized padding-y and optional anchor `id`. Props: `noContainer`, `narrow`, `wide`. |
| `<CodexaLogo />` | `components/shared/codexa-logo.tsx` | SVG logo. Props: `size="sm" | "md" | "lg"`, `showText`, `className`. |
| `<ThemeToggle />` | `components/shared/theme-toggle.tsx` | Hydration-safe light/dark toggle using `useSyncExternalStore`. |
| `<LanguageSwitcher />` | `components/shared/language-switcher.tsx` | Route-preserving locale switcher (changes `/ar/...` to `/en/...`). |
| `<StickyScroll />` | `components/shared/motion/sticky-scroll.tsx` | Pinned section scroll engine. |
| `<Reveal />` | `components/shared/motion/reveal.tsx` | Masked scroll reveal with blur clear. |
| `<Stagger />` | `components/shared/motion/stagger.tsx` | Staggered children animations for lists & grids. |

---

## 🎬 Motion, Scroll Animations & Sticky Mechanics

### 1. The Sticky Scroll Showcase (`<StickyScroll />`)
Used in **Works Showcase** (`WorksShowcase`) and **Process / Why Choose Us** (`WhyChooseUsSection`):
- **Mechanism**: The parent outer container has a virtual scroll height calculated as `height = itemCount * 100vh`.
- **Pinned Panel**: An inner wrapper stays pinned at `sticky top-0 h-svh overflow-hidden`.
- **Smooth Step Transitions**: The content inside uses `<AnimatePresence mode="wait">` to transition each step smoothly with blur and elevation without layout pops.

### 2. Infinite Marquee Banner (`<MarqueeBanner />`)
- Positioned diagonally between the Hero section and Works Showcase.
- Uses `@keyframes marquee-ltr` with an exact **2-copy duplicate track** and `translateX(-50%)` to ensure a 100% seamless, non-flashing infinite scroll loop regardless of RTL/LTR modes.

---

## 📊 Data Models & Types Reference

### 1. `Project` (`types/project.ts`)
```ts
export interface Project {
  id: string
  slug: string
  title: LocalizedText
  description: LocalizedText
  category: ProjectCategory
  image: string
  tags: string[]
  year?: string
  services?: LocalizedText
  pills?: LocalizedText[]
  themeClass?: string // Tailwind gradient e.g. 'from-[#1e1b4b] to-[#4338ca]'
  glowColor?: string  // Hex color for watermark radial light e.g. '#4f46e5'
  featured: boolean
  order: number
}
```

### 2. `Client` (`types/client.ts`)
```ts
export interface Client {
  id: string
  name: string
  logo: string
  description?: LocalizedText
  sector?: LocalizedText
  website?: string
  order: number
}
```


---

## 📋 Page Breakdown & Implementation Status

| Page | Route | Status | Notes for Assigned Developer |
|---|---|---|---|
| **Landing / Home** | `/[lang]` | ✅ Foundation Complete | Includes Hero, Marquee, Sticky Works, Services, Sticky Process & CTA. |
| **Our Work** | `/[lang]/our-work` | 🟡 Ready for Grid Layout | Use `<ProjectsGrid projects={getProjects()} locale={locale} />`. |
| **About Us** | `/[lang]/about` | 🟡 Foundation & Data Ready | Ready for hero, mission cards, values grid, and team section using `data/team.ts`. |
| **Clients** | `/[lang]/clients` | 🟡 Foundation & Data Ready | Ready for grid/filtering using `<ClientsGrid clients={getMockClients()} locale={locale} />`. |
| **Contact Us** | `/[lang]/contact` | ✅ Full Dedicated Route | Form with Zod validation, direct WhatsApp & email links. |
| **Dashboard** | `/dashboard/*` | 🟡 Shell Ready | Authenticated layout with sidebar ready for CRUD integrations. |

---

## ⚠️ Critical Gotchas & Common Pitfalls (Read Before Coding!)

### 1. Next.js 15 `props.params` is an Asynchronous Promise!
❌ **Do NOT do:**
```tsx
export default function Page({ params }: { params: { lang: string } }) {
  const lang = params.lang // 💥 Runtime error in Next.js 15!
}
```
✅ **DO:**
```tsx
export default async function Page(props: PageProps<'/[lang]/...'>) {
  const { lang } = await props.params
}
```

### 2. RTL vs LTR Layout Mirroring
- **Never hardcode** `left-*` or `right-*` for margins, paddings, or positioning unless an element intentionally ignores reading direction (like an LTR ticker).
- Always use **Tailwind logical properties**:
  - `ms-*` (margin-inline-start) instead of `ml-*`
  - `me-*` (margin-inline-end) instead of `mr-*`
  - `ps-*` / `pe-*` (padding-inline-start / end)
  - `start-*` / `end-*` (inset-inline-start / end)

### 3. Direction Locks for Fixed Direction Elements
Certain visual UI components (e.g. Marquee infinite track, top counter numbers) must stay in a fixed physical orientation regardless of Arabic mode.
- Apply `style={{ direction: 'ltr' }}` directly to the wrapper to prevent unwanted flex reversals.

### 4. Dictionary Key Parity
When you add a new translation key to `messages/ar.json`, **you MUST immediately add the identical key to `messages/en.json`**.
- TypeScript strictly enforces that `Dictionary = typeof import('@/messages/ar.json')`. If `en.json` is missing keys or shapes mismatch, type checks will fail.

### 5. Hydration Mismatches with Themes & LocalStorage
Do **not** use `useState` + `useEffect` to toggle mounting flags if it updates state synchronously after mount.
- Instead, use `useSyncExternalStore` or ensure components rendering dynamic local data run in client boundaries with proper default placeholders.

---

## 🚀 Development Workflow & Scripts

```bash
# Install dependencies
npm install

# Start development server with Turbopack
npm run dev

# Run TypeScript typecheck without emitting files
npx tsc --noEmit

# Run production build (Validates SSG & all routes)
npm run build

# Start production server
npm run start
```

---

*Made with ❤️ by Hamza*
