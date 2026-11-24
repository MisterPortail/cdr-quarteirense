"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, Mail, MapPin, Phone } from "lucide-react";
import { useI18n } from "@/i18n/LanguageProvider";
import { club } from "@/content/club";
import { Crest, Ph, socialIcons } from "@/components/ui";
import { LanguageSwitch } from "./Header";
import { routes } from "@/features/fees/ui";

export function Footer() {
  const { t } = useI18n();
  const cols = [
    {
      title: t.footer.club,
      links: [
        [t.nav.club, "#clube"],
        [t.nav.news, "#noticias"],
        [t.nav.matches, "#jogos"],
        [t.nav.partners, "#parceiros"],
        [t.nav.shop, "#loja"],
        [t.topbar.memberArea, routes.portal],
        [t.footer.adminDemo, routes.admin],
      ],
    },
    {
      title: t.footer.sports,
      links: [
        [t.nav.football, "#equipas"],
        [t.nav.futsal, "#equipas"],
        [t.nav.academy, "#formacao"],
        ...Object.values(t.nav.sportsList).map((s) => [s, "#equipas"]),
      ],
    },
    {
      title: t.footer.documents,
      links: [
        [t.footer.docs.statutes, club.documents.statutes],
        [t.footer.docs.reports, club.documents.documentsPage],
        [t.footer.docs.bodies, club.documents.governingBodies],
      ],
    },
  ];

  return (
    <footer id="contactos" className="relative overflow-hidden bg-night text-white">
      <div className="rope text-white" aria-hidden />
      <div className="container-site grid gap-12 py-16 md:py-20 lg:grid-cols-[1.2fr_2fr]">
        <div className="min-w-0">
          <div className="flex items-center gap-4">
            <Crest className="w-20" alt="" />
            <div>
              <p className="display text-3xl">CDR Quarteirense</p>
              <p className="text-sm text-haze">{t.footer.tagline}</p>
            </div>
          </div>
          <address className="mt-8 space-y-3 text-sm not-italic text-white/80">
            <p className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-signal" />
              <span>
                <span className="eyebrow block !text-[0.6rem] text-haze">{t.footer.hq}</span>
                {club.contacts.address.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </span>
            </p>
            <p className="flex items-center gap-3">
              <Phone className="size-4 shrink-0 text-signal" />
              <a href={`tel:${club.contacts.phoneHref}`} className="select-all hover:text-white">
                {club.contacts.phone}
              </a>
            </p>
            <p className="flex items-center gap-3">
              <Mail className="size-4 shrink-0 text-signal" />
              <a href={`mailto:${club.contacts.email}`} className="select-all break-all hover:text-white">
                {club.contacts.email}
              </a>
            </p>
          </address>
          <div className="mt-8 flex items-center gap-2">
            {club.social.map((s) => {
              const Icon = socialIcons[s.id as keyof typeof socialIcons];
              return (
                <a key={s.id} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className="grid size-10 place-items-center rounded-full ring-1 ring-white/15 transition-colors hover:bg-white hover:text-night">
                  <Icon className="size-4" />
                </a>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10 md:grid-cols-3">
          {cols.map((c) => (
            <nav key={c.title} aria-label={c.title} className="min-w-0">
              <p className="eyebrow text-haze">{c.title}</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {c.links.map(([label, href]) => (
                  <li key={label}>
                    <a href={href} {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})} className="text-white/75 transition-colors hover:text-white">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-4 py-6 text-xs text-white/55 lg:flex-row lg:items-center lg:justify-between">
          <p>
            © {new Date().getFullYear()} {club.name}. {t.footer.rights} · {t.footer.publicUtility}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {Object.values(t.footer.legal).map((l) => (
              <Ph key={l}>
                <a href="#contactos" className="hover:text-white">
                  {l}
                </a>
              </Ph>
            ))}
            <LanguageSwitch compact />
          </div>
        </div>
      </div>
    </footer>
  );
}

/** Botão flutuante para a apresentação: realça os conteúdos provisórios. */
export function ReviewToggle() {
  const { t, review, setReview } = useI18n();
  const [hint, setHint] = useState(false);
  return (
    <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom,0px))] right-[max(1rem,env(safe-area-inset-right,0px))] z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {(review || hint) && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="max-w-[17rem] rounded-2xl bg-white p-3 text-xs leading-relaxed text-ink shadow-xl ring-1 ring-line"
          >
            <span className="font-semibold">{t.footer.prototype}.</span> {t.review.legend}
          </motion.p>
        )}
      </AnimatePresence>
      <button
        type="button"
        onClick={() => setReview(!review)}
        onMouseEnter={() => setHint(true)}
        onMouseLeave={() => setHint(false)}
        aria-pressed={review}
        className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold shadow-xl ring-1 transition-colors ${
          review ? "bg-signal text-white ring-signal" : "bg-white/90 text-ink ring-line backdrop-blur hover:bg-white"
        }`}
      >
        {review ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        <span className="hidden sm:inline">{review ? t.review.off : t.review.label}</span>
      </button>
    </div>
  );
}
