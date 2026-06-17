# SkillBridge AI

> A full-stack EdTech SaaS prototype that helps tutors and education programs track student progress, analyze tutoring session notes, identify learning gaps, and generate personalized learning recommendations using AI.

SkillBridge AI includes student profiles, skill-mastery tracking, progress dashboards, AI-generated practice plans, and exportable parent/admin reports — all built on realistic demo data with a clean, component-driven architecture.

![Dashboard](docs/screenshots/dashboard.png)

---

## Table of Contents

- [Overview](#overview)
- [The Problem](#the-problem)
- [The Solution](#the-solution)
- [Features](#features)
- [The AI Feature](#the-ai-feature)
- [Tech Stack](#tech-stack)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
- [Demo Login](#demo-login)
- [Data Model](#data-model)
- [Project Structure](#project-structure)
- [Future Improvements](#future-improvements)
- [What I Learned](#what-i-learned)

---

## Overview

SkillBridge AI is a modern SaaS dashboard for tutoring programs. It centralizes everything a tutor or program admin needs: a real-time progress dashboard, a searchable student roster, detailed student profiles, session logging, skill-mastery analytics, and AI tools that turn rough session notes into structured, actionable plans and parent-ready summaries.

The app is intentionally built like a real product — with empty states, loading states, form validation, responsive layouts, and a typed data layer that mirrors a production Supabase schema.

## The Problem

Tutors and small education programs juggle progress tracking across spreadsheets, sticky notes, and memory. As a result:

- **Learning gaps are spotted late.** Patterns in a student's struggles are hard to see across sessions.
- **Notes don't turn into action.** Free-form session notes rarely translate into a concrete next step.
- **Reporting is time-consuming.** Writing parent/admin updates by hand eats into teaching time.
- **Progress isn't visible.** There's no single view of how a student — or the whole program — is trending.

## The Solution

SkillBridge AI brings it all into one polished workspace:

- A **dashboard** that surfaces who needs attention and what to do next.
- **Student profiles** with skill-mastery charts, goals, and history at a glance.
- An **AI Learning Gap Analyzer** that reads a rough note and returns the detected gap, likely cause, recommended next step, a hands-on practice activity, a parent-friendly update, and a tutor action plan.
- A **Practice Plan Generator** that produces a structured 5-part lesson around any skill.
- **Exportable reports** for parents and admins.

## Features

- **Dashboard** — total students, students needing support, sessions this week, average skill mastery, AI-generated action items, an attention queue, and charts for skill mastery by subject, session performance trend, and students by support level.
- **Students** — searchable, filterable roster (by grade, subject, support level) with table and grid views, status labels (On Track, Improving, Needs Support, High Priority), and an Add Student modal with validation.
- **Student Profile** — strengths, needs-support areas, skill-mastery chart, recent sessions, AI recommendations, learning goals with progress, and a parent/admin summary.
- **Sessions** — log session notes with date, subject, skill focus, performance score, and next steps; filter and review session history.
- **Skills** — program-wide skill catalog grouped by subject with average mastery and coverage.
- **AI Reports** — the Learning Gap Analyzer (see below).
- **Practice Plans** — comprehensive AI-powered practice plan generator with timed session structures (15/30/45/60 min), subject-specific materials, tutor scripts, differentiation tips, exit tickets, and parent summaries. Includes save/copy/export actions and saved plans history.
- **Reports** — parent/admin progress summaries (coming soon).
- **Settings** — profile, notification toggles, and AI/database integration status.
- **Polish** — responsive layout, sidebar navigation, global search, empty states, loading skeletons, and form validation throughout.

## The AI Features

### 1. AI Learning Gap Analyzer

The **AI Learning Gap Analyzer** is the centerpiece. A tutor pastes a rough note like:

> "Bruce thinks 1/4 is bigger than 1/3 because 4 is bigger than 3, and gets frustrated quickly."

…and receives a structured response:

| Field | Example output |
| --- | --- |
| **Detected gap** | Fraction magnitude misconception — treating the denominator like a whole number. |
| **Likely cause** | Applying whole-number reasoning to fractions without a concrete model. |
| **Recommended next step** | Use fraction tiles/area models before symbols. |
| **Practice activity** | Fold paper strips into thirds and fourths and overlay to compare. |
| **Parent-friendly update** | Warm, jargon-free summary for guardians. |
| **Tutor action plan** | A short, ordered checklist for the next session. |

### 2. AI Practice Plan Generator

The **Practice Plan Generator** creates comprehensive, timed tutoring sessions tailored to any skill and student. Features include:

- **Smart form inputs** — student selector (with auto-populated context panel), subject, skill focus (with AI-suggested skills based on lowest mastery), session duration (15/30/45/60 min), support level, and tutor notes
- **Student context panel** — displays current mastery, main learning gap, recent trend, AI recommended focus, and sessions completed when a student is selected
- **Timed session plan** — automatically adjusts activity timing based on duration selection:
  - 15 min: Quick review → Guided practice → Exit check
  - 30 min: Warm-up → Mini lesson → Guided practice → Independent practice → Exit ticket
  - 45/60 min: Extended sessions with deeper practice and reflection
- **Subject-specific materials** — curated lists (e.g., fraction manipulatives for Math, graphic organizers for Reading)
- **Tutor script** — 6 sentence starters and prompts aligned to the skill focus
- **Differentiation tips** — color-coded strategies for students who struggle, are on track, or need challenge
- **Exit ticket** — subject-appropriate assessment aligned to the skill focus
- **Parent-friendly summary** — jargon-free update for guardians
- **Plan actions** — Save, Copy (clipboard), Download PDF (placeholder), Regenerate, Start Session
- **Saved plans history** — Load and delete previously generated plans

### How it's built (and how to make it live)

The AI is **mocked but production-shaped**. The logic lives in [`src/lib/ai.ts`](src/lib/ai.ts) and is served via API routes at [`src/app/api/analyze`](src/app/api/analyze/route.ts) and [`src/app/api/practice-plan`](src/app/api/practice-plan/route.ts).

- The mock engine uses lightweight keyword matching so different notes produce different, realistic results during demos.
- The functions return the **exact shape** a real model call would, so the UI never changes when you go live.
- To enable real generation: add `OPENAI_API_KEY` to `.env.local` and replace the mock call inside the API route with an OpenAI chat completion using the exported `GAP_ANALYSIS_SYSTEM_PROMPT`. The app already detects the key and flips the `Mock AI` badge off.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Icons:** lucide-react
- **AI:** OpenAI-ready API routes (mocked by default)
- **Data:** Typed local mock layer, modeled on a Supabase schema

## Screenshots

> Replace these placeholders with real screenshots in `docs/screenshots/`.

| Dashboard | Student Profile |
| --- | --- |
| ![Dashboard](docs/screenshots/dashboard.png) | ![Profile](docs/screenshots/profile.png) |

| AI Gap Analyzer | Reports |
| --- | --- |
| ![Analyzer](docs/screenshots/analyzer.png) | ![Reports](docs/screenshots/reports.png) |

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. (Optional) configure integrations
cp .env.example .env.local   # add OPENAI_API_KEY / Supabase keys to go live

# 3. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # lint
```

## Demo Login

This prototype ships with a **pre-authenticated demo workspace** — no login required.

- **User:** Jordan Mitchell (Program Admin)
- **Email:** `jordan.mitchell@skillbridge.ai`
- **Password:** _not required in demo mode_

Authentication is intentionally stubbed so reviewers can explore immediately. The `users` table and roles are modeled for a future Supabase Auth integration.

## Data Model

Strongly-typed interfaces in [`src/types/index.ts`](src/types/index.ts) mirror the planned Supabase tables.

| Type | Table | Purpose |
| --- | --- | --- |
| `User` | `users` | Tutors / program admins |
| `Student` | `students` | Student roster and profile data |
| `Session` | `sessions` | Tutoring session notes + scores |
| `Skill` | `skills` | Reusable skill catalog |
| `StudentSkill` | `student_skills` | Per-student mastery (with trend) |
| `AIReport` | `ai_reports` | Learning-gap analyses |
| `PracticePlan` | `practice_plans` | Generated practice plans |
| `Goal` | `goals` | Student learning goals |

Demo data (10 students across grades 1–5, with sessions, skills, goals, and AI examples) lives in [`src/data/`](src/data) and is exposed through small selector functions so swapping in Supabase queries later requires no UI changes.

## Project Structure

```
src/
├── app/                  # Next.js App Router pages + API routes
│   ├── api/              # /analyze and /practice-plan (OpenAI-ready)
│   ├── students/         # roster + dynamic [id] profile
│   ├── sessions/  skills/  ai-reports/  practice-plans/  reports/  settings/
│   ├── layout.tsx        # root layout (wraps AppShell)
│   └── page.tsx          # Dashboard
├── components/
│   ├── layout/           # Sidebar, Header, AppShell, nav config
│   ├── ui/               # Card, Button, Modal, Badge, Field, etc.
│   ├── charts/           # Recharts wrappers
│   ├── ai/               # GapAnalyzer, PracticePlanGenerator
│   ├── students/  sessions/  reports/
├── data/                 # typed mock data + selectors
├── lib/                  # ai.ts (mock engine), utils.ts
└── types/                # domain models
```

## Future Improvements

- Wire up **Supabase** (Postgres + Auth + RLS) using the existing schema.
- Replace the mock AI engine with **live OpenAI** structured outputs.
- Real **PDF/CSV export** and emailed parent reports.
- **Multi-tutor** roles, assignment, and audit history.
- Editable **goals and skills** with optimistic updates.
- Real-time **fluency/assessment capture** and trend forecasting.
- Test coverage with **Playwright** (E2E) and **Vitest** (unit).

## What I Learned

- Designing a **typed data layer** that mirrors a real database schema makes the eventual backend migration almost mechanical.
- Structuring AI features around a **stable response contract** lets you ship a convincing mock and swap in a real model with zero UI churn.
- Investing in **reusable UI primitives** (cards, badges, fields, modals) keeps nine feature pages visually consistent and fast to build.
- Small details — empty states, loading skeletons, validation, responsive breakpoints — are what make a prototype feel like a real product.

---

_Built as a portfolio project to demonstrate full-stack product engineering: TypeScript, Next.js, component architecture, data modeling, and pragmatic AI integration._
