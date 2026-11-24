"use client";

import { useState, type FormEvent, type PointerEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Check, Handshake, Mail } from "lucide-react";
import { useI18n } from "@/i18n/LanguageProvider";
import { club } from "@/content/club";
import { ButtonLink, Crest, Lifebuoy, Ph, Reveal, SectionHeading } from "@/components/ui";

/* ---------------- Sócios ---------------- */

function MemberCard() {
  const { t } = useI18n();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), { stiffness: 150, damping: 18 });
  const shine = useTransform(mx, [-0.5, 0.5], ["0%", "100%"]);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div className="[perspective:1200px]" onPointerMove={onMove} onPointerLeave={reset}>
      <motion.div
        style={{ rotateX: rx, rotateY: ry }}
        className="relative mx-auto aspect-[1.586/1] w-full max-w-[30rem] overflow-hidden rounded-[1.6rem] bg-[linear-gradient(135deg,#0b3fb0_0%,#0a1a3f_55%,#050d22_100%)] p-6 text-white shadow-[0_40px_80px_-30px_rgba(0,0,0,.8)] ring-1 ring-white/15 sm:p-8"
      >
        <Lifebuoy className="absolute -right-24 -top-24 size-80 text-white/[0.08]" stroke="currentColor" bands="rgba(225,29,42,.6)" />
        <motion.div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,transparent_35%,rgba(255,255,255,.18)_50%,transparent_65%)] bg-[length:250%_100%]"
          style={{ backgroundPositionX: shine }}
        />
        <div className="relative flex h-full flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="eyebrow !text-[0.6rem] text-white/60">{t.membership.card.label}</p>
              <p className="display mt-1 text-2xl">CDR Quarteirense</p>
            </div>
            <Crest className="w-14 sm:w-16" alt="" />
          </div>
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold sm:text-xl">{t.membership.card.name}</p>
              <p className="mt-1 font-mono text-xs tracking-widest text-white/70">
                {t.membership.card.number} 0000 · {t.membership.card.since} 2026
              </p>
            </div>
            {/* QR decorativo */}
            <svg viewBox="0 0 7 7" className="size-14 shrink-0 rounded-md bg-white p-1" shapeRendering="crispEdges" aria-hidden>
              {[
                "1110111",
                "1010101",
                "1110111",
                "0001000",
                "1101011",
                "0110110",
                "1011101",
              ].flatMap((row, y) => row.split("").map((c, x) => (c === "1" ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#050d22" /> : null)))}
            </svg>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function Membership() {
  const { t } = useI18n();
  return (
    <section id="socios" className="relative overflow-hidden bg-[linear-gradient(160deg,#0b3fb0_0%,#0a1a3f_55%,#050d22_100%)] py-20 text-white md:py-28">
      <div className="container-site grid items-center gap-14 lg:grid-cols-2">
        <div className="min-w-0">
          <SectionHeading eyebrow={t.membership.eyebrow} title={t.membership.title} lead={t.membership.lead} dark />
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {t.membership.benefits.map((b) => (
              <li key={b} className="flex items-center gap-3 rounded-2xl bg-white/[0.06] px-4 py-3.5 ring-1 ring-white/10">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-signal">
                  <Check className="size-4" />
                </span>
                <Ph className="text-sm font-medium">{b}</Ph>
              </li>
            ))}
          </ul>
          <Ph as="div" className="mt-4 text-xs text-white/55">
            {t.membership.benefitsNote}
          </Ph>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="#socios" variant="primary">
              {t.membership.cta}
            </ButtonLink>
            <ButtonLink href="#socios" variant="ghost">
              {t.membership.ctaSecondary}
            </ButtonLink>
          </div>
        </div>
        <Reveal>
          <MemberCard />
          <p className="display mt-10 text-center text-7xl text-white/90 md:text-8xl">
            {club.figures.members.toLocaleString("pt-PT")}
            <span className="block font-sans text-sm font-medium normal-case tracking-normal text-haze">{t.stats.members}</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Loja ---------------- */

function Jersey({ variant }: { variant: "home" | "training" }) {
  const body = variant === "home" ? "#0b3fb0" : "#050d22";
  const trim = variant === "home" ? "#ffffff" : "#2563eb";
  return (
    <svg viewBox="0 0 200 200" className="w-[70%] drop-shadow-[0_25px_25px_rgba(5,13,34,.35)]" aria-hidden>
      <path d="M70 22 L44 30 L14 62 L36 92 L52 80 L52 178 L148 178 L148 80 L164 92 L186 62 L156 30 L130 22 C124 36 112 42 100 42 C88 42 76 36 70 22 Z" fill={body} />
      <path d="M70 22 C76 36 88 42 100 42 C112 42 124 36 130 22 L124 20 C118 31 110 35 100 35 C90 35 82 31 76 20 Z" fill={trim} />
      {variant === "home" ? (
        <>
          <rect x="52" y="112" width="96" height="9" fill="#e11d2a" />
          <rect x="52" y="125" width="96" height="3" fill="#ffffff" opacity=".8" />
        </>
      ) : (
        <path d="M52 80 L148 140 L148 152 L52 92 Z" fill={trim} opacity=".6" />
      )}
      <path d="M14 62 L36 92 L44 86 L22 56 Z" fill={trim} opacity=".9" />
      <path d="M186 62 L164 92 L156 86 L178 56 Z" fill={trim} opacity=".9" />
      <circle cx="122" cy="66" r="9" fill="#ffffff" opacity=".95" />
      <circle cx="122" cy="66" r="5" fill="#e11d2a" />
    </svg>
  );
}

function Scarf() {
  return (
    <svg viewBox="0 0 200 200" className="w-[78%] -rotate-12 drop-shadow-[0_25px_25px_rgba(5,13,34,.35)]" aria-hidden>
      <rect x="20" y="80" width="160" height="40" fill="#0b3fb0" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <rect key={i} x={20 + i * 20} y="80" width="10" height="40" fill={i % 2 ? "#ffffff" : "#050d22"} opacity={i % 2 ? 0.9 : 0.5} />
      ))}
      <rect x="20" y="96" width="160" height="8" fill="#e11d2a" />
      {Array.from({ length: 9 }).map((_, i) => (
        <g key={i}>
          <line x1={22 + i * 2} y1="120" x2={22 + i * 2} y2="132" stroke="#0b3fb0" strokeWidth="1.4" />
          <line x1={162 + i * 2} y1="120" x2={162 + i * 2} y2="132" stroke="#0b3fb0" strokeWidth="1.4" />
        </g>
      ))}
    </svg>
  );
}

function Cap() {
  return (
    <svg viewBox="0 0 200 200" className="w-[62%] drop-shadow-[0_25px_25px_rgba(5,13,34,.35)]" aria-hidden>
      <path d="M40 120 C40 70 70 48 104 48 C140 48 162 74 162 118 Z" fill="#050d22" />
      <path d="M40 120 L162 118 C176 124 186 132 188 140 L44 138 Z" fill="#0b3fb0" />
      <path d="M100 48 C96 70 96 96 100 119" stroke="#2563eb" strokeWidth="2" fill="none" />
      <circle cx="102" cy="47" r="5" fill="#e11d2a" />
      <circle cx="74" cy="92" r="11" fill="#ffffff" />
      <circle cx="74" cy="92" r="6" fill="#e11d2a" />
    </svg>
  );
}

export function Shop() {
  const { t } = useI18n();
  const [sent, setSent] = useState(false);
  const visuals = [<Jersey key="h" variant="home" />, <Jersey key="t" variant="training" />, <Scarf key="s" />, <Cap key="c" />];
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };
  return (
    <section id="loja" className="bg-foam py-20 md:py-28">
      <div className="container-site">
        <SectionHeading eyebrow={t.shop.eyebrow} title={t.shop.title} lead={t.shop.lead}>
          <form onSubmit={onSubmit} className="flex w-full max-w-md items-center gap-2 rounded-full bg-white p-1.5 ring-1 ring-line">
            {sent ? (
              <p className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-royal" role="status">
                <Check className="size-4" /> {t.shop.thanks}
              </p>
            ) : (
              <>
                <label htmlFor="shop-email" className="sr-only">
                  {t.shop.emailLabel}
                </label>
                <Mail className="ml-3 size-4 shrink-0 text-mist" />
                <input id="shop-email" type="email" required placeholder={t.shop.emailLabel} className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-mist" />
                <button type="submit" className="rounded-full bg-night px-5 py-2.5 text-sm font-semibold text-white hover:bg-royal">
                  {t.shop.notify}
                </button>
              </>
            )}
          </form>
        </SectionHeading>

        <div className="mt-12 grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
          {t.shop.items.map((it, i) => (
            <Reveal key={it.name} delay={i * 0.06}>
              <div className="group relative">
                <div className="relative grid aspect-[4/5] max-w-full place-items-center overflow-hidden rounded-3xl bg-[radial-gradient(80%_70%_at_50%_40%,#ffffff,#dfe7f5)] ring-1 ring-line transition-transform duration-500 group-hover:-translate-y-1">
                  <div className="transition-transform duration-700 group-hover:scale-105 [&>svg]:mx-auto">{visuals[i]}</div>
                  <span className="eyebrow absolute left-3 top-3 rounded-full bg-night px-2.5 py-1 !text-[0.58rem] text-white">{t.common.soon}</span>
                </div>
                <p className="eyebrow mt-4 !text-[0.62rem] text-mist">{it.tag}</p>
                <h3 className="mt-1 font-semibold">{it.name}</h3>
              </div>
            </Reveal>
          ))}
        </div>
        <Ph as="div" className="mt-6 text-xs text-mist">
          {t.shop.illustrative}
        </Ph>
      </div>
    </section>
  );
}

/* ---------------- Parceiros ---------------- */

export function Partners() {
  const { t } = useI18n();
  const Slot = ({ big = false }: { big?: boolean }) => (
    <Ph
      as="div"
      className={`grid place-items-center rounded-2xl border border-dashed border-line bg-paper text-center text-mist transition-colors hover:border-royal hover:text-royal ${big ? "h-36 md:h-44" : "h-24"}`}
    >
      <span className="eyebrow !text-[0.6rem]">{t.partners.slot}</span>
    </Ph>
  );
  return (
    <section id="parceiros" className="bg-paper py-20 md:py-28">
      <div className="container-site">
        <SectionHeading eyebrow={t.partners.eyebrow} title={t.partners.title} />
        <div className="mt-12 space-y-10">
          <div>
            <p className="eyebrow text-royal">{t.partners.main}</p>
            <div className="mt-4">
              <Slot big />
            </div>
          </div>
          <div>
            <p className="eyebrow text-royal">{t.partners.official}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              {[0, 1, 2, 3].map((i) => (
                <Slot key={i} />
              ))}
            </div>
          </div>
          <div>
            <p className="eyebrow text-royal">{t.partners.suppliers}</p>
            <div className="mt-4 grid grid-cols-3 gap-3 md:grid-cols-6">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <Slot key={i} />
              ))}
            </div>
          </div>
        </div>

        <Reveal>
          <div className="relative mt-16 overflow-hidden rounded-[2rem] bg-night p-8 text-white md:p-14">
            <Lifebuoy className="absolute -bottom-40 -right-32 size-[30rem] text-white/[0.06]" stroke="currentColor" bands="rgba(225,29,42,.5)" />
            <div className="relative grid items-end gap-8 lg:grid-cols-[1.4fr_1fr]">
              <div className="min-w-0">
                <span className="grid size-12 place-items-center rounded-2xl bg-signal">
                  <Handshake className="size-6" />
                </span>
                <h3 className="display mt-6 text-4xl md:text-6xl">{t.partners.ctaTitle}</h3>
                <p className="mt-4 max-w-xl text-haze">{t.partners.ctaLead}</p>
              </div>
              <div className="flex flex-wrap gap-3 lg:justify-end">
                <ButtonLink href="#contactos" variant="primary">
                  {t.partners.cta}
                </ButtonLink>
                <ButtonLink href="#contactos" variant="ghost">
                  {t.partners.ctaSecondary}
                </ButtonLink>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
