"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useI18n } from "@/i18n/LanguageProvider";
import { asset } from "@/components/ui";

/**
 * Animação cinematográfica de entrada (10 s). Mostrada uma vez por sessão,
 * nunca a quem pede "reduzir movimento". Sem som por defeito (os navegadores
 * bloqueiam o som automático); o visitante pode ativá-lo ou saltar.
 * Para rever: window.dispatchEvent(new Event("cdr:intro")).
 */
const KEY = "cdr-intro-seen";
const L = {
  pt: { skip: "Entrar no site", soundOn: "Ativar som", soundOff: "Desativar som", label: "Animação de entrada do CDR Quarteirense" },
  en: { skip: "Enter the site", soundOn: "Turn sound on", soundOff: "Turn sound off", label: "CDR Quarteirense intro animation" },
  fr: { skip: "Entrer sur le site", soundOn: "Activer le son", soundOff: "Couper le son", label: "Animation d'ouverture du CDR Quarteirense" },
} as const;

export function Intro() {
  const { locale } = useI18n();
  const t = L[locale as keyof typeof L] ?? L.pt;
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return true;
    try {
      if (sessionStorage.getItem(KEY) === "1") return false;
    } catch {}
    return !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  });
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const video = useRef<HTMLVideoElement>(null);

  const close = useCallback(() => {
    setShow(false);
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {}
  }, []);

  // Decide no cliente se a intro deve ser mostrada
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(KEY) === "1";
    } catch {}
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduced) setShow(false);
    const replay = () => {
      setProgress(0);
      setShow(true);
    };
    window.addEventListener("cdr:intro", replay);
    return () => window.removeEventListener("cdr:intro", replay);
  }, []);

  // Bloqueia o scroll, tecla Esc para saltar, arranque do vídeo
  useEffect(() => {
    if (!show) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    const v = video.current;
    if (v) {
      v.currentTime = 0;
      v.play().catch(() => close()); // autoplay recusado (ex.: modo poupança no iPhone): entra direto
    }
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [show, close]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          role="dialog"
          aria-modal="true"
          aria-label={t.label}
          className="fixed inset-0 z-[200] transition-colors duration-700"
          style={{ backgroundColor: progress > 0.55 ? "#02387e" : "#050d22" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04, filter: "blur(6px)" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <video
            ref={video}
            className="absolute inset-0 size-full object-contain landscape:object-cover"
            poster={asset("/brand/intro-poster.jpg")}
            muted={muted}
            playsInline
            autoPlay
            preload="auto"
            onError={close}
            onEnded={() => window.setTimeout(close, 500)}
            onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime / (e.currentTarget.duration || 10))}
          >
            <source src={asset("/brand/intro.mp4")} type="video/mp4" />
            <source src={asset("/brand/intro.webm")} type="video/webm" />
          </video>

          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-[max(1.25rem,env(safe-area-inset-bottom,0px))] md:p-8">
            <button
              type="button"
              onClick={() => {
                const v = video.current;
                if (v) v.muted = !muted;
                setMuted(!muted);
              }}
              aria-label={muted ? t.soundOn : t.soundOff}
              className="grid size-11 place-items-center rounded-full bg-black/35 text-white ring-1 ring-white/25 backdrop-blur transition-colors hover:bg-black/55"
            >
              {muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
            </button>
            <button
              type="button"
              onClick={close}
              className="relative overflow-hidden rounded-full bg-black/35 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/25 backdrop-blur transition-colors hover:bg-white hover:text-night"
            >
              <span className="absolute inset-y-0 left-0 bg-white/15" style={{ width: `${progress * 100}%` }} aria-hidden />
              <span className="relative">{t.skip} →</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
