# CDR Quarteirense · Site officiel (V1 — page d'accueil)

Prototype fonctionnel de la nouvelle page d'accueil du Clube Desportivo e Recreativo Quarteirense.

- **Stack** : Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion
- **Langues** : PT-PT (référence), EN, FR — `src/i18n/dictionaries.ts`
- **Données du club** : `src/content/club.ts` (statut `verified` / `toConfirm` / `placeholder`)

## Lancer le projet

```bash
npm install
npm run dev            # http://localhost:3000
npm run build          # build de production
npm run preview:build  # aperçu statique autonome dans dist-preview/ (ouvrir via un petit serveur)
```

## Structure

```
src/
  app/              layout (polices, SEO, JSON-LD), page d'accueil, styles globaux / design tokens
  components/home/  sections de la page d'accueil
  components/ui/    briques communes (emblème, boutons, icônes, marqueurs « à compléter »)
  content/club.ts   informations institutionnelles vérifiées
  i18n/             dictionnaires PT/EN/FR + fournisseur de langue
public/brand/       emblème (fond transparent)
preview/            point d'entrée de l'aperçu statique (même code que Next.js)
docs/               documentation du projet
```

Voir `docs/PROJET.md` (direction artistique, architecture, feuille de route) et `docs/A-COMPLETER.md` (informations à fournir par le club).
