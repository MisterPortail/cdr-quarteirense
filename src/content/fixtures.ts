/**
 * JOGOS 2026/27 — DADOS REAIS lidos em fontes públicas da AF Algarve a 24/11/2026.
 *
 * - Calendários: Comunicados Oficiais n.º 11 (Liga 1 Sénior) e n.º 14 (Liga 1 Iniciados).
 * - Mapas semanais "Jogos no Algarve" (20–26/11, 27/11–03/12, 04–10/12/2026), que
 *   incluem as alterações de data/hora. Prevalecem sobre o calendário inicial.
 * - Resultados e classificações: lidos à mão no Centro de Resultados da FPF
 *   (resultados.fpf.pt) a 24/11/2026, num navegador normal. O portal protege-se
 *   contra leitura automática (Cloudflare) e "os resultados só se tornam
 *   oficiais quinze dias após cada encontro". Escalões sem resultado publicado
 *   ficam vazios: nada é inventado.
 *
 * Atenção: "Quarteira SC" e "Quarteira FC" (futsal) são outros clubes.
 */
import type { Fixture, Source, Team } from "./fixtures-model";

export const SCAN_DATE = "2026-11-24";

const CO11: Source = { label: "AF Algarve · C.O. n.º 11 (02/09/2026)", url: "https://afalgarve.pt/wp-content/uploads/2026/09/CO11.pdf", checked: SCAN_DATE };
const CO14: Source = { label: "AF Algarve · C.O. n.º 14 (02/09/2026)", url: "https://afalgarve.pt/wp-content/uploads/2026/09/CO14.pdf", checked: SCAN_DATE };
const W47: Source = { label: "AF Algarve · Jogos 20–26/11/2026", url: "https://afalgarve.pt/wp-content/uploads/2026/10/Jogos-20-26-nov-4.pdf", checked: SCAN_DATE };
const W48: Source = { label: "AF Algarve · Jogos 27/11–03/12/2026", url: "https://afalgarve.pt/wp-content/uploads/2026/11/Jogos-27nov-03dez-1.pdf", checked: SCAN_DATE };
const W49: Source = { label: "AF Algarve · Jogos 04–10/12/2026", url: "https://afalgarve.pt/wp-content/uploads/2026/11/Jogos-04-10-dez-1.pdf", checked: SCAN_DATE };
const FPF_L1: Source = { label: "FPF · Centro de Resultados · Liga 1 Algarve Futebol", url: "https://resultados.fpf.pt/Competition/Details?competitionId=29801&seasonId=106", checked: SCAN_DATE };
const FPF_INI: Source = { label: "FPF · Centro de Resultados · Liga 1 Iniciados", url: "https://resultados.fpf.pt/Competition/Details?competitionId=29813&seasonId=106", checked: SCAN_DATE };
const FPF_JUV: Source = { label: "FPF · Centro de Resultados · Liga 2 Juvenis", url: "https://resultados.fpf.pt/Competition/Details?competitionId=30092&seasonId=106", checked: SCAN_DATE };
const FPF_INI3: Source = { label: "FPF · Centro de Resultados · Liga 3 Iniciados", url: "https://resultados.fpf.pt/Competition/Details?competitionId=30094&seasonId=106", checked: SCAN_DATE };
const FPF_SUB13: Source = { label: "FPF · Centro de Resultados · Infantis Sub-13", url: "https://resultados.fpf.pt/Competition/Details?competitionId=30223&seasonId=106", checked: SCAN_DATE };
const FPF_F9: Source = { label: "FPF · Centro de Resultados · Futebol 9 Infantis", url: "https://resultados.fpf.pt/Competition/Details?competitionId=30218&seasonId=106", checked: SCAN_DATE };
const FPF_WF: Source = { label: "FPF · Centro de Resultados · Walking Football", url: "https://resultados.fpf.pt/Competition/Details?competitionId=30842&seasonId=106", checked: SCAN_DATE };
const W50: Source = { label: "AF Algarve · Jogos 11–17/12/2026", url: "https://afalgarve.pt/wp-content/uploads/2026/11/Jogos-11-17-dez-2.pdf", checked: SCAN_DATE };
const CO43: Source = { label: "AF Algarve · C.O. n.º 43 (13/10/2026)", url: "https://afalgarve.pt/wp-content/uploads/2026/10/co-43.pdf", checked: SCAN_DATE };
const CO45: Source = { label: "AF Algarve · C.O. n.º 45 (13/10/2026)", url: "https://afalgarve.pt/wp-content/uploads/2026/10/co45.pdf", checked: SCAN_DATE };
const WEEKLY = { label: "AF Algarve · Jogos no Algarve", url: "https://afalgarve.pt/competicoes/jogos-no-algarve/" };
const FPF = { label: "Resultados e Classificações AF Algarve (FPF)", url: "https://resultados.fpf.pt/Competition/GetCompetitionsByAssociation?associationId=224&seasonId=106" };

/** Campo da casa: "CM Quarteira Nº 2" (relvado sintético). */
const HOME_VENUE = "Estádio Municipal de Quarteira · Campo n.º 2";
const HOME_MAP = "Estádio Municipal de Quarteira, Quarteira";

