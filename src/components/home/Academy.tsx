"use client";

import { Award, Phone } from "lucide-react";
import { useI18n } from "@/i18n/LanguageProvider";
import { club, youthCategories } from "@/content/club";
import { ButtonLink, Ph, Reveal, SectionHeading } from "@/components/ui";

export function Academy() {
  const { t } = useI18n();
  return (
    <section id="formacao" className="relative overflow-hidden bg-paper py-20 md:py-28">
      <div className="container-site">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="min-w-0">
            <SectionHeading eyebrow={t.academy.eyebrow} title={t.academy.title} lead={t.academy.lead} />

            <div className="mt-10 grid gap-px overflow-hidden rounded-3xl bg-line ring-1 ring-line sm:grid-cols-2">
              {t.academy.values.map((v, i) => (
                <Reveal key={v.title} delay={i * 0.05} className="bg-paper">
                  <div className="h-full p-6">
                    <span className="font-mono text-xs text-signal">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="display mt-2 text-3xl">{v.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-mist">{v.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Escalões */}
            <div className="mt-12">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="eyebrow text-royal">{t.academy.categoriesTitle}</h3>
                <Ph className="text-xs text-mist">{t.academy.categoriesNote}</Ph>
              </div>
              <ol className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-7">
                {youthCategories.map((c, i) => (
                  <li key={c.id} className="group relative overflow-hidden rounded-2xl bg-foam p-3 ring-1 ring-line transition-colors hover:bg-royal hover:text-white">
                    <span className="block h-1 rounded-full bg-royal/15 group-hover:bg-white/30">
                      <span className="block h-full rounded-full bg-royal group-hover:bg-signal" style={{ width: `${((i + 1) / youthCategories.length) * 100}%` }} />
                    </span>
                    <span className="display mt-3 block text-2xl">{c.age}</span>
                    <span className="text-xs text-mist group-hover:text-white/80">{c.name}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Pais */}
          <Reveal className="min-w-0">
            <div className="relative overflow-hidden rounded-[2rem] bg-night p-7 text-white md:p-10 lg:sticky lg:top-28">
              <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-royal/60 blur-3xl" aria-hidden />
              <div className="relative">
                <div className="flex items-center gap-3">
                  <span className="grid size-12 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                    <Award className="size-6 text-signal" />
                  </span>
                  <div>
                    <p className="display text-2xl leading-none">FPF · 4★</p>
                    <p className="text-xs text-haze">{t.ticker[0]}</p>
                  </div>
                </div>
                <h3 className="display mt-8 text-4xl md:text-5xl">{t.academy.parentsTitle}</h3>
                <p className="mt-3 text-haze">{t.academy.parentsLead}</p>
                <ol className="mt-8 space-y-px overflow-hidden rounded-2xl ring-1 ring-white/10">
                  {t.academy.steps.map((s, i) => (
                    <li key={s.title} className="flex gap-4 bg-white/[0.04] p-4">
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-signal font-mono text-sm font-semibold">{i + 1}</span>
                      <div className="min-w-0">
                        <p className="font-semibold">{s.title}</p>
                        <p className="text-sm text-haze">{s.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <Ph as="div" className="mt-4 text-xs text-white/50">
                  {t.academy.stepsNote}
                </Ph>
                <div className="mt-8 flex flex-wrap gap-3">
                  <ButtonLink href="#contactos" variant="primary">
                    {t.academy.ctaEnroll}
                  </ButtonLink>
                  <a href="#contactos" className="inline-flex items-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold ring-1 ring-white/25 hover:bg-white/10">
                    <Phone className="size-4" /> {club.contacts.phone}
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
