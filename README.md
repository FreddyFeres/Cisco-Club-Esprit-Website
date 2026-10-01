# Cisco Club ESPRIT — Plateforme de Gestion

> Plateforme web complète pour le Cisco Club de l'ESPRIT (Ariana, Tunisie).  
> Stack : **Next.js 16 + TypeScript + Prisma + PostgreSQL + NextAuth + Recharts + shadcn/ui**

---

## 🗂️ Structure du projet

```
cisco-club-esprit/
├── prisma/
│   ├── schema.prisma      # Schéma BDD complet (7 modules)
│   └── seed.ts            # Données de démonstration réalistes
├── src/
│   ├── actions/           # Server Actions (auth, events, meetings, sponsors, rh)
│   ├── app/
│   │   ├── (public)/      # Pages publiques (events, ...)
│   │   ├── admin/         # Espace back-office protégé
│   │   │   ├── analytics/ # Dashboard analytique complet
│   │   │   ├── attendance/# Pointage QR & feuille d'appel
│   │   │   ├── meetings/  # Gestion des réunions + PV
│   │   │   ├── rh/        # Ressources Humaines
│   │   │   └── sponsors/  # Kanban sponsoring
│   │   ├── api/auth/      # Route NextAuth
│   │   ├── auth/          # Login & Register
│   │   └── page.tsx       # Dashboard principal
│   ├── components/
│   │   ├── ui/            # Composants shadcn/ui
│   │   └── providers.tsx  # SessionProvider NextAuth
│   ├── lib/
│   │   ├── auth.ts        # Configuration NextAuth
│   │   └── prisma.ts      # Client Prisma singleton
│   ├── actions/           # Server Actions typées
│   ├── types/             # Types TypeScript (next-auth.d.ts)
│   └── middleware.ts      # RBAC : protection des routes
└── .env.example           # Variables d'environnement à configurer
```

---

## 🚀 Installation et démarrage

### Prérequis
- Node.js 18+
- npm ou pnpm
- Une base de données PostgreSQL (locale ou cloud)

### 1. Cloner et installer

```bash
git clone <url-du-repo>
cd cisco-club-esprit
npm install
```

### 2. Configurer l'environnement

```bash
cp .env.example .env
```

Éditez `.env` avec vos valeurs :

```env
# Base de données (Neon recommandé pour le cloud)
DATABASE_URL="postgresql://user:password@host:5432/cisco_club?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-secret-genere-avec-openssl"
```

**Générer NEXTAUTH_SECRET :**
```bash
openssl rand -base64 32
```

### 3. Initialiser la base de données

```bash
# Créer les tables
npm run db:push

# Insérer les données de démonstration
npm run db:seed
```

### 4. Lancer en développement

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

---

## 🔐 Comptes de démonstration

Après le seed, tous les comptes ont le même mot de passe : **`Cisco@2024`**

| Nom | Email | Rôle |
|-----|-------|------|
| Youssef Gharbi | youssef.gharbi@esprit.tn | **ADMIN** (accès total) |
| Ines Mahmoud | ines.mahmoud@esprit.tn | RH |
| Khalil Ferjani | khalil.ferjani@esprit.tn | TRESORIER_SPONSORING |
| Ahmed Ben Ali | ahmed.benali@esprit.tn | RESPONSABLE_CELLULE |
| Fatma Oueslati | fatma.oueslati@esprit.tn | MEMBRE |

---

## 🌐 Pages disponibles

| Page | URL | Accès |
|------|-----|-------|
| Dashboard principal | `/` | Auth requis |
| Analytics complet | `/admin/analytics` | Admin |
| Membres & RH | `/admin/rh` | Admin / RH |
| Sponsoring (Kanban) | `/admin/sponsors` | Admin / Trésorier |
| Réunions | `/admin/meetings` | Membres |
| Pointage / Assiduité | `/admin/attendance` | Admin / Resp. |
| Événements (public) | `/events` | Tout le monde |
| Connexion | `/auth/login` | — |
| Inscription | `/auth/register` | — |

---

## ☁️ Déploiement sur Vercel + Neon

### Option A — Vercel + Neon (Recommandé, 100% gratuit)

**1. Créer une base Neon**
- Aller sur [neon.tech](https://neon.tech)
- Créer un projet → copier l'URL de connexion

**2. Déployer sur Vercel**
```bash
npx vercel --prod
```

**3. Variables d'environnement Vercel**  
Dans le dashboard Vercel → Settings → Environment Variables :
```
DATABASE_URL=<votre-url-neon>
NEXTAUTH_URL=<votre-url-vercel>.vercel.app
NEXTAUTH_SECRET=<votre-secret>
```

**4. Migrer et seeder en production**
```bash
npx prisma db push
npm run db:seed
```

---

### Option B — Docker Compose (auto-hébergement)

```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: cisco_club
      POSTGRES_USER: ciscouser
      POSTGRES_PASSWORD: CiscoPass2024!
    ports: ["5432:5432"]
    volumes: [postgres_data:/var/lib/postgresql/data]

  app:
    build: .
    ports: ["3000:3000"]
    environment:
      DATABASE_URL: "postgresql://ciscouser:CiscoPass2024!@postgres:5432/cisco_club"
      NEXTAUTH_URL: "http://localhost:3000"
      NEXTAUTH_SECRET: "votre-secret"
    depends_on: [postgres]

volumes:
  postgres_data:
```

```bash
docker-compose up -d
docker-compose exec app npm run db:push
docker-compose exec app npm run db:seed
```

---

## 📊 KPI — Définitions et Formules

| KPI | Formule | Source |
|-----|---------|--------|
| **Taux d'assiduité** | `(PRESENT + EXCUSE) / total_pointages × 100` | Table `Attendance` |
| **Taux de no-show** | `ABSENT / total_inscrits_event × 100` | `Registration` ∩ `Attendance` |
| **Taux de remplissage** | `inscrits_confirmés / event.capacity × 100` | `Registration`, `Event` |
| **Pipeline pondéré** | `Σ(deal.amountEstimated × deal.probability / 100)` | Table `Deal` |
| **Taux de conversion sponsor** | `signés / total_prospects_période × 100` | Table `Sponsor` |
| **Taux de rétention** | `(actifs_fin - nouveaux) / actifs_début × 100` | Table `Member` (joinDate) |
| **Score membre** | `(assiduité × 0.4) + (tâches_done × 0.35) + (events × 0.25)` | Composite |

---

## 🛡️ Sécurité

- **Mots de passe** : hachés bcrypt (cost factor 10)
- **Sessions** : JWT httpOnly via NextAuth
- **RBAC** : Middleware Next.js + garde serveur sur chaque Server Action
- **Validation** : Zod côté serveur sur toutes les Server Actions
- **Audit** : Journal des actions admin dans la table `AuditLog`

---

## 📝 Variables d'environnement complètes

Voir [`.env.example`](./.env.example)

---

*Cisco Club ESPRIT — Développé avec ❤️ pour les étudiants de l'ESPRIT, Ariana, Tunisie.*
