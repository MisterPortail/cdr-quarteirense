/**
 * Dados institucionais do CDR Quarteirense.
 *
 * Regra do projeto: nada de informação oficial inventada.
 *  - `verified`  → retirado de fonte pública do clube (cdrquarteirense.com, Historial.pdf…)
 *  - `toConfirm` → fonte secundária (ex.: Wikipédia) — a validar pela Direção
 *  - `placeholder` → conteúdo temporário, a substituir
 *
 * Numa fase seguinte, estes dados passam para a base de dados (Supabase) e
 * passam a ser editados no back-office.
 */

export type Status = "verified" | "toConfirm" | "placeholder";

export const club = {
  name: "Clube Desportivo e Recreativo Quarteirense",
  shortName: "CDR Quarteirense",
  founded: { date: "1937-01-02", status: "verified" as Status },
  city: "Quarteira",
  region: "Algarve",
  contacts: {
    address: ["Rua Patrão Lopes, nº 33-A", "8125-241 Quarteira", "Algarve · Portugal"],
    phone: "289 314 954",
    phoneHref: "+351289314954",
    email: "info@cdrquarteirense.com",
    status: "verified" as Status,
  },
  social: [
    { id: "facebook", label: "Facebook", href: "https://www.facebook.com/cdrquarteirenseoficial" },
    { id: "instagram", label: "Instagram", href: "https://www.instagram.com/cdrquarteirense/" },
    { id: "x", label: "X (Twitter)", href: "https://twitter.com/CdrQuarteirense" },
  ],
  /** Números do Historial do clube (data de referência a confirmar). */
  figures: {
    founded: 1937,
    members: 1455,
    federatedAthletes: 311,
    disciplines: 7,
    fpfStars: 4,
  },
  legacySite: "https://www.cdrquarteirense.com",
  documents: {
    statutes: "https://www.cdrquarteirense.com/files/CDRQUARTEIRENSE-Estatutosfinal-17_03_2022.pdf",
    documentsPage: "https://www.cdrquarteirense.com/Documentos.html",
    governingBodies: "https://www.cdrquarteirense.com/Clube.html",
  },
} as const;

/** Escalões de formação — nomenclatura habitual FPF; lista real a confirmar pelo clube. */
export const youthCategories = [
  { id: "sub7", name: "Petizes", age: "Sub-7" },
  { id: "sub9", name: "Traquinas", age: "Sub-9" },
  { id: "sub11", name: "Benjamins", age: "Sub-11" },
  { id: "sub13", name: "Infantis", age: "Sub-13" },
  { id: "sub15", name: "Iniciados", age: "Sub-15" },
  { id: "sub17", name: "Juvenis", age: "Sub-17" },
  { id: "sub19", name: "Juniores", age: "Sub-19" },
] as const;
