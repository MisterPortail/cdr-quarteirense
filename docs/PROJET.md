# Projet CDR Quarteirense — Website 2026

Document de suivi : décisions, architecture et feuille de route. Mis à jour à chaque phase.

## 1. Analyse de l'existant (phase 1 — faite le 24/11/2026)

Sources lues : cdrquarteirense.com (Accueil, Clube, Modalidades, Documentos, Contactos, Historial.pdf, Órgãos Sociais 2022/2026), page de l'institution sur jf-quarteira.pt, Wikipédia (source secondaire).

Le site actuel affiche « Site em desenvolvimento ». Il contient surtout des documents institutionnels (statuts, actas, rapports), peu de contenu éditorial, aucune photo exploitable récupérée, aucun partenaire listé.

**Informations vérifiées et utilisées sur la page :**
- Fondation le 02/01/1937 (Sociedade Recreativa Quarteirense), nom actuel depuis 1971.
- Siège : Rua Patrão Lopes, nº 33-A, 8125-241 Quarteira · 289 314 954 · info@cdrquarteirense.com
- Réseaux : Facebook, Instagram, X (liens du site actuel).
- 7 modalités : Futebol, Futsal, Teqball, Futebol de Praia, Walking Football, Boxe, Petanca.
- Certifications FPF : football masculin 4★, football féminin 3★, futsal masculin Centro Básico (2024/2025). Bandeira da Ética (IPDJ, 2020). Utilité publique (despacho 16/09/2022).
- Chiffres de l'Historial : ~311 athlètes fédérés, 1455 associés.
- Prise de fonctions de la Direction 2026/2030 le 18/05/2026 (Ata nº 57) ; convocation d'AG du 10/09/2026 ; rapport d'activités et comptes 2025 publié.

**Source secondaire, à confirmer :** titres AF Algarve 1ª Divisão 2006/07 et 2010/11, Supertaça 2011/12, surnom « Lobos do Mar », Estádio Municipal de Quarteira (~2 300 places).

## 2. Direction artistique (phase 2 — proposition V1)

**Concept : « le club de la mer ».** Le blason (bouée, caíque à voile latine, mer) fournit tout le vocabulaire graphique :
- **Bouée** : anneau à quatre bandes rouges → grand motif animé du hero, cartes, encarts.
- **Corde pointillée** : séparateur (haut du pied de page).
- **Vagues** : base animée du hero et de la frise historique.
- **Caíque** : silhouette en filigrane (histoire, actualités).

