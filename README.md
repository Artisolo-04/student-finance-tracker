# FinTrack — Student Finance Tracker

A modern, full-stack personal finance tracker built specifically for students. FinTrack helps you understand where your money goes, plan your spending with envelope-based budgeting, and build better financial habits over time.

---

## Features

**Transactions & Categories**
- Add income and expense transactions with custom categories, notes, and dates
- Color-coded categories with icons
- Search, filter by type, date range, and category

**Envelope Budgeting**
- Allocate your income across spending categories at the start of each income cycle
- Track how much you've spent vs allocated per envelope, in real time
- Daily remaining amount calculated automatically per envelope
- Alerts at 80% and 100% of each envelope

**Dashboard**
- Live balance, total savings, income, and expense summary cards
- Contextual alerts: low balance, unallocated income, budget warnings
- Recent transactions and savings overview with direct navigation

**Calendar View**
- Month-grid heatmap — green for net positive days, red for net negative
- Click any day to see a full transaction breakdown in a slide-in drawer
- Navigate across any month and year

**Analytics**
- Category breakdown with pie chart and percentage bars
- Monthly income vs expenses bar chart
- Best month, worst month, average net per month
- 6 auto-generated insights based on your actual data (biggest expense category, savings rate, spending trends, busiest month, largest single expense)

**Savings**
- Automatic savings: leftover balance is saved every time new income arrives
- Savings history with running total and savings rate

**Settings**
- Profile and password management
- Light / Dark / System theme
- Budget Goals management (set, update, remove envelopes)

---

## Tech Stack

**Frontend**
- React 18 + Vite
- Tailwind CSS
- Recharts (charts)
- React Router v6
- Lucide React (icons)

**Backend**
- Node.js + Express
- PostgreSQL
- JWT authentication
- RESTful API

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### 1. Clone the repo

```bash
git clone https://github.com/Artisolo-04/student-finance-tracker.git
cd student-finance-tracker
```

### 2. Set up environment variables

Create `server/.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=student_finance
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
PORT=5000
```

### 3. Set up the database

Create the database and run migrations in order:

```bash
psql -U postgres -c "CREATE DATABASE student_finance;"

psql -U postgres -d student_finance -f server/src/db/migrations/001_users.sql
psql -U postgres -d student_finance -f server/src/db/migrations/002_categories.sql
psql -U postgres -d student_finance -f server/src/db/migrations/003_transactions.sql
psql -U postgres -d student_finance -f server/src/db/migrations/004_savings.sql
psql -U postgres -d student_finance -f server/src/db/migrations/005_categories_type.sql
psql -U postgres -d student_finance -f server/src/db/migrations/006_budgets.sql
psql -U postgres -d student_finance -f server/src/db/migrations/007_budgets_cycle.sql
```

### 4. Install dependencies and start

**Backend:**
```bash
cd server
npm install
npm run dev
```

**Frontend (new terminal):**
```bash
cd client
npm install
npm run dev
```

App runs at `http://localhost:5173`, API at `http://localhost:5000`.

---

## Project Structure

```
student-finance-tracker/
├── client/                  # React frontend
│   └── src/
│       ├── api/             # Axios instance
│       ├── components/      # Shared UI components
│       ├── context/         # Finance, Auth, UI context + reducers
│       └── pages/           # Dashboard, Transactions, Calendar, Analytics, Savings, Settings
└── server/                  # Express backend
    └── src/
        ├── controllers/     # authController, transactionController, budgetController...
        ├── db/              # Pool config + SQL migrations
        ├── middleware/      # JWT auth middleware
        └── routes/          # auth, transactions, categories, savings, budgets
```

---

## Key Design Decisions

**Income-cycle budgeting, not calendar-month budgeting** — budgets reset when new income arrives, not on the 1st of the month. This matches how students actually receive money (weekly allowance, irregular family transfers, scholarships) rather than forcing a rigid monthly model.

**Auto-save on new income** — leftover balance from the previous cycle is automatically moved to savings when new income arrives. Students shouldn't have to remember to save — the app does it for them.

**Timezone-safe date handling** — all date comparisons use `TO_CHAR` on the PostgreSQL side and a custom `parseLocalDate()` on the frontend, preventing off-by-one-day bugs regardless of server or browser timezone.

---

## Author

**Khelifi Hachem** — [@Artisolo-04](https://github.com/Artisolo-04)

---

*Built as a real-world learning project — designed for students, by a student.*
