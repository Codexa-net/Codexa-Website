"use client"

import {
  ArrowUpLeft,
  ArrowUpRight,
  BrainCircuit,
  Boxes,
  Code2,
  Globe,
  Palette,
  ShieldCheck,
  Smartphone,
  Users,
} from "lucide-react"


/* =========================================================
   ICON MAP
========================================================= */

const iconMap = {
  globe: Globe,
  smartphone: Smartphone,
  palette: Palette,
  boxes: Boxes,
  brain: BrainCircuit,
  users: Users,
  code: Code2,
  shield: ShieldCheck,
} as const

type IconName = keyof typeof iconMap


/* =========================================================
   TYPES
========================================================= */

export interface ValueItem {
  number: string
  title: string
  description: string
  small: string
  icon: string
}

interface ValuesGridProps {
  items: ValueItem[]
  isArabic: boolean
}


/* =========================================================
   VALUES GRID
========================================================= */

export function ValuesGrid({
  items,
  isArabic,
}: ValuesGridProps) {
  return (
    <div
      className={[
        "mt-16 w-full",

        /*
         * Mobile / Tablet
         * Normal responsive grid because hover expansion
         * isn't useful on touch screens.
         */
        "grid grid-cols-1 gap-5",
        "sm:grid-cols-2",
        "lg:grid-cols-3",

        /*
         * Desktop
         * Change to flex so cards can dynamically expand.
         */
        "xl:flex xl:items-stretch xl:gap-5",

        /*
         * RTL keeps the same visual ordering as the design.
         */
        isArabic ? "[direction:rtl]" : "[direction:ltr]",
      ].join(" ")}
    >
      {items.map((item) => {
        const Icon =
          iconMap[item.icon as IconName] ?? Globe

        return (
          <div
            key={item.number}
            className={[
              /*
               * =================================================
               * DESKTOP FLEX BEHAVIOR
               * =================================================
               *
               * Every card starts with the same flex value.
               *
               * On hover:
               * - hovered card grows
               * - other cards automatically shrink
               *
               * flex-[2.8] is what creates the large expansion
               * shown in your screenshot.
               */
              "xl:flex-1",
              "xl:hover:flex-[2.8]",

              /*
               * Smooth width expansion.
               */
              "transition-[flex]",
              "duration-1000",
              "ease-[cubic-bezier(0.22,1,0.36,1)]",

              /*
               * Mobile / tablet cards.
               */
              "w-full",

              /*
               * Card height.
               */
              "min-h-[420px]",
              "xl:h-[560px]",

              /*
               * Appearance.
               */
              "relative",
              "overflow-hidden",
              "rounded-[20px]",
              "border",
              "border-white/[0.04]",

              /*
               * Default background.
               */
              "bg-[#24205c]",

              /*
               * Hover background.
               */
              "hover:bg-gradient-to-b",
              "hover:from-[#4b42a9]",
              "hover:to-[#26205f]",

              /*
               * Lift slightly on hover.
               */
              "hover:-translate-y-2",

              /*
               * Shadow.
               */
              "shadow-none",
              "hover:shadow-[0_25px_70px_rgba(70,65,180,0.25)]",

              /*
               * Smooth visual transitions.
               */
              "transition-all",
              "duration-500",
              "ease-[cubic-bezier(0.22,1,0.36,1)]",

              /*
               * Group for child hover animations.
               */
              "group",
            ].join(" ")}
          >
            <div
              className={[
                "flex h-full w-full flex-col p-6 sm:p-7",

                /*
                 * Keep content direction correct.
                 */
                isArabic
                  ? "text-right"
                  : "text-left",
              ].join(" ")}
            >

              {/* =================================================
                  NUMBER + ICON
              ================================================= */}

              <div
                className={[
                  "flex shrink-0 items-start justify-between",

                  isArabic
                    ? "[direction:rtl]"
                    : "[direction:ltr]",
                ].join(" ")}
              >
                <span className="text-3xl font-bold text-white">
                  {item.number}
                </span>

                <Icon
                  className={[
                    "h-7 w-7",
                    "text-white/40",
                    "transition-all",
                    "duration-500",

                    /*
                     * Icon becomes brighter/larger when
                     * the card is hovered.
                     */
                    "group-hover:scale-110",
                    "group-hover:text-white",
                  ].join(" ")}
                />
              </div>


              {/* =================================================
                  CONTENT
              ================================================= */}

              <div
                className={[
                  "flex flex-1 flex-col",

                  /*
                   * Important:
                   *
                   * We don't use a fixed mt-14 here.
                   * This allows the title to sit naturally
                   * inside the expanding card.
                   */
                  "pt-16",

                  isArabic
                    ? "text-right"
                    : "text-left",
                ].join(" ")}
              >

                {/* =================================================
                    TITLE
                ================================================= */}

                <h3
                  className={[
                    "text-xl",
                    "font-black",
                    "leading-[1.45]",
                    "text-white",
                    "sm:text-2xl",

                    /*
                     * Keep title stable while card expands.
                     */
                    "transition-all",
                    "duration-500",
                  ].join(" ")}
                >
                  {item.title}
                </h3>


                {/* =================================================
                    DESCRIPTION
                ================================================= */}

                <div
                  className={[
                    /*
                     * Hidden initially.
                     */
                    "grid",
                    "grid-rows-[0fr]",

                    /*
                     * Open on hover.
                     */
                    "transition-[grid-template-rows]",
                    "duration-500",
                    "ease-[cubic-bezier(0.22,1,0.36,1)]",

                    "group-hover:grid-rows-[1fr]",
                  ].join(" ")}
                >
                  <div className="overflow-hidden">

                    <p
                      className={[
                        "pt-0",

                        /*
                         * Description appears smoothly.
                         */
                        "opacity-0",
                        "translate-y-3",

                        "transition-all",
                        "duration-500",
                        "ease-[cubic-bezier(0.22,1,0.36,1)]",

                        "group-hover:pt-6",
                        "group-hover:opacity-100",
                        "group-hover:translate-y-0",

                        "text-[15px]",
                        "leading-7",
                        "text-white/70",
                        "sm:leading-8",
                      ].join(" ")}
                    >
                      {item.description}
                    </p>

                  </div>
                </div>


                {/* =================================================
                    BOTTOM AREA
                ================================================= */}

                <div
                  className={[
                    "mt-auto",
                    "pt-8",
                    "flex",
                    "items-end",
                    "justify-between",
                    "gap-4",

                    isArabic
                      ? "[direction:rtl]"
                      : "[direction:ltr]",
                  ].join(" ")}
                >

                  {/* Small label */}

                  <span
                    className={[
                      "text-sm",
                      "font-bold",
                      "text-white/50",

                      /*
                       * Allow wrapping inside narrow cards.
                       */
                      "max-w-[150px]",
                      "leading-8",

                      /*
                       * When the card expands, label becomes
                       * more visible.
                       */
                      "transition-all",
                      "duration-500",
                    ].join(" ")}
                  >
                    {item.small}
                  </span>


                  {/* =================================================
                      ARROW
                  ================================================= */}

                  <span
                    aria-hidden="true"
                    className={[
                      "flex",
                      "h-10",
                      "w-10",
                      "shrink-0",
                      "items-center",
                      "justify-center",
                      "rounded-full",
                      "border",

                      "transition-all",
                      "duration-500",

                      "border-white/70",
                      "text-white",

                      /*
                       * Screenshot behavior:
                       * arrow becomes filled when active/hovered.
                       */
                      "group-hover:border-white",
                      "group-hover:bg-white",
                      "group-hover:text-[#171451]",
                    ].join(" ")}
                  >
                    {isArabic ? (
                      <ArrowUpLeft className="h-5 w-5" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5" />
                    )}
                  </span>

                </div>

              </div>

            </div>
          </div>
        )
      })}
    </div>
  )
}