import type { Metadata, Viewport } from "next";
import { Archivo, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import { club } from "@/content/club";
import "./globals.css";

const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });
const instrument = Instrument_Sans({ subsets: ["latin"], variable: "--font-instrument", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.cdrquarteirense.com"),
  title: { default: "CDR Quarteirense · Site oficial", template: "%s · CDR Quarteirense" },
  description:
    "Clube Desportivo e Recreativo Quarteirense. Desde 1937, o clube de Quarteira: futebol, futsal, formação e comunidade no Algarve.",
  icons: { icon: "/brand/crest.png" },
  openGraph: { type: "website", locale: "pt_PT", alternateLocale: ["en_GB", "fr_FR"], siteName: "CDR Quarteirense", images: ["/brand/crest.png"] },
  alternates: { languages: { "pt-PT": "/", en: "/en", fr: "/fr" } },
};

export const viewport: Viewport = { themeColor: "#050d22", width: "device-width", initialScale: 1, viewportFit: "cover" };

/** Dados estruturados para o Google (SEO local). */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsOrganization",
  name: club.name,
  alternateName: club.shortName,
  sport: ["Football", "Futsal"],
  foundingDate: club.founded.date,
  url: "https://www.cdrquarteirense.com",
  logo: "https://www.cdrquarteirense.com/brand/crest.png",
  email: club.contacts.email,
  telephone: club.contacts.phoneHref,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rua Patrão Lopes, 33-A",
    postalCode: "8125-241",
    addressLocality: "Quarteira",
    addressRegion: "Faro",
    addressCountry: "PT",
  },
  sameAs: club.social.map((s) => s.href),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-PT" className={`${archivo.variable} ${instrument.variable} ${mono.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
