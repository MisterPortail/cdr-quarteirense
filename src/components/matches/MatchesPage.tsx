"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, CalendarPlus, Clock, ExternalLink, Info, MapPin, Star, Trophy } from "lucide-react";
import { useI18n } from "@/i18n/LanguageProvider";
import { matchesDictionaries } from "@/i18n/matches";
import { Crest } from "@/components/ui";
import { Header } from "@/components/home/Header";
import { Footer, ReviewToggle } from "@/components/home/Footer";
import { icsFor, mapsUrl, nextFixture, pastFixtures, upcomingFixtures, type Discipline, type Fixture, type Source, type Team } from "@/content/fixtures-model";
import { teams, SCAN_DATE } from "@/content/fixtures";

const MY_TEAM_KEY = "cdrq.myTeam";

function readMine(): string | null {
  try {
    return window.localStorage.getItem(MY_TEAM_KEY);
  } catch {
    return null;
  }
}
function writeMine(id: string) {
  try {
    window.localStorage.setItem(MY_TEAM_KEY, id);
  } catch {
    /* navegação privada: ignora */
  }
}

const loc = (l: string) => (l === "pt" ? "pt-PT" : l);

function fmtDate(iso: string, locale: string, long = false) {
  const [d] = iso.split("T");
  const date = new Date(`${d}T12:00:00`);
  return date.toLocaleDateString(loc(locale), long ? { weekday: "long", day: "numeric", month: "long" } : { weekday: "short", day: "2-digit", month: "short" });
}
const timeOf = (iso: string) => (iso.includes("T") ? iso.split("T")[1].slice(0, 5) : null);

function SourceLine({ s, dark = false }: { s: Source; dark?: boolean }) {
  const { locale } = useI18n();
  const m = matchesDictionaries[locale];
  return (
    <p className={`text-xs ${dark ? "text-haze" : "text-mist"}`}>
      {m.source}:{" "}
      <a href={s.url} target="_blank" rel="noreferrer" className="underline decoration-dotted underline-offset-2 hover:text-royal">
        {s.label}
      </a>{" "}
      · {m.checked} {new Date(`${s.checked}T12:00:00`).toLocaleDateString(loc(locale))}
    </p>
  );
}

function NextMatch({ team, now }: { team: Team; now: Date }) {
  const { locale } = useI18n();
  const m = matchesDictionaries[locale];
  const f = nextFixture(team, now);
  if (!f)
    return (
      <div className="flex h-full flex-col justify-between gap-6 rounded-3xl bg-night p-6 text-white md:p-8">
        <p className="eyebrow text-haze">{m.next}</p>
        <p className="text-lg text-white/80">{m.noNext}</p>
        {team.officialLink && <OfficialLink link={team.officialLink} dark />}
      </div>
    );
  const t = timeOf(f.date);
  return (
    <div className="relative h-full overflow-hidden rounded-3xl bg-night p-6 text-white md:p-8">
      <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-royal/50 blur-3xl" aria-hidden />
      <div className="relative flex items-center justify-between gap-3">
        <p className="eyebrow text-haze">{m.next}</p>
        <span className="eyebrow rounded-full bg-white/10 px-2.5 py-1 !text-[0.6rem]">{f.home ? m.home : m.away}</span>
      </div>
      <div className="relative mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center">
        <TeamName us={f.home} name={f.opponent} />
        <span className="display text-2xl text-white/40">VS</span>
        <TeamName us={!f.home} name={f.opponent} />
      </div>
      <div className="relative mt-7 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/10">
          <p className="flex items-center gap-2 text-sm text-haze">
            <CalendarDays className="size-4 text-signal" /> <span className="first-letter:uppercase">{fmtDate(f.date, locale, true)}</span>
          </p>
          <p className="mt-1 flex items-center gap-2 font-mono text-3xl font-semibold tabular-nums">
            <Clock className="size-5 text-signal" /> {t ?? <span className="text-base font-normal text-white/70">{m.timeTbc}</span>}
          </p>
        </div>
        <div className="rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/10">
          <p className="flex items-center gap-2 text-sm text-haze">
            <MapPin className="size-4 text-signal" /> {f.home ? m.home : m.away}
          </p>
          <p className="mt-1 text-base font-semibold leading-snug">{f.venue ?? "—"}</p>
        </div>
      </div>
      <div className="relative mt-6 flex flex-wrap gap-3">
        {(f.mapQuery || f.venue) && (
          <a href={mapsUrl(f.mapQuery ?? f.venue!)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-signal px-5 py-3 text-sm font-semibold text-white hover:bg-signal-deep">
            <MapPin className="size-4" /> {m.map}
          </a>
        )}
        <a href={icsFor(team, f)} download={`quarteirense-${team.id}.ics`} className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white ring-1 ring-inset ring-white/35 hover:bg-white/10">
          <CalendarPlus className="size-4" /> {m.calendar}
        </a>
      </div>
      <div className="relative mt-6 border-t border-white/10 pt-4">
        {f.competition && (
          <p className="mb-1 flex items-center gap-2 text-xs text-haze">
            <Trophy className="size-3.5" /> {[f.competition, f.round].filter(Boolean).join(" · ")}
          </p>
        )}
        <SourceLine s={f.source} dark />
      </div>
    </div>
  );
}

function TeamName({ us, name }: { us: boolean; name: string }) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-2">
      {us ? <Crest className="size-14 object-contain" alt="" /> : <span className="grid size-14 place-items-center rounded-full bg-white/10 text-xl font-bold text-white/70">{name.slice(0, 1)}</span>}
      <span className="text-xs font-semibold uppercase tracking-wide sm:text-sm">{us ? "Quarteirense" : name}</span>
    </div>
  );
}

