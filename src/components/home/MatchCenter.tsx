"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, CalendarPlus, MapPin, Ticket, Trophy } from "lucide-react";
import { useI18n } from "@/i18n/LanguageProvider";
import { ButtonLink, Crest, DemoBadge, Ph, Reveal, SectionHeading } from "@/components/ui";

type CatKey = "seniors" | "women" | "futsal" | "u19" | "u17";

/**
 * DADOS DE EXEMPLO — estrutura pronta a ligar à tabela `matches` (Supabase).
 * Adversários anónimos de propósito: nenhum resultado real é inventado.
 */
const demo: Record<CatKey, { last: { home: boolean; us: number; them: number; daysAgo: number }; next: { home: boolean; inDays: number; hour: number } }> = {
  seniors: { last: { home: true, us: 2, them: 1, daysAgo: 6 }, next: { home: false, inDays: 0, hour: 15 } },
  women: { last: { home: false, us: 3, them: 3, daysAgo: 7 }, next: { home: true, inDays: 1, hour: 11 } },
  futsal: { last: { home: true, us: 5, them: 2, daysAgo: 5 }, next: { home: true, inDays: -1, hour: 21 } },
  u19: { last: { home: false, us: 1, them: 0, daysAgo: 6 }, next: { home: true, inDays: 0, hour: 11 } },
  u17: { last: { home: true, us: 0, them: 2, daysAgo: 7 }, next: { home: false, inDays: 0, hour: 17 } },
};

function nextWeekend(offset: number, hour: number) {
  const d = new Date();
  const day = d.getDay();
  const toSunday = (7 - day) % 7 || 7;
  d.setDate(d.getDate() + toSunday + offset);
  d.setHours(hour, 0, 0, 0);
  return d;
}

function useCountdown(target: Date) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - (now ?? target.getTime()));
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff / 3600000) % 24),
    m: Math.floor((diff / 60000) % 60),
    s: Math.floor((diff / 1000) % 60),
    ready: now !== null,
  };
}

function OpponentShield({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 72" className={className} aria-hidden>
      <path d="M32 3 L59 12 V34 C59 52 46 64 32 69 C18 64 5 52 5 34 V12 Z" fill="#eef3fb" stroke="#9fb0cf" strokeWidth="2" strokeDasharray="4 4" />
      <text x="32" y="44" textAnchor="middle" fontSize="22" fontWeight="700" fill="#9fb0cf" fontFamily="system-ui">?</text>
    </svg>
  );
}

function TeamSide({ us, label, dark }: { us: boolean; label: string; dark?: boolean }) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-3 text-center">
      <div className="grid size-16 place-items-center sm:size-20">{us ? <Crest className="w-full" alt="" /> : <OpponentShield className="w-[78%]" />}</div>
      <span className={`text-xs font-semibold uppercase tracking-wide sm:text-sm ${dark ? "text-white" : "text-ink"}`}>{us ? "Quarteirense" : <Ph>{label}</Ph>}</span>
    </div>
  );
}

