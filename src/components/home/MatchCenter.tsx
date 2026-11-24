"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, CalendarPlus, MapPin, Trophy } from "lucide-react";
import { useI18n } from "@/i18n/LanguageProvider";
import { ButtonLink, Crest, Reveal, SectionHeading } from "@/components/ui";
import { matchesDictionaries } from "@/i18n/matches";
import { teams, SCAN_DATE } from "@/content/fixtures";
import { icsFor, mapsUrl, nextFixture, pastFixtures } from "@/content/fixtures-model";
import { routes } from "@/features/fees/ui";
import { Table } from "@/components/matches/MatchesPage";

/**
 * Match Center da página inicial — DADOS REAIS (src/content/fixtures.ts),
 * lidos nas publicações da AF Algarve. Página completa: /jogos.
 */
const homeTeams = teams.filter((t) => t.fixtures.length > 0);

function useCountdown(target: Date | null) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const diff = target ? Math.max(0, target.getTime() - (now ?? target.getTime())) : 0;
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff / 3600000) % 24),
    m: Math.floor((diff / 60000) % 60),
    s: Math.floor((diff / 1000) % 60),
    ready: now !== null && target !== null,
  };
}

function TeamSide({ us, label, dark }: { us: boolean; label: string; dark?: boolean }) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-3 text-center">
      <div className="grid size-16 place-items-center sm:size-20">
        {us ? (
          <Crest className="w-full" alt="" />
        ) : (
          <span className={`grid size-14 place-items-center rounded-full text-2xl font-bold sm:size-16 ${dark ? "bg-white/10 text-white/70" : "bg-foam text-mist ring-1 ring-line"}`}>{label.slice(0, 1)}</span>
        )}
      </div>
      <span className={`text-xs font-semibold uppercase tracking-wide sm:text-sm ${dark ? "text-white" : "text-ink"}`}>{us ? "Quarteirense" : label}</span>
    </div>
  );
}

