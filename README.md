# Casino Jackpot — Full-Stack Slot Machine (Next.js + Prisma)

A minimal, production-ish implementation of the “Casino Jackpot” assignment.
Single repo, single Next.js app (App Router), shared types, server-authoritative game logic, and a tiny, testable domain layer.

---

## ✨ Features

* **Gameplay**: 3-reel slot, 10 starting credits, staggered reveal at 1s/2s/3s.
* **House edge**:

  * `< 40` credits → fair rolls
  * `40–60` → if roll is **winning**, 30% chance to **re-roll**
  * `> 60` → if roll is **winning**, 60% chance to **re-roll**
* **Cash Out**: moves session credits → user account balance; shows congrats banner + **Retry**.
* **Out of credits**: ends session at `0` credits; shows “Try your luck next time” + **Retry**.
* **Server authority**: sessions/credits live on the server; client is dumb UI.
* **Monorepo-style organization** with shared types/constants.

---

## 🧱 Tech Stack

* **Frontend**: Next.js (App Router), React, Tailwind, **Zustand** (store)
* **Backend**: Next.js Route Handlers (Node runtime), Prisma
* **Tests**: Vitest, Testing Library (unit + store + routes)

---


## ⚙️ Setup

1. **Install**

```bash
npm i
```

2. **Env**
   Create `.env.local` from `.env.example` and set DB connection:

```bash
cp .env.example .env.local
# edit DATABASE_URL, optionally NEXT_PUBLIC_API_BASE_URL=/api
```

3. **DB & Prisma**

```bash
npx prisma migrate dev --name init
npx prisma generate
```

4. **Run**

```bash
npm run dev
```

App: [http://localhost:3000](http://localhost:3000)

---

## 🔌 API Endpoints

* `POST /api/session` → creates/resumes session; returns `{ credits, sessionId, accountBalance }`
* `POST /api/roll` → performs roll with house rules; returns `{ symbols, delta, newCredits }`
* `POST /api/cashout` → closes session; returns `{ balance, cashed }`

> All responses set `Cache-Control: no-store`. Routes run on **Node runtime** (Prisma support).

---

## 🧪 Testing

Install dev deps (already in package.json) and run:

```bash
npm test           # vitest run
npm run test:watch # vitest watch
```

---