"use client";

import { useMemo, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Clock, Database, KeyRound, Loader2, Lock, Mail, MessageSquare, Send, ShieldCheck, UserRound } from "lucide-react";
import { Crest } from "@/components/ui";
import { feesStore, useFees, type OutboxItem } from "./store";
import { balance, eur, type Athlete, type Guardian } from "./model";
import { monthLabel, Pill } from "./ui";

/* =====================================================================
 * Login do gestor (DEMO). Em produção: Supabase Auth (email + palavra-passe
 * forte + 2FA), papel verificado na base de dados e sessão com expiração.
 * ===================================================================== */

export function AdminLogin() {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const [step, setStep] = useState(-1);
  const steps = ["A verificar credenciais", "Ligação cifrada à base de dados (UE)", "Permissões: Tesouraria · Direção"];

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError(false);
    if (!(id.trim().toLowerCase() === "admin" && pw === "123456789")) {
      setError(true);
      return;
    }
    setStep(0);
    steps.forEach((_, i) => window.setTimeout(() => setStep(i + 1), 450 * (i + 1)));
    window.setTimeout(() => feesStore.login(id, pw), 450 * steps.length + 350);
  };

  const fill = () => {
    setId("admin");
    setPw("123456789");
    setError(false);
  };

  return (
    <div className="container-site grid min-h-[calc(100vh-6rem)] place-items-center py-12">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_80px_-40px_rgba(5,13,34,.5)] ring-1 ring-line md:grid-cols-[1fr_1.1fr]">
        <div className="relative overflow-hidden bg-night p-8 text-white md:p-10">
          <div className="absolute -bottom-24 -left-24 size-72 rounded-full bg-royal/60 blur-3xl" aria-hidden />
          <Crest className="relative w-16" alt="" />
          <p className="eyebrow relative mt-8 text-haze">Área reservada</p>
          <h1 className="display relative mt-2 text-5xl">Gestão do clube</h1>
          <p className="relative mt-4 text-sm leading-relaxed text-haze">
            Acesso exclusivo à Direção e à Tesouraria. Depois de entrar, o painel consulta a base de dados do clube: atletas, encarregados de educação, licenças, mensalidades e pagamentos.
          </p>
          <ul className="relative mt-8 space-y-3 text-sm text-white/80">
            <li className="flex items-center gap-3">
              <Lock className="size-4 text-signal" /> Ligação cifrada (HTTPS)
            </li>
            <li className="flex items-center gap-3">
              <Database className="size-4 text-signal" /> Dados alojados na União Europeia (RGPD)
            </li>
            <li className="flex items-center gap-3">
              <ShieldCheck className="size-4 text-signal" /> Cada gestor vê apenas o que o seu papel permite
            </li>
          </ul>
        </div>

        <div className="p-8 md:p-10">
          <AnimatePresence mode="wait">
            {step < 0 ? (
              <motion.form key="form" onSubmit={submit} className="space-y-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 className="text-xl font-semibold">Entrar como gestor</h2>
                <div>
                  <label htmlFor="admin-id" className="text-sm font-semibold">
                    Identificador
                  </label>
                  <div className="mt-1.5 flex items-center gap-2 rounded-2xl bg-foam px-4 ring-1 ring-line focus-within:ring-2 focus-within:ring-royal">
                    <UserRound className="size-4 text-mist" />
                    <input id="admin-id" autoComplete="username" value={id} onChange={(e) => setId(e.target.value)} className="min-w-0 flex-1 bg-transparent py-3.5 text-sm outline-none" />
                  </div>
                </div>
                <div>
                  <label htmlFor="admin-pw" className="text-sm font-semibold">
                    Palavra-passe
                  </label>
                  <div className="mt-1.5 flex items-center gap-2 rounded-2xl bg-foam px-4 ring-1 ring-line focus-within:ring-2 focus-within:ring-royal">
                    <KeyRound className="size-4 text-mist" />
                    <input id="admin-pw" type="password" autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} className="min-w-0 flex-1 bg-transparent py-3.5 text-sm outline-none" />
                  </div>
                </div>
                {error && (
                  <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-signal-deep ring-1 ring-red-200">
                    Identificador ou palavra-passe incorretos.
                  </p>
                )}
                <button type="submit" className="w-full rounded-full bg-night py-3.5 text-sm font-semibold text-white hover:bg-royal">
                  Entrar
                </button>

                {/* Credenciais de demonstração, visíveis de propósito */}
                <div className="rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50 p-4 text-sm">
                  <p className="font-semibold text-amber-900">Credenciais de demonstração</p>
                  <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 font-mono text-amber-900">
                    <dt>Identificador</dt>
                    <dd className="select-all font-semibold">admin</dd>
                    <dt>Palavra-passe</dt>
                    <dd className="select-all font-semibold">123456789</dd>
                  </dl>
                  <button type="button" onClick={fill} className="mt-3 text-xs font-semibold text-amber-900 underline underline-offset-4">
                    Preencher automaticamente
                  </button>
                  <p className="mt-2 text-xs text-amber-800">Só para a apresentação. Na versão final, cada gestor terá a sua conta pessoal com palavra-passe forte e verificação em dois passos.</p>
                </div>
              </motion.form>
            ) : (
              <motion.div key="connecting" className="flex h-full flex-col justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-xl font-semibold">A ligar…</h2>
                <ol className="mt-6 space-y-4">
                  {steps.map((s, i) => (
                    <li key={s} className="flex items-center gap-3 text-sm">
                      <span className={`grid size-7 place-items-center rounded-full ${step > i ? "bg-emerald-500 text-white" : "bg-foam text-mist ring-1 ring-line"}`}>
                        {step > i ? <Check className="size-4" /> : step === i ? <Loader2 className="size-4 animate-spin" /> : null}
                      </span>
                      <span className={step >= i ? "text-ink" : "text-mist"}>{s}</span>
                    </li>
                  ))}
                </ol>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
 * Centro de lembretes
 * ===================================================================== */

const PORTAL_LINK = "https://www.cdrquarteirense.com/area-pais";

const DEFAULT_TEMPLATE = `Olá {nome},

Segundo os nossos registos, estão por pagar: {detalhe}.
Total em dívida: {valor}.

Pode pagar em segundos por MB WAY, Multibanco ou cartão no Espaço Pais:
{link}

Se já efetuou o pagamento, ignore esta mensagem. Obrigado pelo apoio ao clube!

Tesouraria do CDR Quarteirense`;

export type Recipient = { g: Guardian; kids: Athlete[]; amount: number; maxLate: number };

function detail(kids: Athlete[]) {
  return kids
    .map((a) => {
      const months = a.months.flatMap((m, i) => (m === "overdue" || m === "due" ? [monthLabel(i, "pt", "long").replace(/ de \d{4}/, "")] : []));
      return `${a.firstName} (${months.join(", ")})`;
    })
    .join("; ");
}

export function fillTemplate(tpl: string, r: Recipient) {
  return tpl
    .replaceAll("{nome}", r.g.name.split(" ")[0])
    .replaceAll("{detalhe}", detail(r.kids))
    .replaceAll("{valor}", eur(r.amount))
    .replaceAll("{link}", PORTAL_LINK);
}

const smsText = (r: Recipient) => `CDR Quarteirense: mensalidades por pagar (${detail(r.kids)}), total ${eur(r.amount)}. Pague por MB WAY no Espaço Pais: cdrquarteirense.com/area-pais`;

export function useRecipients() {
  const { athletes, guardians } = useFees();
  return useMemo<Recipient[]>(() => {
    return guardians
      .map((g) => {
        const kids = athletes.filter((a) => a.guardianId === g.id && a.months.includes("overdue"));
        return { g, kids, amount: kids.reduce((s, a) => s + balance(a).amount, 0), maxLate: Math.max(0, ...kids.map((a) => a.months.filter((m) => m === "overdue").length)) };
      })
      .filter((r) => r.kids.length > 0)
      .sort((x, y) => y.amount - x.amount);
  }, [athletes, guardians]);
}

/** Envio de um lembrete individual (botão "Lembrar" da tabela). */
export function remindGuardian(r: Recipient) {
  feesStore.queueReminders([
    { guardianId: r.g.id, athleteIds: r.kids.map((a) => a.id), channel: "email", to: r.g.email, subject: `CDR Quarteirense · Mensalidades em atraso`, body: fillTemplate(DEFAULT_TEMPLATE, r) },
  ]);
}

export function ReminderCenter({ onSent }: { onSent: (msg: string) => void }) {
  const recipients = useRecipients();
  const { outbox, reminders } = useFees();
  const [excluded, setExcluded] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<"all" | "late2">("all");
  const [channel, setChannel] = useState<"email" | "sms">("email");
  const [tpl, setTpl] = useState(DEFAULT_TEMPLATE);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [rules, setRules] = useState({ before: true, d3: true, d10: true });

  const visible = recipients.filter((r) => filter === "all" || r.maxLate >= 2);
  const selected = visible.filter((r) => !excluded.has(r.g.id));
  const preview = visible.find((r) => r.g.id === previewId) ?? selected[0] ?? visible[0];

  const send = () => {
    if (!selected.length) return;
    feesStore.queueReminders(
      selected.map((r) => ({
        guardianId: r.g.id,
        athleteIds: r.kids.map((a) => a.id),
        channel,
        to: channel === "email" ? r.g.email : r.g.phone,
        subject: "CDR Quarteirense · Mensalidades em atraso",
        body: channel === "email" ? fillTemplate(tpl, r) : smsText(r),
      })),
    );
    onSent(`${selected.length} lembretes colocados na fila de envio (${channel === "email" ? "email" : "SMS"}).`);
  };

  const toggle = (id: string) =>
    setExcluded((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  return (
    <section id="lembretes" className="rounded-3xl bg-white ring-1 ring-line">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-5">
        <div>
          <h2 className="font-semibold">Centro de lembretes</h2>
          <p className="text-sm text-mist">Os emails e telemóveis vêm da ficha de cada encarregado de educação. Nesta demo, nada é realmente enviado.</p>
        </div>
        <div className="flex rounded-full bg-foam p-1 text-sm ring-1 ring-line">
          {(["email", "sms"] as const).map((c) => (
            <button key={c} type="button" onClick={() => setChannel(c)} aria-pressed={channel === c} className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 font-semibold ${channel === c ? "bg-night text-white" : "text-mist"}`}>
              {c === "email" ? <Mail className="size-4" /> : <MessageSquare className="size-4" />} {c === "email" ? "Email" : "SMS"}
            </button>
          ))}
        </div>
      </header>

      <div className="grid gap-0 lg:grid-cols-[1fr_1.15fr]">
        {/* Destinatários */}
        <div className="min-w-0 border-b border-line p-5 lg:border-b-0 lg:border-r">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold">
              Destinatários <span className="text-mist">({selected.length}/{visible.length})</span>
            </p>
            <select id="rem-filter" value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)} className="rounded-full bg-foam px-3 py-1.5 text-xs ring-1 ring-line" aria-label="Filtro">
              <option value="all">Todos em atraso</option>
              <option value="late2">Só 2+ meses</option>
            </select>
          </div>
          <ul className="mt-3 max-h-[26rem] space-y-1.5 overflow-y-auto pr-1">
            {visible.map((r) => {
              const last = r.kids.map((k) => reminders[k.id]).filter(Boolean).sort().pop();
              return (
                <li key={r.g.id}>
                  <div
                    className={`flex items-start gap-3 rounded-2xl px-3 py-2.5 ring-1 transition-colors ${preview?.g.id === r.g.id ? "bg-foam ring-royal/40" : "ring-transparent hover:bg-foam/60"}`}
                    onMouseEnter={() => setPreviewId(r.g.id)}
                  >
                    <input type="checkbox" checked={!excluded.has(r.g.id)} onChange={() => toggle(r.g.id)} className="mt-1 accent-royal" aria-label={`Incluir ${r.g.name}`} />
                    <button type="button" onClick={() => setPreviewId(r.g.id)} className="min-w-0 flex-1 text-left">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-semibold">{r.g.name}</span>
                        <span className="shrink-0 text-sm font-semibold tabular-nums text-signal">{eur(r.amount)}</span>
                      </span>
                      <span className="block truncate text-xs text-mist">{channel === "email" ? r.g.email : r.g.phone}</span>
                      <span className="mt-1 flex flex-wrap items-center gap-1.5 text-xs">
                        <span className="text-ink">{r.kids.map((k) => k.firstName).join(", ")}</span>
                        <Pill tone={r.maxLate >= 2 ? "bad" : "warn"}>{r.maxLate >= 2 ? `${r.maxLate} meses` : "1 mês"}</Pill>
                        {last && (
                          <span className="inline-flex items-center gap-1 text-emerald-700">
                            <Check className="size-3" /> lembrado {new Date(last).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        )}
                      </span>
                    </button>
                  </div>
                </li>
              );
            })}
            {visible.length === 0 && <li className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800">Ninguém em atraso. 🎉</li>}
          </ul>
        </div>

        {/* Mensagem e pré-visualização */}
        <div className="min-w-0 space-y-4 p-5">
          {channel === "email" ? (
            <div>
              <label htmlFor="rem-tpl" className="text-sm font-semibold">
                Modelo da mensagem
              </label>
              <p className="text-xs text-mist">Campos automáticos: {"{nome}"}, {"{detalhe}"}, {"{valor}"}, {"{link}"}</p>
              <textarea id="rem-tpl" value={tpl} onChange={(e) => setTpl(e.target.value)} rows={7} className="mt-2 w-full rounded-2xl bg-foam p-4 font-mono text-xs leading-relaxed ring-1 ring-line outline-none focus:ring-2 focus:ring-royal" />
            </div>
          ) : (
            <p className="rounded-2xl bg-foam p-4 text-xs text-mist ring-1 ring-line">SMS curto (máx. 160 caracteres por mensagem), gerado automaticamente. Envio por um serviço de SMS português, com custo por mensagem.</p>
          )}

          {preview && (
            <div className="overflow-hidden rounded-2xl ring-1 ring-line">
              <div className="flex items-center justify-between gap-2 bg-night px-4 py-2.5 text-xs text-white">
                <span className="truncate">
                  Para: <strong>{channel === "email" ? preview.g.email : preview.g.phone}</strong>
                </span>
                <span className="text-haze">Pré-visualização</span>
              </div>
              {channel === "email" && <p className="border-b border-line px-4 py-2 text-sm font-semibold">CDR Quarteirense · Mensalidades em atraso</p>}
              <pre className="max-h-56 overflow-y-auto whitespace-pre-wrap px-4 py-3 font-sans text-sm leading-relaxed text-ink">{channel === "email" ? fillTemplate(tpl, preview) : smsText(preview)}</pre>
            </div>
          )}

          <button type="button" onClick={send} disabled={!selected.length} className="flex w-full items-center justify-center gap-2 rounded-full bg-signal py-3.5 text-sm font-semibold text-white hover:bg-signal-deep disabled:opacity-50">
            <Send className="size-4" /> Enviar {selected.length} {selected.length === 1 ? "lembrete" : "lembretes"} por {channel === "email" ? "email" : "SMS"}
          </button>

          <fieldset className="rounded-2xl bg-foam p-4 ring-1 ring-line">
            <legend className="sr-only">Lembretes automáticos</legend>
            <p className="flex items-center gap-2 text-sm font-semibold">
              <Clock className="size-4 text-royal" /> Lembretes automáticos
            </p>
            <div className="mt-3 space-y-2 text-sm">
              {(
                [
                  ["before", "3 dias antes do vencimento (dia 5), por email"],
                  ["d3", "3 dias depois do vencimento, por email"],
                  ["d10", "10 dias depois do vencimento, por email e SMS"],
                ] as const
              ).map(([k, label]) => (
                <label key={k} className="flex cursor-pointer items-center justify-between gap-3">
                  <span>{label}</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={rules[k]}
                    onClick={() => setRules((r) => ({ ...r, [k]: !r[k] }))}
                    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${rules[k] ? "bg-emerald-500" : "bg-line"}`}
                  >
                    <span className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all ${rules[k] ? "left-[1.375rem]" : "left-0.5"}`} />
                  </button>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      </div>

      <Journal outbox={outbox} />
    </section>
  );
}

function Journal({ outbox }: { outbox: OutboxItem[] }) {
  return (
    <div className="border-t border-line p-5">
      <p className="text-sm font-semibold">
        Registo de envios <span className="text-mist">({outbox.length})</span>
      </p>
      {outbox.length === 0 ? (
        <p className="mt-2 text-sm text-mist">Ainda nenhum lembrete enviado nesta sessão.</p>
      ) : (
        <ul className="mt-3 max-h-60 divide-y divide-line overflow-y-auto text-sm">
          {outbox.slice(0, 40).map((o) => (
            <li key={o.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
              <span className="flex min-w-0 items-center gap-2">
                {o.channel === "email" ? <Mail className="size-4 shrink-0 text-mist" /> : <MessageSquare className="size-4 shrink-0 text-mist" />}
                <span className="truncate">{o.to}</span>
              </span>
              <span className="flex items-center gap-3 text-xs text-mist">
                <span className="font-mono">{new Date(o.at).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
                {o.status === "sent" ? <Pill tone="ok">Enviado</Pill> : <Pill tone="neutral">Na fila</Pill>}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
