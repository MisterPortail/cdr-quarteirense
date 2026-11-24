# Espace parents, mensualités et licences

Demande de Mathieu du 24/11/2026 : un espace où chaque parent se connecte avec son email, voit les informations du club, l'état de la licence de son enfant, ce qu'il doit, et paie en ligne au mois ou pour toute la saison. Côté club, un tableau simple : qui a payé, qui n'a pas payé, qui a un ou plusieurs mois de retard.

## Ce que montre la démo

**Espace Pais** (`/area-pais`, ou `#area-pais` dans l'aperçu), en PT, EN et FR :
- connexion par lien magique envoyé par email (pas de mot de passe à retenir) ;
- résumé : montant dû, pour chaque enfant la licence, l'examen médical et la situation des mensualités, avec une frise de septembre à juin ;
- paiements : mois en retard présélectionnés, mois suivants au choix, ou « saison complète » avec un mois offert (valeur d'exemple). Paiement MB WAY, référence Multibanco ou carte, puis reçu ;
- avis du club, profil, consentement photo (RGPD).

**Gestão do clube** (`/gestao`, ou `#gestao`), en portugais :
- chiffres clés : athlètes, montant encaissé, montant dû, licences à régulariser, examens médicaux qui expirent ;
- graphique prévu / encaissé par mois ;
- tableau par catégorie ;
- liste des athlètes avec une pastille par mois (vert payé, rouge en retard), filtres et recherche, boutons « Lembrar » (relance) et « Recebido » (paiement reçu au secrétariat en espèces) ;
- derniers paiements.

Les deux vues partagent les mêmes données : un paiement fait côté parent apparaît tout de suite côté club. Tout est fictif (noms, emails, montants de 20 à 30 €/mois, inscription 60 €) et aucun paiement réel n'est effectué.

## Fonctionnement en production

1. **Début de saison** : le club importe ou saisit les athlètes, leurs parents (email) et la catégorie. Le système crée automatiquement les mensualités de septembre à juin et l'inscription.
2. **Le parent reçoit une invitation** par email, se connecte et voit uniquement ses enfants (sécurité au niveau de la base, Row Level Security).
3. **Paiement** : le site crée une demande chez le prestateur de paiement (MB WAY, Multibanco, carte). Le prestataire confirme par *webhook* et la mensualité passe en « payé ». Reçu envoyé par email.
4. **Relances automatiques** : rappel 3 jours avant l'échéance (le 8 du mois), puis à J+3 et J+10 en cas de retard (email, et SMS en option). Le trésorier peut relancer à la main.
5. **Paiements au secrétariat** : le trésorier les enregistre en un clic (espèces, virement).
6. **Licences et examens médicaux** : alerte automatique 45 jours avant expiration, visible du parent et du club.

## Rôles

| Rôle | Voit | Peut faire |
|---|---|---|
| Parent | ses enfants, leurs licences, ses paiements, les avis | payer, gérer les consentements |
| Athlète majeur | sa propre fiche | payer |
| Entraîneur | son équipe, licences et examens médicaux | **pas** l'argent |
| Coordinateur | toutes les équipes | gérer athlètes et licences |
| Trésorier | tout le volet financier | enregistrer paiements, relancer, exonérer |
| Administrateur | tout | gérer les rôles |

Schéma complet : `supabase/migrations/0001_fees.sql`.

## Solution de paiement recommandée

**Recommandation : ifthenpay** (entreprise portugaise), avec Easypay comme alternative.

| Prestataire | MB WAY | Multibanco | Carte | Abonnement | Remarques |
|---|---|---|---|---|---|
| **ifthenpay** | 0,07 € + 0,7 % | 0,20 € + 1,5 % | 0,20 € + 1,5 % | 0 € annoncé | prélèvement SEPA 0,45 € ; très répandu chez les associations |
| EuPago | 0,07 € + 0,7 % | 0,20 € + 1,5 % | 0,20 € + 1,5 % | 0 € | équivalent à ifthenpay |
| Easypay | 0,25 € + 1,5 % | 0,25 € + 1,5 % | 0,25 € + 1,5 % | 0 € sous conditions (500 € si inactivité) | gère aussi prélèvements et abonnements |
| Stripe | 1,5 % + 0,25 € | 2,95 % + 0,25 € | 1,5 % + 0,25 € | 0 € | excellente API, mais plus cher et MB WAY non récurrent |

Tarifs hors TVA, relevés sur shelf.pt (mis à jour le 8/11/2026) et quasa.io (31/10/2026). À confirmer directement auprès des prestataires avant de signer.

Pour une mensualité de 25 € payée par MB WAY, le club paie environ **0,25 €** chez ifthenpay contre **0,63 €** chez Stripe. Sur 300 athlètes et 10 mois, cela représente environ 750 € contre 1 900 € par an.

**Point important :** MB WAY et Multibanco ne permettent pas de prélever automatiquement chaque mois. Le parent valide chaque paiement (une notification MB WAY, en un geste). Pour un vrai paiement automatique, il faut le **prélèvement SEPA** (débito direto), que proposent ifthenpay, EuPago et Easypay. Proposition : MB WAY par défaut, prélèvement SEPA pour les familles qui le souhaitent, et paiement de la saison complète avec remise.

Le club doit ouvrir le compte lui-même (NIF de l'association, IBAN). Les données de carte ne passent jamais par le site.

## Simplicité

Volontairement limité : 4 onglets côté parent, une seule page côté club. Pas de comptabilité, pas de facturation fiscale certifiée : les reçus restent ceux du club. Si une facture certifiée AT est nécessaire, on branchera plus tard un logiciel de facturation (InvoiceXpress, Moloni, etc.).

## Accès gestionnaire et relances (ajout du 24/11/2026)

### Connexion « Gestão do clube »
- Démo : écran de connexion avec identifiants visibles **admin / 123456789** (bouton « Preencher automaticamente »), puis animation « connexion à la base de données ». Bouton « Sair » pour se déconnecter.
- Production : Supabase Auth (compte personnel par gestionnaire, mot de passe fort + 2FA), rôle vérifié en base (`user_roles` : admin / treasurer), middleware Next.js qui bloque `/gestao` sans session, expiration de session, journal `audit_log`. Les identifiants de démo disparaissent.

### Centre de relances (tableau de bord)
- Destinataires = encarregados avec mensualités en retard ; email et téléphone viennent de leur fiche (table `profiles`, liée aux athlètes via `athlete_guardians`).
- Modèle de message modifiable avec champs automatiques {nome}, {detalhe}, {valor}, {link} ; aperçu par destinataire ; canal email ou SMS ; envoi groupé (cases à cocher, filtre « 2+ meses ») ou individuel (bouton « Lembrar » dans le tableau).
- Journal d'envois (en file → envoyé) ; table `reminders` en production.
- Règles automatiques affichées : J-3 avant échéance (email), J+3 (email), J+10 (email + SMS). En production : tâche planifiée (Supabase cron / Edge Function).
- Côté parents : le message reçu apparaît dans « Avisos do clube » → « Mensagens da tesouraria ».
- Envoi réel en production : Brevo (entreprise française, serveurs UE, offre gratuite ~300 emails/jour, SMS disponibles) ou Resend. Domaine d'envoi à authentifier (SPF/DKIM) sur cdrquarteirense.com.
- Démo : aucun email ni SMS n'est réellement envoyé.
