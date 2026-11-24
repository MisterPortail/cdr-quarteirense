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

const viewFromHash = () => (location.hash === "#area-pais" ? "portal" : location.hash === "#gestao" ? "admin" : "home");

function App() {
  const [view, setView] = useState(viewFromHash);
  useEffect(() => {
    const on = () => {
      const v = viewFromHash();
      setView((prev) => {
        if (prev !== v) window.scrollTo(0, 0);
        return v;
      });
    };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return view === "portal" ? <ParentPortal /> : view === "admin" ? <AdminDashboard /> : <HomePage />;
}

createRoot(document.getElementById("root")!).render(
  <LanguageProvider>
    <App />
  </LanguageProvider>,
);
