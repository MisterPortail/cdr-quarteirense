"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Award, Flag, Medal, Trophy } from "lucide-react";
import { useI18n } from "@/i18n/LanguageProvider";
import { TROPHIES, trophyTexts, type TrophyGroup } from "@/i18n/trophies";
import { Ph, SectionHeading } from "@/components/ui";

const ICON = { cup: Trophy, medal: Medal, flag: Flag, star: Award } as const;

export function TrophyRoom() {
  const { locale } = useI18n();
  const tr = trophyTexts[locale];
  const [group, setGroup] = useState<TrophyGroup | "all">("all");
  const list = group === "all" ? TROPHIES : TROPHIES.filter((x) => x.group === group);
  const groups = Object.entries(tr.filters) as [TrophyGroup, string][];

  return (
    <section id="trofeus" className="bg-paper py-20 md:py-28">
      <div className="container-site">
        <SectionHeading eyebrow={tr.eyebrow} title={tr.title} lead={tr.lead} />

        <div className="no-scrollbar -mx-4 mt-8 overflow-x-auto px-4">
          <div className="flex gap-2">
            {[["all", tr.all] as const, ...groups].map(([k, label]) => (
              <button
                key={k}
                type="button"
                onClick={() => setGroup(k as TrophyGroup | "all")}
                aria-pressed={group === k}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ring-1 transition-colors ${group === k ? "bg-ink text-white ring-ink" : "text-mist ring-line hover:text-ink"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <motion.ul layout className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence initial={false}>
            {list.map((x) => {
              const it = tr.items[x.key];
              const Icon = ICON[x.kind];
              const sport = x.kind === "cup";
              const card = (
                <div className={`flex h-full flex-col rounded-3xl p-6 ring-1 ${sport ? "bg-night text-white ring-night" : "bg-foam ring-line"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <span className={`grid size-12 place-items-center rounded-2xl ${sport ? "bg-gradient-to-br from-amber-300 to-amber-500 text-night" : "bg-white text-royal ring-1 ring-line"}`}>
                      <Icon className="size-6" />
                    </span>
                    {x.count && <span className={`display text-5xl ${sport ? "text-white" : "text-ink"}`}>{x.count}×</span>}
                  </div>
                  <h3 className="mt-5 text-lg font-semibold leading-snug">{it.name}</h3>
                  <p className={`mt-1 text-xs ${sport ? "text-haze" : "text-mist"}`}>{it.team}</p>
                  <p className={`mt-3 text-sm leading-relaxed ${sport ? "text-white/75" : "text-mist"}`}>{it.text}</p>
                  <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
                    {x.seasons.map((s) => (
                      <span key={s} className={`rounded-full px-2.5 py-1 font-mono text-xs ${sport ? "bg-white/10" : "bg-white ring-1 ring-line"}`}>
                        {s}
                      </span>
                    ))}
                    <span className={`ml-auto text-[0.68rem] font-semibold uppercase tracking-wide ${x.verified ? "text-emerald-600" : "text-signal"}`}>
                      {x.verified ? tr.verified : tr.toConfirm}
                    </span>
                  </div>
                </div>
              );
              return (
                <motion.li key={x.key} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.25 }}>
                  {x.verified ? card : <Ph as="div" className="block h-full">{card}</Ph>}
                </motion.li>
              );
            })}
          </AnimatePresence>
        </motion.ul>
        <p className="mt-6 text-sm text-mist">{tr.more}</p>
      </div>
    </section>
  );
}
