"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, UserRound, X } from "lucide-react";
import { useI18n } from "@/i18n/LanguageProvider";
import { locales, type Locale } from "@/i18n/dictionaries";
import { club } from "@/content/club";
import { Crest, socialIcons } from "@/components/ui";
import { routes } from "@/features/fees/ui";

const LANG_LABEL: Record<Locale, string> = { pt: "PT", en: "EN", fr: "FR" };

export function LanguageSwitch({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale, t } = useI18n();
  return (
    <div role="group" aria-label={t.topbar.language} className="flex items-center rounded-full bg-white/5 p-0.5 ring-1 ring-white/10">
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          aria-pressed={locale === l}
          className={`rounded-full font-mono text-[0.68rem] tracking-widest transition-colors ${compact ? "px-2 py-1" : "px-2.5 py-1"} ${
            locale === l ? "bg-white text-night" : "text-haze hover:text-white"
          }`}
        >
          {LANG_LABEL[l]}
        </button>
      ))}
    </div>
  );
}

function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {club.social.map((s) => {
        const Icon = socialIcons[s.id as keyof typeof socialIcons];
        return (
          <a key={s.id} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className="grid size-8 place-items-center rounded-full text-haze transition-colors hover:bg-white/10 hover:text-white">
            <Icon className="size-4" />
          </a>
        );
      })}
    </div>
  );
}

export function Header() {
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const nav = [
    { href: "#clube", label: t.nav.club },
    { href: "#equipas", label: t.nav.football },
    { href: "#equipas", label: t.nav.futsal },
    { href: "#formacao", label: t.nav.academy },
    { href: "#jogos", label: t.nav.matches },
    { href: "#noticias", label: t.nav.news },
    { href: "#socios", label: t.nav.members },
    { href: "#loja", label: t.nav.shop },
  ];
  const sports = Object.values(t.nav.sportsList);

  return (
    <>
      {/* Barra superior */}
      <div className="relative z-50 bg-night text-white">
        <div className="container-site flex h-10 items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="hidden text-haze sm:inline">{t.topbar.follow}</span>
            <SocialLinks />
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <LanguageSwitch compact />
            <a href={routes.portal} className="hidden items-center gap-1.5 text-haze transition-colors hover:text-white md:inline-flex">
              <UserRound className="size-3.5" /> {t.topbar.memberArea}
            </a>
            <a href="#socios" className="hidden rounded-full bg-signal px-3.5 py-1.5 font-semibold text-white transition-colors hover:bg-signal-deep sm:inline-block">
              {t.topbar.becomeMember}
            </a>
          </div>
        </div>
      </div>

      {/* Navegação principal, fixa ao scroll */}
      <header
        className={`sticky top-0 z-40 text-white transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
          scrolled ? "bg-night/85 shadow-[0_10px_40px_-20px_rgba(0,0,0,.8)] backdrop-blur-xl" : "bg-night"
        }`}
      >
        <div className={`container-site flex items-center justify-between gap-6 transition-[height] duration-500 ${scrolled ? "h-16" : "h-20 lg:h-24"}`}>
          <a href="#inicio" className="flex shrink-0 items-center gap-3" aria-label="CDR Quarteirense — Início">
            <Crest className={`h-auto drop-shadow-[0_6px_18px_rgba(0,0,0,.45)] transition-all duration-500 ${scrolled ? "w-11" : "w-14 lg:w-[4.5rem]"}`} alt="" />
            <span className="leading-none">
              <span className="display block text-xl tracking-wide lg:text-2xl">CDR Quarteirense</span>
              <span className="eyebrow mt-1 block !text-[0.6rem] text-haze">Quarteira · 1937</span>
            </span>
          </a>

          <nav aria-label="Principal" className="hidden xl:block">
            <ul className="flex items-center gap-1">
              {nav.slice(0, 4).map((n) => (
                <li key={n.label}>
                  <a href={n.href} className="relative rounded-full px-3 py-2 text-[0.82rem] font-medium text-white/85 transition-colors hover:text-white">
                    {n.label}
                  </a>
                </li>
              ))}
              <li className="group relative">
                <button type="button" className="flex items-center gap-1 rounded-full px-3 py-2 text-[0.82rem] font-medium text-white/85 transition-colors hover:text-white" aria-haspopup="true">
                  {t.nav.sports} <ChevronDown className="size-3.5 transition-transform group-hover:rotate-180" />
                </button>
                <div className="invisible absolute left-1/2 top-full w-56 -translate-x-1/2 translate-y-2 pt-3 opacity-0 transition-all duration-300 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <ul className="rounded-2xl bg-white p-2 text-ink shadow-2xl ring-1 ring-line">
                    {sports.map((s) => (
                      <li key={s}>
                        <a href="#equipas" className="block rounded-xl px-3 py-2 text-sm transition-colors hover:bg-foam hover:text-royal">
                          {s}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
              {nav.slice(4).map((n) => (
                <li key={n.label}>
                  <a href={n.href} className="rounded-full px-3 py-2 text-[0.82rem] font-medium text-white/85 transition-colors hover:text-white">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <a href="#parceiros" className="hidden text-[0.82rem] font-medium text-white/85 hover:text-white 2xl:inline">
              {t.nav.partners}
            </a>
            <a href="#contactos" className="hidden text-[0.82rem] font-medium text-white/85 hover:text-white 2xl:ml-3 2xl:inline">
              {t.nav.contacts}
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-sm font-semibold ring-1 ring-white/15 transition-colors hover:bg-white/20 xl:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <Menu className="size-4" /> {t.nav.menu}
            </button>
          </div>
        </div>
      </header>

      {/* Menu móvel em ecrã inteiro */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[60] overflow-y-auto bg-night text-white"
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="container-site flex h-20 items-center justify-between">
              <Crest className="w-12" alt="" />
              <button type="button" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-sm font-semibold">
                <X className="size-4" /> {t.nav.close}
              </button>
            </div>
            <nav aria-label="Menu" className="container-site pb-12 pt-4">
              <ul className="flex flex-col">
                {[{ href: "#inicio", label: t.nav.home }, ...nav, { href: "#parceiros", label: t.nav.partners }, { href: "#contactos", label: t.nav.contacts }].map((n, i) => (
                  <motion.li key={n.label} initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.15 + i * 0.035 }}>
                    <a href={n.href} onClick={() => setOpen(false)} className="display flex items-baseline justify-between border-b border-white/10 py-3 text-4xl transition-colors hover:text-signal sm:text-5xl">
                      {n.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
              <p className="eyebrow mt-8 text-haze">{t.nav.sports}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {sports.map((s) => (
                  <a key={s} href="#equipas" onClick={() => setOpen(false)} className="rounded-full px-3.5 py-1.5 text-sm ring-1 ring-white/20">
                    {s}
                  </a>
                ))}
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a href="#socios" onClick={() => setOpen(false)} className="rounded-full bg-signal px-6 py-3 font-semibold">
                  {t.topbar.becomeMember}
                </a>
                <a href={routes.portal} onClick={() => setOpen(false)} className="inline-flex items-center gap-2 text-haze">
                  <UserRound className="size-4" /> {t.topbar.memberArea}
                </a>
              </div>
              <div className="mt-8 flex items-center justify-between">
                <LanguageSwitch />
                <SocialLinks />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