function OfficialLink({ link, dark = false }: { link: { label: string; url: string }; dark?: boolean }) {
  const { locale } = useI18n();
  const m = matchesDictionaries[locale];
  return (
    <a href={link.url} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-2 text-sm font-semibold hover:underline ${dark ? "text-white" : "text-royal"}`}>
      {m.official}: {link.label} <ExternalLink className="size-3.5" />
    </a>
  );
}

function SeasonRow({ f, played, noScores = false }: { f: Fixture; played: boolean; noScores?: boolean }) {
  const { locale } = useI18n();
  const m = matchesDictionaries[locale];
  const sc = f.score;
  const o = sc ? (sc.us > sc.them ? "w" : sc.us === sc.them ? "d" : "l") : null;
  const t = timeOf(f.date);
  return (
    <li className="flex items-center gap-3 py-2.5 text-sm">
      <span className="w-[4.8rem] shrink-0 text-xs text-mist">
        {fmtDate(f.date, locale)}
        {!played && t && <span className="block font-mono">{t}</span>}
      </span>
      <span
        className={`grid size-6 shrink-0 place-items-center rounded-full text-[0.65rem] font-bold ${f.home ? "bg-royal/10 text-royal" : "bg-foam text-mist ring-1 ring-line"}`}
        title={f.home ? m.home : m.away}
      >
        {f.home ? m.homeShort : m.awayShort}
      </span>
      <span className="min-w-0 flex-1 truncate">{f.opponent}</span>
      {played &&
        !noScores &&
        (sc && o ? (
          <span className={`shrink-0 rounded-md px-2 py-0.5 font-mono text-xs font-semibold text-white ${o === "w" ? "bg-emerald-600" : o === "d" ? "bg-mist" : "bg-signal"}`}>
            {sc.us}–{sc.them}
          </span>
        ) : (
          <span className="shrink-0 text-xs text-mist">{m.noScore}</span>
        ))}
    </li>
  );
}

function Season({ team, now }: { team: Team; now: Date }) {
  const { locale } = useI18n();
  const m = matchesDictionaries[locale];
  const [showAll, setShowAll] = useState(false);
  const past = pastFixtures(team, now);
  const coming = upcomingFixtures(team, now).slice(1); // o próximo já está no cartão
  const pastShown = showAll ? past : past.slice(0, 4);
  const comingShown = showAll ? coming : coming.slice(0, 4);
  return (
    <div className="flex flex-col rounded-3xl bg-white p-6 ring-1 ring-line md:p-8">
      <p className="eyebrow text-royal">{m.season}</p>
      {team.fixtures.length === 0 ? (
        <p className="mt-4 text-sm text-mist">{m.noFixtures}</p>
      ) : (
        <>
          {comingShown.length > 0 && (
            <>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-mist">{m.upcoming}</p>
              <ul className="divide-y divide-line">
                {comingShown.map((f) => (
                  <SeasonRow key={f.date} f={f} played={false} />
                ))}
              </ul>
            </>
          )}
          {pastShown.length > 0 && (
            <>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-mist">{m.results}</p>
              <ul className="divide-y divide-line">
                {pastShown.map((f) => (
                  <SeasonRow key={f.date} f={f} played noScores={team.noScores} />
                ))}
              </ul>
            </>
          )}
          {(past.length > 4 || coming.length > 4) && (
            <button type="button" onClick={() => setShowAll((v) => !v)} className="mt-3 self-start text-sm font-semibold text-royal hover:underline">
              {showAll ? m.showLess : m.showAll(team.fixtures.length)}
            </button>
          )}
          <p className="mt-4 rounded-xl bg-foam p-3 text-xs text-mist">{team.noScores ? m.youthNoScores : m.scoresNote}</p>
        </>
      )}
    </div>
  );
}

export function Table({ team }: { team: Team }) {
  const { locale } = useI18n();
  const m = matchesDictionaries[locale];
  const tb = team.table;
  return (
    <div className="rounded-3xl bg-white p-6 ring-1 ring-line md:p-8">
      <p className="eyebrow text-royal">{m.table}</p>
      {!tb ? (
        <div className="mt-4 space-y-3">
          <p className="text-sm text-mist">{team.noScores ? m.youthNoScores : m.noTable}</p>
          {team.officialLink && <OfficialLink link={team.officialLink} />}
        </div>
      ) : (
        <>
          <div className="-mx-2 mt-4 overflow-x-auto">
            <table className="w-full min-w-[22rem] text-sm">
              <thead>
                <tr className="text-left text-xs text-mist">
                  {(["pos", "team", "p", "w", "d", "l", "gd", "pts"] as const).map((k) => (
                    <th key={k} className={`px-2 pb-2 font-semibold ${k === "team" ? "" : "text-center"}`}>
                      {m.cols[k]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="font-mono tabular-nums">
                {tb.rows.map((r) => {
                  const us = /quarteirense/i.test(r.team);
                  const gd = r.gf != null && r.ga != null ? r.gf - r.ga : null;
                  return (
                    <tr key={r.team} className={us ? "bg-royal/10 font-semibold text-royal" : "border-t border-line"}>
                      <td className="px-2 py-2 text-center">{r.pos}</td>
                      <td className="px-2 py-2 font-sans">{r.team}</td>
                      <td className="px-2 py-2 text-center">{r.p}</td>
                      <td className="px-2 py-2 text-center">{r.w ?? "–"}</td>
                      <td className="px-2 py-2 text-center">{r.d ?? "–"}</td>
                      <td className="px-2 py-2 text-center">{r.l ?? "–"}</td>
                      <td className="px-2 py-2 text-center">{gd == null ? "–" : gd > 0 ? `+${gd}` : gd}</td>
                      <td className="px-2 py-2 text-center font-bold">{r.pts}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-3">
            <SourceLine s={tb.source} />
          </div>
        </>
      )}
    </div>
  );
}

function upcomingSoon(now: Date) {
  const until = new Date(now);
  until.setDate(until.getDate() + 7);
  const today = now.toISOString().slice(0, 10);
  const end = until.toISOString().slice(0, 10);
  return teams
    .map((t) => ({ t, f: nextFixture(t, now) }))
    .filter((x) => x.f && x.f.date.slice(0, 10) >= today && x.f.date.slice(0, 10) <= end)
    .sort((x, y) => x.f!.date.localeCompare(y.f!.date));
}

export function MatchesPage() {
  const { locale } = useI18n();
  const m = matchesDictionaries[locale];
  const [sel, setSel] = useState<string>(teams[0].id);
  const [mine, setMine] = useState<string | null>(null);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const saved = readMine();
    if (saved && teams.some((t) => t.id === saved)) {
      setMine(saved);
      setSel(saved);
    }
  }, []);

  const team = teams.find((t) => t.id === sel) ?? teams[0];
  const groups = useMemo(() => {
    const order: Discipline[] = ["futebol", "futsal", "outras"];
    return order.map((d) => ({ d, list: teams.filter((t) => t.discipline === d) })).filter((g) => g.list.length);
  }, []);
  const soon = now ? upcomingSoon(now) : [];

  return (
    <>
      <Header />
      <main id="conteudo" className="bg-foam">
        {/* Cabeçalho */}
        <section className="relative overflow-hidden bg-night text-white">
          <div className="pointer-events-none absolute -left-32 top-0 size-[28rem] rounded-full bg-royal/40 blur-3xl" aria-hidden />
          <div className="container-site relative py-14 md:py-20">
            <p className="eyebrow flex items-center gap-3 text-haze">
              <span className="band" aria-hidden />
              {m.eyebrow}
            </p>
            <h1 className="display mt-4 max-w-4xl text-[2.6rem] sm:text-6xl lg:text-7xl">{m.title}</h1>
            <p className="mt-5 max-w-2xl text-base text-haze md:text-lg">{m.lead}</p>
          </div>
        </section>

        <div className="container-site py-10 md:py-14">
          {/* Seletor de equipa */}
          <h2 className="eyebrow text-royal">{m.pick}</h2>
          <div className="mt-4 space-y-4">
            {groups.map((g) => (
              <div key={g.d}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-mist">{m.disciplines[g.d]}</p>
                <div className="flex flex-wrap gap-2" role="tablist">
                  {g.list.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      role="tab"
                      aria-selected={sel === t.id}
                      onClick={() => setSel(t.id)}
                      className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-left text-sm font-semibold ring-1 transition-colors ${
                        sel === t.id ? "bg-night text-white ring-night" : "bg-white text-ink ring-line hover:ring-royal"
                      }`}
                    >
                      {mine === t.id && <Star className="size-3.5 fill-signal text-signal" />}
                      <span>
                        {t.name}
                        {t.age && <span className={`ml-1.5 text-xs font-normal ${sel === t.id ? "text-haze" : "text-mist"}`}>{t.age}</span>}
                      </span>
                      {!t.confirmed && <span className="size-1.5 rounded-full bg-amber-400" title={t.fixtures.length ? m.toConfirm : m.notFound} />}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Equipa escolhida */}
          <AnimatePresence mode="wait">
            <motion.section key={team.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="mt-10">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                  <h2 className="display text-4xl text-ink sm:text-5xl">
                    {team.name} {team.age && <span className="text-mist">· {team.age}</span>}
                  </h2>
                  <p className="mt-1 text-sm text-mist">
                    {team.competition ?? "—"}
                    {team.confirmed && team.confirmedBy ? (
                      <>
                        {" "}
                        · {m.confirmedIn}{" "}
                        <a href={team.confirmedBy.url} target="_blank" rel="noreferrer" className="underline decoration-dotted">
                          {team.confirmedBy.label}
                        </a>
                      </>
                    ) : (
                      !team.confirmed && (
                        <span data-ph="" className="ml-2 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                          {team.fixtures.length ? m.toConfirm : m.notFound}
                        </span>
                      )
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    writeMine(team.id);
                    setMine(team.id);
                  }}
                  className={`inline-flex shrink-0 items-center gap-2 self-start rounded-full px-4 py-2.5 text-sm font-semibold ring-1 ring-inset ${mine === team.id ? "bg-signal/10 text-signal ring-signal/30" : "bg-white text-ink ring-line hover:ring-royal"}`}
                >
                  <Star className={`size-4 ${mine === team.id ? "fill-signal" : ""}`} /> {mine === team.id ? m.savedMine : m.saveMine}
                </button>
              </div>

              {team.note && (
                <p className="mt-5 flex items-start gap-2 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900 ring-1 ring-amber-200">
                  <Info className="mt-0.5 size-4 shrink-0" /> {team.note[locale]}
                </p>
              )}
              <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                <NextMatch team={team} now={now ?? new Date(`${SCAN_DATE}T12:00:00`)} />
                <Season team={team} now={now ?? new Date(`${SCAN_DATE}T12:00:00`)} />
              </div>
              <div className="mt-4">
                <Table team={team} />
              </div>
            </motion.section>
          </AnimatePresence>

          {/* Esta semana, todas as equipas */}
          <section className="mt-14">
            <h2 className="display text-3xl text-ink">{m.weekend}</h2>
            {soon.length === 0 ? (
              <p className="mt-3 text-sm text-mist">{m.weekendEmpty}</p>
            ) : (
              <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {soon.map(({ t, f }) => (
                  <li key={t.id}>
                    <button type="button" onClick={() => { setSel(t.id); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="w-full rounded-2xl bg-white p-4 text-left ring-1 ring-line hover:ring-royal">
                      <p className="text-xs font-semibold uppercase tracking-wide text-royal">{t.name} {t.age && `· ${t.age}`}</p>
                      <p className="mt-1 font-semibold">{f!.home ? `Quarteirense – ${f!.opponent}` : `${f!.opponent} – Quarteirense`}</p>
                      <p className="mt-1 text-sm text-mist">
                        {fmtDate(f!.date, locale)} · {timeOf(f!.date) ?? m.timeTbc} · {f!.venue ?? "—"}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <p className="mt-12 flex max-w-3xl items-start gap-2 text-sm text-mist">
            <Info className="mt-0.5 size-4 shrink-0 text-royal" />
            <span>
              {m.honest} ({m.checked} {new Date(`${SCAN_DATE}T12:00:00`).toLocaleDateString(loc(locale))})
            </span>
          </p>
        </div>
      </main>
      <Footer />
      <ReviewToggle />
    </>
  );
}
