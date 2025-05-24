# CARMEET 🚗

## Présentation du projet – MyDigitalProject

Dans le cadre du programme **MyDigitalProject**, nous avons conçu **CARMEET**, une plateforme sociale innovante dédiée aux passionnés d'automobile. Ce projet répond à un besoin clair : rassembler une communauté souvent éclatée entre forums, groupes privés et événements peu référencés, en centralisant les échanges et les rassemblements sur une interface unique.

**CARMEET** repose sur une carte interactive qui permet de localiser facilement des événements automobiles, qu'ils soient gratuits ou premium, tout en assurant un cadre sécurisé grâce à la vérification des profils.

Chaque utilisateur dispose d'un profil pilote personnalisé, associé à un QR code à apposer sur son véhicule, pour faciliter les échanges lors des rassemblements. La plateforme intègre également des fonctionnalités sociales : messagerie, galerie photo, et vente de pièces détachées.

À travers ce projet, nous souhaitons apporter une solution digitale concrète, communautaire et sécurisée à l'univers automobile, en phase avec les attentes d'une génération connectée et passionnée.

## Architecture du projet

Le projet est divisé en deux parties principales :

- **`api/`** : Backend Node.js avec Express et base de données MySQL
- **`front/`** : Frontend Nuxt.js avec TypeScript

## Installation et configuration

### Prérequis

- Node.js (version 16 ou supérieure)
- MySQL/MAMP
- npm ou yarn

### 1. Configuration de la base de données

Assurez-vous d'avoir MySQL en cours d'exécution (via MAMP ou directement) et créez une base de données nommée `carmeet`.

### 2. Configuration du Backend (API)

```bash
cd api
npm install
```

Créez un fichier `.env` dans le dossier `api/` avec le contenu suivant :

```env
DB_NAME=carmeet
DB_USER=root
DB_PASSWORD=root
DB_HOST=localhost
DB_PORT=8889
DB_DIALECT=mysql
PORT=3002
GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY
JWT_SECRET=your_jwt_secret_key_here
SYNC_DB=true
```

Démarrez le serveur backend :

```bash
node index.js
```

Le serveur API sera accessible sur `http://localhost:3002`

### 3. Configuration du Frontend

```bash
cd front
npm install
```

Créez un fichier `.env` dans le dossier `front/` avec le contenu suivant :

```env
NUXT_PUBLIC_CARMEET_API_URL=http://localhost:3002/api
NUXT_PUBLIC_MAPBOX_TOKEN=YOUR_MAPBOX_TOKEN
```

Démarrez le serveur de développement :

```bash
npm run dev
```

Le frontend sera accessible sur `http://localhost:3000`

## Guide d'utilisation

### Fonctionnalités principales du prototype

1. **Recherche d'adresse** 📍

   - Sur la page d'accueil, utilisez la barre de recherche pour saisir une adresse
   - L'autocomplétion Google Maps vous proposera des suggestions en temps réel
   - Sélectionnez l'adresse souhaitée dans la liste

2. **Carte interactive** 🗺️

   - Une fois l'adresse sélectionnée, une carte interactive s'affiche
   - Visualisez tous les événements automobiles dans la région
   - Deux types de marqueurs sont disponibles :
     - **Événements gratuits** (marqueur vert)
     - **Événements payants** (marqueur rouge)

3. **Consultation des événements** 🎪
   - Cliquez sur un marqueur pour accéder aux détails de l'événement
   - Consultez les informations : date, heure, description, tarifs
   - Découvrez les participants et organisateurs

### Navigation

- **Accueil** : Recherche d'adresse et carte principale
- **Événements** : Liste complète des événements
- **Boutique** : Section dédiée aux pièces détachées
- **Contact** : Informations de contact

## Technologies utilisées

### Backend

- Node.js & Express.js
- MySQL avec Sequelize ORM
- JWT pour l'authentification
- API Google Maps pour la géolocalisation

### Frontend

- Nuxt.js 3 avec TypeScript
- Mapbox pour les cartes interactives
- Tailwind CSS pour le styling
- Composables Vue.js pour la logique métier

## Structure des données

Le projet gère plusieurs entités principales :

- **Users** : Utilisateurs de la plateforme
- **Events** : Événements automobiles
- **Cars** : Véhicules des utilisateurs
- **Profiles** : Profils pilotes avec QR codes
- **Tickets** : Billets pour les événements payants

---

_Projet réalisé dans le cadre du MyDigitalProject - Passionnés d'automobile, rejoignez la communauté CARMEET ! 🏁_
