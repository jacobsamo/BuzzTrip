# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

In all interactions and commit messages, be concise, clear and sacrifice grammar for the sake of concision.

## Essential Information

This is a mono repo using turbo repo that contains a set of packages and apps across nextjs framework and expo. **Always check the `/docs/` folder for detailed documentation before making changes.**

## Quick Start

```bash
bun dev        # Start development server (Rails + Vite)
```

## Documentation Structure

📁 **`/docs/` - All detailed documentation lives here**

Start with **[/docs/overview.md](/docs/overview.md)** which indexes all documentation:

- **[Architecture](/docs/architecture.md)** - Application structure, patterns, and technology stack
- **[Testing](/docs/testing.md)** - Testing strategy and how to write/run tests  
- **[Commands](/docs/commands.md)** - Complete development command reference

## Critical Information

### When Creating New Features
1. Check `/docs/architecture.md` for patterns and structure
2. Follow existing code conventions in similar files
3. Test features using the Playwright MCP

### Technology Stack
- **Backend**: Convex
- **Frontend**: Svelte 5 with Inertia.js
- **Styling**: Tailwind CSS + DaisyUI + ShadcnUI
- **Build**: Vite

### Key Directories
- `/apps/web/` - Main web application (Next.js) includes the landing pages and main web app
- `/apps/admin/` - Admin dashboard (Next.js) includes the admin dashboard
- `/apps/mobile` - BuzzTruck mobile app (Expo)
- `/packages/backend/` - Convex backend, schemas, functions, types and more
- `/packages/ui/` - Shared UI components
- `/packages/transactional/` - Email templates
- `/docs/` - Detailed documentation

## Always Remember

1. **Read the docs first** - Check `/docs/` before implementing
2. **Follow patterns** - Look at existing code for conventions
3. **Security matters** - Never commit secrets, use credentials
