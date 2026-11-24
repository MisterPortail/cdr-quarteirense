import type { Metadata } from "next";
import { ParentPortal } from "@/features/fees/ParentPortal";

export const metadata: Metadata = { title: "Espaço Pais e Atletas", robots: { index: false } };

export default function Page() {
  return <ParentPortal />;
}
