# BuildWise AI

BuildWise AI is an AI-powered backend mentor designed for beginner developers. The platform helps users transform their application ideas into structured backend architecture plans while learning the reasoning behind every technical recommendation.


## Features

The MVP includes:

- Backend architecture planning.
- Educational technology recommendations.
- Follow-up questions relating to generated plans.
- Secure authentication.
- Saved backend plans.
- Responsive user interfaces.


## Tech Stack

The project is built with:

- Next.js
- TypeScript
- TailwindCSS
- shadcn/ui
- Supabase
- Heroicons
- Framer Motion
- Vercel


## Getting Started

Install dependencies:

```bash
npm install
```

Create your local environment file and fill in the Supabase values:

```bash
cp .env.example .env.local
```

Full configuration steps, including Google OAuth, are in
[docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md). Authentication will not work
until those steps are complete.

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```


## Scripts

```bash
npm run dev        # Start the development server
npm run build      # Production build
npm run start      # Serve the production build
npm run lint       # ESLint
npm run typecheck  # TypeScript, no emit
```


## Deployment

Full steps, including pushing to GitHub and connecting Vercel, are in
[docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md) section 8.

Before the first deployment, set these in the Vercel project:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_SITE_URL
```

`NEXT_PUBLIC_SITE_URL` must be the deployed address. Supabase also needs
`https://your-domain.com/auth/confirm` added to its redirect URLs, or sign in
will fail in production.


## Project Structure

```text
app/
    (auth)/          Sign in, sign up, forgot password, new password
    auth/confirm/    Return point for every Supabase email and OAuth link
    dashboard/       Protected route
    create-plan/     Backend plan form
    generated-plan/  Generated plan, currently example data

components/
    auth/          Authentication forms and shared auth shell
    dashboard/     Sidebar, shell and logout
    landing/       Landing page sections
    plans/         Plan form and generated plan sections
    shared/        Reusable pieces used across areas
    ui/            shadcn/ui primitives

lib/
    actions/       Server actions
    constants/     Static content and navigation
    helpers/       Validation, error copy, profile mapping
    supabase/      Browser, server and proxy clients
    utils/         Small generic utilities

types/             Shared TypeScript types
proxy.ts           Session refresh and route protection
```


## Documentation

Product, design and build documentation lives in [docs/](docs/). The
documentation is the source of truth for this project and takes precedence over
anything inferred from the code.


## Project Status

BuildWise AI is currently under active development.

Authentication, the landing page, the dashboard and the plan creation flow are
implemented. The generated plan currently renders worked example data.

AI generation, saved plans and settings are planned for later phases.