export function MatchCenter() {
  const { t, locale } = useI18n();
  const m = matchesDictionaries[locale];
  const [sel, setSel] = useState(homeTeams[0].id);
  const [today, setToday] = useState<Date | null>(null);
  useEffect(() => {
    setToday(new Date());
    try {
      const mine = window.localStorage.getItem("cdrq.myTeam");
      if (mine && homeTeams.some((x) => x.id === mine)) setSel(mine);
    } catch {
      /* ignora */
    }
  }, []);
  const team = homeTeams.find((x) => x.id === sel) ?? homeTeams[0];
  const ref = today ?? new Date(`${SCAN_DATE}T12:00:00`);
  const next = nextFixture(team, ref);
  const last = pastFixtures(team, ref)[0];
  const nextDate = next ? new Date(next.date.includes("T") ? `${next.date}:00` : `${next.date}T12:00:00`) : null;
  const cd = useCountdown(nextDate);
  const fmt = (iso: string, withTime = false) => {
    const d = new Date(iso.includes("T") ? `${iso}:00` : `${iso}T12:00:00`);
    return d.toLocaleDateString(locale === "pt" ? "pt-PT" : locale, { weekday: "short", day: "2-digit", month: "short", ...(withTime && iso.includes("T") ? { hour: "2-digit", minute: "2-digit" } : {}) });
  };
  const sc = last?.score;
  const outcome = sc ? (sc.us > sc.them ? "V" : sc.us === sc.them ? "E" : "D") : null;

  return (
    <section id="jogos" className="relative bg-foam py-20 md:py-28">
      <div className="container-site">
        <SectionHeading eyebrow={t.match.eyebrow} title={t.match.title}>
          <ButtonLink href={routes.matches} variant="royal">
            {m.allTeams}
          </ButtonLink>
        </SectionHeading>

        {/* Seletor de equipa */}
        <div className="no-scrollbar -mx-4 mt-10 overflow-x-auto px-4">
          <div role="tablist" aria-label={m.pick} className="inline-flex gap-1 rounded-full bg-white p-1 ring-1 ring-line">
            {homeTeams.map((x) => (
              <button
                key={x.id}
                role="tab"
                type="button"
                aria-selected={sel === x.id}
                onClick={() => setSel(x.id)}
                className="relative whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors"
              >
                {sel === x.id && <motion.span layoutId="cat-pill" className="absolute inset-0 rounded-full bg-night" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />}
                <span className={`relative ${sel === x.id ? "text-white" : "text-mist hover:text-ink"}`}>{x.name}</span>
              </button>
            ))}
          </div>
        </div>

        <Reveal>
          <AnimatePresence mode="wait">
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]"
            >
              {/* Último jogo */}
              <div className="flex flex-col rounded-3xl bg-white p-6 ring-1 ring-line md:p-8">
                <div className="flex items-center justify-between gap-3">
                  <p className="eyebrow text-royal">{t.match.last}</p>
                  {last && <span className="eyebrow text-mist">{last.home ? t.match.home : t.match.away}</span>}
                </div>
                {last ? (
                  <>
                    <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                      <TeamSide us={last.home} label={last.opponent} />
                      <div className="flex flex-col items-center">
                        {sc ? (
                          <>
                            <span className="font-mono text-5xl font-semibold tabular-nums tracking-tight sm:text-6xl">
                              {last.home ? sc.us : sc.them}
                              <span className="mx-1 text-line">–</span>
                              {last.home ? sc.them : sc.us}
                            </span>
                            <span className={`mt-3 grid size-7 place-items-center rounded-full text-xs font-bold text-white ${outcome === "V" ? "bg-emerald-600" : outcome === "E" ? "bg-mist" : "bg-signal"}`}>{outcome}</span>
                          </>
                        ) : (
                          <span className="max-w-[7rem] text-center text-xs text-mist">{m.noScore}</span>
                        )}
                      </div>
                      <TeamSide us={!last.home} label={last.opponent} />
                    </div>
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5 text-sm text-mist">
                      <span className="inline-flex min-w-0 items-center gap-2">
                        <Trophy className="size-4 shrink-0 text-royal" /> <span className="truncate">{last.competition ?? team.competition}</span>
                      </span>
                      <span>{fmt(last.date)}</span>
                    </div>
                  </>
                ) : (
                  <p className="mt-6 text-sm text-mist">{m.noResults}</p>
                )}
              </div>

              {/* Próximo jogo */}
              <div className="relative overflow-hidden rounded-3xl bg-night p-6 text-white md:p-8">
                <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-royal/50 blur-3xl" aria-hidden />
                <div className="relative flex items-center justify-between gap-3">
                  <p className="eyebrow text-haze">{t.match.next}</p>
                  {next && <span className="eyebrow rounded-full bg-white/10 px-2.5 py-1 !text-[0.6rem]">{next.home ? t.match.home : t.match.away}</span>}
                </div>
                {next ? (
                  <>
                    <div className="relative mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                      <TeamSide us={next.home} label={next.opponent} dark />
                      <span className="display text-3xl text-white/40">VS</span>
                      <TeamSide us={!next.home} label={next.opponent} dark />
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
                      <span className="inline-flex items-center gap-2">
                        <CalendarDays className="size-4 text-signal" /> {fmt(next.date, true)}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <MapPin className="size-4 text-signal" /> {next.venue}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <Trophy className="size-4 text-signal" /> {next.competition ?? team.competition}
                      </span>
                    </div>
                    <div className="relative mt-7 flex flex-wrap gap-3">
                      {next.mapQuery && (
                        <a href={mapsUrl(next.mapQuery)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-signal px-5 py-3 text-sm font-semibold text-white hover:bg-signal-deep">
                          <MapPin className="size-4" /> {m.map}
                        </a>
                      )}
                      <a href={icsFor(team, next)} download={`quarteirense-${team.id}.ics`} className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white ring-1 ring-inset ring-white/35 hover:bg-white/10">
                        <CalendarPlus className="size-4" /> {t.match.addCalendar}
                      </a>
                    </div>
                    <p className="relative mt-5 text-xs text-haze">
                      {m.source}:{" "}
                      <a href={next.source.url} target="_blank" rel="noreferrer" className="underline decoration-dotted">
                        {next.source.label}
                      </a>
                    </p>
                  </>
                ) : (
                  <p className="relative mt-6 text-white/80">{m.noNext}</p>
                )}
              </div>

              {/* Classificação */}
              <div className="lg:col-span-2">
                <Table team={team} />
              </div>
            </motion.div>
          </AnimatePresence>
        </Reveal>
        <p className="mt-5 max-w-3xl text-sm text-mist">{m.honest}</p>
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
