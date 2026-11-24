/**
 * Sala de Troféus. Estrutura (ano, estado de verificação, ícone) em `TROPHIES`;
 * textos por língua em `trophyTexts`. Na fase 6 passa para a tabela `honours`.
 */
import type { Locale } from "./dictionaries";

export type TrophyKey = "afa1" | "super" | "juniors" | "merit" | "parish" | "ethics" | "fpf" | "utility";
export type TrophyGroup = "football" | "academy" | "institutional";

export const TROPHIES: { key: TrophyKey; group: TrophyGroup; seasons: string[]; count?: number; verified: boolean; kind: "cup" | "medal" | "flag" | "star" }[] = [
  { key: "afa1", group: "football", seasons: ["2006/07", "2010/11"], count: 2, verified: false, kind: "cup" },
  { key: "super", group: "football", seasons: ["2011/12"], count: 1, verified: false, kind: "cup" },
  { key: "juniors", group: "academy", seasons: ["—"], verified: false, kind: "cup" },
  { key: "fpf", group: "academy", seasons: ["2020", "2024/25"], verified: true, kind: "star" },
  { key: "merit", group: "institutional", seasons: ["1996"], verified: true, kind: "medal" },
  { key: "parish", group: "institutional", seasons: ["2018"], verified: true, kind: "medal" },
  { key: "ethics", group: "institutional", seasons: ["2020"], verified: true, kind: "flag" },
  { key: "utility", group: "institutional", seasons: ["2022"], verified: true, kind: "medal" },
];

type Item = { name: string; team: string; text: string };
type TrophyDict = {
  eyebrow: string;
  title: string;
  lead: string;
  all: string;
  filters: Record<TrophyGroup, string>;
  verified: string;
  toConfirm: string;
  more: string;
  items: Record<TrophyKey, Item>;
};

export const trophyTexts: Record<Locale, TrophyDict> = {
  pt: {
    eyebrow: "Sala de Troféus",
    title: "Títulos e distinções",
    lead: "Cada troféu conta uma parte da nossa história. Aqui ficam os títulos desportivos e as distinções do clube, com a explicação de cada um.",
    all: "Todos",
    filters: { football: "Futebol sénior", academy: "Formação", institutional: "Clube" },
    verified: "Confirmado",
    toConfirm: "A confirmar",
    more: "Os títulos do futsal, futebol de praia, boxe, petanca e restantes modalidades serão acrescentados pelo clube no back-office.",
    items: {
      afa1: { name: "Campeão da 1.ª Divisão AF Algarve", team: "Seniores masculinos", text: "O principal campeonato distrital do Algarve." },
      super: { name: "Supertaça AF Algarve", team: "Seniores masculinos", text: "Disputada no arranque da época entre os vencedores das provas distritais." },
      juniors: { name: "Juniores campeões", team: "Formação · Sub-19", text: "Título anunciado no site atual do clube. Competição e época a indicar." },
      fpf: { name: "Entidade Formadora Certificada", team: "Federação Portuguesa de Futebol", text: "Futebol masculino 4 estrelas, futebol feminino 3 estrelas e futsal masculino Centro Básico (2024/2025)." },
      merit: { name: "Medalha Municipal de Mérito, grau Prata", team: "Câmara Municipal de Loulé", text: "Reconhecimento do município pelo contributo do clube para o desporto e a comunidade." },
      parish: { name: "Cidadão de Mérito da Freguesia", team: "Junta de Freguesia de Quarteira", text: "Distinção da freguesia ao clube que representa Quarteira há gerações." },
      ethics: { name: "Bandeira da Ética", team: "IPDJ · Plano Nacional de Ética no Desporto", text: "Atribuída a entidades que promovem o fair-play, o respeito e os valores do desporto." },
      utility: { name: "Utilidade Pública", team: "Estado português", text: "Estatuto reconhecido a instituições que servem o interesse geral." },
    },
  },
  en: {
    eyebrow: "Trophy Room",
    title: "Titles and honours",
    lead: "Every trophy tells part of our story. Here are the club's sporting titles and honours, each with its explanation.",
    all: "All",
    filters: { football: "Senior football", academy: "Academy", institutional: "Club" },
    verified: "Confirmed",
    toConfirm: "To be confirmed",
    more: "Titles in futsal, beach soccer, boxing, pétanque and the other sports will be added by the club in the back-office.",
    items: {
      afa1: { name: "AF Algarve 1st Division champions", team: "Men's seniors", text: "The Algarve's top district league." },
      super: { name: "AF Algarve Super Cup", team: "Men's seniors", text: "Played at the start of the season between the winners of the district competitions." },
      juniors: { name: "U19 champions", team: "Academy · U19", text: "Title announced on the club's current website. Competition and season to be added." },
      fpf: { name: "Certified Training Entity", team: "Portuguese Football Federation", text: "Men's football 4 stars, women's football 3 stars and men's futsal Basic Centre (2024/2025)." },
      merit: { name: "Municipal Medal of Merit, Silver", team: "Loulé City Council", text: "The municipality's recognition of the club's contribution to sport and the community." },
      parish: { name: "Parish Citizen of Merit", team: "Quarteira Parish Council", text: "The parish's honour for the club that has represented Quarteira for generations." },
      ethics: { name: "Ethics Flag", team: "IPDJ · National Plan for Ethics in Sport", text: "Awarded to organisations that promote fair play, respect and the values of sport." },
      utility: { name: "Public Utility", team: "Portuguese State", text: "Status granted to institutions that serve the general interest." },
    },
  },
  fr: {
    eyebrow: "Salle des trophées",
    title: "Titres et distinctions",
    lead: "Chaque trophée raconte une partie de notre histoire. Voici les titres sportifs et les distinctions du club, chacun expliqué.",
    all: "Tous",
    filters: { football: "Football senior", academy: "Formation", institutional: "Club" },
    verified: "Confirmé",
    toConfirm: "À confirmer",
    more: "Les titres du futsal, du football de plage, de la boxe, de la pétanque et des autres disciplines seront ajoutés par le club dans le back-office.",
    items: {
      afa1: { name: "Champion de 1re division AF Algarve", team: "Seniors masculins", text: "Le principal championnat de district de l'Algarve." },
      super: { name: "Supercoupe AF Algarve", team: "Seniors masculins", text: "Disputée en début de saison entre les vainqueurs des compétitions de district." },
      juniors: { name: "U19 champions", team: "Formation · U19", text: "Titre annoncé sur le site actuel du club. Compétition et saison à préciser." },
      fpf: { name: "Centre de formation certifié", team: "Fédération portugaise de football", text: "Football masculin 4 étoiles, football féminin 3 étoiles et futsal masculin Centre de base (2024/2025)." },
      merit: { name: "Médaille municipale du Mérite, grade Argent", team: "Mairie de Loulé", text: "Reconnaissance de la commune pour la contribution du club au sport et à la vie locale." },
      parish: { name: "Citoyen de mérite de la paroisse", team: "Junta de Freguesia de Quarteira", text: "Distinction de la paroisse pour le club qui représente Quarteira depuis des générations." },
      ethics: { name: "Drapeau de l'Éthique", team: "IPDJ · Plan national d'éthique dans le sport", text: "Attribué aux structures qui promeuvent le fair-play, le respect et les valeurs du sport." },
      utility: { name: "Utilité publique", team: "État portugais", text: "Statut reconnu aux institutions qui servent l'intérêt général." },
    },
  },
};
