/**
 * Modelo de dados de "Jogos e Resultados".
 *
 * Hoje: ficheiro estático preenchido à mão a partir de fontes públicas, com a
 * data de consulta. Amanhã: as mesmas formas vêm da tabela `matches` /
 * `standings` (Supabase), alimentada pelo back-office ou por uma fonte
 * federativa autorizada. Regra do projeto: nenhum resultado inventado.
 */

export type Discipline = "futebol" | "futsal" | "outras";

export type Source = {
  label: string;
  url: string;
  /** Data em que a informação foi lida na fonte (AAAA-MM-DD). */
  checked: string;
};

export type Fixture = {
  /** ISO local (Europe/Lisbon), ex.: "2026-11-29T15:00". Sem hora → "2026-11-29". */
  date: string;
  home: boolean;
  opponent: string;
  venue?: string;
  /** Texto livre para o Google Maps (nome do campo + localidade). */
  mapQuery?: string;
  round?: string;
  competition?: string;
  /** Resultado: golos do Quarteirense / do adversário. Ausente = jogo por disputar. */
  score?: { us: number; them: number };
  source: Source;
};

export type TableRow = { pos: number; team: string; p: number; w?: number; d?: number; l?: number; gf?: number; ga?: number; pts: number };

export type Team = {
  id: string;
  discipline: Discipline;
  /** Nome curto mostrado no seletor (ex.: "Juniores"). */
  name: string;
  /** Escalão etário (ex.: "Sub-19"). */
  age?: string;
  competition?: string;
  /** Equipa confirmada numa fonte oficial da época atual? */
  confirmed: boolean;
  confirmedBy?: Source;
  /** Todos os jogos conhecidos (passados e futuros). O próximo jogo é calculado pela data. */
  fixtures: Fixture[];
  table?: { rows: TableRow[]; source: Source };
  /** Escalões sem resultados publicados pela FPF (futebol de formação inicial). */
  noScores?: boolean;
  /** Aviso importante (ex.: equipa retirada da prova), mostrado em destaque. */
  note?: { pt: string; en: string; fr: string };
  /** Ligação para consultar a fonte oficial enquanto não há dados aqui. */
  officialLink?: { label: string; url: string };
};

export const mapsUrl = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

const todayIso = (now: Date) => {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`;
};
/** Próximo jogo (a partir de hoje, inclusive). */
export const nextFixture = (t: Team, now = new Date()) => [...t.fixtures].sort((a, b) => a.date.localeCompare(b.date)).find((f) => f.date.slice(0, 10) >= todayIso(now));
/** Jogos já disputados, do mais recente para o mais antigo. */
export const pastFixtures = (t: Team, now = new Date()) =>
  [...t.fixtures].sort((a, b) => b.date.localeCompare(a.date)).filter((f) => f.date.slice(0, 10) < todayIso(now));
export const upcomingFixtures = (t: Team, now = new Date()) =>
  [...t.fixtures].sort((a, b) => a.date.localeCompare(b.date)).filter((f) => f.date.slice(0, 10) >= todayIso(now));

/** Ficheiro .ics (1 jogo) para adicionar ao calendário do telemóvel. */
export function icsFor(team: Team, f: Fixture) {
  const hasTime = f.date.includes("T");
  const pad = (n: number) => String(n).padStart(2, "0");
  const [d, t = "00:00"] = f.date.split("T");
  const ymd = d.replaceAll("-", "");
  const [hh, mm] = t.split(":").map(Number);
  const endH = hh + 2;
  const title = f.home ? `Quarteirense – ${f.opponent} (${team.name})` : `${f.opponent} – Quarteirense (${team.name})`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//CDR Quarteirense//Jogos//PT",
    "BEGIN:VEVENT",
    `UID:${team.id}-${ymd}@cdrquarteirense.com`,
    hasTime ? `DTSTART;TZID=Europe/Lisbon:${ymd}T${pad(hh)}${pad(mm)}00` : `DTSTART;VALUE=DATE:${ymd}`,
    hasTime ? `DTEND;TZID=Europe/Lisbon:${ymd}T${pad(endH)}${pad(mm)}00` : "",
    `SUMMARY:${title}`,
    f.venue ? `LOCATION:${f.venue}` : "",
    `DESCRIPTION:${[f.competition, f.round].filter(Boolean).join(" · ")} — Fonte: ${f.source.label}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(lines.join("\r\n"))}`;
}
