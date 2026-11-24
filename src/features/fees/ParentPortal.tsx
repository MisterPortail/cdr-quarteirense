"use client";

import { useMemo, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Check, CreditCard, FileText, LayoutGrid, Loader2, LogOut, Mail, ShieldCheck, Smartphone, UserRound, Wallet } from "lucide-react";
import { useI18n } from "@/i18n/LanguageProvider";
import { portalDictionaries } from "@/i18n/portal-dictionaries";
import { Crest } from "@/components/ui";
import { feesStore, useFees } from "./store";
import { balance, categoryById, eur, SEASON, standing, type Athlete, type PaymentMethod } from "./model";
import { AppShell, monthLabel, monthTone, Pill } from "./ui";

type Tab = "overview" | "payments" | "info" | "profile";

function Login({ onEnter }: { onEnter: () => void }) {
  const { locale } = useI18n();
  const p = portalDictionaries[locale];
  const [email, setEmail] = useState("ana.ribeiro@exemplo.pt");
  const [sent, setSent] = useState(false);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };
  return (
    <div className="container-site grid min-h-[calc(100vh-6rem)] place-items-center py-12">
      <div className="w-full max-w-md overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_80px_-40px_rgba(5,13,34,.5)] ring-1 ring-line">
        <div className="relative bg-night px-8 pb-10 pt-8 text-white">
          <div className="absolute -right-16 -top-16 size-56 rounded-full bg-royal/60 blur-3xl" aria-hidden />
          <Crest className="relative w-16" alt="" />
          <h1 className="display relative mt-6 text-4xl">{p.login.title}</h1>
          <p className="relative mt-2 text-sm text-haze">{p.login.lead}</p>
        </div>
        <div className="p-8">
          {!sent ? (
            <form onSubmit={submit} className="space-y-4">
              <label htmlFor="login-email" className="text-sm font-semibold">
                {p.login.email}
              </label>
              <div className="flex items-center gap-2 rounded-2xl bg-foam px-4 ring-1 ring-line focus-within:ring-2 focus-within:ring-royal">
                <Mail className="size-4 text-mist" />
                <input id="login-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="min-w-0 flex-1 bg-transparent py-3.5 text-sm outline-none" />
              </div>
              <button type="submit" className="w-full rounded-full bg-royal py-3.5 text-sm font-semibold text-white transition-colors hover:bg-deep">
                {p.login.send}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="flex items-start gap-3 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800 ring-1 ring-emerald-200">
                <Check className="mt-0.5 size-4 shrink-0" />
                <span>
                  {p.login.sent} <strong className="break-all">{email}</strong>
                </span>
              </p>
              <p className="text-sm text-mist">{p.login.sentHint}</p>
              <button type="button" onClick={onEnter} className="w-full rounded-full bg-signal py-3.5 text-sm font-semibold text-white hover:bg-signal-deep">
                {p.login.enterDemo}
              </button>
            </div>
          )}
          <p className="mt-6 flex items-start gap-2 text-xs text-mist">
            <ShieldCheck className="size-4 shrink-0 text-royal" /> {p.login.privacy}
          </p>
        </div>
      </div>
    </div>
  );
}

function MonthStrip({ a }: { a: Athlete }) {
  const { locale } = useI18n();
  const p = portalDictionaries[locale];
  return (
    <ol className="grid grid-cols-5 gap-1.5 sm:grid-cols-10">
      {a.months.map((m, i) => (
        <li key={i} className="text-center" title={`${monthLabel(i, locale, "long")} · ${p.months[m]}`}>
          <span className={`block rounded-lg py-1.5 text-[0.68rem] font-semibold uppercase ${monthTone[m]}`}>{monthLabel(i, locale)}</span>
        </li>
      ))}
    </ol>
  );
}

function daysUntil(iso: string) {
  return Math.round((new Date(iso).getTime() - Date.now()) / 86400000);
}

