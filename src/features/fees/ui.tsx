"use client";

import type { ReactNode } from "react";
import { ArrowLeft, FlaskConical } from "lucide-react";
import { useI18n } from "@/i18n/LanguageProvider";
import { portalDictionaries } from "@/i18n/portal-dictionaries";
import { Crest } from "@/components/ui";
import { LanguageSwitch } from "@/components/home/Header";
import { SEASON, type MonthStatus } from "./model";

/** Ligações entre vistas: hash na pré-visualização estática, rotas no Next.js. */
const HASH = process.env.NEXT_PUBLIC_ROUTING === "hash";
export const routes = {
  home: HASH ? "#inicio" : "/",
  portal: HASH ? "#area-pais" : "/area-pais",
  admin: HASH ? "#gestao" : "/gestao",
};

export const monthLabel = (i: number, locale: string, style: "short" | "long" = "short") =>
  new Date(`${SEASON.months[i]}-15`).toLocaleDateString(locale === "pt" ? "pt-PT" : locale, { month: style, ...(style === "long" ? { year: "numeric" } : {}) }).replace(".", "");

export const monthTone: Record<MonthStatus, string> = {
  paid: "bg-emerald-500 text-white",
  overdue: "bg-signal text-white",
  due: "bg-amber-400 text-ink",
  upcoming: "bg-line text-mist",
  exempt: "bg-haze text-white",
};

export function Pill({ tone, children }: { tone: "ok" | "warn" | "bad" | "neutral" | "info"; children: ReactNode }) {
  const tones = {
    ok: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    warn: "bg-amber-50 text-amber-800 ring-amber-200",
    bad: "bg-red-50 text-signal-deep ring-red-200",
    neutral: "bg-foam text-mist ring-line",
    info: "bg-blue-50 text-royal ring-blue-200",
  };
  return <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${tones[tone]}`}>{children}</span>;
}

export function AppShell({ view, title, demoText, children }: { view: "portal" | "admin"; title: string; demoText: string; children: ReactNode }) {
  const { locale } = useI18n();
  const p = portalDictionaries[locale];
  return (
    <div className="min-h-screen bg-foam text-ink">
      <div className="bg-signal text-white">
        <p className="container-site flex items-center justify-center gap-2 py-2 text-center text-xs font-semibold">
          <FlaskConical className="size-3.5 shrink-0" /> {demoText}
        </p>
      </div>
      <header className="sticky top-0 z-40 bg-night text-white">
        <div className="container-site flex h-16 items-center justify-between gap-3">
          <a href={routes.home} className="flex min-w-0 items-center gap-3">
            <Crest className="w-10 shrink-0" alt="" />
            <span className="min-w-0 leading-tight">
              <span className="display block truncate text-lg">CDR Quarteirense</span>
              <span className="block truncate text-[0.7rem] text-haze">{title}</span>
            </span>
          </a>
          <div className="flex items-center gap-2">
            <nav aria-label="Vista" className="hidden items-center rounded-full bg-white/5 p-0.5 text-xs font-semibold ring-1 ring-white/10 sm:flex">
              <a href={routes.portal} className={`rounded-full px-3 py-1.5 ${view === "portal" ? "bg-white text-night" : "text-haze hover:text-white"}`}>
                {p.views.portal}
              </a>
              <a href={routes.admin} className={`rounded-full px-3 py-1.5 ${view === "admin" ? "bg-white text-night" : "text-haze hover:text-white"}`}>
                {p.views.admin}
              </a>
            </nav>
            <LanguageSwitch compact />
            <a href={routes.home} className="hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-haze ring-1 ring-white/15 hover:text-white md:inline-flex">
              <ArrowLeft className="size-3.5" /> {p.backToSite}
            </a>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