export function MatchCenter() {
  const { t, locale } = useI18n();
  const [cat, setCat] = useState<CatKey>("seniors");
  const data = demo[cat];
  const nextDate = useMemo(() => nextWeekend(data.next.inDays, data.next.hour), [data]);
  const lastDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - data.last.daysAgo);
    return d;
  }, [data]);
  const cd = useCountdown(nextDate);
  const fmt = (d: Date, withTime = false) =>
    d.toLocaleDateString(locale === "pt" ? "pt-PT" : locale, { weekday: "short", day: "2-digit", month: "short", ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}) });

  const cats = Object.entries(t.match.categories) as [CatKey, string][];
  const lastHome = data.last.home;
  const lastLeft = lastHome ? data.last.us : data.last.them;
  const lastRight = lastHome ? data.last.them : data.last.us;
  const outcome = data.last.us > data.last.them ? "V" : data.last.us === data.last.them ? "E" : "D";

  return (
    <section id="jogos" className="relative bg-foam py-20 md:py-28">
      <div className="container-site">
        <SectionHeading eyebrow={t.match.eyebrow} title={t.match.title}>
          <DemoBadge label={t.common.demo} />
        </SectionHeading>

        {/* Seletor de escalão */}
        <div className="no-scrollbar -mx-4 mt-10 overflow-x-auto px-4">
          <div role="tablist" aria-label="Escalão" className="inline-flex gap-1 rounded-full bg-white p-1 ring-1 ring-line">
            {cats.map(([k, label]) => (
              <button
                key={k}
                role="tab"
                type="button"
                aria-selected={cat === k}
                onClick={() => setCat(k)}
                className="relative whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors"
              >
                {cat === k && <motion.span layoutId="cat-pill" className="absolute inset-0 rounded-full bg-night" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />}
                <span className={`relative ${cat === k ? "text-white" : "text-mist hover:text-ink"}`}>{label}</span>
              </button>
            ))}
          </div>
        </div>

        <Reveal>
          <AnimatePresence mode="wait">
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="mt-6 grid gap-4 lg:grid-cols-[0.85fr_1.15fr]"
            >
              {/* Último resultado */}
              <Ph as="div" className="flex flex-col rounded-3xl bg-white p-6 ring-1 ring-line md:p-8">
                <div className="flex items-center justify-between gap-3">
                  <p className="eyebrow text-royal">{t.match.last}</p>
                  <span className="eyebrow text-mist">{t.match.final}</span>
                </div>
                <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                  <TeamSide us={lastHome} label={t.match.opponent} />
                  <div className="flex flex-col items-center">
                    <span className="font-mono text-5xl font-semibold tabular-nums tracking-tight sm:text-6xl">
                      {lastLeft}
                      <span className="mx-1 text-line">–</span>
                      {lastRight}
                    </span>
                    <span
                      className={`mt-3 grid size-7 place-items-center rounded-full text-xs font-bold text-white ${outcome === "V" ? "bg-emerald-600" : outcome === "E" ? "bg-mist" : "bg-signal"}`}
                      title={outcome === "V" ? "Vitória" : outcome === "E" ? "Empate" : "Derrota"}
                    >
                      {outcome}
                    </span>
                  </div>
                  <TeamSide us={!lastHome} label={t.match.opponent} />
                </div>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5 text-sm text-mist">
                  <span className="inline-flex items-center gap-2">
                    <Trophy className="size-4 text-royal" /> {t.match.competition}
                  </span>
                  <span suppressHydrationWarning>{fmt(lastDate)}</span>
                </div>
                <a href="#noticias" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-royal hover:underline">
                  {t.match.matchReport} →
                </a>
              </Ph>

              {/* Próximo jogo */}
              <Ph as="div" className="relative overflow-hidden rounded-3xl bg-night p-6 text-white md:p-8">
                <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-royal/50 blur-3xl" aria-hidden />
                <div className="relative flex items-center justify-between gap-3">
                  <p className="eyebrow text-haze">{t.match.next}</p>
                  <span className="eyebrow rounded-full bg-white/10 px-2.5 py-1 !text-[0.6rem]">{data.next.home ? t.match.home : t.match.away}</span>
                </div>
                <div className="relative mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                  <TeamSide us={data.next.home} label={t.match.opponent} dark />
                  <span className="display text-3xl text-white/40">VS</span>
                  <TeamSide us={!data.next.home} label={t.match.opponent} dark />
                </div>

                <div className="relative mt-8 grid grid-cols-4 gap-2 sm:gap-3" aria-live="off">
                  {[
                    [cd.d, t.match.days],
                    [cd.h, t.match.hours],
                    [cd.m, t.match.minutes],
                    [cd.s, t.match.seconds],
                  ].map(([v, l]) => (
                    <div key={l as string} className="rounded-2xl bg-white/[0.06] px-2 py-3 text-center ring-1 ring-white/10">
                      <span className="block font-mono text-3xl font-semibold tabular-nums sm:text-4xl" suppressHydrationWarning>
                        {cd.ready ? String(v).padStart(2, "0") : "--"}
                      </span>
                      <span className="eyebrow mt-1 block !text-[0.58rem] text-haze">{l}</span>
                    </div>
                  ))}
                </div>

                <div className="relative mt-6 flex flex-col gap-2 text-sm text-white/80 sm:flex-row sm:flex-wrap sm:gap-x-6">
                  <span className="inline-flex items-center gap-2" suppressHydrationWarning>
                    <CalendarDays className="size-4 text-signal" /> {fmt(nextDate, true)}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="size-4 text-signal" /> {data.next.home ? t.match.venueHome : t.match.venueAway}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Trophy className="size-4 text-signal" /> {t.match.competition}
                  </span>
                </div>
                <div className="relative mt-7 flex flex-wrap gap-3">
                  <ButtonLink href="#jogos" variant="primary">
                    {t.match.fullCalendar}
                  </ButtonLink>
                  <span className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm text-white/60 ring-1 ring-white/15" title={t.common.soon}>
                    <Ticket className="size-4" /> {t.match.tickets} · {t.common.soon}
                  </span>
                  <span className="hidden items-center gap-2 rounded-full px-4 py-3 text-sm text-white/60 ring-1 ring-white/15 sm:inline-flex" title={t.common.soon}>
                    <CalendarPlus className="size-4" /> {t.match.addCalendar}
                  </span>
                </div>
              </Ph>
            </motion.div>
          </AnimatePresence>
        </Reveal>
        <p className="mt-5 max-w-3xl text-sm text-mist">{t.match.demoNote}</p>
      </div>
    </section>
  );
}

export function Ticker() {
  const { t } = useI18n();
  const items = [...t.ticker, ...t.ticker];
  return (
    <div className="relative overflow-hidden bg-signal py-3.5 text-white" aria-label="Certificações">
      <div className="animate-marquee flex w-max items-center gap-10 whitespace-nowrap">
        {items.map((it, i) => (
          <span key={i} className="display flex items-center gap-10 text-lg tracking-wide md:text-xl" aria-hidden={i >= t.ticker.length}>
            {it}
            <span className="inline-block size-1.5 rotate-45 bg-white/70" />
          </span>
        ))}
      </div>
    </div>
  );
}
