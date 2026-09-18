# JOD Studios

Premium cinematic post-production studio website built with Next.js App Router and TypeScript.

Public site for project inquiries, plus an admin portal to review and manage submissions.

## Getting started

```bash
cp .env.example .env.local
# Set ADMIN_PASSWORD and NEXT_PUBLIC_WHATSAPP_NUMBER
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Admin: [http://localhost:3000/admin](http://localhost:3000/admin) (HTTP Basic Auth when `ADMIN_PASSWORD` is set).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Serve production build |

## Features

- Multi-step project inquiry form with client + server validation
- JSON file–backed submissions store (`data/submissions.json`) for local/dev
- Admin portal (Basic Auth): search, filter, status, notes, filtered CSV export, delete
- Mobile nav, canvas ambient visuals, interactive orbital hero

## Production notes

- Set `ADMIN_USER` / `ADMIN_PASSWORD` before deploying; without a password, admin routes return 503 in production
- Set `NEXT_PUBLIC_WHATSAPP_NUMBER` to the studio’s WhatsApp number (digits only, with country code)
- Replace Unsplash placeholders with licensed studio assets
- The JSON file store is not durable on serverless hosts — use a real database before production traffic
