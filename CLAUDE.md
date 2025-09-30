# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

BuzzTrip is a custom mapping platform built as a monorepo with multiple applications and shared packages. It provides an alternative to Google My Maps with features for creating custom maps, managing places, markers, collections, and collaborative mapping.

### Architecture

This is a **Turborepo monorepo** with the following structure:
- `apps/web` - Main Next.js web application (port 5173)
- `apps/admin` - Admin dashboard Next.js application (port 5176)
- `apps/mobile` - React Native Expo mobile application (WIP will need to be rewritten soon)
- `packages/backend` - Shared Convex backend and data models
- `packages/components` - Shared UI component library
- `packages/tsconfig` - Shared TypeScript configurations

### Tech Stack

**Core Technologies:**
- **Frontend:** Next.js 15 with App Router, React 19, TypeScript
- **Backend:** Convex (real-time database with serverless functions)
- **Authentication:** Clerk
- **Styling:** TailwindCSS v4
- **Mobile:** React Native with Expo
- **Package Manager:** Bun
- **Monorepo:** Turborepo

**Key Dependencies:**
- **UI Components:** Radix UI primitives, shadcn/ui patterns
- **State Management:** TanStack Query, Zustand
- **Maps:** Google Maps API, Mapbox GL, Terra Draw
- **Analytics:** PostHog, Sentry
- **Email:** Resend (via Convex integration)

## Visual Development

### Design Principles
- Comprehensive design checklist in `/specs/context/design-principles.md`
- Brand style guide in `/specs/context/style-guide.md`
- When making visual (front-end, UI/UX) changes, always refer to these files for guidance

### Quick Visual Check
IMMEDIATELY after implementing any front-end change:
1. **Identify what changed** - Review the modified components/pages
2. **Navigate to affected pages** - Use `mcp__playwright__browser_navigate` to visit each changed view
3. **Verify design compliance** - Compare against `/specs/context/design-principles.md` and `/specs/context/style-guide.md`
4. **Validate feature implementation** - Ensure the change fulfills the user's specific request
5. **Check acceptance criteria** - Review any provided context files or requirements
6. **Capture evidence** - Take full page screenshot at desktop viewport (1440px) of each changed view
7. **Check for errors** - Run `mcp__playwright__browser_console_messages`

This verification ensures changes meet design standards and user requirements.

### Comprehensive Design Review
Invoke the `@agent-design-review` subagent for thorough design validation when:
- Completing significant UI/UX features
- Before finalizing PRs with visual changes
- Needing comprehensive accessibility and responsiveness testing


## Development Commands

### Root Level Commands
```bash
bun install                    # Install dependencies
bun run dev                    # Start all apps in development
bun run build                  # Build all packages and apps
bun run lint                   # Lint all packages (includes sherif check)
bun sherif                     # Check dependency consistency across workspace
bun run clean:all              # Clean all node_modules and build artifacts
```

### Individual App Development
```bash
# Web app (apps/web)
cd apps/web && bun run dev                    # Port 5173
cd apps/web && bun run build
cd apps/web && bun run lint

# Admin app (apps/admin)
cd apps/admin && bun run dev                  # Port 5176
cd apps/admin && bun run build
cd apps/admin && bun run lint

# Mobile app (apps/mobile)
cd apps/mobile && bun run start              # Expo development server
cd apps/mobile && bun run android            # Run on Android
cd apps/mobile && bun run ios                # Run on iOS
```

### Backend Development
```bash
# Convex backend (packages/backend)
cd packages/backend && bun run dev           # Start Convex development server
cd packages/backend && bun run setup         # Setup Convex until success
cd packages/backend && bun run deploy        # Deploy to Convex
```

## Convex Backend Architecture

The backend uses **Convex** as a real-time database with serverless functions. All Convex code follows the new function syntax with proper validators.

### Key Convex Guidelines
- Always use new function syntax with `args` and `returns` validators
- Use `query`, `mutation`, `action` for public functions
- Use `internalQuery`, `internalMutation`, `internalAction` for internal functions
- All functions must include `returns` validator (use `v.null()` if no return value)
- Database schema is defined using Zod schemas with `zodToConvex` helper

### Database Schema (packages/backend/convex/schema.ts)
**Core Tables:**
- `users` - User profiles with Clerk integration
- `maps` - Map definitions with visibility settings
- `markers` - Map markers linked to places
- `collections` - Grouped map elements
- `paths` - Drawing paths on maps
- `places` - Location data with multiple provider IDs (Google, Mapbox, Foursquare)
- `places_reviews` - User reviews for places
- `labels` - Custom labels for map elements

## Shared Component Library

The `@buzztrip/components` package provides shared UI components following shadcn/ui patterns with Radix UI primitives. Components are exported modularly:

```typescript
// Import specific UI components
import { Button } from "@buzztrip/components/ui"
import { Icon } from "@buzztrip/components/icon"

// Import utilities
import { cn } from "@buzztrip/components/lib/utils"
```

## Environment Setup

Each app requires environment variables for:
- **Clerk:** Authentication provider
- **Convex:** Backend database URL and deployment
- **PostHog:** Analytics tracking
- **Sentry:** Error monitoring
- **Map APIs:** Google Maps, Mapbox tokens

## Code Conventions

### TypeScript
- Strict TypeScript configuration across all packages
- Use proper typing for Convex document IDs: `Id<"tableName">`
- Shared types exported from `@buzztrip/backend/types`

### Styling
- TailwindCSS v4 for all styling
- Use `cn()` utility for conditional classes
- Components follow shadcn/ui patterns with CVA for variants

### File Organization
- Next.js App Router structure in web/admin apps
- Convex functions organized by feature (maps/, places/, etc.)
- Shared utilities in packages/backend/helpers/

## Important Notes

- **Always run `bun run lint`** before committing (includes sherif dependency checks)
- **Use Bun** as the package manager (configured in package.json)
- **Convex functions** require proper validators - never skip `args` and `returns`
- **Mobile app** uses Expo with custom development build
- **Admin app** is in active development with comprehensive analytics dashboard

## Current Development Status

The project is actively being developed with focus on the admin portal (apps/admin) featuring user management, map analytics, and platform insights. The main web app provides the core mapping functionality for end users.