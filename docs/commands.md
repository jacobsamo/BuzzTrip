# BuzzTrip Development Commands

> **Last Updated:** 2025-10-29
> **Version:** 1.0

This document provides a comprehensive reference for all development commands available in the BuzzTrip monorepo, including root-level commands, app-specific commands, and common workflows.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Root-Level Commands](#root-level-commands)
3. [App Commands](#app-commands)
   - [Web App (apps/web)](#web-app-appsweb)
   - [Admin App (apps/admin)](#admin-app-appsadmin)
4. [Backend Commands](#backend-commands)
5. [Package Commands](#package-commands)
6. [Turborepo Commands](#turborepo-commands)
7. [Common Workflows](#common-workflows)
8. [Command Chaining](#command-chaining)
9. [Troubleshooting](#troubleshooting)

---

## Quick Start

### First Time Setup

```bash
# Clone the repository
git clone <repository-url>
cd BuzzTrip

# Install all dependencies
bun install

# Setup Convex backend (runs until successful connection)
cd packages/backend
bun run setup
cd ../..

# Start all applications in development mode
bun run dev
```

This will start:
- **Web App** on http://localhost:5173
- **Admin App** on http://localhost:5176
- **Convex Backend** on its development server

---

## Root-Level Commands

These commands are run from the **repository root** and orchestrate tasks across all apps and packages using Turborepo.

### Core Development Commands

#### `bun install`
```bash
bun install
```
- Installs all dependencies for all apps and packages in the monorepo
- Uses Bun's workspace feature to link local packages
- Deduplicates shared dependencies
- **When to use:** First time setup, after pulling changes, after modifying package.json

#### `bun run dev`
```bash
bun run dev
```
- Starts all applications in development mode concurrently
- Runs in watch mode with hot module replacement
- Uses Turborepo's task orchestration
- **What runs:**
  - `packages/backend` -> Convex dev server
  - `apps/web` -> Next.js dev server (port 5173)
  - `apps/admin` -> Next.js dev server (port 5176)
- **When to use:** Primary development workflow

#### `bun run build`
```bash
bun run build
```
- Builds all apps and packages for production
- Respects dependency graph (builds packages before apps)
- Uses Turborepo caching for faster subsequent builds
- **Output:**
  - `apps/web/.next/` -> Web app production build
  - `apps/admin/.next/` -> Admin app production build
- **When to use:** Before deployment, testing production builds

### Code Quality Commands

#### `bun run lint`
```bash
bun run lint
```
- Runs ESLint on all apps and packages
- Runs Sherif to check workspace dependency consistency
- **Checks:**
  - TypeScript type errors
  - Code style issues
  - Unused variables
  - Import order
  - Dependency mismatches across packages
- **When to use:** Before committing, in CI/CD

#### `bun run format`
```bash
bun run format
```
- Formats all code files using Prettier
- **Formats:**
  - JavaScript/TypeScript (.js, .jsx, .ts, .tsx)
  - Markdown (.md, .mdx)
- **Applies:**
  - Organized imports
  - Tailwind class ordering
  - 2-space indentation
  - 80 character line width
- **When to use:** Before committing, after large refactors

#### `bun sherif`
```bash
bun sherif
# or
bun run sherif
```
- Validates workspace dependency consistency
- Ensures all packages use compatible versions
- Excludes `apps/mobile` from checks
- **Checks:**
  - Version mismatches between packages
  - Missing dependencies
  - Unused dependencies
- **When to use:** After updating dependencies, debugging package issues

### Maintenance Commands

#### `bun run clean:all`
```bash
bun run clean:all
```
- Removes all `node_modules/` folders
- Removes all build artifacts (`.next/`, `.turbo/`)
- Cleans cache directories
- **When to use:**
  - Resolving dependency conflicts
  - Starting fresh after major updates
  - Debugging module resolution issues

#### `bun run update`
```bash
bun run update
```
- Updates all dependencies to their latest versions
- Runs across all apps and packages
- Updates `bun.lock` file
- **When to use:**
  - Monthly dependency updates
  - After checking for security updates
  - When upgrading major frameworks

---

## App Commands

### Web App (apps/web)

All commands below are run from the `apps/web/` directory:

```bash
cd apps/web
```

#### Development Commands

##### `bun run dev`
```bash
bun run dev
```
- Starts Next.js development server on **port 5173**
- Uses **Turbopack** for faster bundling
- Enables hot module replacement (HMR)
- **Access:** http://localhost:5173
- **Features:**
  - Fast Refresh for React components
  - Automatic TypeScript compilation
  - Error overlay in browser
  - API route hot reloading

##### `bun run dev:secure`
```bash
bun run dev:secure
```
- Starts development server with **HTTPS enabled**
- Uses self-signed certificate
- **Access:** https://localhost:5173
- **When to use:**
  - Testing secure contexts (Service Workers, Web Crypto)
  - Testing authentication flows requiring HTTPS
  - Local development with OAuth providers

##### `bun run scan`
```bash
bun run scan
```
- Starts dev server **and** React Scan performance monitor
- Monitors component re-renders in real-time
- **What it does:**
  1. Starts dev server in background
  2. Launches React Scan on http://localhost:5173
- **When to use:**
  - Performance debugging
  - Identifying unnecessary re-renders
  - Optimizing component performance

#### Build Commands

##### `bun run build`
```bash
bun run build
```
- Creates optimized production build
- **Output:** `apps/web/.next/`
- **Process:**
  1. Validates TypeScript types
  2. Compiles pages and API routes
  3. Optimizes assets (images, fonts, etc.)
  4. Generates static pages
  5. Creates server bundles
- **When to use:** Before deployment, testing production behavior

##### `bun run start`
```bash
bun run start
```
- Starts production server on **port 5173**
- Requires `bun run build` to be run first
- Serves the optimized production build
- **When to use:** Testing production build locally

#### Quality Commands

##### `bun run lint`
```bash
bun run lint
```
- Runs Next.js ESLint configuration
- **Checks:**
  - React best practices
  - Next.js specific rules
  - Accessibility issues
  - Hook dependencies
- **When to use:** Before committing changes

#### Maintenance Commands

##### `bun run clean:all`
```bash
bun run clean:all
```
- Removes `node_modules/` folder
- Removes `.next/` build directory
- **When to use:**
  - Resolving build cache issues
  - Before fresh install

##### `bun run update`
```bash
bun run update
```
- Updates all dependencies to latest versions
- Uses `bun update --latest` flag
- **When to use:** Keeping web app dependencies current

---

### Admin App (apps/admin)

All commands below are run from the `apps/admin/` directory:

```bash
cd apps/admin
```

#### Development Commands

##### `bun run dev`
```bash
bun run dev
```
- Starts Next.js development server on **port 5176**
- Uses **Turbopack** for faster bundling
- Enables hot module replacement (HMR)
- **Access:** http://localhost:5176
- **Features:**
  - Same as web app dev mode
  - Admin-specific middleware applies
  - Role-based access control active

#### Build Commands

##### `bun run build`
```bash
bun run build
```
- Creates optimized production build for admin dashboard
- **Output:** `apps/admin/.next/`
- **When to use:** Before deploying admin dashboard

##### `bun run start`
```bash
bun run start
```
- Starts production server on **default Next.js port (3000)**
- Requires `bun run build` to be run first
- **Note:** Uses default port, not custom 5176
- **When to use:** Testing admin production build

#### Quality Commands

##### `bun run lint`
```bash
bun run lint
```
- Runs ESLint on admin codebase
- **When to use:** Before committing admin changes

#### Maintenance Commands

##### `bun run clean:all`
```bash
bun run clean:all
```
- Removes `node_modules/` folder
- Removes `.next/` build directory
- Removes `.turbo/` cache directory
- **When to use:** Troubleshooting admin build issues

##### `bun run update`
```bash
bun run update
```
- Updates admin dependencies to latest versions
- **When to use:** Keeping admin dependencies current

---

## Backend Commands

Commands for the Convex backend, run from `packages/backend/`:

```bash
cd packages/backend
```

### Core Backend Commands

#### `bun run dev`
```bash
bun run dev
```
- Starts Convex development server
- Watches for file changes and hot reloads
- **Process:**
  1. Connects to Convex cloud development environment
  2. Generates TypeScript types in `convex/_generated/`
  3. Syncs schema and functions to cloud
  4. Watches for changes and auto-deploys
- **Output:**
  - Real-time logs in terminal
  - Generated API types
  - Connection URL for apps
- **When to use:**
  - Developing backend functions
  - Testing schema changes
  - Debugging database queries

#### `bun run setup`
```bash
bun run setup
```
- Runs `convex dev --until-success`
- Attempts connection to Convex until successful
- **Use cases:**
  1. **First-time setup:** Initializes Convex project
  2. **Configuration:** Prompts for deployment selection
  3. **Connection testing:** Retries on network failures
- **When to use:**
  - Initial project setup
  - After cloning repository
  - When switching Convex projects
  - Debugging connection issues

#### `bun run deploy`
```bash
bun run deploy
```
- Deploys backend to Convex production environment
- **Process:**
  1. Validates all functions and schema
  2. Runs type checking
  3. Pushes code to production deployment
  4. Regenerates production types
- **Outputs:**
  - Production deployment URL
  - Success/failure status
  - Any migration warnings
- **When to use:**
  - Deploying to production
  - After backend feature completion
  - **WARNING:** Only run when changes are tested

#### `bun run update`
```bash
bun run update
```
- Updates backend dependencies to latest versions
- **When to use:** Keeping Convex and related packages current

---

## Package Commands

### UI Package (packages/ui)

The UI package is a **React component library** that doesn't require build commands in development.

**No build commands needed** - Components are consumed directly by apps via TypeScript.

### Transactional Package (packages/transactional)

Email templates using React Email.

**No specific commands** - Used as a library by backend.

### TypeScript Config Package (packages/tsconfig)

Configuration files only - no commands.

---

## Turborepo Commands

Turborepo orchestrates all monorepo tasks. These commands use the `turbo` CLI.

### Direct Turbo Commands

#### `turbo run <task>`
```bash
# Run a specific task across all packages
turbo run build
turbo run lint
turbo run dev
```
- Executes the named task in all packages that define it
- Uses dependency graph to determine order
- Caches results for faster subsequent runs

#### `turbo run <task> --filter=<package>`
```bash
# Run task only for specific package(s)
turbo run build --filter=@buzztrip/web
turbo run dev --filter=@buzztrip/admin
turbo run lint --filter=@buzztrip/backend
```
- Runs task only in specified package
- **Filter patterns:**
  - `--filter=@buzztrip/web` - Single package
  - `--filter=apps/*` - All apps
  - `--filter=packages/*` - All packages

#### `turbo run <task> --force`
```bash
turbo run build --force
```
- Bypasses Turborepo cache
- Forces fresh execution of task
- **When to use:**
  - Debugging cache issues
  - After external file changes
  - Testing build from scratch

#### `turbo run <task> --concurrency=<n>`
```bash
turbo run build --concurrency=2
```
- Limits number of tasks running in parallel
- Default: Number of CPU cores
- **When to use:**
  - Limiting resource usage
  - Debugging parallel execution issues

---

## Common Workflows

### Starting Development

```bash
# Full monorepo development
bun install
cd packages/backend && bun run setup
cd ../..
bun run dev
```

**Result:** All apps running simultaneously with hot reload.

---

### Working on Web App Only

```bash
# Terminal 1: Start backend
cd packages/backend
bun run dev

# Terminal 2: Start web app
cd apps/web
bun run dev
```

**Result:** Web app on port 5173, backend syncing changes.

---

### Working on Admin Dashboard Only

```bash
# Terminal 1: Start backend (if not already running)
cd packages/backend
bun run dev

# Terminal 2: Start admin app
cd apps/admin
bun run dev
```

**Result:** Admin dashboard on port 5176.

---

### Adding a New NPM Package

#### To Web App
```bash
cd apps/web
bun add <package-name>
# or for dev dependency
bun add -D <package-name>
```

#### To Admin App
```bash
cd apps/admin
bun add <package-name>
```

#### To Shared UI Package
```bash
cd packages/ui
bun add <package-name>
```

#### To Backend
```bash
cd packages/backend
bun add <package-name>
```

**After adding:** Run `bun sherif` from root to check consistency.

---

### Updating Dependencies

#### Update All Packages
```bash
# From root - updates everything
bun run update
```

#### Update Specific App
```bash
cd apps/web
bun run update
```

#### Update Single Package
```bash
cd apps/web
bun update <package-name>
```

#### Check for Outdated Packages
```bash
bun outdated
```

---

### Building for Production

#### Build Everything
```bash
# From root
bun run build
```

#### Build Specific App
```bash
# Web app
cd apps/web
bun run build

# Admin app
cd apps/admin
bun run build
```

#### Deploy Backend
```bash
cd packages/backend
bun run deploy
```

---

### Running Tests (Future)

**Note:** Test commands will be added as testing infrastructure is implemented.

Typical patterns:
```bash
# Run all tests (when implemented)
bun test

# Run tests in watch mode
bun test --watch

# Run tests for specific app
cd apps/web
bun test
```

---

### Code Quality Checks

#### Before Committing
```bash
# From root
bun run format    # Format all code
bun run lint      # Lint all code
```

#### Check Specific App
```bash
cd apps/web
bun run lint
```

#### Auto-fix Linting Issues
```bash
cd apps/web
bun run lint --fix
```

---

### Cleaning and Resetting

#### Clean Everything
```bash
# From root
bun run clean:all
bun install
```

#### Clean Specific App
```bash
cd apps/web
bun run clean:all
bun install
```

#### Remove Turbo Cache
```bash
# From root
rm -rf .turbo
```

#### Full Reset (Nuclear Option)
```bash
# Remove all dependencies and caches
rm -rf node_modules bun.lock
rm -rf apps/*/node_modules apps/*/.next apps/*/.turbo
rm -rf packages/*/node_modules packages/*/.turbo
rm -rf .turbo

# Reinstall everything
bun install

# Setup backend
cd packages/backend
bun run setup
```

---

### Working with Convex

#### View Convex Dashboard
```bash
cd packages/backend
bun run dev
```
Then visit the Convex dashboard URL shown in terminal.

#### Run Convex Migration
```bash
cd packages/backend
# Edit convex/migrations.ts
bun run dev  # Migration runs automatically
```

#### Change Database Schema
```bash
cd packages/backend
# Edit convex/schema.ts
bun run dev  # Schema updates automatically
```

#### Test Backend Function
```bash
# Use Convex dashboard to test functions
# Or use curl/fetch with HTTP endpoints
```

---

### Performance Optimization

#### Analyze Bundle Size (Web)
```bash
cd apps/web
bun run build

# View build output for bundle analysis
# Look for "First Load JS" column
```

#### Monitor React Performance
```bash
cd apps/web
bun run scan

# Opens React Scan for performance monitoring
```

---

## Command Chaining

You can chain multiple commands using Bash operators:

### Sequential Execution (&&)
```bash
# Only run next command if previous succeeds
bun install && bun run build && bun run start
```

### Parallel Execution (&)
```bash
# Run multiple commands simultaneously
cd packages/backend && bun run dev &
cd apps/web && bun run dev &
cd apps/admin && bun run dev &
```

### Ignore Errors (;)
```bash
# Run all commands regardless of failures
bun run format; bun run lint; bun run build
```

---

## Troubleshooting

### "Module not found" errors

```bash
# Clean and reinstall
bun run clean:all
bun install
```

### Convex connection issues

```bash
cd packages/backend
bun run setup  # Runs until successful
```

### Port already in use

```bash
# Find and kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use different port
cd apps/web
bun run dev -- --port 5174
```

### TypeScript errors after pulling changes

```bash
# Regenerate Convex types
cd packages/backend
bun run dev  # Let it sync, then Ctrl+C

# Restart your app
cd apps/web
bun run dev
```

### Build cache issues

```bash
# Clear Next.js cache
cd apps/web
rm -rf .next
bun run build

# Clear Turbo cache
rm -rf .turbo
turbo run build --force
```

### Dependency conflicts

```bash
# Check for mismatches
bun sherif

# Resolve by updating package.json versions to match
# Then run:
bun install
```

### Stuck development server

```bash
# Kill all Node/Bun processes
pkill -f node
pkill -f bun

# Restart development
bun run dev
```

---

## Command Reference Table

### Root Commands

| Command | Description | When to Use |
|---------|-------------|-------------|
| `bun install` | Install all dependencies | First setup, after changes |
| `bun run dev` | Start all apps in dev mode | Primary development |
| `bun run build` | Build all apps for production | Before deployment |
| `bun run lint` | Lint all code + dependency check | Before commit |
| `bun run format` | Format all code with Prettier | Before commit |
| `bun sherif` | Check dependency consistency | After updates |
| `bun run clean:all` | Remove all build artifacts | Troubleshooting |
| `bun run update` | Update all dependencies | Monthly maintenance |

### Web App Commands (apps/web)

| Command | Description | Port | When to Use |
|---------|-------------|------|-------------|
| `bun run dev` | Development server | 5173 | Primary development |
| `bun run dev:secure` | Dev server with HTTPS | 5173 | Testing secure features |
| `bun run scan` | Dev + React performance monitor | 5173 | Performance debugging |
| `bun run build` | Production build | - | Before deployment |
| `bun run start` | Serve production build | 5173 | Test production locally |
| `bun run lint` | ESLint check | - | Before commit |

### Admin App Commands (apps/admin)

| Command | Description | Port | When to Use |
|---------|-------------|------|-------------|
| `bun run dev` | Development server | 5176 | Admin development |
| `bun run build` | Production build | - | Before deployment |
| `bun run start` | Serve production build | 3000 | Test production locally |
| `bun run lint` | ESLint check | - | Before commit |

### Backend Commands (packages/backend)

| Command | Description | When to Use |
|---------|-------------|-------------|
| `bun run dev` | Start Convex dev server | Backend development |
| `bun run setup` | Setup Convex (retry until success) | First setup, troubleshooting |
| `bun run deploy` | Deploy to Convex production | Production deployment |
| `bun run update` | Update backend dependencies | Monthly maintenance |

---

## Best Practices

### 1. Always Run Lint Before Committing
```bash
bun run lint
```
This catches issues early and ensures code quality.

### 2. Use Turbo for Multi-Package Operations
```bash
# Good - runs across all packages with caching
bun run build

# Less efficient - manual per-package builds
cd apps/web && bun run build
cd apps/admin && bun run build
```

### 3. Keep Backend Running During Development
Keep `packages/backend` dev server running in a dedicated terminal for real-time type generation.

### 4. Use Workspace Commands from Root
Run `bun run dev` from root to start everything at once, rather than starting each app individually.

### 5. Format Before Lint
```bash
bun run format && bun run lint
```
Prettier fixes many issues ESLint would complain about.

### 6. Check Sherif After Dependency Changes
```bash
bun add <package>
bun sherif  # Verify no conflicts
```

### 7. Use --filter for Targeted Operations
```bash
# Only build web app
turbo run build --filter=@buzztrip/web

# Only run tests in backend
turbo run test --filter=@buzztrip/backend
```

### 8. Leverage Turbo Cache
Don't force rebuild unless necessary - Turbo's cache speeds up development significantly.

---

## Environment-Specific Commands

### Development Environment
```bash
bun install
bun run dev
```

### Staging/Testing Environment
```bash
bun install
bun run build
bun run start
```

### Production Deployment
```bash
# Backend
cd packages/backend
bun run deploy

# Apps (varies by hosting platform)
cd apps/web
bun run build
# Deploy .next/ folder to Vercel/hosting

cd apps/admin
bun run build
# Deploy .next/ folder to hosting
```

---

## Quick Reference

### Most Used Commands

```bash
# Daily development
bun run dev                 # Start everything
bun run format             # Format code
bun run lint               # Check code quality

# Backend work
cd packages/backend
bun run dev                # Backend development

# Frontend work
cd apps/web
bun run dev                # Web app development

cd apps/admin
bun run dev                # Admin dashboard development

# Maintenance
bun install                # After pulling changes
bun sherif                 # Check dependencies
bun run clean:all          # Reset everything
```

---

## Additional Resources

- **Turborepo Docs:** https://turbo.build/repo/docs
- **Bun Docs:** https://bun.sh/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Convex Docs:** https://docs.convex.dev/
- **Project Documentation:**
  - `docs/overview.md` - Project overview
  - `docs/architecture.md` - Architecture decisions
  - `docs/file_system_structure.md` - Codebase structure
  - `CLAUDE.md` - Development guidelines

---

**Need help?** Check the troubleshooting section above or consult the project documentation in the `docs/` directory.
