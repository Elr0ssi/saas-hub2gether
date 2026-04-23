# Hub2gether — SaaS B2B sport en entreprise

Plateforme multi-tenant Next.js 15 + Prisma + PostgreSQL pour animer la pratique sportive en entreprise avec SSO (OIDC/SAML via WorkOS), groupes, matchmaking, classements, dépenses et analytics admin.

## Stack
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Prisma ORM + PostgreSQL
- Zod validations
- Auth enterprise-ready WorkOS (SSO OIDC / SAML)
- Architecture Vercel-compatible

## Fonctionnalités MVP
- Authentification SSO B2B multi-tenant par domaine ou slug organisation
- Provisioning auto utilisateur à la première connexion + liaison tenant
- Rôles `super_admin`, `company_admin`, `group_admin`, `player`
- Dashboard joueur: profil, stats, badges, sports
- Groupes: création, listing, détails, membres, posts
- Matchmaking: création, filtres, détails, participation
- Classements entreprise
- Dépenses match + répartition manuelle
- Notifications in-app
- Dashboard admin + journal d'audit
- Isolation stricte par `companyId`

## Structure des routes
- `/login`
- `/onboarding`
- `/app`
- `/app/profile`
- `/app/groups`
- `/app/groups/[groupId]`
- `/app/matches`
- `/app/matches/[matchId]`
- `/app/rankings`
- `/app/expenses`
- `/app/notifications`
- `/admin`
- `/admin/users`
- `/admin/groups`
- `/admin/matches`
- `/admin/analytics`
- `/admin/settings`

## Installation locale
```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:seed
npm run dev
```

## Variables d'environnement
Voir `.env.example`.

## WorkOS (configuration démo entreprise)
1. Créer une application WorkOS et récupérer `WORKOS_API_KEY` + `WORKOS_CLIENT_ID`.
2. Configurer l'URL de redirection: `http://localhost:3000/api/auth/callback`.
3. Créer une connexion SAML/OIDC dans WorkOS.
4. Mapper le domaine entreprise (`acme.com`) côté Hub2gether dans la table `Company`.

## Déploiement Vercel
1. Créer base PostgreSQL managée.
2. Définir les variables `.env.example` dans Vercel.
3. `vercel build` puis `vercel deploy`.
4. Exécuter les migrations Prisma sur l'environnement cible.

## Seed de démonstration
Le seed crée:
- 2 entreprises (`acme`, `globex`)
- utilisateurs multi-rôles
- sports, groupes, posts
- matchs et participants
- dépenses + partage
- badges + classement
- notifications + audit log

## Roadmap v2
- Chat temps réel (WebSocket / Pusher)
- Réseau inter-entreprises sécurisé
- Module tournoi complet (bracket, scoring)
- Recommandation intelligente de matchs (ML scoring)
- Import RH / provisioning SCIM
- Analytics avancées (cohortes, rétention, BI exports)
