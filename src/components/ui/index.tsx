"use client";

import type { ReactNode, SVGProps } from "react";
import { motion, useReducedMotion } from "framer-motion";

/** Base dos ficheiros estáticos: "/" no Next.js, "" na pré-visualização estática. */
const BASE = process.env.NEXT_PUBLIC_ASSET_BASE ?? "/";
export const asset = (p: string) => `${BASE}${p.replace(/^\//, "")}`;

export function Crest({ className = "", alt = "Emblema do CDR Quarteirense" }: { className?: string; alt?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={asset("brand/crest.webp")} alt={alt} className={className} width={476} height={470} decoding="async" />;
}

/** Marca um conteúdo provisório (visível no modo revisão). */
export function Ph({ children, className = "", as: Tag = "span" }: { children: ReactNode; className?: string; as?: "span" | "div" }) {
  return (
    <Tag data-ph="" className={className}>
      {children}
    </Tag>
  );
}

export function Chip({ children, tone = "light", className = "" }: { children: ReactNode; tone?: "light" | "dark" | "signal"; className?: string }) {
  const tones = {
    light: "bg-foam text-deep ring-1 ring-line",
    dark: "bg-white/10 text-white ring-1 ring-white/15",
    signal: "bg-signal/10 text-signal ring-1 ring-signal/30",
  };
  return <span className={`eyebrow inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 !text-[0.62rem] ${tones[tone]} ${className}`}>{children}</span>;
}

export function DemoBadge({ label, tone = "signal" }: { label: string; tone?: "signal" | "dark" }) {
  return (
    <Chip tone={tone === "dark" ? "dark" : "signal"}>
      <span className="size-1.5 rounded-full bg-signal" aria-hidden /> {label}
    </Chip>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  dark = false,
  align = "left",
  children,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  dark?: boolean;
  align?: "left" | "center";
  children?: ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-5 md:flex-row md:items-end md:justify-between ${align === "center" ? "items-center text-center md:flex-col md:items-center" : ""}`}>
      <div className="max-w-3xl min-w-0">
        <p className={`eyebrow flex items-center gap-3 ${dark ? "text-haze" : "text-royal"}`}>
          <span className="band" aria-hidden />
          {eyebrow}
        </p>
        <h2 className={`display mt-4 text-[2.6rem] sm:text-6xl lg:text-7xl ${dark ? "text-white" : "text-ink"}`}>{title}</h2>
        {lead && <p className={`mt-5 max-w-2xl text-base leading-relaxed md:text-lg ${dark ? "text-haze" : "text-mist"}`}>{lead}</p>}
      </div>
      {children}
    </div>
  );
}

/** Revelação ao scroll: só translação, o conteúdo nunca fica invisível. */
export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { y: 28 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "light" | "ghost" | "ghostDark" | "royal";
  className?: string;
}) {
  const variants = {
    primary: "bg-signal text-white hover:bg-signal-deep shadow-[0_10px_30px_-10px_rgba(225,29,42,.7)]",
    royal: "bg-royal text-white hover:bg-deep",
    light: "bg-white text-night hover:bg-foam",
    ghost: "text-white ring-1 ring-inset ring-white/35 hover:bg-white/10 hover:ring-white/60",
    ghostDark: "text-ink ring-1 ring-inset ring-ink/20 hover:bg-ink/5 hover:ring-ink/40",
  };
  return (
    <a
      href={href}
      className={`group inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3.5 text-sm font-semibold tracking-wide transition-all duration-300 ${variants[variant]} ${className}`}
    >
      {children}
      <Arrow className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
    </a>
  );
}

/* ---------- Ícones ---------- */

type IconProps = SVGProps<SVGSVGElement>;

export function Arrow(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21h3.1z" />
    </svg>
  );
}
export function InstagramIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
export function XIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M17.8 3.5h3l-6.6 7.5 7.8 9.5h-6.1l-4.8-5.9-5.5 5.9h-3l7-7.9L2 3.5h6.2l4.3 5.4 5.3-5.4zm-1 15.2h1.7L7.3 5.2H5.5l11.3 13.5z" />
    </svg>
  );
}

export const socialIcons = { facebook: FacebookIcon, instagram: InstagramIcon, x: XIcon } as const;

/** Silhueta do caíque do emblema (desenho simplificado para fundos e marcas d'água). */
export function BoatMark(props: IconProps) {
  return (
    <svg viewBox="0 0 200 160" fill="currentColor" aria-hidden {...props}>
      <path d="M104 8 L104 112 L60 112 C70 80 86 40 104 8 Z" opacity=".95" />
      <path d="M110 22 C140 50 160 84 168 112 L110 112 Z" />
      <path d="M18 118 H186 C178 134 164 142 146 144 H50 C36 142 24 132 18 118 Z" />
    </svg>
  );
}

/** Anel da boia com quatro faixas — motivo gráfico principal. */
export function Lifebuoy({ className = "", stroke = "currentColor", bands = "#e11d2a" }: { className?: string; stroke?: string; bands?: string }) {
  const r = 160;
  const angles = [-55, 55, 125, 235];
  return (
    <svg viewBox="-200 -200 400 400" className={className} aria-hidden>
      <circle r={r} fill="none" stroke={stroke} strokeWidth="56" opacity=".9" />
      <circle r={r + 34} fill="none" stroke={stroke} strokeWidth="1.5" strokeDasharray="2 7" strokeLinecap="round" opacity=".7" />
      {angles.map((a) => (
        <rect key={a} x={-15} y={-r - 34} width={30} height={68} fill={bands} transform={`rotate(${a})`} />
      ))}
    </svg>
  );
}