const h = (date: string, opponent: string, source: Source, extra: Partial<Fixture> = {}): Fixture => ({
  date,
  home: true,
  opponent,
  venue: HOME_VENUE,
  mapQuery: HOME_MAP,
  source,
  ...extra,
});
const a = (date: string, opponent: string, venue: string, source: Source, extra: Partial<Fixture> = {}): Fixture => ({
  date,
  home: false,
  opponent,
  venue,
  mapQuery: venue,
  source,
  ...extra,
});

/* ---------- Seniores · Liga 1 Algarve Futebol (C.O. 11, todos às 15:00) ---------- */
const L1 = "Liga 1 Algarve Futebol";
const sr = (j: number) => ({ competition: L1, round: `${j}.ª jornada` });
const seniors: Fixture[] = [
  a("2026-09-19T15:00", "Silves FC", "Estádio Dr. Francisco Vieira, Silves", FPF_L1, { ...sr(1), score: { us: 1, them: 5 } }),
  h("2026-10-03T15:00", "SC Olhanense", FPF_L1, { ...sr(2), score: { us: 1, them: 7 } }),
  h("2026-10-10T15:00", "Portimonense SC", FPF_L1, { ...sr(3), score: { us: 0, them: 4 } }),
  a("2026-10-17T15:00", "CD Odiáxere", "Campo das Eiras, Odeáxere", FPF_L1, { ...sr(4), score: { us: 1, them: 3 } }),
  h("2026-10-24T15:00", "LGC Moncarapachense", FPF_L1, { ...sr(5), score: { us: 0, them: 4 } }),
  a("2026-10-31T15:00", "Louletano DC", "Campo Municipal n.º 2, Loulé", FPF_L1, { ...sr(6), score: { us: 0, them: 3 } }),
  h("2026-11-07T15:00", "FC Ferreiras", FPF_L1, { ...sr(7), score: { us: 3, them: 6 } }),
  a("2026-11-14T15:00", "Carvoeiro United", "Parque Desportivo Municipal de Estombar", FPF_L1, { ...sr(8), score: { us: 1, them: 0 } }),
  h("2026-11-28T15:00", "Lusitano FC", W48, sr(9)),
  a("2026-12-05T15:00", "CF Os Armacenenses", "Estádio Municipal de Armação de Pêra", W49, sr(10)),
  h("2026-12-12T15:00", "CF Esperança Lagos", CO11, sr(11)),
  h("2026-12-19T15:00", "Silves FC", CO11, sr(12)),
  a("2027-01-09T15:00", "SC Olhanense", "Olhão", CO11, sr(13)),
  a("2027-01-16T15:00", "Portimonense SC", "Portimão", CO11, sr(14)),
  h("2027-01-23T15:00", "CD Odiáxere", CO11, sr(15)),
  a("2027-01-30T15:00", "LGC Moncarapachense", "Moncarapacho", CO11, sr(16)),
  h("2027-02-06T15:00", "Louletano DC", CO11, sr(17)),
  a("2027-02-13T15:00", "FC Ferreiras", "Ferreiras", CO11, sr(18)),
  h("2027-02-20T15:00", "Carvoeiro United", CO11, sr(19)),
  a("2027-02-27T15:00", "Lusitano FC", "Vila Real de Santo António", CO11, sr(20)),
  h("2027-03-06T15:00", "CF Os Armacenenses", CO11, sr(21)),
  a("2027-03-13T15:00", "CF Esperança Lagos", "Lagos", CO11, sr(22)),
];

/* ---------- Iniciados Sub-15 · Liga 1 Algarve Futebol Iniciados (C.O. 14, 11:00 salvo indicação) ---------- */
const LI = "Liga 1 Algarve Futebol Iniciados";
const ini = (j: number) => ({ competition: LI, round: `${j}.ª jornada` });
const iniciados: Fixture[] = [
  h("2026-09-27T11:00", "AA Belavista", FPF_INI, { ...ini(1), score: { us: 4, them: 0 } }),
  a("2026-10-04T11:00", "Louletano DC", "Campo Municipal n.º 2, Loulé", FPF_INI, { ...ini(2), score: { us: 1, them: 2 } }),
  h("2026-10-11T11:00", "SC Farense", FPF_INI, { ...ini(3), score: { us: 1, them: 0 } }),
  a("2026-10-18T11:00", "Imortal DC", "Campo da Palmeira n.º 2, Albufeira", FPF_INI, { ...ini(4), score: { us: 2, them: 1 } }),
  h("2026-10-25T11:00", "Silves FC", FPF_INI, { ...ini(5), score: { us: 3, them: 0 } }),
  a("2026-11-01T11:00", "AEF Faro", "Campo da Horta da Areia, Faro", FPF_INI, { ...ini(6), score: { us: 2, them: 2 } }),
  h("2026-11-08T11:00", "GC Tavira", FPF_INI, { ...ini(7), score: { us: 4, them: 1 } }),
  h("2026-11-22T11:00", "CD Montenegro", FPF_INI, { ...ini(9), score: { us: 1, them: 1 } }),
  a("2026-11-25T20:30", "Portimonense SC", "Campo Major David Neto n.º 2, Portimão", FPF_INI, { ...ini(8), round: "8.ª jornada (adiado de 15/11)" }),
  h("2026-11-29T11:00", "JS Campinense", W48, ini(10)),
  a("2026-12-06T11:00", "FC Ferreiras", "Estádio da Nora n.º 2, Ferreiras", W49, ini(11)),
  a("2026-12-13T11:00", "AA Belavista", "Parchal, Lagoa", CO14, ini(12)),
  h("2026-12-20T11:00", "Louletano DC", CO14, ini(13)),
  a("2027-01-10T11:00", "SC Farense", "Complexo da Penha, Faro", CO14, ini(14)),
  h("2027-01-17T11:00", "Imortal DC", CO14, ini(15)),
  a("2027-01-24T11:00", "Silves FC", "Silves", CO14, ini(16)),
  h("2027-01-31T11:00", "AEF Faro", CO14, ini(17)),
  a("2027-02-07T11:00", "GC Tavira", "Tavira", CO14, ini(18)),
  h("2027-02-14T11:00", "Portimonense SC", CO14, ini(19)),
  a("2027-02-21T11:00", "CD Montenegro", "Campo da Horta da Areia, Faro", CO14, ini(20)),
  a("2027-02-28T11:00", "JS Campinense", "Loulé", CO14, ini(21)),
  h("2027-03-07T11:00", "FC Ferreiras", CO14, ini(22)),
];