**Palette** : bleu nuit `#050D22`, abysse `#0A1A3F`, bleu royal `#0B3FB0`, bleu vif `#2563EB`, blanc, glace `#EEF3FB`, rouge bouée `#E11D2A` (réservé aux appels à l'action et aux accents).

**Typographie** : Archivo condensé (titres, capitales, très sportif) · Instrument Sans (texte) · JetBrains Mono (données : dates, scores, compte à rebours).

**Rythme** : alternance de sections sombres immersives et claires éditoriales. Animations : entrée du hero orchestrée, parallaxe légère, révélations au défilement sans jamais masquer le contenu, respect de `prefers-reduced-motion`.

## 3. Arborescence proposée

Início · O Clube (história, órgãos sociais, instalações, documentos) · Futebol (seniores, feminino) · Futsal · Formação (escalões, inscrições, valores) · Modalidades (teqball, praia, walking football, boxe, petanca) · Jogos e Resultados · Notícias · Sócios · Loja · Parceiros · Contactos.

Navigation adaptée aux disciplines réelles : un menu « Modalidades » regroupe les 5 disciplines complémentaires.

## 4. Page d'accueil V1 (phase 3)

Sections : barre supérieure (réseaux, PT/EN/FR, espace membre, Torna-te Sócio) · navigation fixe + menu mobile plein écran · hero + 3 actualités à la une · bandeau des certifications · Match Center (catégories, dernier résultat, prochain match, compte à rebours) · actualités (filtres par catégorie) · chiffres clés · équipes et modalités (carrousel) · formation et parcours d'inscription pour les parents · frise historique déplaçable · sócios (carte de membre interactive) · boutique (bientôt) · partenaires + appel aux entreprises · pied de page complet (contacts, documents, mentions légales, Livro de Reclamações).

**Mode révision** (bouton en bas à droite) : entoure en pointillés rouges tout contenu provisoire ou à confirmer, pour la présentation à la Direction.

## 5. Architecture cible

- **Front** : Next.js (App Router), rendu statique/ISR pour les pages publiques, composants serveur par défaut.
- **i18n** : routes `/`, `/en`, `/fr` (prochaine étape, avec `hreflang`), dictionnaires typés ; contenus éditoriaux traduits en base.
- **Back-end** : Supabase (PostgreSQL, Auth, Storage, Row Level Security).
- **Back-office** : interface d'administration sur `/admin` (Next.js + Supabase), éditeurs simples pour actualités, matchs, équipes, partenaires, documents. Alternative à étudier : CMS headless (Payload, Sanity) si l'équipe préfère.

### Schéma de données (esquisse)

| Table | Rôle |
|---|---|
| `seasons`, `competitions` | saisons et compétitions |
| `teams` | équipes / catégories, discipline, staff |
| `players` | effectif, `publish_consent` obligatoire (mineurs) |
| `matches` | calendrier, scores, lieu, compétition |
| `standings` | classements (saisie ou import autorisé) |
| `news`, `news_translations` | actualités multilingues, catégorie, statut |
| `partners` | partenaires, niveau, logo, lien |
| `members` | sócios (privé), numéro, cotisations |
| `documents` | statuts, rapports, actas |
| `profiles`, `roles` | rôles : admin, éditeur, coach, parent, joueur, sócio |

### Rôles et sécurité
Séparation stricte public / privé par RLS. Rôles : administrateur, rédacteur, entraîneur (son équipe), parent (ses enfants), joueur, sócio.

### RGPD
- Aucune photo ni nom de mineur publié sans consentement parental enregistré (`publish_consent`, date, signataire).
- Données personnelles hébergées dans l'UE (région Supabase Francfort/Irlande).
- Bannière cookies, politique de confidentialité, registre des traitements, droit à l'effacement.

## 6. Feuille de route

| Phase | Contenu | État |
|---|---|---|
| 1 | Analyse de l'existant | ✅ |
| 2 | Direction artistique, design system, arborescence | ✅ proposition V1 |
| 3 | Page d'accueil complète et fonctionnelle | ✅ V1 |
| 4 | Validation de la direction artistique par la Direction | ⏳ |
| 5 | Pages secondaires (Clube, équipes, Formação, Sócios, Parceiros, Contactos, actualité) | |
| 6 | Base de données Supabase + back-office · espace parents et mensualités (démo faite, voir ESPACE-PARENTS.md) | ⏳ démo |
| 7 | Fonctionnalités avancées : espaces privés, convocations, présences, adhésion et paiement en ligne, boutique, billetterie, carte digitale, newsletter, PWA, notifications | |
| 8 | Tests, performance, accessibilité, SEO, mise en production | |

**IA (modulaire, plus tard)** : assistant FAQ du club, résumés de matchs assistés, traduction des actualités, visuels réseaux sociaux. Aucune de ces fonctions n'est présentée comme opérationnelle.

## 7. Journal des décisions

- 24/11/2026 — Next.js + Tailwind + Framer Motion retenus. Aperçu statique généré à partir du même code (esbuild) pour présentation sans serveur.
- 24/11/2026 — Match Center en données d'exemple, adversaires anonymes : aucun résultat réel n'est inventé.
- 24/11/2026 — Actualités rédigées à partir de faits publics du club, marquées « textes provisoires ».
- 24/11/2026 — Espace parents et gestion des mensualités : démo navigable, schéma Supabase (`supabase/migrations/0001_fees.sql`), prestataire recommandé ifthenpay. Gestion du club en portugais uniquement.
- 24/11/2026 — Salle des trophées ajoutée après l'histoire. Seuls les titres vérifiés sont marqués « confirmé ».
- 24/11/2026 — Pas de photos disponibles : compositions graphiques à partir du blason en attendant les photos officielles.
