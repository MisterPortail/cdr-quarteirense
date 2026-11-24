import type { Metadata } from "next";
import { AdminDashboard } from "@/features/fees/AdminDashboard";

export const metadata: Metadata = { title: "Gestão de quotas", robots: { index: false, follow: false } };

/** Na versão real: protegido por middleware (sessão Supabase + papel tesoureiro/direção). */
export default function Page() {
  return <AdminDashboard />;
}