const c = (competition: string) => ({ competition });

export const teams: Team[] = [
  {
    id: "seniores",
    discipline: "futebol",
    name: "Seniores",
    competition: L1,
    confirmed: true,
    confirmedBy: CO11,
    fixtures: seniors,
    table: {
      source: FPF_L1,
      rows: [
        { pos: 1, team: "SC Olhanense", p: 8, w: 7, d: 0, l: 1, gf: 27, ga: 4, pts: 21 },
        { pos: 2, team: "LGC Moncarapachense", p: 8, w: 6, d: 1, l: 1, gf: 23, ga: 4, pts: 19 },
        { pos: 3, team: "FC Ferreiras", p: 8, w: 5, d: 2, l: 1, gf: 21, ga: 11, pts: 17 },
        { pos: 4, team: "CF Esperança Lagos", p: 8, w: 5, d: 1, l: 2, gf: 16, ga: 7, pts: 16 },
        { pos: 5, team: "CD Odiáxere", p: 8, w: 4, d: 1, l: 3, gf: 12, ga: 13, pts: 13 },
        { pos: 6, team: "Portimonense SC", p: 8, w: 3, d: 3, l: 2, gf: 19, ga: 16, pts: 12 },
        { pos: 7, team: "Silves FC", p: 8, w: 2, d: 3, l: 3, gf: 14, ga: 17, pts: 9 },
        { pos: 8, team: "CF Os Armacenenses", p: 8, w: 2, d: 2, l: 4, gf: 6, ga: 13, pts: 8 },
        { pos: 9, team: "Louletano DC", p: 8, w: 2, d: 1, l: 5, gf: 15, ga: 19, pts: 7 },
        { pos: 10, team: "Lusitano FC", p: 8, w: 1, d: 3, l: 4, gf: 8, ga: 17, pts: 6 },
        { pos: 11, team: "Carvoeiro United", p: 8, w: 1, d: 1, l: 6, gf: 8, ga: 23, pts: 4 },
        { pos: 12, team: "Quarteirense SAD", p: 8, w: 1, d: 0, l: 7, gf: 7, ga: 32, pts: 3 },
      ],
    },
    officialLink: { label: FPF_L1.label, url: FPF_L1.url },
  },
  {
    id: "juniores",
    discipline: "futebol",
    name: "Juniores",
    age: "Sub-19",
    confirmed: false,
    fixtures: [],
    note: {
      pt: "Nenhuma equipa de Juniores do CDR Quarteirense nas Ligas 1 e 2 AF Algarve 2026/27 (C.O. 19 e 20 e Centro de Resultados FPF verificados a 24/11/2026). A confirmar pelo clube.",
      en: "No CDR Quarteirense U19 team in AF Algarve Liga 1 or Liga 2 for 2026/27 (C.O. 19 and 20 and the FPF results centre checked on 24/11/2026). To be confirmed by the club.",
      fr: "Aucune équipe Juniores du CDR Quarteirense en Liga 1 ou Liga 2 AF Algarve 2026/27 (C.O. 19 et 20 et portail FPF vérifiés le 24/11/2026). À confirmer par le club.",
    },
    officialLink: FPF,
  },
  {
    id: "juvenis-a",
    discipline: "futebol",
    name: "Juvenis A",
    age: "Sub-17",
    competition: "Liga 2 Algarve Futebol Juvenis · Série C",
    confirmed: true,
    confirmedBy: FPF_JUV,
    fixtures: [
      a("2026-10-11", "Padernense Clube", "Campo de Montes Eloi, Paderne", FPF_JUV, { ...c("Liga 2 Juvenis · Série C"), round: "1.ª jornada", score: { us: 3, them: 0 } }),
      h("2026-10-18", "FC Ferreiras", FPF_JUV, { ...c("Liga 2 Juvenis · Série C"), round: "2.ª jornada", score: { us: 4, them: 1 } }),
      a("2026-10-25", "SR Almancilense", "Estádio Municipal de Almancil", FPF_JUV, { ...c("Liga 2 Juvenis · Série C"), round: "3.ª jornada", score: { us: 4, them: 1 } }),
      a("2026-11-01", "Internacional CA", "Estádio Municipal de Almancil", FPF_JUV, { ...c("Liga 2 Juvenis · Série C"), round: "4.ª jornada", score: { us: 4, them: 2 } }),
      h("2026-11-08", "JS Campinense", FPF_JUV, { ...c("Liga 2 Juvenis · Série C"), round: "5.ª jornada", score: { us: 5, them: 0 } }),
      h("2026-11-22T09:00", "Padernense Clube", FPF_JUV, { ...c("Liga 2 Juvenis · Série C"), round: "6.ª jornada", score: { us: 3, them: 2 } }),
      a("2026-11-28T17:30", "FC Ferreiras", "Estádio da Nora n.º 2, Ferreiras", W48, { ...c("Liga 2 Juvenis · Série C"), round: "7.ª jornada" }),
      h("2026-12-06T11:00", "SR Almancilense", W49, { ...c("Liga 2 Juvenis · Série C"), round: "8.ª jornada" }),
      h("2026-12-13T11:00", "Internacional CA", FPF_JUV, { ...c("Liga 2 Juvenis · Série C"), round: "9.ª jornada" }),
      a("2026-12-20T11:00", "JS Campinense", "Campo Municipal n.º 2, Loulé", FPF_JUV, { ...c("Liga 2 Juvenis · Série C"), round: "10.ª jornada" }),
    ],
    table: {
      source: FPF_JUV,
      rows: [
        { pos: 1, team: "CDR Quarteirense A", p: 6, w: 6, d: 0, l: 0, gf: 23, ga: 6, pts: 18 },
        { pos: 2, team: "SR Almancilense", p: 6, w: 3, d: 1, l: 2, gf: 18, ga: 12, pts: 10 },
        { pos: 3, team: "Padernense Clube", p: 6, w: 2, d: 1, l: 3, gf: 12, ga: 14, pts: 7 },
        { pos: 4, team: "FC Ferreiras", p: 6, w: 2, d: 1, l: 3, gf: 15, ga: 19, pts: 7 },
        { pos: 5, team: "Internacional CA", p: 6, w: 2, d: 1, l: 3, gf: 12, ga: 14, pts: 7 },
        { pos: 6, team: "JS Campinense", p: 6, w: 1, d: 0, l: 5, gf: 5, ga: 20, pts: 3 },
      ],
    },
    officialLink: { label: FPF_JUV.label, url: FPF_JUV.url },
  },
  {
    id: "juvenis-b",
    discipline: "futebol",
    name: "Juvenis B",
    age: "Sub-17",
    competition: "Liga 2 Algarve Futebol Juvenis · Série D",
    confirmed: true,
    confirmedBy: FPF_JUV,
    fixtures: [
      h("2026-10-11", "AEF Faro", FPF_JUV, { ...c("Liga 2 Juvenis · Série D"), round: "1.ª jornada", score: { us: 0, them: 5 } }),
      h("2026-10-25", "AD Geração Génios", FPF_JUV, { ...c("Liga 2 Juvenis · Série D"), round: "3.ª jornada", score: { us: 2, them: 4 } }),
      a("2026-11-01", "CD Montenegro", "Campo da Horta da Areia, Faro", FPF_JUV, { ...c("Liga 2 Juvenis · Série D"), round: "4.ª jornada", score: { us: 0, them: 5 } }),
      h("2026-11-08", "4 ao Cubo AD Olhão", FPF_JUV, { ...c("Liga 2 Juvenis · Série D"), round: "5.ª jornada", score: { us: 1, them: 2 } }),
      a("2026-11-22T09:00", "AEF Faro", "Campo da Horta da Areia, Faro", FPF_JUV, { ...c("Liga 2 Juvenis · Série D"), round: "6.ª jornada", score: { us: 0, them: 8 } }),
      // 29/11 v UDR Sambrasense: adversário desistiu (FPF, "DS"), jogo não se realiza.
      a("2026-12-06T17:00", "AD Geração Génios", "Complexo Desportivo da Penha, Faro", W49, { ...c("Liga 2 Juvenis · Série D"), round: "8.ª jornada" }),
      h("2026-12-13T09:00", "CD Montenegro", FPF_JUV, { ...c("Liga 2 Juvenis · Série D"), round: "9.ª jornada" }),
      a("2026-12-20T11:00", "4 ao Cubo AD Olhão", "Estádio Municipal de Olhão", FPF_JUV, { ...c("Liga 2 Juvenis · Série D"), round: "10.ª jornada" }),
    ],
    table: {
      source: FPF_JUV,
      rows: [
        { pos: 1, team: "AEF Faro", p: 5, w: 4, d: 0, l: 1, gf: 21, ga: 4, pts: 12 },
        { pos: 2, team: "AD Geração Génios", p: 5, w: 3, d: 1, l: 1, gf: 13, ga: 8, pts: 10 },
        { pos: 3, team: "CD Montenegro", p: 4, w: 2, d: 2, l: 0, gf: 9, ga: 3, pts: 8 },
        { pos: 4, team: "4 ao Cubo AD Olhão", p: 5, w: 1, d: 1, l: 3, gf: 7, ga: 14, pts: 4 },
        { pos: 5, team: "CDR Quarteirense B", p: 5, w: 0, d: 0, l: 5, gf: 3, ga: 24, pts: 0 },
      ],
    },
    officialLink: { label: FPF_JUV.label, url: FPF_JUV.url },
  },
  {
    id: "iniciados",
    discipline: "futebol",
    name: "Iniciados",
    age: "Sub-15",
    competition: LI,
    confirmed: true,
    confirmedBy: CO14,
    fixtures: iniciados,
    table: {
      source: FPF_INI,
      rows: [
        { pos: 1, team: "Louletano DC", p: 9, w: 7, d: 1, l: 1, gf: 35, ga: 10, pts: 22 },
        { pos: 2, team: "Imortal DC", p: 9, w: 6, d: 1, l: 2, gf: 18, ga: 10, pts: 19 },
        { pos: 3, team: "FC Ferreiras", p: 9, w: 6, d: 1, l: 2, gf: 24, ga: 12, pts: 19 },
        { pos: 4, team: "CDR Quarteirense", p: 8, w: 5, d: 2, l: 1, gf: 18, ga: 7, pts: 17 },
        { pos: 5, team: "SC Farense", p: 9, w: 4, d: 1, l: 4, gf: 11, ga: 12, pts: 13 },
        { pos: 6, team: "Portimonense SC", p: 8, w: 4, d: 0, l: 4, gf: 19, ga: 18, pts: 12 },
        { pos: 7, team: "AA Belavista", p: 9, w: 3, d: 3, l: 3, gf: 14, ga: 15, pts: 12 },
        { pos: 8, team: "AEF Faro", p: 8, w: 3, d: 1, l: 4, gf: 21, ga: 25, pts: 10 },
        { pos: 9, team: "JS Campinense", p: 9, w: 2, d: 1, l: 6, gf: 14, ga: 25, pts: 7 },
        { pos: 10, team: "GC Tavira", p: 8, w: 1, d: 2, l: 5, gf: 11, ga: 21, pts: 5 },
        { pos: 11, team: "CD Montenegro", p: 8, w: 1, d: 2, l: 5, gf: 14, ga: 28, pts: 5 },
        { pos: 12, team: "Silves FC", p: 8, w: 1, d: 1, l: 6, gf: 8, ga: 24, pts: 4 },
      ],
    },
    officialLink: { label: FPF_INI.label, url: FPF_INI.url },
  },
  {
    id: "iniciados-l3",
    discipline: "futebol",
    name: "Iniciados B",
    age: "Sub-15",
    competition: "Liga 3 Algarve Futebol Iniciados · Série D",
    confirmed: true,
    confirmedBy: FPF_INI3,
    fixtures: [
      h("2026-10-25", "Guia FC B", FPF_INI3, { ...c("Liga 3 Iniciados · Série D"), round: "1.ª jornada", score: { us: 8, them: 1 } }),
      a("2026-11-08", "UD Messinense", "Estádio Municipal de Messines", FPF_INI3, { ...c("Liga 3 Iniciados · Série D"), score: { us: 12, them: 0 } }),
      h("2026-11-15", "JS Campinense", FPF_INI3, { ...c("Liga 3 Iniciados · Série D"), score: { us: 11, them: 0 } }),
      a("2026-11-22T18:30", "Louletano DC A", "Campo Municipal n.º 2, Loulé", FPF_INI3, { ...c("Liga 3 Iniciados · Série D"), score: { us: 0, them: 3 } }),
      a("2026-11-29T18:30", "Guia FC B", "Complexo Arsénio Catuna n.º 2, Guia", W48, c("Liga 3 Iniciados · Série D")),
      h("2026-12-06T09:00", "CF Os Armacenenses B", W49, c("Liga 3 Iniciados · Série D")),
      h("2026-12-13T17:00", "UD Messinense", FPF_INI3, c("Liga 3 Iniciados · Série D")),
      a("2026-12-20T11:00", "JS Campinense", "Campo Municipal n.º 2, Loulé", FPF_INI3, c("Liga 3 Iniciados · Série D")),
      h("2027-01-10T11:00", "Louletano DC A", FPF_INI3, c("Liga 3 Iniciados · Série D")),
    ],
    table: {
      source: FPF_INI3,
      rows: [
        { pos: 1, team: "Louletano DC A", p: 5, w: 5, d: 0, l: 0, gf: 43, ga: 1, pts: 15 },
        { pos: 2, team: "CDR Quarteirense", p: 4, w: 3, d: 0, l: 1, gf: 31, ga: 4, pts: 9 },
        { pos: 3, team: "JS Campinense", p: 5, w: 2, d: 0, l: 3, gf: 15, ga: 21, pts: 6 },
        { pos: 4, team: "CF Os Armacenenses B", p: 4, w: 2, d: 0, l: 2, gf: 4, ga: 12, pts: 6 },
        { pos: 5, team: "Guia FC B", p: 5, w: 1, d: 0, l: 4, gf: 4, ga: 29, pts: 3 },
        { pos: 6, team: "UD Messinense", p: 5, w: 1, d: 0, l: 4, gf: 4, ga: 34, pts: 3 },
      ],
    },
    officialLink: { label: FPF_INI3.label, url: FPF_INI3.url },
  },
  {
    id: "infantis-sub13",
    discipline: "futebol",
    name: "Infantis",
    age: "Sub-13 · F7",
    competition: "Liga Algarve Futebol 7 Infantis Sub-13 · Série A",
    confirmed: true,
    confirmedBy: FPF_SUB13,
    // Neste escalão a FPF não publica resultados nem classificação.
    fixtures: [
      a("2026-10-17T10:30", "AEF Faro A", "Complexo Desportivo da Penha, Faro", FPF_SUB13),
      h("2026-10-24T12:00", "CF Os Armacenenses", FPF_SUB13),
      h("2026-10-31T12:00", "Mexilhoeira Grande FC", FPF_SUB13),
      h("2026-11-07T12:00", "GDR Alvorense", FPF_SUB13),
      h("2026-11-14T12:00", "AEF João Moutinho", FPF_SUB13),
      a("2026-11-21T11:00", "Padernense Clube", "Campo de Montes Eloi, Paderne", FPF_SUB13),
      h("2026-11-28T11:00", "CSL Benfica Lagos", W48),
      a("2026-12-05T12:00", "Guia FC", "Complexo Arsénio Catuna n.º 2, Guia", FPF_SUB13),
      h("2026-12-12T12:00", "CF Esperança Lagos", FPF_SUB13),
      h("2026-12-19T11:00", "AEF Faro A", FPF_SUB13),
      a("2027-01-09T11:00", "CF Os Armacenenses", "Estádio Municipal de Armação de Pêra", FPF_SUB13),
      a("2027-01-16T11:00", "Mexilhoeira Grande FC", "Campo Municipal da Mexilhoeira Grande", FPF_SUB13),
      a("2027-01-23T09:00", "GDR Alvorense", "Estádio da Restinga n.º 1, Alvor", FPF_SUB13),
      a("2027-01-30T11:00", "AEF João Moutinho", "Parque Desportivo Municipal de Estombar", FPF_SUB13),
      h("2027-02-06T11:00", "Padernense Clube", FPF_SUB13),
      h("2027-02-20T11:00", "Guia FC", FPF_SUB13),
      a("2027-02-27T11:00", "CF Esperança Lagos", "Estádio Municipal de Lagos n.º 2", FPF_SUB13),
    ].map((f) => ({ ...f, competition: "Infantis Sub-13 · Série A" })),
    noScores: true,
    officialLink: { label: FPF_SUB13.label, url: FPF_SUB13.url },
  },
  {
    id: "infantis-f9-a",
    discipline: "futebol",
    name: "Infantis A",
    age: "F9",
    competition: "Liga Algarve Futebol 9 Infantis · Série 3",
    confirmed: true,
    confirmedBy: FPF_F9,
    fixtures: [],
    note: {
      pt: "Na classificação da FPF esta equipa aparece como \"DS · Desistência\" (Série 3). Mas o mapa da AF Algarve de 11–17/12 ainda lhe atribui um jogo (12/12, 11:00, em casa, v GD Lagoa C). A confirmar com a coordenação.",
      en: "The FPF table shows this team as \"DS · withdrawn\" (Série 3). Yet AF Algarve's 11–17/12 listing still gives it a match (12/12, 11:00, home v GD Lagoa C). To be confirmed with the coordinators.",
      fr: "Le classement FPF affiche cette équipe « DS · Desistência » (Série 3). Pourtant la liste AF Algarve du 11 au 17/12 lui donne encore un match (12/12, 11h, à domicile contre GD Lagoa C). À confirmer avec la coordination.",
    },
    officialLink: { label: FPF_F9.label, url: FPF_F9.url },
  },
  {
    id: "infantis-f9-b",
    discipline: "futebol",
    name: "Infantis B",
    age: "F9",
    competition: "Liga Algarve Futebol 9 Infantis · Série 4",
    confirmed: true,
    confirmedBy: FPF_F9,
    fixtures: [
      h("2026-11-21T09:00", "Imortal DC C", FPF_F9, { ...c("Infantis F9 · Série 4"), score: { us: 5, them: 1 } }),
      h("2026-12-05T12:00", "SC Farense B", W49, c("Infantis F9 · Série 4")),
      a("2026-12-08T11:00", "Lusitano FC A", "Campo Francisco Gomes Socorro, Vila Real de Santo António", W49, c("Infantis F9 · Série 4")),
      a("2026-12-12T09:00", "CD Porto Algarve", "São Brás de Alportel", W50, c("Infantis F9 · Série 4")),
    ],
    table: {
      source: FPF_F9,
      rows: [
        { pos: 1, team: "CD Montenegro B", p: 6, w: 6, d: 0, l: 0, gf: 32, ga: 6, pts: 18 },
        { pos: 2, team: "CDR Quarteirense B", p: 6, w: 4, d: 0, l: 2, gf: 23, ga: 15, pts: 12 },
        { pos: 3, team: "Lusitano FC A", p: 6, w: 3, d: 1, l: 2, gf: 17, ga: 17, pts: 10 },
        { pos: 4, team: "SR 1.º de Janeiro", p: 6, w: 3, d: 1, l: 2, gf: 13, ga: 10, pts: 10 },
        { pos: 5, team: "SC Farense B", p: 6, w: 2, d: 1, l: 3, gf: 13, ga: 9, pts: 7 },
        { pos: 6, team: "CD Porto Algarve", p: 5, w: 2, d: 1, l: 2, gf: 21, ga: 11, pts: 7 },
        { pos: 7, team: "Imortal DC C", p: 6, w: 0, d: 1, l: 5, gf: 4, ga: 26, pts: 1 },
        { pos: 8, team: "FC Ferreiras B", p: 5, w: 0, d: 1, l: 4, gf: 5, ga: 34, pts: 1 },
      ],
    },
    officialLink: { label: FPF_F9.label, url: FPF_F9.url },
  },
  {
    id: "benjamins-a1",
    discipline: "futebol",
    name: "Benjamins A · equipa A",
    age: "F7",
    competition: "Benjamins A · Série D",
    confirmed: true,
    confirmedBy: W47,
    fixtures: [
      h("2026-11-21T12:00", "Imortal DC B", W47, c("Benjamins A · Série D")),
      a("2026-11-28T18:00", "JS Campinense A", "Campo Municipal n.º 2, Loulé", W48, c("Benjamins A · Série D")),
      h("2026-12-05T10:30", "FC Ferreiras B", W49, c("Benjamins A · Série D")),
      a("2026-12-12T11:00", "CD Montenegro A", "Faro", W50, c("Benjamins A · Série D")),
    ],
    officialLink: WEEKLY,
  },
  {
    id: "benjamins-a2",
    discipline: "futebol",
    name: "Benjamins A · equipa B",
    age: "F7",
    competition: "Benjamins A · Série E",
    confirmed: true,
    confirmedBy: W47,
    fixtures: [
      a("2026-11-22T13:00", "AD Geração Génios", "Complexo Desportivo da Penha, Faro", W47, c("Benjamins A · Série E")),
      h("2026-11-28T09:30", "JS Campinense B", W48, c("Benjamins A · Série E")),
      a("2026-12-05T11:00", "FC São Luís", "Campo da Horta da Areia, Faro", W49, c("Benjamins A · Série E")),
      h("2026-12-12T10:30", "SC Farense B", W50, c("Benjamins A · Série E")),
    ],
    officialLink: WEEKLY,
  },
  {
    id: "benjamins-b1",
    discipline: "futebol",
    name: "Benjamins B · equipa A",
    age: "F7",
    competition: "Benjamins B · Série E",
    confirmed: true,
    confirmedBy: W47,
    fixtures: [
      a("2026-11-21T10:30", "Imortal DC B", "Campo da Palmeira n.º 2, Albufeira", W47, c("Benjamins B · Série E")),
      h("2026-11-28T11:00", "Internacional CA", W48, c("Benjamins B · Série E")),
      a("2026-12-05T10:30", "Padernense Clube A", "Campo de Montes Eloi, Paderne", W49, c("Benjamins B · Série E")),
      h("2026-12-12T09:00", "JS Campinense A", W50, c("Benjamins B · Série E")),
      a("2026-12-19T11:00", "FC Ferreiras", "Ferreiras", CO43, c("Benjamins B · Série E")),
      h("2027-01-09T11:00", "Imortal DC B", CO43, c("Benjamins B · Série E")),
      a("2027-01-16T11:00", "Internacional CA", "Almancil", CO43, c("Benjamins B · Série E")),
    ],
    officialLink: WEEKLY,
  },
  {
    id: "benjamins-b2",
    discipline: "futebol",
    name: "Benjamins B · equipa B",
    age: "F7",
    competition: "Benjamins B · Série F",
    confirmed: true,
    confirmedBy: W47,
    fixtures: [
      h("2026-11-21T10:30", "Imortal DC C", W47, c("Benjamins B · Série F")),
      a("2026-11-28T09:00", "Louletano DC A", "Campo Municipal n.º 2, Loulé", W48, c("Benjamins B · Série F")),
      h("2026-12-05T09:00", "JS Campinense B", W49, c("Benjamins B · Série F")),
      a("2026-12-12T11:00", "CD Marítimo Olhanense", "Olhão", W50, c("Benjamins B · Série F")),
      h("2026-12-19T11:00", "Padernense Clube B", CO43, c("Benjamins B · Série F")),
      a("2027-01-09T11:00", "Imortal DC C", "Albufeira", CO43, c("Benjamins B · Série F")),
      h("2027-01-16T11:00", "Louletano DC A", CO43, c("Benjamins B · Série F")),
    ],
    officialLink: WEEKLY,
  },
  {
    id: "traquinas",
    discipline: "futebol",
    name: "Traquinas",
    age: "F7",
    competition: "Futebol 7 Traquinas · Série C",
    confirmed: true,
    confirmedBy: W47,
    fixtures: [
      h("2026-11-22T15:00", "CD Montenegro A", W47, c("Traquinas · Série C")),
      h("2026-11-29T15:00", "Imortal DC B", W48, c("Traquinas · Série C")),
      a("2026-12-06T17:00", "Louletano DC", "Campo Municipal n.º 2, Loulé", W49, c("Traquinas · Série C")),
      a("2026-12-20T15:00", "4 ao Cubo AD Olhão A", "Olhão", CO45, c("Traquinas · Série C")),
      h("2027-01-10T15:00", "Guia FC B", CO45, c("Traquinas · Série C")),
    ],
    officialLink: WEEKLY,
  },
  {
    id: "petizes",
    discipline: "futebol",
    name: "Petizes",
    age: "Sub-7",
    confirmed: false,
    fixtures: [],
    note: {
      pt: "Os Petizes não têm campeonato: a AF Algarve organiza encontros/festas ao longo da época, sem calendário publicado por clube. O clube pode anunciar aqui as datas.",
      en: "Petizes have no league: AF Algarve runs festivals during the season, with no per-club calendar published. The club can post the dates here.",
      fr: "Les Petizes n'ont pas de championnat : l'AF Algarve organise des rassemblements pendant la saison, sans calendrier publié par club. Le club pourra annoncer les dates ici.",
    },
  },
  {
    id: "feminino",
    discipline: "futebol",
    name: "Feminino",
    confirmed: false,
    fixtures: [],
    note: {
      pt: "Nenhuma equipa feminina do CDR Quarteirense nas provas AF Algarve 2026/27 (futebol 9 feminino e futsal feminino verificados a 24/11/2026). A confirmar pelo clube.",
      en: "No CDR Quarteirense women's team in AF Algarve 2026/27 competitions (women's 9-a-side and futsal checked on 24/11/2026). To be confirmed by the club.",
      fr: "Aucune équipe féminine du CDR Quarteirense dans les compétitions AF Algarve 2026/27 (foot à 9 et futsal féminins vérifiés le 24/11/2026). À confirmer par le club.",
    },
    officialLink: FPF,
  },
  {
    id: "futsal",
    discipline: "futsal",
    name: "Futsal",
    confirmed: false,
    fixtures: [],
    note: {
      pt: "Nenhuma equipa de futsal do CDR Quarteirense nas provas AF Algarve 2026/27 (todas as categorias verificadas a 24/11/2026). O \"Quarteira FC\" que aparece nos mapas é outro clube.",
      en: "No CDR Quarteirense futsal team in AF Algarve 2026/27 competitions (all age groups checked on 24/11/2026). \"Quarteira FC\" in the listings is a different club.",
      fr: "Aucune équipe de futsal du CDR Quarteirense dans les compétitions AF Algarve 2026/27 (toutes catégories vérifiées le 24/11/2026). Le « Quarteira FC » des listes est un autre club.",
    },
    officialLink: FPF,
  },
  {
    id: "walking",
    discipline: "outras",
    name: "Walking Football",
    competition: "Liga Algarve Walking Football",
    confirmed: true,
    confirmedBy: W48,
    fixtures: [
      a("2026-11-29T18:30", "FC Ferreiras B", "Estádio da Nora n.º 2, Ferreiras", W48, c("Liga Algarve Walking Football")),
      h("2026-12-13T15:00", "Associação Klubesol", W50, c("Liga Algarve Walking Football")),
    ],
    table: {
      source: FPF_WF,
      rows: [
        { pos: 1, team: "SC Farense A", p: 1, w: 1, d: 0, l: 0, gf: 5, ga: 4, pts: 3 },
        { pos: 2, team: "FC Ferreiras B", p: 1, w: 0, d: 1, l: 0, gf: 1, ga: 1, pts: 1 },
        { pos: 2, team: "SC Farense B", p: 1, w: 0, d: 1, l: 0, gf: 1, ga: 1, pts: 1 },
        { pos: 4, team: "Associação Klubesol", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
        { pos: 4, team: "FC Ferreiras A", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
        { pos: 6, team: "CDR Quarteirense", p: 1, w: 0, d: 0, l: 1, gf: 4, ga: 5, pts: 0 },
      ],
    },
    officialLink: { label: FPF_WF.label, url: FPF_WF.url },
  },
  { id: "praia", discipline: "outras", name: "Futebol de Praia", confirmed: false, fixtures: [] },
  { id: "boxe", discipline: "outras", name: "Boxe", confirmed: false, fixtures: [] },
  { id: "teqball", discipline: "outras", name: "Teqball", confirmed: false, fixtures: [] },
  { id: "petanca", discipline: "outras", name: "Petanca", confirmed: false, fixtures: [] },
];
