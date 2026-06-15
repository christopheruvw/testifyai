# TestifyAI

The fastest and easiest way to collect testimonials from students, clients, and community members. Guided multi-step form + AI-generated polished testimonials.

## Features

- **11-step guided testimonial form** at `/share` — no login required for respondents
- **AI-powered generation** — creates Short, Professional, and Story-Based versions
- **Review & edit flow** — respondents approve, edit, or write their own version
- **Admin dashboard** at `/admin` — view, edit, delete, and export testimonials
- **Email notifications** — admin alerted on new submissions via ZeptoMail
- **CSV export** — download all testimonials
- **Photo uploads** — optional respondent photos via Supabase Storage

## Tech Stack

- Next.js 15 (App Router) + TypeScript
- TailwindCSS + Shadcn-style UI components
- Supabase (PostgreSQL + Auth + Storage)
- Groq API (llama-3.3-70b-versatile, free tier)
- ZeptoMail (email)
- Vercel Analytics

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run the SQL in `supabase/schema.sql` in the SQL Editor
3. Create an admin user: Authentication → Users → Add User

### 3. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

### 4. Run locally

```bash
npm run dev
```

- Testimonial form: [http://localhost:3000/share](http://localhost:3000/share)
- Admin dashboard: [http://localhost:3000/admin](http://localhost:3000/admin)

### 5. Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add all environment variables
4. Deploy

## Project Structure

```
src/
├── app/
│   ├── share/              # Public testimonial form
│   ├── admin/              # Protected admin dashboard
│   └── api/                # AI generation, export, upload
├── components/
│   ├── share/              # Form components
│   ├── admin/              # Dashboard components
│   └── ui/                 # Reusable UI primitives
├── actions/                # Server actions
└── lib/                    # Supabase, Groq AI, email, types
```

## User Flow

1. Landing → Start
2. Relationship type
3. Impact areas (multi-select)
4. Experience description
5. Transformation/outcomes
6. Three words
7. AI generates 3 testimonial versions
8. Review, edit, or write custom
9. Public sharing permission
10. Identity (name, email, photo, visibility)
11. Submit → Success page

## License

Private — for Mark's use. Future SaaS roadmap in PRD.
