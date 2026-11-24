"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Camera } from "lucide-react";
import { useI18n } from "@/i18n/LanguageProvider";
import { ButtonLink, Crest, Lifebuoy, Ph } from "@/components/ui";

/** Ondas animadas em SVG — o mar de Quarteira na base do hero. */
export function Waves({ className = "", color = "#0b3fb0" }: { className?: string; color?: string }) {
  const wave = (amp: number, len: number, y: number) => {
    let d = `M0 ${y}`;
    for (let x = 0; x < 2880; x += len) d += ` q ${len / 4} ${-amp} ${len / 2} 0 t ${len / 2} 0`;
    return d + ` V 200 H 0 Z`;
  };
  return (
    <div className={`pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden ${className}`} aria-hidden>
      <svg className="animate-wave-slow block h-24 w-[200%] md:h-32" viewBox="0 0 2880 200" preserveAspectRatio="none">
        <path d={wave(18, 360, 80)} fill={color} opacity=".35" />
      </svg>
      <svg className="animate-wave absolute bottom-0 block h-16 w-[200%] md:h-24" viewBox="0 0 2880 200" preserveAspectRatio="none">
        <path d={wave(14, 240, 90)} fill={color} opacity=".55" />
      </svg>
    </div>
  );
}

function Line({ text, outline = false }: { text: string; outline?: boolean }) {
  const hasDot = text.endsWith(".");
  const body = hasDot ? text.slice(0, -1) : text;
  return (
    <span className="block overflow-hidden pb-[0.06em]">
      <motion.span
        className="block"
        initial={{ y: "105%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className={outline ? "text-outline text-white" : ""}>{body}</span>
        {hasDot && <span className="text-signal">.</span>}
      </motion.span>
    </span>
  );
}

export function Hero({ image }: { image?: string }) {
  const { t, locale } = useI18n();
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const ringY = useTransform(scrollY, [0, 800], [0, reduce ? 0 : 140]);
  const crestY = useTransform(scrollY, [0, 800], [0, reduce ? 0 : 60]);

  const featured = [
    { cat: t.news.categories.club, ...t.news.items.board, date: "18.05.2026" },
    { cat: t.news.categories.academy, ...t.news.items.fpf, date: "2024/25" },
    { cat: t.news.categories.futsal, ...t.news.items.futsal, date: "2024/25" },
  ];
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % featured.length), 6500);
    return () => window.clearInterval(id);
  }, [reduce, featured.length, active]);

  return (
    <section id="inicio" className="grain relative isolate overflow-hidden bg-night text-white">
      {/* Fundo */}
      {image ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" className="absolute inset-0 -z-20 size-full object-cover" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-night via-night/80 to-night/20" />
        </>
      ) : (
        <div className="absolute inset-0 -z-10" aria-hidden>
          <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_85%_10%,#1747c7_0%,#0b2a7a_30%,#050d22_70%)]" />
          {/* feixes de luz de estádio */}
          <div className="absolute -top-40 right-[18%] h-[140%] w-40 rotate-[24deg] bg-gradient-to-b from-white/12 to-transparent blur-2xl" />
          <div className="absolute -top-40 right-[38%] h-[140%] w-24 rotate-[14deg] bg-gradient-to-b from-white/8 to-transparent blur-2xl" />
          <motion.div style={{ y: ringY }} className="absolute -right-[22rem] top-1/2 -translate-y-1/2 md:-right-40 lg:right-[-6rem]">
            <Lifebuoy className="animate-spin-slow size-[46rem] text-white/[0.06] lg:size-[56rem]" stroke="currentColor" bands="rgba(225,29,42,.35)" />
          </motion.div>
        </div>
      )}

      <div className="container-site relative grid min-h-[min(54rem,calc(100svh-6.5rem))] grid-cols-1 items-center gap-10 pb-40 pt-14 md:pb-44 lg:grid-cols-[1.25fr_0.75fr] lg:pt-10">
        <div className="min-w-0">
          <motion.p
            className="eyebrow flex items-center gap-3 text-haze"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <span className="band" aria-hidden />
            {t.hero.kicker}
          </motion.p>
          <h1 key={locale} className="display mt-6 text-[3.4rem] leading-[0.86] sm:text-[5rem] md:text-[6.2rem] xl:text-[7.6rem]">
            <Line text={t.hero.line1} />
            <Line text={t.hero.line2} outline />
            <Line text={t.hero.line3} />
          </h1>
          <motion.p
            className="mt-7 max-w-xl text-base leading-relaxed text-white/75 md:text-lg"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {t.hero.lead}
          </motion.p>
          <motion.div className="mt-9 flex flex-wrap gap-3" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.65 }}>
            <ButtonLink href="#clube" variant="light">
              {t.hero.ctaClub}
            </ButtonLink>
            <ButtonLink href="#socios" variant="primary">
              {t.hero.ctaMember}
            </ButtonLink>
          </motion.div>
        </div>

        {!image && (
          <motion.div
            style={{ y: crestY }}
            className="relative mx-auto hidden w-full max-w-[26rem] lg:block"
            initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <div className="absolute inset-[12%] rounded-full bg-royal-bright/40 blur-3xl" aria-hidden />
            <Crest className="relative w-full drop-shadow-[0_30px_60px_rgba(0,0,0,.55)]" />
          </motion.div>
        )}
      </div>

      {/* Destaques */}
      <div className="absolute inset-x-0 bottom-0 z-10">
        <Waves color="#0b3fb0" />
        <div className="container-site relative pb-5">
          <div className="flex items-end justify-between gap-4">
            <p className="eyebrow text-white/70">{t.hero.featured}</p>
            <Ph className="hidden items-center gap-1.5 text-[0.7rem] text-white/60 md:inline-flex">
              <Camera className="size-3.5" /> {t.common.photoSlot}
            </Ph>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/10 backdrop-blur-md md:grid-cols-3">
            {featured.map((f, i) => (
              <button
                key={f.title}
                type="button"
                onClick={() => setActive(i)}
                className={`group relative min-w-0 px-5 pb-4 pt-5 text-left transition-colors ${active === i ? "bg-night/70" : "bg-night/40 hover:bg-night/60"} ${
                  active === i ? "block" : "hidden md:block"
                }`}
                aria-current={active === i}
              >
                <span className="absolute inset-x-0 top-0 h-0.5 bg-white/10">
                  {active === i && (
                    <motion.span
                      key={`${active}-${locale}`}
                      className="block h-full origin-left bg-signal"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: reduce ? 0 : 6.5, ease: "linear" }}
                    />
                  )}
                </span>
                <span className="eyebrow flex items-center gap-2 !text-[0.62rem] text-haze">
                  <span className="text-signal">{f.cat}</span> · {f.date}
                </span>
                <Ph className="mt-2 line-clamp-2 block text-[0.95rem] font-semibold leading-snug">{f.title}</Ph>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
