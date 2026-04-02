# Project Overview

A React single-page application built with Vite, TypeScript, Tailwind CSS, and shadcn/ui. Originally created on Lovable, migrated to Replit.

## Architecture

- **Frontend**: React 18 + TypeScript + Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS + shadcn/ui component library
- **State/Data**: TanStack React Query
- **Animations**: Framer Motion

## Key Files

- `src/App.tsx` — Root component with router and providers
- `src/main.tsx` — Entry point
- `src/pages/` — Page-level components (Index, NotFound)
- `src/components/` — Reusable UI components (including bible, ui subdirectories)
- `src/hooks/` — Custom React hooks
- `src/lib/` — Utility functions
- `src/data/` — Static data files
- `vite.config.ts` — Vite configuration (serves on port 5000)

## Development

Run the app with the "Start application" workflow, which executes `npm run dev` and serves on port 5000.

## Deployment

Static site deployment using `npm run build` which outputs to `dist/`.

## Notes

- Removed `lovable-tagger` dependency from vite config (Lovable-specific, not needed on Replit)
- Vite dev server configured to bind to `0.0.0.0:5000` for Replit compatibility
