/**
 * DADOS FICTÍCIOS para a demonstração. Nomes, emails e valores são inventados
 * e não correspondem a atletas reais do clube.
 */
import { CATEGORIES, SEASON, type Athlete, type Guardian, type MonthStatus, type PaymentMethod } from "./model";

/** Data de referência da demo: hoje. A época começa em setembro. */
export function currentSeasonMonthIndex(today = new Date()) {
  const key = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  const i = (SEASON.months as readonly string[]).indexOf(key);
  if (i === -1) return today < new Date(`${SEASON.months[0]}-01`) ? -1 : SEASON.months.length - 1;
  return i;
}

function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

const FIRST_M = ["Tomás", "Rodrigo", "Martim", "Afonso", "Duarte", "Santiago", "Gonçalo", "Lourenço", "Diogo", "Gabriel", "Rafael", "Miguel", "Tiago", "Salvador", "Vicente", "Guilherme", "Dinis", "Simão"];
const FIRST_F = ["Leonor", "Matilde", "Beatriz", "Carolina", "Inês", "Mariana", "Benedita", "Margarida"];
const LAST = ["Ribeiro", "Martins", "Sousa", "Guerreiro", "Pires", "Cavaco", "Viegas", "Correia", "Mendes", "Rosa", "Pereira", "Gomes", "Neto", "Brito", "Faria", "Coelho", "Bárbara", "Santos", "Pinto", "Dias"];
const GUARD = ["Ana", "Rui", "Sónia", "Paulo", "Cláudia", "Nuno", "Sandra", "Hugo", "Patrícia", "Bruno", "Vera", "Ricardo", "Marta", "Pedro", "Catarina", "Luís"];
const METHODS: PaymentMethod[] = ["mbway", "mbway", "mbway", "multibanco", "card", "cash", "transfer"];

export type DemoData = { guardians: Guardian[]; athletes: Athlete[]; demoGuardianId: string };

export function createDemoData(today = new Date()): DemoData {
  const r = rng(1937);
  const pick = <T,>(arr: readonly T[]) => arr[Math.floor(r() * arr.length)];
  const cur = currentSeasonMonthIndex(today);
  const pastDue = today.getDate() > SEASON.dueDay;
  const guardians: Guardian[] = [];
  const athletes: Athlete[] = [];

  const monthsFor = (profile: "ok" | "late1" | "late2" | "season"): MonthStatus[] =>
    SEASON.months.map((_, i) => {
      if (profile === "season") return "paid";
      if (i > cur) return "upcoming";
      const isCurrent = i === cur;
      const unpaid = profile === "late1" ? i === cur - (pastDue ? 0 : 1) : profile === "late2" ? i >= cur - 1 - (pastDue ? 0 : 1) : false;
      if (!unpaid) return isCurrent && !pastDue && profile === "ok" && r() < 0.35 ? "due" : "paid";
      return isCurrent && !pastDue ? "due" : "overdue";
    });

  const addAthlete = (a: Omit<Athlete, "payments">) => {
    const payments = a.months
      .map((m, i) => (m === "paid" ? { monthIndex: i, method: pick(METHODS), date: `${SEASON.months[Math.min(i, Math.max(cur, 0))]}-0${1 + Math.floor(r() * 8)}` } : null))
      .filter(Boolean) as Athlete["payments"];
    athletes.push({ ...a, payments });
  };

  // Família de demonstração (a que entra no Espaço Pais)
  guardians.push({ id: "g-demo", name: "Ana Ribeiro", email: "ana.ribeiro@exemplo.pt", phone: "912 345 678" });
  addAthlete({
    id: "a-demo-1",
    firstName: "Tomás",
    lastName: "Ribeiro",
    birthYear: 2016,
    categoryId: "sub11",
    guardianId: "g-demo",
    licence: { status: "valid", number: "AFA-2026-04812", validUntil: "2027-06-30" },
    medicalUntil: "2026-12-15",
    registrationPaid: true,
    months: monthsFor("late1"),
    photoConsent: true,
  });
  addAthlete({
    id: "a-demo-2",
    firstName: "Leonor",
    lastName: "Ribeiro",
    birthYear: 2012,
    categoryId: "sub15",
    guardianId: "g-demo",
    licence: { status: "pending", number: null, validUntil: null },
    medicalUntil: "2027-09-01",
    registrationPaid: true,
    months: monthsFor("ok"),
    photoConsent: false,
  });

  let n = 0;
  for (const cat of CATEGORIES) {
    const count = 7 + Math.floor(r() * 5);
    for (let k = 0; k < count; k++) {
      const gid = `g${++n}`;
      const last = pick(LAST);
      guardians.push({ id: gid, name: `${pick(GUARD)} ${last}`, email: `encarregado${n}@exemplo.pt`, phone: `91${Math.floor(1000000 + r() * 8999999)}` });
      const x = r();
      const profile = x < 0.66 ? "ok" : x < 0.82 ? "late1" : x < 0.92 ? "late2" : "season";
      const girl = r() < 0.2;
      const lic = r();
      const baseAge = Number(cat.age.replace("Sub-", ""));
      addAthlete({
        id: `a${n}`,
        firstName: girl ? pick(FIRST_F) : pick(FIRST_M),
        lastName: last,
        birthYear: 2026 - baseAge + 1 + Math.floor(r() * 2),
        categoryId: cat.id,
        guardianId: gid,
        licence: lic < 0.85 ? { status: "valid", number: `AFA-2026-0${4000 + n * 7}`, validUntil: "2027-06-30" } : lic < 0.96 ? { status: "pending", number: null, validUntil: null } : { status: "expired", number: `AFA-2025-0${3000 + n}`, validUntil: "2026-06-30" },
        medicalUntil: r() < 0.9 ? "2027-08-31" : "2026-11-30",
        registrationPaid: profile === "late2" ? r() < 0.5 : true,
        months: monthsFor(profile),
        photoConsent: r() < 0.8,
      });
    }
  }
  return { guardians, athletes, demoGuardianId: "g-demo" };
}
