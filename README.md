# CardShare (full stack)

A small app for a friend group: list which card you hold (name only), search who has the card you need, and send a request.
The cardholder pays with their own card; the buyer pays them back. Phone numbers stay hidden until the cardholder accepts a request.

**Never store or share card numbers, expiry, CVV, PIN or OTPs.** The API rejects anything that looks like a card number.

## Stack

- **Frontend:** React 18 + Vite (`client/`)
- **Backend:** Node + Express REST API (`server/`)
- **Database:** SQLite via better-sqlite3 (`server/data.db`, created on first run)
- **Auth:** email + password (bcrypt), JWT bearer tokens, optional group invite code

## Run locally

```bash
npm install                 # installs concurrently (root)
npm run install:all         # installs server + client dependencies
cp .env.example server/.env # optional; or export the variables in your shell
npm run dev                 # API on :3001, web on http://localhost:5173
```

Environment variables (`.env.example`): `JWT_SECRET` (set a long random value), `INVITE_CODE` (if set, required to sign up), `PORT`, `DB_FILE`.
The server reads real environment variables, so on macOS/Linux use `export JWT_SECRET=... INVITE_CODE=...` before `npm run dev`
(PowerShell: `$env:JWT_SECRET="..."`).

## Production

```bash
npm run build               # builds client/dist
JWT_SECRET=... INVITE_CODE=... npm start   # Express serves API + built app on :3001
```

Deploy to Render, Railway or Fly.io with a persistent disk for `data.db` (or move to Postgres).

## API

| Method | Route | Notes |
|---|---|---|
| POST | /api/auth/register, /api/auth/login | returns `{ token, user }` |
| GET | /api/me | current user |
| GET / POST | /api/listings | search with `?q=`; phone never included |
| DELETE | /api/listings/:id | owner only |
| POST | /api/requests | `{ listingId, message }` |
| GET | /api/requests/incoming, /outgoing | phone appears only when status is `accepted` |
| PATCH | /api/requests/:id | `{ status: "accepted" \| "declined" }`, listing owner only |

## Before opening to more people

No rate limiting, email verification or password reset yet. Add `express-rate-limit`, email verification, and HTTPS.
There is no payment or escrow: friends settle up directly, so keep it to people you trust.

## Project demo video's link 
https://drive.google.com/file/d/1Ij8Z0Xp1A_SKVbUYuAuGbLnPNO46oEwt/view?usp=sharing

## Website's Link
https://cardshare-hzax.onrender.com/
