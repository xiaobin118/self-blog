# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A React + TypeScript personal blog in early development. Component files are empty stubs — the actual implementation following `PROJECT.md` (Chinese spec) has not started.

## Commands

- `npm run dev` — Start Vite dev server
- `npm run build` — Type-check (`tsc -b`) then bundle with Vite
- `npm run lint` — Run ESLint
- `npm run preview` — Serve production build locally

## Architecture

- **Framework:** React 19 + TypeScript 6 + Vite 8
- **Styling:** Tailwind CSS 4 via `@tailwindcss/vite` plugin + MUI 9 components + Emotion
- **Routing:** react-router-dom v7 (not yet wired up in code)
- **Animations:** Framer Motion
- **Icons:** MUI Icons + Lucide React
- **State:** React Context API for theme (planned, no external state library)

## Planned Routes (per PROJECT.md)

| Path | Page |
|------|------|
| `/` | Home |
| `/archive` | Archive |
| `/about` | About |
| `*` | 404 fallback |

## Planned Theme System

- Tailwind `dark:` class strategy with `localStorage` persistence
- `ThemeContext` providing `toggleTheme`, detecting `prefers-color-scheme`
- Current `index.css` uses CSS custom properties with media queries — needs reconciliation with Tailwind dark mode approach

## Key Conventions

- **Strict TypeScript:** `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly` — unused code will fail the build
- **Directory layout:** `components/layout/` for structural components, `components/ui/` for reusable primitives, `pages/` for route pages
- **Background images** in `public/image/home/`, `public/image/achieve/`, `public/image/about/`
- **Responsive breakpoints:** mobile (<768px), tablet (768-1024px), desktop (>1024px)

## Version Note

`PROJECT.md` references React 18 / React Router v6, but `package.json` has React 19 / React Router v7. The actual dependencies in `package.json` are authoritative.
