"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Star } from "lucide-react";
import { useI18n } from "@/i18n/LanguageProvider";
import type { Dict } from "@/i18n/dictionaries";
import { BoatMark, Crest, Lifebuoy, Ph, Reveal, SectionHeading } from "@/components/ui";

type Cat = keyof Dict["news"]["categories"];
type ItemKey = keyof Dict["news"]["items"];

/** Notícias baseadas em factos públicos do clube. Datas reais quando conhecidas. */
const NEWS: { key: ItemKey; cat: Cat; date: string; art: Art }[] = [
  { key: "board", cat: "club", date: "18.05.2026", art: "crest" },
  { key: "assembly", cat: "club", date: "10.09.2026", art: "assembly" },
  { key: "fpf", cat: "academy", date: "2024/25", art: "stars" },
  { key: "futsal", cat: "futsal", date: "2024/25", art: "court" },
  { key: "accounts", cat: "club", date: "2025", art: "accounts" },
  { key: "ethics", cat: "community", date: "2020", art: "ethics" },
];

type Art = "crest" | "stars" | "court" | "assembly" | "accounts" | "ethics";

/** Composições gráficas no lugar das fotografias, até o clube fornecer imagens. */
function ArtPanel({ art, big = false }: { art: Art; big?: boolean }) {
  const base = "absolute inset-0 overflow-hidden transition-transform duration-700 ease-out group-hover:scale-[1.04]";
  switch (art) {
    case "crest":
      return (
        <div className={`${base} bg-[radial-gradient(90%_90%_at_70%_30%,#2563eb,#0b3fb0_45%,#050d22)]`}>
          <Lifebuoy className="absolute -right-1/4 -top-1/4 size-[150%] text-white/[0.07]" stroke="currentColor" bands="rgba(225,29,42,.45)" />
          <Crest className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-2xl ${big ? "w-[42%]" : "w-[46%]"}`} alt="" />
        </div>
      );
    case "stars":
      return (
        <div className={`${base} bg-gradient-to-br from-deep via-royal to-royal-bright`}>
          <div className="absolute inset-0 flex items-center justify-center gap-[3%]">
            {[0, 1, 2, 3].map((i) => (
              <Star key={i} className="size-[16%] fill-white text-white drop-shadow-lg" style={{ transform: `translateY(${i % 2 ? 10 : -10}%)` }} />
            ))}
          </div>
          <span className="display absolute bottom-3 left-4 text-6xl text-white/15">FPF</span>
        </div>
      );
    case "court":
      return (
        <div className={`${base} bg-[#0b3fb0]`}>
          <svg viewBox="0 0 400 240" className="absolute inset-0 size-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
            <rect x="20" y="20" width="360" height="200" fill="none" stroke="white" strokeOpacity=".5" strokeWidth="2" />
            <line x1="200" y1="20" x2="200" y2="220" stroke="white" strokeOpacity=".5" strokeWidth="2" />
            <circle cx="200" cy="120" r="34" fill="none" stroke="white" strokeOpacity=".5" strokeWidth="2" />
            <path d="M20 60 a60 60 0 0 1 60 60 a60 60 0 0 1 -60 60" fill="none" stroke="white" strokeOpacity=".5" strokeWidth="2" />
            <path d="M380 60 a60 60 0 0 0 -60 60 a60 60 0 0 0 60 60" fill="none" stroke="white" strokeOpacity=".5" strokeWidth="2" />
            <circle cx="200" cy="120" r="7" fill="#e11d2a" />
          </svg>
        </div>
      );
    case "assembly":
      return (
        <div className={`${base} bg-night`}>
          <span className="display text-outline absolute -bottom-6 -left-2 text-[10rem] leading-none text-white/30">AG</span>
          <BoatMark className="absolute right-6 top-6 w-1/3 text-royal-bright/60" />
        </div>
      );
    case "accounts":
      return (
        <div className={`${base} bg-foam`}>
          <div className="absolute inset-x-6 bottom-6 flex h-1/2 items-end gap-2" aria-hidden>
            {[40, 55, 48, 70, 62, 85].map((h, i) => (
              <span key={i} className={`flex-1 rounded-t-md ${i === 5 ? "bg-signal" : "bg-royal/25"}`} style={{ height: `${h}%` }} />
            ))}
          </div>
          <span className="display absolute left-5 top-4 text-6xl text-royal">2025</span>
        </div>
      );
    case "ethics":
      return (
        <div className={`${base} bg-gradient-to-br from-white to-foam`}>
          <svg viewBox="0 0 120 120" className="absolute left-1/2 top-1/2 w-1/3 -translate-x-1/2 -translate-y-1/2" aria-hidden>
            <line x1="22" y1="10" x2="22" y2="112" stroke="#0a1530" strokeWidth="4" strokeLinecap="round" />
            <path d="M24 14 C50 4 70 26 100 16 V62 C70 72 50 50 24 60 Z" fill="#0b3fb0" />
            <path d="M24 37 C50 27 70 49 100 39 V62 C70 72 50 50 24 60 Z" fill="#e11d2a" opacity=".9" />
          </svg>
        </div>
      );
  }
}

export function News() {
  const { t } = useI18n();
  const [filter, setFilter] = useState<Cat | "all">("all");
  const list = filter === "all" ? NEWS : NEWS.filter((n) => n.cat === filter);
  const [lead, ...rest] = list;
  const cats = Object.entries(t.news.categories) as [Cat, string][];

  return (
    <section id="noticias" className="bg-paper py-20 md:py-28">
      <div className="container-site">
        <SectionHeading eyebrow={t.news.eyebrow} title={t.news.title}>
          <a href="#noticias" className="inline-flex items-center gap-2 text-sm font-semibold text-royal hover:underline">
            {t.common.seeAll} <ArrowUpRight className="size-4" />
          </a>
        </SectionHeading>

        <div className="no-scrollbar -mx-4 mt-8 overflow-x-auto px-4">
          <div className="flex gap-2">
            {[["all", t.news.all] as const, ...cats].map(([k, label]) => (
              <button
                key={k}
                type="button"
                onClick={() => setFilter(k as Cat | "all")}
                aria-pressed={filter === k}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ring-1 transition-colors ${
                  filter === k ? "bg-ink text-white ring-ink" : "text-mist ring-line hover:text-ink hover:ring-ink/30"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={filter} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            {!lead ? (
              <Ph as="div" className="mt-8 rounded-3xl bg-foam p-12 text-center text-mist">
                {t.common.soon}
              </Ph>
            ) : (
              <div className="mt-8 grid gap-5 lg:grid-cols-12">
                <Reveal className="lg:col-span-7">
                  <a href="#noticias" className="group block">
                    <div className="relative aspect-[16/10] max-w-full overflow-hidden rounded-3xl">
                      <ArtPanel art={lead.art} big />
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-night/70 to-transparent" />
                      <span className="eyebrow absolute left-5 top-5 rounded-full bg-signal px-3 py-1 !text-[0.62rem] text-white">{t.news.categories[lead.cat]}</span>
                    </div>
                    <div className="mt-5 flex items-center gap-3 text-sm text-mist">
                      <span className="font-mono">{lead.date}</span>
                    </div>
                    <h3 className="display mt-2 text-3xl transition-colors group-hover:text-royal md:text-[2.75rem]">
                      <Ph>{t.news.items[lead.key].title}</Ph>
                    </h3>
                    <p className="mt-3 max-w-2xl leading-relaxed text-mist">
                      <Ph>{t.news.items[lead.key].excerpt}</Ph>
                    </p>
                  </a>
                </Reveal>
                <div className="grid content-start gap-5 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
                  {rest.slice(0, 4).map((n, i) => (
                    <Reveal key={n.key} delay={i * 0.06}>
                      <a href="#noticias" className="group grid grid-cols-[7.5rem_1fr] gap-4 sm:grid-cols-1 lg:grid-cols-[9.5rem_1fr]">
                        <div className="relative aspect-square max-w-full overflow-hidden rounded-2xl sm:aspect-[16/9] lg:aspect-square">
                          <ArtPanel art={n.art} />
                        </div>
                        <div className="min-w-0 self-center">
                          <p className="eyebrow flex flex-wrap gap-x-2 !text-[0.62rem]">
                            <span className="text-signal">{t.news.categories[n.cat]}</span>
                            <span className="text-mist">{n.date}</span>
                          </p>
                          <h3 className="mt-1.5 text-[1.02rem] font-semibold leading-snug transition-colors group-hover:text-royal">
                            <Ph>{t.news.items[n.key].title}</Ph>
                          </h3>
                        </div>
                      </a>
                    </Reveal>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        <p className="mt-10 border-t border-line pt-5 text-sm text-mist">{t.news.note}</p>
      </div>
    </section>
  );
}
