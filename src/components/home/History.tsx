"use client";

import { useRef, type PointerEvent } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MoveHorizontal, Trophy } from "lucide-react";
import { trophyTexts } from "@/i18n/trophies";
import { useI18n } from "@/i18n/LanguageProvider";
import { BoatMark, Ph, SectionHeading } from "@/components/ui";
import { Waves } from "./Hero";

export function History() {
  const { t, locale } = useI18n();
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number } | null>(null);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start end", "end start"] });
  const bigX = useTransform(scrollYProgress, [0, 1], ["8%", "-18%"]);

  const onDown = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" || !track.current) return;
    drag.current = { x: e.clientX, left: track.current.scrollLeft };
  };
  const onMove = (e: PointerEvent) => {
    if (!drag.current || !track.current) return;
    track.current.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
  };
  const onUp = () => (drag.current = null);

  return (
    <section id="clube" ref={section} className="grain relative isolate overflow-hidden bg-abyss py-20 text-white md:py-28">
      <motion.span
        style={{ x: bigX }}
        className="display text-outline pointer-events-none absolute -z-10 top-10 whitespace-nowrap text-[14rem] text-white/[0.07] md:text-[24rem]"
        aria-hidden
      >
        1937 · Quarteira
      </motion.span>
      <BoatMark className="pointer-events-none absolute -bottom-6 right-[-4rem] -z-10 w-[28rem] text-royal/40 md:w-[40rem]" />

      <div className="container-site">
        <SectionHeading eyebrow={t.history.eyebrow} title={t.history.title} lead={t.history.lead} dark>
          <div className="flex flex-wrap items-center gap-4">
            <span className="eyebrow inline-flex items-center gap-2 text-haze">
              <MoveHorizontal className="size-4" /> {t.history.drag}
            </span>
            <a href="#trofeus" className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/15 hover:bg-white/20">
              <Trophy className="size-4 text-amber-300" /> {trophyTexts[locale].eyebrow}
            </a>
          </div>
        </SectionHeading>
      </div>

      <div
        ref={track}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
        className="no-scrollbar relative mt-14 cursor-grab overflow-x-auto pb-24 active:cursor-grabbing"
      >
        <ol className="relative flex w-max gap-0 pl-4 md:pl-[max(2rem,calc((100vw_-_88rem)/2_+_2rem))] pr-16">
          <span className="absolute left-0 right-0 top-[3.1rem] h-px bg-gradient-to-r from-white/0 via-white/30 to-white/0" aria-hidden />
          {t.history.events.map((ev, i) => {
            const body = (
              <>
                <span className="display block text-5xl text-white md:text-6xl">{ev.year}</span>
                <span className={`relative z-10 mt-3 block size-3 rounded-full ring-4 ring-abyss ${i === 0 ? "bg-signal" : "bg-white"}`} aria-hidden />
                <h3 className="mt-6 text-lg font-semibold">{ev.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-haze">{ev.text}</p>
                {"confirm" in ev && ev.confirm && (
                  <span className="eyebrow mt-3 inline-block rounded-full bg-signal/15 px-2 py-1 !text-[0.58rem] text-[#ff8a92]">{t.history.toConfirm}</span>
                )}
              </>
            );
            return (
              <li key={ev.year} className="w-[16rem] shrink-0 select-none pr-10 md:w-[19rem]">
                {"confirm" in ev && ev.confirm ? <Ph as="div">{body}</Ph> : body}
              </li>
            );
          })}
        </ol>
      </div>
      <Waves color="#0b3fb0" className="opacity-60" />
    </section>
  );
}
