"use client";

import { Header } from "./Header";
import { Hero } from "./Hero";
import { MatchCenter, Ticker } from "./MatchCenter";
import { News } from "./News";
import { Stats, Teams } from "./Teams";
import { Academy } from "./Academy";
import { History } from "./History";
import { TrophyRoom } from "./TrophyRoom";
import { Membership, Partners, Shop } from "./Membership";
import { Footer, ReviewToggle } from "./Footer";
import { Intro } from "./Intro";

/**
 * Página inicial — ordem das secções pensada para os vários públicos:
 * adeptos (jogos, notícias) → famílias (equipas, formação) → identidade
 * (história) → envolvimento (sócios, loja) → empresas (parceiros).
 */
export function HomePage({ heroImage }: { heroImage?: string }) {
  return (
    <>
      <Intro />
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-ink">
        Saltar para o conteúdo
      </a>
      <Header />
      <main id="conteudo">
        <Hero image={heroImage} />
        <Ticker />
        <MatchCenter />
        <News />
        <Stats />
        <Teams />
        <Academy />
        <History />
        <TrophyRoom />
        <Membership />
        <Shop />
        <Partners />
      </main>
      <Footer />
      <ReviewToggle />
    </>
  );
}
