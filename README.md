# FinTrack — Gestion Financiere Etudiante

Application web pour suivre mes depenses et revenus en tant qu'etudiant.

## Technologies

- React.js + Tailwind CSS
- Node.js + Express.js
- PostgreSQL

## Lancer le projet

### 1. Base de donnees

psql -U postgres -c "CREATE DATABASE finance_tracker;"
psql -U postgres -d finance_tracker -f server/src/db/migrations/001_users.sql
psql -U postgres -d finance_tracker -f server/src/db/migrations/002_categories.sql
psql -U postgres -d finance_tracker -f server/src/db/migrations/003_transactions.sql
psql -U postgres -d finance_tracker -f server/src/db/migrations/004_savings.sql

### 2. Backend

cd server
npm install
npm run dev

### 3. Frontend

cd client
npm install
npm run dev

Ouvrir : http://localhost:5173

## Auteur

Khelifi Hachem — 2026
