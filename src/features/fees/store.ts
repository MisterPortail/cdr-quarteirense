"use client";

/**
 * Estado partilhado da DEMO (em memória). Pagar no Espaço Pais atualiza
 * imediatamente o painel de gestão, como acontecerá com a base de dados real
 * (webhook do prestador de pagamentos → tabela `payments`).
 */
import { useSyncExternalStore } from "react";
import { createDemoData, type DemoData } from "./demo-data";
import type { PaymentMethod } from "./model";

export type OutboxItem = {
  id: string;
  guardianId: string;
  athleteIds: string[];
  channel: "email" | "sms";
  to: string;
  subject: string;
  body: string;
  status: "queued" | "sent";
  at: string;
  auto?: boolean;
};

type State = DemoData & { reminders: Record<string, string>; outbox: OutboxItem[]; adminAuthed: boolean; version: number };

let state: State = { ...createDemoData(), reminders: {}, outbox: [], adminAuthed: false, version: 0 };
const listeners = new Set<() => void>();
const emit = () => {
  state = { ...state, version: state.version + 1 };
  listeners.forEach((l) => l());
};

export const feesStore = {
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  get: () => state,

  /** Regista o pagamento de mensalidades (e, opcionalmente, da inscrição). */
  pay(items: { athleteId: string; monthIndexes: number[]; registration?: boolean }[], method: PaymentMethod) {
    const today = new Date().toISOString().slice(0, 10);
    state.athletes = state.athletes.map((a) => {
      const it = items.find((i) => i.athleteId === a.id);
      if (!it) return a;
      return {
        ...a,
        registrationPaid: a.registrationPaid || !!it.registration,
        months: a.months.map((m, i) => (it.monthIndexes.includes(i) ? "paid" : m)),
        payments: [...a.payments, ...it.monthIndexes.map((monthIndex) => ({ monthIndex, method, date: today }))],
      };
    });
    emit();
  },

  /** Coloca lembretes na fila de envio; passam a "enviado" pouco depois (simulação do serviço de email/SMS). */
  queueReminders(items: Omit<OutboxItem, "id" | "status" | "at">[]) {
    const now = new Date().toISOString();
    const created = items.map((it, k) => ({ ...it, id: `m${Date.now()}-${k}`, status: "queued" as const, at: now }));
    state.outbox = [...created, ...state.outbox];
    state.reminders = { ...state.reminders, ...Object.fromEntries(items.flatMap((i) => i.athleteIds.map((a) => [a, now]))) };
    emit();
    created.forEach((c, k) =>
      window.setTimeout(() => {
        state.outbox = state.outbox.map((o) => (o.id === c.id ? { ...o, status: "sent" } : o));
        emit();
      }, 900 + k * 120),
    );
  },

  login(id: string, password: string) {
    // DEMO: credenciais fixas e visíveis. Em produção: Supabase Auth + papel "treasurer"/"admin" + 2FA.
    const ok = id.trim().toLowerCase() === "admin" && password === "123456789";
    if (ok) {
      state.adminAuthed = true;
      emit();
    }
    return ok;
  },
  logout() {
    state.adminAuthed = false;
    emit();
  },

  setPhotoConsent(athleteId: string, v: boolean) {
    state.athletes = state.athletes.map((a) => (a.id === athleteId ? { ...a, photoConsent: v } : a));
    emit();
  },

  reset() {
    state = { ...createDemoData(), reminders: {}, outbox: [], adminAuthed: state.adminAuthed, version: state.version + 1 };
    listeners.forEach((l) => l());
  },
};

export function useFees() {
  return useSyncExternalStore(feesStore.subscribe, feesStore.get, feesStore.get);
}
