/**
 * Modelo de quotas / mensalidades da formação (espelha o esquema Supabase em
 * supabase/migrations/0001_fees.sql). Na demo, os dados vêm de demo-data.ts.
 */

export type MonthStatus = "paid" | "overdue" | "due" | "upcoming" | "exempt";
export type LicenceStatus = "valid" | "pending" | "expired";
export type PaymentMethod = "mbway" | "multibanco" | "card" | "cash" | "transfer";

export type Guardian = { id: string; name: string; email: string; phone: string };

export type Athlete = {
  id: string;
  firstName: string;
  lastName: string;
  birthYear: number;
  categoryId: string;
  guardianId: string;
  licence: { status: LicenceStatus; number: string | null; validUntil: string | null };
  medicalUntil: string | null;
  registrationPaid: boolean;
  /** Estado de cada mensalidade da época (índice = mês da época, 0 = setembro). */
  months: MonthStatus[];
  payments: { monthIndex: number; method: PaymentMethod; date: string }[];
  photoConsent: boolean;
};

export type Category = { id: string; name: string; age: string; monthlyFee: number };

export const SEASON = {
  label: "2026/27",
  /** setembro 2026 → junho 2027 */
  months: ["2026-09", "2026-10", "2026-11", "2026-12", "2027-01", "2027-02", "2027-03", "2027-04", "2027-05", "2027-06"],
  dueDay: 8,
  registrationFee: 60,
  /** Pagamento da época completa: 1 mês oferecido (valor de exemplo). */
  fullSeasonFreeMonths: 1,
} as const;

export const CATEGORIES: Category[] = [
  { id: "sub7", name: "Petizes", age: "Sub-7", monthlyFee: 20 },
  { id: "sub9", name: "Traquinas", age: "Sub-9", monthlyFee: 20 },
  { id: "sub11", name: "Benjamins", age: "Sub-11", monthlyFee: 25 },
  { id: "sub13", name: "Infantis", age: "Sub-13", monthlyFee: 25 },
  { id: "sub15", name: "Iniciados", age: "Sub-15", monthlyFee: 30 },
  { id: "sub17", name: "Juvenis", age: "Sub-17", monthlyFee: 30 },
  { id: "sub19", name: "Juniores", age: "Sub-19", monthlyFee: 30 },
];

export const categoryById = (id: string) => CATEGORIES.find((c) => c.id === id)!;

export const eur = (v: number, locale = "pt-PT") =>
  new Intl.NumberFormat(locale, { style: "currency", currency: "EUR", minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(v);

/** Valor em dívida de um atleta (mensalidades vencidas + inscrição). */
export function balance(a: Athlete) {
  const fee = categoryById(a.categoryId).monthlyFee;
  const overdue = a.months.filter((m) => m === "overdue").length;
  const due = a.months.filter((m) => m === "due").length;
  return { overdueMonths: overdue, dueMonths: due, amount: (overdue + due) * fee + (a.registrationPaid ? 0 : SEASON.registrationFee) };
}

export type Standing = "ok" | "late1" | "late2" | "season";
export function standing(a: Athlete): Standing {
  if (a.months.every((m) => m === "paid" || m === "exempt")) return "season";
  const n = a.months.filter((m) => m === "overdue").length;
  if (n === 0) return "ok";
  return n === 1 ? "late1" : "late2";
}
