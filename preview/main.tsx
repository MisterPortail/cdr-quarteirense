/**
 * Pré-visualização estática (sem servidor): monta as mesmas vistas do Next.js
 * num único bundle. Navegação por hash: #area-pais, #gestao, resto = site.
 */
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import { HomePage } from "@/components/home/HomePage";
import { ParentPortal } from "@/features/fees/ParentPortal";
import { AdminDashboard } from "@/features/fees/AdminDashboard";
import { MatchesPage } from "@/components/matches/MatchesPage";

const viewFromHash = () =>
  location.hash === "#area-pais" ? "portal" : location.hash === "#gestao" ? "admin" : location.hash === "#jogos-resultados" ? "matches" : "home";

function App() {
  const [view, setView] = useState(viewFromHash);
  useEffect(() => {
    const on = () => {
      const v = viewFromHash();
      setView((prev) => {
        if (prev !== v) {
          window.scrollTo(0, 0);
          // Âncora da página inicial (ex.: #clube) vinda de outra vista: desce até à secção.
          if (v === "home" && location.hash.length > 1) setTimeout(() => document.querySelector(location.hash)?.scrollIntoView(), 80);
        }
        return v;
      });
    };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return view === "portal" ? <ParentPortal /> : view === "admin" ? <AdminDashboard /> : view === "matches" ? <MatchesPage /> : <HomePage />;
}

createRoot(document.getElementById("root")!).render(
  <LanguageProvider>
    <App />
  </LanguageProvider>,
);