function Overview({ kids, goPay }: { kids: Athlete[]; goPay: () => void }) {
  const { locale } = useI18n();
  const p = portalDictionaries[locale];
  const total = kids.reduce((s, a) => s + balance(a).amount, 0);
  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString(locale === "pt" ? "pt-PT" : locale, { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className="space-y-6">
      <div className={`relative overflow-hidden rounded-3xl p-6 text-white md:p-8 ${total > 0 ? "bg-night" : "bg-emerald-700"}`}>
        <div className="absolute -right-10 -top-16 size-60 rounded-full bg-royal/50 blur-3xl" aria-hidden />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-haze">{p.overview.toPay}</p>
            <p className="display mt-2 text-6xl tabular-nums md:text-7xl">{eur(total, locale)}</p>
            {total === 0 && <p className="mt-2 text-sm text-white/85">{p.overview.allGood}</p>}
          </div>
          {total > 0 && (
            <button type="button" onClick={goPay} className="rounded-full bg-signal px-6 py-3.5 text-sm font-semibold shadow-lg transition-colors hover:bg-signal-deep">
              {p.overview.payNow} →
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {kids.map((a) => {
          const cat = categoryById(a.categoryId);
          const st = standing(a);
          const med = a.medicalUntil ? daysUntil(a.medicalUntil) : -1;
          return (
            <article key={a.id} className="rounded-3xl bg-white p-6 ring-1 ring-line">
              <header className="flex items-center gap-4">
                <span className="display grid size-14 shrink-0 place-items-center rounded-2xl bg-royal text-2xl text-white">
                  {a.firstName[0]}
                  {a.lastName[0]}
                </span>
                <div className="min-w-0">
                  <h3 className="truncate text-lg font-semibold">
                    {a.firstName} {a.lastName}
                  </h3>
                  <p className="text-sm text-mist">
                    {cat.age} · {cat.name} · {p.overview.season} {SEASON.label}
                  </p>
                </div>
              </header>
              <dl className="mt-6 divide-y divide-line rounded-2xl bg-foam/60 ring-1 ring-line">
                <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                  <dt className="flex items-center gap-2 text-sm">
                    <FileText className="size-4 text-royal" /> {p.overview.licence}
                  </dt>
                  <dd className="flex items-center gap-2">
                    {a.licence.number && <span className="hidden font-mono text-xs text-mist sm:inline">{a.licence.number}</span>}
                    <Pill tone={a.licence.status === "valid" ? "ok" : a.licence.status === "pending" ? "info" : "bad"}>{p.overview.licenceStatus[a.licence.status]}</Pill>
                  </dd>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                  <dt className="flex items-center gap-2 text-sm">
                    <ShieldCheck className="size-4 text-royal" /> {p.overview.medical}
                  </dt>
                  <dd>
                    {a.medicalUntil && (
                      <Pill tone={med < 0 ? "bad" : med < 45 ? "warn" : "ok"}>
                        {med < 45 && med >= 0 ? `${p.overview.expiresSoon} · ` : ""}
                        {fmtDate(a.medicalUntil)}
                      </Pill>
                    )}
                  </dd>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                  <dt className="flex items-center gap-2 text-sm">
                    <Wallet className="size-4 text-royal" /> {p.overview.fees} · {eur(cat.monthlyFee, locale)}{p.overview.perMonth}
                  </dt>
                  <dd>
                    <Pill tone={st === "ok" || st === "season" ? "ok" : st === "late1" ? "warn" : "bad"}>{p.overview.feesStatus[st]}</Pill>
                  </dd>
                </div>
              </dl>
              <div className="mt-5">
                <MonthStrip a={a} />
              </div>
              <p className="mt-5 text-xs text-mist">
                <span className="font-semibold text-ink">{p.overview.nextSession}:</span> {p.overview.sessionDemo}
              </p>
            </article>
          );
        })}
      </div>
    </div>
  );
}

type Selection = Record<string, { months: number[]; registration: boolean; full: boolean }>;

function Payments({ kids }: { kids: Athlete[] }) {
  const { locale } = useI18n();
  const p = portalDictionaries[locale];

  const initial = useMemo<Selection>(
    () =>
      Object.fromEntries(
        kids.map((a) => [a.id, { months: a.months.flatMap((m, i) => (m === "overdue" || m === "due" ? [i] : [])), registration: !a.registrationPaid, full: false }]),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const [sel, setSel] = useState<Selection>(initial);
  const [method, setMethod] = useState<PaymentMethod>("mbway");
  const [phone, setPhone] = useState("912 345 678");
  const [phase, setPhase] = useState<"idle" | "processing" | "done">("idle");
  const [receipt, setReceipt] = useState("");

  const toggleMonth = (id: string, i: number) =>
    setSel((s) => {
      const cur = s[id];
      const months = cur.months.includes(i) ? cur.months.filter((x) => x !== i) : [...cur.months, i];
      return { ...s, [id]: { ...cur, months, full: false } };
    });
  const toggleFull = (a: Athlete) =>
    setSel((s) => {
      const cur = s[a.id];
      const open = a.months.flatMap((m, i) => (m !== "paid" && m !== "exempt" ? [i] : []));
      return { ...s, [a.id]: { ...cur, full: !cur.full, months: !cur.full ? open : open.filter((i) => a.months[i] !== "upcoming") } };
    });

  const lines = kids.map((a) => {
    const s = sel[a.id] ?? { months: [], registration: false, full: false };
    const fee = categoryById(a.categoryId).monthlyFee;
    const subtotal = s.months.length * fee + (s.registration ? SEASON.registrationFee : 0);
    const discount = s.full && s.months.length > SEASON.fullSeasonFreeMonths ? SEASON.fullSeasonFreeMonths * fee : 0;
    return { a, s, fee, subtotal, discount };
  });
  const total = lines.reduce((x, l) => x + l.subtotal - l.discount, 0);
  const discount = lines.reduce((x, l) => x + l.discount, 0);
  const count = lines.reduce((x, l) => x + l.s.months.length + (l.s.registration ? 1 : 0), 0);

  const pay = () => {
    if (!count) return;
    setPhase("processing");
    window.setTimeout(() => {
      feesStore.pay(
        lines.map((l) => ({ athleteId: l.a.id, monthIndexes: l.s.months, registration: l.s.registration })),
        method,
      );
      setReceipt(`CDRQ-${SEASON.label.replace("/", "")}-${String(Math.floor(Math.random() * 90000) + 10000)}`);
      setPhase("done");
    }, 2200);
  };

  const methods: { id: PaymentMethod; label: string; icon: typeof Smartphone }[] = [
    { id: "mbway", label: p.pay.mbway, icon: Smartphone },
    { id: "multibanco", label: p.pay.multibanco, icon: LayoutGrid },
    { id: "card", label: p.pay.card, icon: CreditCard },
  ];

  const history = kids
    .flatMap((a) => a.payments.map((x) => ({ ...x, a })))
    .sort((x, y) => y.date.localeCompare(x.date))
    .slice(0, 8);

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_24rem]">
      <div className="min-w-0 space-y-5">
        <div>
          <h2 className="display text-4xl">{p.pay.title}</h2>
          <p className="mt-2 text-mist">{p.pay.lead}</p>
        </div>
        {lines.map(({ a, s, fee }) => {
          const open = a.months.flatMap((m, i) => (m === "overdue" || m === "due" ? [i] : []));
          const next = a.months.flatMap((m, i) => (m === "upcoming" ? [i] : []));
          return (
            <section key={a.id} className="rounded-3xl bg-white p-5 ring-1 ring-line md:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-semibold">
                  {a.firstName} {a.lastName} <span className="font-normal text-mist">· {categoryById(a.categoryId).age} · {eur(fee, locale)}{p.overview.perMonth}</span>
                </h3>
                {next.length > 0 && (
                  <label className="flex cursor-pointer items-center gap-2 rounded-full bg-foam px-3 py-1.5 text-xs font-semibold ring-1 ring-line">
                    <input type="checkbox" checked={s.full} onChange={() => toggleFull(a)} className="accent-royal" /> {p.pay.fullSeason}
                  </label>
                )}
              </div>
              {s.full && <p className="mt-2 text-xs text-royal">{p.pay.fullSeasonHint}</p>}
              {open.length > 0 && (
                <>
                  <p className="eyebrow mt-5 !text-[0.62rem] text-signal">{p.pay.overdue}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {open.map((i) => (
                      <MonthChip key={i} active={s.months.includes(i)} onClick={() => toggleMonth(a.id, i)} label={monthLabel(i, locale, "long")} status={p.months[a.months[i]]} danger={a.months[i] === "overdue"} />
                    ))}
                  </div>
                </>
              )}
              {next.length > 0 && (
                <>
                  <p className="eyebrow mt-5 !text-[0.62rem] text-mist">{p.pay.nextMonths}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {next.map((i) => (
                      <MonthChip key={i} active={s.months.includes(i)} onClick={() => toggleMonth(a.id, i)} label={monthLabel(i, locale, "long")} />
                    ))}
                  </div>
                </>
              )}
              {!a.registrationPaid && (
                <label className="mt-5 flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={s.registration} onChange={() => setSel((x) => ({ ...x, [a.id]: { ...x[a.id], registration: !x[a.id].registration } }))} className="accent-royal" />
                  {p.pay.registration} · {eur(SEASON.registrationFee, locale)}
                </label>
              )}
              {open.length === 0 && next.length === 0 && <p className="mt-3 text-sm text-emerald-700">{p.overview.allGood}</p>}
            </section>
          );
        })}

        <section className="rounded-3xl bg-white p-5 ring-1 ring-line md:p-6">
          <h3 className="font-semibold">{p.pay.history}</h3>
          {history.length === 0 ? (
            <p className="mt-3 text-sm text-mist">{p.pay.noHistory}</p>
          ) : (
            <ul className="mt-3 divide-y divide-line text-sm">
              {history.map((h, k) => (
                <li key={k} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
                  <span>
                    {h.a.firstName} · {monthLabel(h.monthIndex, locale, "long")}
                  </span>
                  <span className="flex items-center gap-3 text-mist">
                    <span className="hidden sm:inline">{p.pay.methodNames[h.method]}</span>
                    <span className="font-mono text-xs">{h.date}</span>
                    <span className="font-semibold text-ink">{eur(categoryById(h.a.categoryId).monthlyFee, locale)}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Resumo e método */}
      <aside className="h-fit space-y-4 rounded-3xl bg-white p-5 ring-1 ring-line md:p-6 xl:sticky xl:top-24">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-mist">
            {p.pay.selected}: {count}
          </span>
          {discount > 0 && (
            <span className="text-sm font-semibold text-emerald-700">
              {p.pay.discount} −{eur(discount, locale)}
            </span>
          )}
        </div>
        <p className="flex items-baseline justify-between border-b border-line pb-4">
          <span className="font-semibold">{p.pay.total}</span>
          <span className="display text-5xl tabular-nums">{eur(total, locale)}</span>
        </p>
        <fieldset>
          <legend className="text-sm font-semibold">{p.pay.method}</legend>
          <div className="mt-3 grid gap-2">
            {methods.map((m) => (
              <label key={m.id} className={`flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 ring-1 transition-colors ${method === m.id ? "bg-foam ring-2 ring-royal" : "ring-line hover:bg-foam/60"}`}>
                <input type="radio" name="method" value={m.id} checked={method === m.id} onChange={() => setMethod(m.id)} className="accent-royal" />
                <m.icon className="size-4 text-royal" />
                <span className="text-sm font-medium">{m.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        {method === "mbway" && (
          <div>
            <label htmlFor="mbway-phone" className="text-xs font-semibold text-mist">
              {p.pay.phone}
            </label>
            <input id="mbway-phone" value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" className="mt-1 w-full rounded-xl bg-foam px-4 py-3 font-mono text-sm ring-1 ring-line outline-none focus:ring-2 focus:ring-royal" />
            <p className="mt-2 text-xs text-mist">{p.pay.mbwayHint}</p>
          </div>
        )}
        {method === "multibanco" && (
          <div className="rounded-2xl bg-foam p-4 text-sm ring-1 ring-line">
            <p className="text-xs text-mist">{p.pay.mbHint}</p>
            <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 font-mono">
              <dt className="text-mist">{p.pay.entity}</dt>
              <dd>12345</dd>
              <dt className="text-mist">{p.pay.reference}</dt>
              <dd>123 456 789</dd>
              <dt className="text-mist">{p.pay.amount}</dt>
              <dd>{eur(total, locale)}</dd>
            </dl>
          </div>
        )}
        {method === "card" && <p className="rounded-2xl bg-foam p-4 text-xs text-mist ring-1 ring-line">{p.pay.cardHint}</p>}
        <button
          type="button"
          onClick={pay}
          disabled={!count || phase === "processing"}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-signal py-4 text-sm font-semibold text-white transition-colors hover:bg-signal-deep disabled:cursor-not-allowed disabled:opacity-50"
        >
          {phase === "processing" ? (
            <>
              <Loader2 className="size-4 animate-spin" /> {p.pay.processing}
            </>
          ) : (
            `${p.pay.confirm} ${eur(total, locale)}`
          )}
        </button>
        {!count && <p className="text-center text-xs text-mist">{p.pay.nothing}</p>}
      </aside>

      <AnimatePresence>
        {phase === "done" && (
          <motion.div className="fixed inset-0 z-50 grid place-items-center bg-night/60 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div role="dialog" aria-modal="true" className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl" initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}>
              <span className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-500 text-white">
                <Check className="size-8" />
              </span>
              <h3 className="display mt-5 text-4xl">{p.pay.success}</h3>
              <p className="mt-2 text-sm text-mist">{p.pay.successLead}</p>
              <p className="mt-4 rounded-xl bg-foam px-4 py-3 font-mono text-xs">
                {p.pay.receipt} {receipt}
              </p>
              <button
                type="button"
                onClick={() => {
                  setPhase("idle");
                  setSel(Object.fromEntries(kids.map((a) => [a.id, { months: [], registration: false, full: false }])));
                }}
                className="mt-6 w-full rounded-full bg-night py-3.5 text-sm font-semibold text-white"
              >
                {p.pay.done}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MonthChip({ active, onClick, label, status, danger }: { active: boolean; onClick: () => void; label: string; status?: string; danger?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center gap-2 rounded-full px-3.5 py-2 text-sm ring-1 transition-colors ${
        active ? (danger ? "bg-signal text-white ring-signal" : "bg-royal text-white ring-royal") : "bg-white text-ink ring-line hover:ring-ink/30"
      }`}
    >
      <span className={`grid size-4 place-items-center rounded-full ${active ? "bg-white/25" : "ring-1 ring-line"}`}>{active && <Check className="size-3" />}</span>
      {label}
      {status && <span className={`text-xs normal-case ${active ? "text-white/80" : "text-mist"}`}>· {status}</span>}
    </button>
  );
}

function Info() {
  const { locale } = useI18n();
  const p = portalDictionaries[locale];
  return (
    <div className="space-y-4">
      <h2 className="display text-4xl">{p.info.title}</h2>
      <Inbox />
      {p.info.items.map((it) => (
        <article key={it.title} className="flex gap-4 rounded-3xl bg-white p-5 ring-1 ring-line">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-foam text-royal">
            <Bell className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="eyebrow !text-[0.6rem] text-signal">{it.date}</p>
            <h3 className="mt-1 font-semibold">{it.title}</h3>
            <p className="mt-1 text-sm text-mist">{it.text}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

const INBOX = {
  pt: { title: "Mensagens da tesouraria", empty: "Nenhuma mensagem. Quando o clube lhe enviar um lembrete, aparece aqui e no seu email.", email: "Enviado para", sms: "SMS para" },
  en: { title: "Messages from the treasury", empty: "No messages. When the club sends you a reminder, it appears here and in your inbox.", email: "Sent to", sms: "Text to" },
  fr: { title: "Messages de la trésorerie", empty: "Aucun message. Quand le club vous envoie un rappel, il apparaît ici et dans votre boîte mail.", email: "Envoyé à", sms: "SMS à" },
} as const;

function Inbox() {
  const { locale } = useI18n();
  const t = INBOX[locale as keyof typeof INBOX] ?? INBOX.pt;
  const { outbox, demoGuardianId } = useFees();
  const mine = outbox.filter((o) => o.guardianId === demoGuardianId && o.status === "sent");
  return (
    <section id="inbox" className="rounded-3xl bg-white p-5 ring-1 ring-line">
      <p className="flex items-center gap-2 font-semibold">
        <Mail className="size-4 text-royal" /> {t.title}
        {mine.length > 0 && <span className="rounded-full bg-signal px-2 py-0.5 text-xs font-bold text-white">{mine.length}</span>}
      </p>
      {mine.length === 0 ? (
        <p className="mt-2 text-sm text-mist">{t.empty}</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {mine.map((o) => (
            <li key={o.id} className="rounded-2xl bg-foam p-4 ring-1 ring-line">
              <p className="flex flex-wrap justify-between gap-2 text-xs text-mist">
                <span>
                  {o.channel === "email" ? t.email : t.sms} {o.to}
                </span>
                <span className="font-mono">{new Date(o.at).toLocaleString(locale === "en" ? "en-GB" : locale === "fr" ? "fr-FR" : "pt-PT", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</span>
              </p>
              {o.channel === "email" && <p className="mt-1 text-sm font-semibold">{o.subject}</p>}
              <pre className="mt-2 whitespace-pre-wrap font-sans text-sm leading-relaxed text-ink">{o.body}</pre>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Profile({ kids }: { kids: Athlete[] }) {
  const { locale } = useI18n();
  const p = portalDictionaries[locale];
  const { guardians, demoGuardianId } = useFees();
  const g = guardians.find((x) => x.id === demoGuardianId)!;
  return (
    <div className="space-y-5">
      <h2 className="display text-4xl">{p.profile.title}</h2>
      <section className="rounded-3xl bg-white p-6 ring-1 ring-line">
        <p className="eyebrow !text-[0.62rem] text-mist">{p.profile.guardian}</p>
        <p className="mt-2 text-lg font-semibold">{g.name}</p>
        <p className="text-sm text-mist">
          {g.email} · {g.phone}
        </p>
      </section>
      {kids.map((a) => (
        <section key={a.id} className="rounded-3xl bg-white p-6 ring-1 ring-line">
          <p className="font-semibold">
            {a.firstName} {a.lastName}
          </p>
          <label className="mt-3 flex cursor-pointer items-start gap-3 text-sm">
            <input type="checkbox" checked={a.photoConsent} onChange={(e) => feesStore.setPhotoConsent(a.id, e.target.checked)} className="mt-1 accent-royal" />
            <span>{p.profile.photo}</span>
          </label>
          <p className="mt-2 text-xs text-mist">{p.profile.photoNote}</p>
        </section>
      ))}
      <button type="button" className="text-sm font-semibold text-royal underline-offset-4 hover:underline">
        {p.profile.data}
      </button>
    </div>
  );
}

export function ParentPortal() {
  const { locale } = useI18n();
  const p = portalDictionaries[locale];
  const { athletes, guardians, demoGuardianId } = useFees();
  const [logged, setLogged] = useState(false);
  const [tab, setTab] = useState<Tab>("overview");
  const g = guardians.find((x) => x.id === demoGuardianId)!;
  const kids = athletes.filter((a) => a.guardianId === demoGuardianId);
  const due = kids.reduce((s, a) => s + balance(a).amount, 0);

  const tabs: { id: Tab; label: string; icon: typeof LayoutGrid; badge?: string }[] = [
    { id: "overview", label: p.nav.overview, icon: LayoutGrid },
    { id: "payments", label: p.nav.payments, icon: Wallet, badge: due > 0 ? eur(due, locale) : undefined },
    { id: "info", label: p.nav.info, icon: Bell },
    { id: "profile", label: p.nav.profile, icon: UserRound },
  ];

  return (
    <AppShell view="portal" title={p.title} demoText={p.demoBanner}>
      {!logged ? (
        <Login onEnter={() => setLogged(true)} />
      ) : (
        <div className="container-site grid gap-6 py-8 lg:grid-cols-[15rem_1fr] lg:py-10">
          <aside className="min-w-0">
            <p className="text-sm text-mist">{p.hello},</p>
            <p className="display text-3xl">{g.name.split(" ")[0]}</p>
            <nav className="no-scrollbar -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:px-0">
              {tabs.map((tb) => (
                <button
                  key={tb.id}
                  type="button"
                  onClick={() => setTab(tb.id)}
                  aria-current={tab === tb.id}
                  className={`flex shrink-0 items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition-colors ${tab === tb.id ? "bg-night text-white" : "bg-white text-ink ring-1 ring-line hover:bg-white/70"}`}
                >
                  <tb.icon className="size-4" />
                  <span className="flex-1 whitespace-nowrap">{tb.label}</span>
                  {tb.badge && <span className="rounded-full bg-signal px-2 py-0.5 text-[0.65rem] font-bold text-white">{tb.badge}</span>}
                </button>
              ))}
              <button type="button" onClick={() => setLogged(false)} className="flex shrink-0 items-center gap-3 rounded-2xl px-4 py-3 text-sm text-mist hover:text-ink">
                <LogOut className="size-4" /> {p.nav.logout}
              </button>
            </nav>
          </aside>
          <main className="min-w-0">
            <AnimatePresence mode="wait">
              <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
                {tab === "overview" && <Overview kids={kids} goPay={() => setTab("payments")} />}
                {tab === "payments" && <Payments kids={kids} />}
                {tab === "info" && <Info />}
                {tab === "profile" && <Profile kids={kids} />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      )}
    </AppShell>
  );
}
