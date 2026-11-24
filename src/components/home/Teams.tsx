"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Camera } from "lucide-react";
import { useI18n } from "@/i18n/LanguageProvider";
import type { Dict } from "@/i18n/dictionaries";
import { club } from "@/content/club";
import { Ph, Reveal, SectionHeading } from "@/components/ui";

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(value);
  useEffect(() => {
    if (!inView || reduce) return;
    const from = value > 1900 ? 1900 : 0;
    const c = animate(from, value, { duration: 1.6, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setShown(Math.round(v)) });
    return () => c.stop();
  }, [inView, reduce, value]);
  return (
    <span ref={ref} className="tabular-nums">
      {shown.toLocaleString("pt-PT")}
      {suffix}
    </span>
  );
}

export function Stats() {
  const { t } = useI18n();
  const f = club.figures;
  const items = [
    { v: f.founded, l: t.stats.founded },
    { v: f.members, l: t.stats.members },
    { v: f.federatedAthletes, l: t.stats.athletes },
    { v: f.disciplines, l: t.stats.disciplines },
    { v: f.fpfStars, l: t.stats.stars, suffix: "★" },
  ];
  return (
    <section id="numeros" className="relative overflow-hidden bg-royal text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_120%_at_0%_0%,rgba(255,255,255,.14),transparent_60%)]" aria-hidden />
      <div className="container-site relative py-14 md:py-16">
        <p className="eyebrow flex items-center gap-3 text-white/70">
          <span className="band" aria-hidden /> {t.stats.eyebrow}
        </p>
        <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-5">
          {items.map((it) => (
            <div key={it.l} className="min-w-0 border-l border-white/25 pl-4">
              <dd className="display text-5xl md:text-6xl lg:text-7xl">
                <Counter value={it.v} suffix={it.suffix} />
              </dd>
              <dt className="mt-2 text-sm text-white/75">{it.l}</dt>
            </div>
          ))}
        </dl>
        <Ph as="div" className="mt-8 inline-block text-xs text-white/55">
          {t.stats.source}
        </Ph>
      </div>
    </section>
  );
}

type TeamKey = keyof Dict["teams"]["items"];
const TEAMS: { key: TeamKey; tone: string; mark: string }[] = [
  { key: "seniors", tone: "from-royal via-deep to-night", mark: "11" },
  { key: "women", tone: "from-[#1d4ed8] via-royal to-night", mark: "F" },
  { key: "academy", tone: "from-signal via-[#7a1530] to-night", mark: "U19" },
  { key: "futsal", tone: "from-royal-bright via-royal to-night", mark: "5" },
  { key: "beach", tone: "from-[#c9a86a] via-[#3b5a8f] to-night", mark: "☀" },
  { key: "teqball", tone: "from-deep via-abyss to-night", mark: "T" },
  { key: "walking", tone: "from-[#2b6cb0] via-deep to-night", mark: "W" },
  { key: "boxing", tone: "from-[#9b1c24] via-abyss to-night", mark: "B" },
  { key: "petanque", tone: "from-[#5b6b8c] via-abyss to-night", mark: "●" },
];

export function Teams() {
  const { t } = useI18n();
  const track = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 640), behavior: "smooth" });
  };

  return (
    <section id="equipas" className="relative overflow-hidden bg-night py-20 text-white md:py-28">
      <div className="container-site">
        <SectionHeading eyebrow={t.teams.eyebrow} title={t.teams.title} lead={t.teams.lead} dark>
          <div className="flex gap-2">
            <button type="button" onClick={() => scroll(-1)} aria-label="Anterior" className="grid size-12 place-items-center rounded-full ring-1 ring-white/20 transition-colors hover:bg-white hover:text-night">
              <ArrowLeft className="size-5" />
            </button>
            <button type="button" onClick={() => scroll(1)} aria-label="Seguinte" className="grid size-12 place-items-center rounded-full ring-1 ring-white/20 transition-colors hover:bg-white hover:text-night">
              <ArrowRight className="size-5" />
            </button>
          </div>
        </SectionHeading>
      </div>

      <div
        ref={track}
        className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4 pl-4 md:pl-[max(2rem,calc((100vw_-_88rem)/2_+_2rem))] pr-4 md:gap-5"
      >
        {TEAMS.map((team, i) => {
          const item = t.teams.items[team.key];
          return (
            <Reveal key={team.key} delay={Math.min(i, 4) * 0.06} className="shrink-0 snap-start">
              <a href="#equipas" className="group relative flex aspect-[3/4] w-[17rem] flex-col justify-between overflow-hidden rounded-3xl p-6 ring-1 ring-white/10 sm:w-[19rem] lg:w-[21rem]">
                <div className={`absolute inset-0 bg-gradient-to-b ${team.tone} transition-transform duration-700 group-hover:scale-105`} aria-hidden />
                <span className="display text-outline pointer-events-none absolute -right-4 top-6 text-[11rem] leading-none text-white/25 transition-transform duration-700 group-hover:-translate-x-3" aria-hidden>
                  {team.mark}
                </span>
                <div className="relative flex items-start justify-between">
                  <span className="font-mono text-xs text-white/60">{String(i + 1).padStart(2, "0")} / {String(TEAMS.length).padStart(2, "0")}</span>
                  <Ph className="inline-flex items-center gap-1 rounded-full bg-black/25 px-2 py-1 text-[0.62rem] text-white/70 backdrop-blur">
                    <Camera className="size-3" /> Foto
                  </Ph>
                </div>
                <div className="relative">
                  <p className="eyebrow text-white/70">{item.group}</p>
                  <h3 className="display mt-2 text-5xl">{item.name}</h3>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">
                    {t.teams.open}
                    <span className="grid size-8 place-items-center rounded-full bg-white text-night transition-transform duration-300 group-hover:translate-x-1">
                      <ArrowRight className="size-4" />
                    </span>
                  </span>
                </div>
              </a>
            </Reveal>
          );
        })}
        <div className="w-4 shrink-0" aria-hidden />
      </div>
    </section>
  );
}
