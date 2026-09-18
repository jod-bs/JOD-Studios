# JOD Studios

Premium cinematic post-production studio website built with Next.js App Router and TypeScript.

Public site for project inquiries, plus an admin portal to review and manage submissions.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Admin portal: [http://localhost:3000/admin](http://localhost:3000/admin).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Serve production build |

## Features

- Multi-step project inquiry form with client + server validation
- JSON file–backed submissions store (`data/submissions.json`)
- Admin portal: search, filter, status updates, notes, CSV export, delete
- Canvas ambient visuals and interactive orbital hero

## Notes

- Replace Unsplash placeholders with licensed studio assets before launch
- Update WhatsApp `wa.me` URLs with JOD’s business number
- Protect `/admin` and the projects API with authentication before production use
