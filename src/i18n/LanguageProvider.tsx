"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { defaultLocale, dictionaries, locales, type Dict, type Locale } from "./dictionaries";

type Ctx = {
  locale: Locale;
  t: Dict;
  setLocale: (l: Locale) => void;
  /** Modo revisão: realça os conteúdos provisórios (para a apresentação à Direção). */
  review: boolean;
  setReview: (v: boolean) => void;
};

const LanguageContext = createContext<Ctx | null>(null);
const STORAGE_KEY = "cdrq.locale";

function readStored(): Locale | null {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v && (locales as readonly string[]).includes(v) ? (v as Locale) : null;
  } catch {
    return null;
  }
}

export function LanguageProvider({ children, initialLocale = defaultLocale }: { children: ReactNode; initialLocale?: Locale }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [review, setReview] = useState(false);

  useEffect(() => {
    const stored = readStored();
    if (stored) setLocaleState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "pt" ? "pt-PT" : locale;
    document.title = dictionaries[locale].meta.title;
  }, [locale]);

  useEffect(() => {
    document.documentElement.classList.toggle("review-mode", review);
  }, [review]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* armazenamento indisponível: ignora */
    }
  }, []);

  const value = useMemo(() => ({ locale, t: dictionaries[locale], setLocale, review, setReview }), [locale, setLocale, review]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useI18n must be used inside <LanguageProvider>");
  return ctx;
}
