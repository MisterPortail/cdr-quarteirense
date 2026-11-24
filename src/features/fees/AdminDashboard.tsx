"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, BellRing, Check, Download, FileWarning, LogOut, RotateCcw, Search, Users, Wallet } from "lucide-react";
import { feesStore, useFees } from "./store";
import { AdminLogin, ReminderCenter, remindGuardian } from "./Reminders";
import { balance, CATEGORIES, categoryById, eur, SEASON, standing, type Athlete, type Standing } from "./model";
import { currentSeasonMonthIndex } from "./demo-data";
import { AppShell, monthLabel, monthTone, Pill } from "./ui";

/** Painel da Direção / tesouraria. Interface em PT-PT (uso interno). */

const STANDING_LABEL: Record<Standing, string> = { ok: "Em dia", late1: "1 mês em atraso", late2: "2+ meses em atraso", season: "Época paga" };
const STANDING_TONE: Record<Standing, "ok" | "warn" | "bad" | "info"> = { ok: "ok", late1: "warn", late2: "bad", season: "info" };
const METHOD_LABEL = { mbway: "MB WAY", multibanco: "Multibanco", card: "Cartão", cash: "Numerário", transfer: "Transferência" } as const;

function Kpi({ icon: Icon, label, value, sub, tone = "default" }: { icon: typeof Users; label: string; value: string; sub?: string; tone?: "default" | "bad" | "ok" }) {
  return (
    <div className="min-w-0 rounded-3xl bg-white p-5 ring-1 ring-line">
      <p className="flex items-center gap-2 text-sm text-mist">
        <Icon className={`size-4 ${tone === "bad" ? "text-signal" : tone === "ok" ? "text-emerald-600" : "text-royal"}`} /> {label}
      </p>
      <p className={`display mt-3 text-5xl tabular-nums ${tone === "bad" ? "text-signal" : ""}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-mist">{sub}</p>}
    </div>
  );
}

function CollectionsChart({ athletes, cur }: { athletes: Athlete[]; cur: number }) {
  const data = SEASON.months.map((_, i) => {
    let expected = 0;
    let collected = 0;
    for (const a of athletes) {
      const fee = categoryById(a.categoryId).monthlyFee;
      if (a.months[i] !== "exempt") expected += fee;
      if (a.months[i] === "paid") collected += fee;
    }
    return { i, expected, collected };
  });
  const max = Math.ceil(Math.max(...data.map((d) => d.expected)) / 500) * 500;
  const W = 640;
  const H = 220;
  const pad = { l: 44, r: 8, t: 12, b: 26 };
  const bw = (W - pad.l - pad.r) / data.length;
  const y = (v: number) => pad.t + (H - pad.t - pad.b) * (1 - v / max);
  const ticks = [0, max / 2, max];
  return (
    <div className="min-w-0 rounded-3xl bg-white p-5 ring-1 ring-line md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-semibold">Mensalidades: previsto e cobrado</h2>
        <div className="flex items-center gap-4 text-xs text-mist">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-line" /> Previsto
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-royal" /> Cobrado
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-signal" /> Em falta (vencido)
          </span>
        </div>
      </div>
      <div className="mt-4 overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[32rem]" role="img" aria-label="Gráfico de mensalidades previstas e cobradas por mês">
          {ticks.map((tk) => (
            <g key={tk}>
              <line x1={pad.l} x2={W - pad.r} y1={y(tk)} y2={y(tk)} stroke="#d8e0ee" strokeDasharray={tk ? "3 4" : undefined} />
              <text x={pad.l - 6} y={y(tk) + 4} textAnchor="end" fontSize="10" fill="#5b6b8c">
                {tk >= 1000 ? `${(tk / 1000).toLocaleString("pt-PT")}k €` : `${tk} €`}
              </text>
            </g>
          ))}
          {data.map((d) => {
            const x = pad.l + d.i * bw + bw * 0.18;
            const w = bw * 0.64;
            const past = d.i <= cur;
            return (
              <g key={d.i}>
                <rect x={x} y={y(d.expected)} width={w} height={y(0) - y(d.expected)} rx="4" fill={past ? "#fde2e4" : "#eef3fb"} stroke={past ? "#e11d2a" : "none"} strokeOpacity=".25" />
                <rect x={x} y={y(d.collected)} width={w} height={y(0) - y(d.collected)} rx="4" fill="#0b3fb0" />
                <text x={x + w / 2} y={H - 8} textAnchor="middle" fontSize="10" fill={d.i === cur ? "#0a1530" : "#5b6b8c"} fontWeight={d.i === cur ? 700 : 400}>
                  {monthLabel(d.i, "pt")}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="mt-2 text-xs text-mist">Nos meses já vencidos, a parte rosada é o que falta cobrar. Os meses futuros mostram apenas o que já foi pago adiantado.</p>
    </div>
  );
}

export function AdminDashboard() {
  const { athletes, guardians, reminders, adminAuthed } = useFees();
  const cur = currentSeasonMonthIndex();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [st, setSt] = useState<"all" | Standing | "licence">("all");
  const [toast, setToast] = useState<string | null>(null);
  const flash = (m: string) => {
    setToast(m);
    window.setTimeout(() => setToast(null), 2600);
  };

  const gById = useMemo(() => Object.fromEntries(guardians.map((g) => [g.id, g])), [guardians]);

  const stats = useMemo(() => {
    let collected = 0;
    let expectedToDate = 0;
    let owed = 0;
    for (const a of athletes) {
      const fee = categoryById(a.categoryId).monthlyFee;
      a.months.forEach((m, i) => {
        if (m === "paid") collected += fee;
        if (i <= cur && m !== "exempt") expectedToDate += fee;
      });
      owed += balance(a).amount;
    }
    const late = athletes.filter((a) => a.months.includes("overdue"));
    const licencePending = athletes.filter((a) => a.licence.status !== "valid").length;
    const medicalSoon = athletes.filter((a) => a.medicalUntil && new Date(a.medicalUntil).getTime() - Date.now() < 45 * 86400000).length;
    const paidToDate = athletes.reduce((s, a) => s + a.months.filter((m, i) => i <= cur && m === "paid").length * categoryById(a.categoryId).monthlyFee, 0);
    return { collected, expectedToDate, owed, late, licencePending, medicalSoon, rate: expectedToDate ? Math.round((paidToDate / expectedToDate) * 100) : 100 };
  }, [athletes, cur]);

  const rows = athletes.filter((a) => {
    const g = gById[a.guardianId];
    const text = `${a.firstName} ${a.lastName} ${g?.name} ${g?.email}`.toLowerCase();
    if (q && !text.includes(q.toLowerCase())) return false;
    if (cat !== "all" && a.categoryId !== cat) return false;
    if (st === "licence") return a.licence.status !== "valid";
    if (st !== "all" && standing(a) !== st) return false;
    return true;
  });
  const sorted = [...rows].sort((x, y) => balance(y).amount - balance(x).amount || x.lastName.localeCompare(y.lastName));

  const byCat = CATEGORIES.map((c) => {
    const list = athletes.filter((a) => a.categoryId === c.id);
    return {
      c,
      n: list.length,
      late: list.filter((a) => a.months.includes("overdue")).length,
      owed: list.reduce((s, a) => s + balance(a).amount, 0),
    };
  });

  const recent = athletes
    .flatMap((a) => a.payments.map((p) => ({ ...p, a })))
    .sort((x, y) => y.date.localeCompare(x.date))
    .slice(0, 7);

  const markPaid = (a: Athlete, method: "cash" | "transfer") => {
    const idx = a.months.flatMap((m, i) => (m === "overdue" || m === "due" ? [i] : []));
    feesStore.pay([{ athleteId: a.id, monthIndexes: idx, registration: !a.registrationPaid }], method);
    flash(`Pagamento de ${a.firstName} ${a.lastName} registado (${METHOD_LABEL[method]}).`);
  };

  if (!adminAuthed)
    return (
      <AppShell view="admin" title="Gestão de quotas e licenças" demoText="Modo demonstração · credenciais de teste visíveis · nenhum dado real">
        <AdminLogin />
      </AppShell>
    );

  const remindOne = (a: Athlete) => {
    const g = gById[a.guardianId];
    const kids = athletes.filter((k) => k.guardianId === g.id && balance(k).amount > 0);
    remindGuardian({ g, kids, amount: kids.reduce((s, k) => s + balance(k).amount, 0), maxLate: 0 });
    flash(`Lembrete por email colocado na fila para ${g.email}.`);
  };

  return (
    <AppShell view="admin" title="Gestão de quotas e licenças" demoText="Modo demonstração · atletas e valores fictícios · nenhum dado real">
      <div className="container-site space-y-6 py-8 lg:py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-royal">Tesouraria · Formação</p>
            <h1 className="display mt-2 text-5xl md:text-6xl">Época {SEASON.label}</h1>
            <p className="mt-2 text-sm text-mist">
              Mensalidades vencem a {SEASON.dueDay} de cada mês. Hoje: {new Date().toLocaleDateString("pt-PT", { day: "2-digit", month: "long", year: "numeric" })}.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => document.getElementById("lembretes")?.scrollIntoView({ behavior: "smooth", block: "start" })}
              className="inline-flex items-center gap-2 rounded-full bg-signal px-5 py-3 text-sm font-semibold text-white hover:bg-signal-deep"
            >
              <BellRing className="size-4" /> Lembrar todos em atraso ({stats.late.length})
            </button>
            <span className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm text-mist ring-1 ring-line" title="Exportação Excel/CSV na versão final">
              <Download className="size-4" /> Exportar · em breve
            </span>
            <button type="button" onClick={() => feesStore.reset()} className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm text-mist ring-1 ring-line hover:text-ink">
              <RotateCcw className="size-4" /> Repor demo
            </button>
            <button type="button" onClick={() => feesStore.logout()} className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm text-mist ring-1 ring-line hover:text-ink">
              <LogOut className="size-4" /> Sair
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Kpi icon={Users} label="Atletas de formação" value={String(athletes.length)} sub={`${CATEGORIES.length} escalões`} />
          <Kpi icon={Wallet} label="Cobrado nesta época" value={eur(stats.collected)} sub={`Taxa de cobrança até hoje: ${stats.rate}%`} tone="ok" />
          <Kpi icon={AlertTriangle} label="Em dívida" value={eur(stats.owed)} sub={`${stats.late.length} atletas com mensalidades em atraso`} tone="bad" />
          <Kpi icon={FileWarning} label="Licenças por regularizar" value={String(stats.licencePending)} sub={`${stats.medicalSoon} exames médicos expiram em menos de 45 dias`} />
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
          <div className="min-w-0 space-y-4">
            <CollectionsChart athletes={athletes} cur={cur} />
            <div className="rounded-3xl bg-white p-5 ring-1 ring-line md:p-6">
            <h3 className="font-semibold">Últimos pagamentos</h3>
            <ul className="mt-2 divide-y divide-line text-sm">
              {recent.map((p, k) => (
                <li key={k} className="flex items-center justify-between gap-2 py-2">
                  <span className="min-w-0 truncate">
                    {p.a.firstName} {p.a.lastName} <span className="text-mist">· {monthLabel(p.monthIndex, "pt")}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2 text-xs text-mist">
                    {METHOD_LABEL[p.method]} <span className="font-mono">{p.date.slice(5)}</span>
                  </span>
                </li>
              ))}
            </ul>
            </div>
          </div>
          <div className="min-w-0 rounded-3xl bg-white p-5 ring-1 ring-line md:p-6">
            <h2 className="font-semibold">Por escalão</h2>
            <table className="mt-4 w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-mist">
                  <th className="pb-2 font-medium">Escalão</th>
                  <th className="pb-2 text-right font-medium">Atletas</th>
                  <th className="pb-2 text-right font-medium">Em atraso</th>
                  <th className="pb-2 text-right font-medium">Em dívida</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {byCat.map((r) => (
                  <tr key={r.c.id} className="cursor-pointer hover:bg-foam" onClick={() => setCat(r.c.id)}>
                    <td className="py-2.5">
                      <span className="font-semibold">{r.c.age}</span> <span className="text-mist">{r.c.name}</span>
                    </td>
                    <td className="py-2.5 text-right tabular-nums">{r.n}</td>
                    <td className={`py-2.5 text-right tabular-nums ${r.late ? "font-semibold text-signal" : "text-mist"}`}>{r.late}</td>
                    <td className="py-2.5 text-right tabular-nums">{eur(r.owed)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <ReminderCenter onSent={flash} />

        {/* Lista de atletas */}
        <section className="rounded-3xl bg-white ring-1 ring-line">
          <div className="flex flex-wrap items-center gap-3 border-b border-line p-4 md:p-5">
            <h2 className="mr-auto font-semibold">
              Atletas <span className="text-mist">({sorted.length})</span>
            </h2>
            <label className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-foam px-4 ring-1 ring-line sm:max-w-xs">
              <Search className="size-4 shrink-0 text-mist" />
              <span className="sr-only">Pesquisar</span>
              <input id="admin-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Atleta, encarregado, email…" className="min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none" />
            </label>
            <select id="admin-cat" value={cat} onChange={(e) => setCat(e.target.value)} className="rounded-full bg-foam px-4 py-2.5 text-sm ring-1 ring-line" aria-label="Escalão">
              <option value="all">Todos os escalões</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.age} · {c.name}
                </option>
              ))}
            </select>
            <select id="admin-status" value={st} onChange={(e) => setSt(e.target.value as typeof st)} className="rounded-full bg-foam px-4 py-2.5 text-sm ring-1 ring-line" aria-label="Situação">
              <option value="all">Todas as situações</option>
              <option value="ok">Em dia</option>
              <option value="late1">1 mês em atraso</option>
              <option value="late2">2+ meses em atraso</option>
              <option value="season">Época paga</option>
              <option value="licence">Licença por regularizar</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[60rem] text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs text-mist">
                  <th className="px-5 py-3 font-medium">Atleta</th>
                  <th className="px-3 py-3 font-medium">Encarregado</th>
                  <th className="px-3 py-3 font-medium">Licença</th>
                  <th className="px-3 py-3 font-medium">Mensalidades (set → jun)</th>
                  <th className="px-3 py-3 font-medium">Situação</th>
                  <th className="px-3 py-3 text-right font-medium">Em dívida</th>
                  <th className="px-5 py-3 text-right font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {sorted.map((a) => {
                  const g = gById[a.guardianId];
                  const b = balance(a);
                  const s = standing(a);
                  const reminded = reminders[a.id];
                  const isDemo = a.guardianId === "g-demo";
                  return (
                    <tr key={a.id} className={isDemo ? "bg-blue-50/60" : "hover:bg-foam/60"}>
                      <td className="px-5 py-3">
                        <p className="font-semibold">
                          {a.firstName} {a.lastName}
                          {isDemo && <span className="ml-2 rounded-full bg-royal px-2 py-0.5 text-[0.6rem] font-bold uppercase text-white">família demo</span>}
                        </p>
                        <p className="text-xs text-mist">
                          {categoryById(a.categoryId).age} · {a.birthYear}
                        </p>
                      </td>
                      <td className="px-3 py-3">
                        <p>{g.name}</p>
                        <p className="text-xs text-mist">{g.email}</p>
                      </td>
                      <td className="px-3 py-3">
                        <Pill tone={a.licence.status === "valid" ? "ok" : a.licence.status === "pending" ? "info" : "bad"}>
                          {a.licence.status === "valid" ? "Válida" : a.licence.status === "pending" ? "Pendente" : "Expirada"}
                        </Pill>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex gap-1">
                          {a.months.map((m, i) => (
                            <span key={i} title={`${monthLabel(i, "pt", "long")}: ${m}`} className={`block h-5 w-3.5 rounded ${monthTone[m]} ${i === cur ? "ring-2 ring-ink/30 ring-offset-1" : ""}`} />
                          ))}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <Pill tone={STANDING_TONE[s]}>{STANDING_LABEL[s]}</Pill>
                      </td>
                      <td className={`px-3 py-3 text-right font-semibold tabular-nums ${b.amount ? "text-signal" : "text-mist"}`}>{b.amount ? eur(b.amount) : "—"}</td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-1.5">
                          {b.amount > 0 && (
                            <>
                              <button
                                type="button"
                                onClick={() => remindOne(a)}
                                disabled={!!reminded}
                                className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-line hover:bg-foam disabled:text-emerald-700 disabled:ring-emerald-200"
                              >
                                {reminded ? (
                                  <>
                                    <Check className="size-3.5" /> Lembrado
                                  </>
                                ) : (
                                  <>
                                    <BellRing className="size-3.5" /> Lembrar
                                  </>
                                )}
                              </button>
                              <button type="button" onClick={() => markPaid(a, "cash")} className="rounded-full bg-night px-3 py-1.5 text-xs font-semibold text-white hover:bg-royal" title="Registar pagamento recebido na secretaria">
                                Recebido
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center gap-4 border-t border-line px-5 py-3 text-xs text-mist">
            {(["paid", "overdue", "due", "upcoming"] as const).map((m) => (
              <span key={m} className="flex items-center gap-1.5">
                <span className={`block h-3 w-2.5 rounded ${monthTone[m]}`} /> {{ paid: "Pago", overdue: "Em atraso", due: "A pagar", upcoming: "Por vencer" }[m]}
              </span>
            ))}
            <span className="ml-auto">Valores de exemplo: mensalidade 20–30 € por escalão, inscrição {eur(SEASON.registrationFee)}.</span>
          </div>
        </section>
      </div>

      {toast && (
        <div role="status" className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom,0px))] left-1/2 z-50 -translate-x-1/2 rounded-full bg-night px-5 py-3 text-sm font-medium text-white shadow-2xl">
          <Check className="mr-2 inline size-4 text-emerald-400" />
          {toast}
        </div>
      )}
    </AppShell>
  );
}
