# BuzzTrip Documentation Overview

> **Last Updated:** 2025-10-29
> **Version:** 1.0

Welcome to the BuzzTrip documentation! This overview provides a roadmap to all project documentation and helps you find the information you need quickly.

---

## Table of Contents

1. [What is BuzzTrip?](#what-is-buzztrip)
2. [Documentation Structure](#documentation-structure)
3. [Quick Navigation](#quick-navigation)
4. [Getting Started Guides](#getting-started-guides)
5. [Documentation By Role](#documentation-by-role)
6. [External Resources](#external-resources)
7. [Contributing to Documentation](#contributing-to-documentation)

---

## What is BuzzTrip?

**BuzzTrip** is a real-time collaborative mapping platform that provides an alternative to Google My Maps with enhanced features for creating custom maps, managing places, markers, collections, and collaborative mapping.

### Key Features

- **Custom Maps:** Create unlimited maps with custom styling and visibility settings
- **Rich Markers:** Add markers linked to real places with custom icons, colors, and descriptions
- **Collections:** Organize markers into grouped collections
- **Drawing Tools:** Draw paths, polygons, circles, and shapes on maps
- **Real-Time Collaboration:** Multiple users can edit maps simultaneously
- **Place Search:** Search and add places from Google Maps, Mapbox, and Foursquare
- **Sharing:** Share maps with specific users or make them public
- **Mobile Ready:** Planned native mobile apps for iOS and Android

### Technology Highlights

- **Monorepo Architecture:** Turborepo with shared packages
- **Real-Time Backend:** Convex for instant synchronization
- **Modern Frontend:** Next.js 15 with React 19
- **Type-Safe:** End-to-end TypeScript with Zod validation
- **Component Library:** shadcn/ui with Radix UI primitives
- **Authentication:** Clerk for secure user management

---

## Documentation Structure

BuzzTrip's documentation is organized into focused documents, each covering a specific aspect of the project:

```
docs/
 overview.md                    -> You are here
 file_system_structure.md       -> Codebase organization
 architecture.md                -> Technical architecture
 commands.md                    -> Development commands
 plans/                         -> Implementation plans
```

### [FILES] [File System Structure](./file_system_structure.md)
**38KB | 1,000+ lines**

Complete guide to the BuzzTrip monorepo file system structure.

**What's Inside:**
- Monorepo organization (apps, packages)
- Detailed directory trees for each app
- Component organization patterns
- Convex backend structure
- Shared package layouts
- Configuration file reference

**Read this when you need to:**
- Understand where code lives
- Find specific components or functions
- Learn the project organization
- Add new features in the right place
- Navigate the codebase efficiently

**Key Sections:**
- [Root Level Structure](./file_system_structure.md#root-level-structure)
- [Apps Directory](./file_system_structure.md#apps-directory) - Web, Admin, Mobile
- [Packages Directory](./file_system_structure.md#packages-directory) - Backend, UI, Transactional
- [Key Organizational Patterns](./file_system_structure.md#key-organizational-patterns)
- [How It All Works Together](./file_system_structure.md#how-it-all-works-together)

---

### [ARCH] [Architecture](./architecture.md)
**64KB | 2,468 lines**

Comprehensive technical architecture documentation covering all systems and integrations.

**What's Inside:**
- Core technology stack (18+ technologies)
- System architecture with diagrams
- Authentication & authorization flows
- Real-time database patterns
- State management strategies
- API design patterns
- Security architecture
- Data flow examples

**Read this when you need to:**
- Understand how systems integrate
- Learn real-time collaboration mechanics
- Implement new features following patterns
- Debug complex issues
- Make architectural decisions
- Understand security model

**Key Sections:**
- [Core Technology Stack](./architecture.md#core-technology-stack) - Convex, Next.js, Clerk, etc.
- [Authentication & Authorization](./architecture.md#authentication--authorization) - JWT flow, RBAC
- [Real-Time Database Architecture](./architecture.md#real-time-database-architecture) - Convex patterns
- [State Management](./architecture.md#state-management) - Zustand, Convex, Context
- [Mapping Architecture](./architecture.md#mapping-architecture) - Google Maps, Terra Draw
- [Data Flow Patterns](./architecture.md#data-flow-patterns) - End-to-end examples

---

### ( [Commands](./commands.md)
**1,042 lines**

Complete reference for all development commands and workflows.

**What's Inside:**
- Root-level commands (build, dev, lint)
- App-specific commands (web, admin)
- Backend/Convex commands
- Common workflows
- Troubleshooting guide
- Command chaining patterns

**Read this when you need to:**
- Start development for the first time
- Run specific apps or packages
- Build for production
- Debug build or runtime issues
- Update dependencies
- Clean and reset the project

**Key Sections:**
- [Quick Start](./commands.md#quick-start) - Get running in minutes
- [Root-Level Commands](./commands.md#root-level-commands) - Monorepo commands
- [App Commands](./commands.md#app-commands) - Web, Admin specific
- [Backend Commands](./commands.md#backend-commands) - Convex development
- [Common Workflows](./commands.md#common-workflows) - Real-world scenarios
- [Troubleshooting](./commands.md#troubleshooting) - Common issues

---

### Plans Directory

Contains implementation plans, feature specifications, and development roadmaps.

**Currently:**
- Admin dashboard implementation plans
- Feature specifications
- Development todos

---

## Quick Navigation

### By Task

| What do you want to do? | Go to |
|-------------------------|-------|
| **Set up the project for the first time** | [Commands -> Quick Start](./commands.md#quick-start) |
| **Find where a component lives** | [File System -> Apps Directory](./file_system_structure.md#apps-directory) |
| **Understand how authentication works** | [Architecture -> Authentication](./architecture.md#authentication--authorization) |
| **Learn the database schema** | [Architecture -> Real-Time Database](./architecture.md#real-time-database-architecture) |
| **Run a specific command** | [Commands -> Reference](./commands.md#command-reference-table) |
| **Add a new Convex function** | [File System -> Backend](./file_system_structure.md#packagesbackend---convex-backend) |
| **Create a new component** | [File System -> UI Package](./file_system_structure.md#packagesui---shared-ui-components) |
| **Debug a build issue** | [Commands -> Troubleshooting](./commands.md#troubleshooting) |
| **Understand state management** | [Architecture -> State Management](./architecture.md#state-management) |
| **Learn API patterns** | [Architecture -> API Design](./architecture.md#api-design-patterns) |

### By Technology

| Technology | Documentation |
|------------|---------------|
| **Convex** | [Architecture -> Real-Time Database](./architecture.md#real-time-database-architecture) |
| **Next.js** | [Architecture -> Core Stack](./architecture.md#3-nextjs---web-framework) |
| **Clerk** | [Architecture -> Authentication](./architecture.md#7-clerk---authentication) |
| **Google Maps** | [Architecture -> Mapping](./architecture.md#mapping-architecture) |
| **Terra Draw** | [Architecture -> Drawing](./architecture.md#17-terra-draw---drawing-on-maps) |
| **shadcn/ui** | [Architecture -> UI Components](./architecture.md#ui-component-architecture) |
| **Zustand** | [Architecture -> State Management](./architecture.md#8-zustand---global-state-management) |
| **PostHog** | [Architecture -> Analytics](./architecture.md#analytics--monitoring) |
| **Sentry** | [Architecture -> Monitoring](./architecture.md#analytics--monitoring) |
| **React Email** | [Architecture -> Email System](./architecture.md#email-system) |

### By Component Type

| Component Type | Location in Docs |
|----------------|------------------|
| **Backend Functions** | [File System -> Backend](./file_system_structure.md#packagesbackend---convex-backend) |
| **Web App Pages** | [File System -> Web App](./file_system_structure.md#appsweb---main-web-application) |
| **Admin Dashboard** | [File System -> Admin App](./file_system_structure.md#appsadmin---admin-dashboard) |
| **Shared UI Components** | [File System -> UI Package](./file_system_structure.md#packagesui---shared-ui-components) |
| **Email Templates** | [File System -> Transactional](./file_system_structure.md#packagestransactional---email-templates) |
| **Zod Schemas** | [Architecture -> Real-Time Database](./architecture.md#database-schema) |

---

## Getting Started Guides

### For First-Time Setup

**Goal:** Get BuzzTrip running on your local machine.

1. **Read:** [Commands -> Quick Start](./commands.md#quick-start)
2. **Follow:** Installation steps
3. **Run:** `bun install && bun run dev`
4. **Access:** Web app at http://localhost:5173

**Prerequisites:**
- Bun installed (`curl -fsSL https://bun.sh/install | bash`)
- Git
- Node.js (for some dependencies)
- Convex account (free)
- Clerk account (free)

**Estimated Time:** 15 minutes

---

### For Understanding the Codebase

**Goal:** Learn how BuzzTrip is organized and architected.

**Path 1: Top-Down (Recommended for New Developers)**
1. **Start:** [Overview](./overview.md) -> You are here
2. **Next:** [Architecture -> Overview](./architecture.md#architecture-overview)
3. **Then:** [File System -> Monorepo Overview](./file_system_structure.md#monorepo-overview)
4. **Finally:** Explore specific sections as needed

**Path 2: Bottom-Up (Recommended for Experienced Developers)**
1. **Start:** [File System Structure](./file_system_structure.md)
2. **Next:** [Architecture -> Data Flow](./architecture.md#data-flow-patterns)
3. **Then:** [Architecture -> Specific Systems](./architecture.md#core-technology-stack)

**Estimated Time:** 2-3 hours for complete understanding

---

### For Contributing Code

**Goal:** Make your first contribution to BuzzTrip.

1. **Understand Structure:** [File System -> Key Patterns](./file_system_structure.md#key-organizational-patterns)
2. **Learn Patterns:** [Architecture -> Development Patterns](./architecture.md#development-patterns)
3. **Setup Environment:** [Commands -> Quick Start](./commands.md#quick-start)
4. **Run Quality Checks:** [Commands -> Code Quality](./commands.md#code-quality-checks)
5. **Read:** [CLAUDE.md](../CLAUDE.md) for development guidelines

**Key Guidelines:**
- Follow established patterns in [Architecture](./architecture.md)
- Run `bun run lint` before committing
- Use TypeScript strictly
- Add Zod validators for all Convex functions
- Write descriptive commit messages

---

### For Deploying

**Goal:** Deploy BuzzTrip to production.

1. **Understand:** [Architecture -> Deployment](./architecture.md#deployment-architecture)
2. **Build:** [Commands -> Production Build](./commands.md#building-for-production)
3. **Deploy Backend:** [Commands -> Backend Deploy](./commands.md#backend-commands)
4. **Deploy Apps:** Platform-specific (Vercel, etc.)
5. **Configure:** Environment variables

**Deployment Checklist:**
- [ ] Environment variables configured
- [ ] Convex production deployment created
- [ ] Clerk production instance configured
- [ ] DNS configured
- [ ] Analytics (PostHog, Sentry) set up
- [ ] Email service (Resend) configured

---

## Documentation By Role

### [FRONTEND] Frontend Developer

**You'll primarily work in:**
- `apps/web/src/app/` - Next.js pages
- `apps/web/src/components/` - React components
- `packages/ui/` - Shared UI components

**Essential Reading:**
1. [File System -> Web App](./file_system_structure.md#appsweb---main-web-application)
2. [Architecture -> UI Components](./architecture.md#ui-component-architecture)
3. [Architecture -> State Management](./architecture.md#state-management)
4. [Commands -> Web App Commands](./commands.md#web-app-appsweb)

**Key Patterns:**
- Component organization: [File System -> Component Organization](./file_system_structure.md#component-organization)
- State management: [Architecture -> State Management](./architecture.md#state-management)
- Form handling: [Architecture -> UI Components](./architecture.md#ui-component-architecture)

---

### [BACKEND] Backend Developer

**You'll primarily work in:**
- `packages/backend/convex/` - Convex functions
- `packages/backend/zod-schemas/` - Validation schemas
- `packages/backend/helpers/` - Utility functions

**Essential Reading:**
1. [File System -> Backend](./file_system_structure.md#packagesbackend---convex-backend)
2. [Architecture -> Real-Time Database](./architecture.md#real-time-database-architecture)
3. [Architecture -> API Patterns](./architecture.md#api-design-patterns)
4. [Commands -> Backend Commands](./commands.md#backend-commands)

**Key Patterns:**
- Function organization: [File System -> Convex Functions](./file_system_structure.md#convex---convex-serverless-functions)
- Schema design: [Architecture -> Database Schema](./architecture.md#database-schema)
- RBAC: [Architecture -> Security](./architecture.md#security-architecture)

---

### [DESIGN] UI/UX Designer

**You'll work with:**
- Component library in `packages/ui/`
- Design system patterns
- shadcn/ui components

**Essential Reading:**
1. [Architecture -> UI Components](./architecture.md#ui-component-architecture)
2. [File System -> UI Package](./file_system_structure.md#packagesui---shared-ui-components)
3. [Context Files](../context/) - Design principles and style guide

**Key Resources:**
- Design principles: `context/design-principles.md`
- Style guide: `context/style-guide.md`
- Component variants: [Architecture -> Component Patterns](./architecture.md#component-pattern)

---

### [MAP] Mapping Specialist

**You'll work with:**
- Google Maps integration
- Terra Draw drawing tools
- Place search and geocoding
- Future Mapbox integration

**Essential Reading:**
1. [Architecture -> Mapping Architecture](./architecture.md#mapping-architecture)
2. [File System -> Mapping Components](./file_system_structure.md#srccomponents---react-components)
3. [Architecture -> Terra Draw](./architecture.md#17-terra-draw---drawing-on-maps)

**Key Sections:**
- Google Maps integration: [Architecture -> Google Maps](./architecture.md#google-maps-integration)
- Drawing tools: [Architecture -> Terra Draw](./architecture.md#terra-draw-integration)
- Place search: [Architecture -> Place Search](./architecture.md#place-search)

---

### [DATA] Data Analyst / Admin

**You'll work with:**
- Admin dashboard
- Analytics queries
- User management

**Essential Reading:**
1. [File System -> Admin App](./file_system_structure.md#appsadmin---admin-dashboard)
2. [Architecture -> Analytics](./architecture.md#analytics--monitoring)
3. [Commands -> Admin Commands](./commands.md#admin-app-appsadmin)

**Key Features:**
- Dashboard stats: [Architecture -> Admin Analytics](./architecture.md#admin-analytics-dashboard)
- User management: [File System -> Admin Structure](./file_system_structure.md#directory-structure-1)

---

### [DEVOPS] DevOps / Infrastructure

**You'll work with:**
- Deployment pipelines
- Environment configuration
- Monitoring and logging

**Essential Reading:**
1. [Architecture -> Deployment](./architecture.md#deployment-architecture)
2. [Commands -> Production Build](./commands.md#building-for-production)
3. [Architecture -> Security](./architecture.md#security-architecture)

**Key Sections:**
- Environment variables: [Architecture -> Deployment](./architecture.md#environment-variables)
- Monitoring: [Architecture -> Analytics](./architecture.md#analytics--monitoring)

---

## External Resources

### Official Documentation

| Service | Documentation | Purpose |
|---------|---------------|---------|
| **Convex** | https://docs.convex.dev | Real-time database and backend |
| **Next.js** | https://nextjs.org/docs | Web framework |
| **Clerk** | https://clerk.com/docs | Authentication |
| **Google Maps** | https://developers.google.com/maps | Mapping API |
| **shadcn/ui** | https://ui.shadcn.com | Component library |
| **Radix UI** | https://www.radix-ui.com/primitives | UI primitives |
| **TailwindCSS** | https://tailwindcss.com/docs | CSS framework |
| **Bun** | https://bun.sh/docs | Package manager |
| **Turborepo** | https://turbo.build/repo/docs | Monorepo tool |
| **Zod** | https://zod.dev | Schema validation |
| **Terra Draw** | https://terradraw.io | Drawing library |
| **PostHog** | https://posthog.com/docs | Analytics |
| **Sentry** | https://docs.sentry.io | Error tracking |
| **Resend** | https://resend.com/docs | Email delivery |

### Community & Support

- **GitHub Repository:** [BuzzTrip Repository](#) (link TBD)
- **Discord:** [Join Community](#) (link TBD)
- **Twitter:** [@buzztrip](#) (link TBD)

---

## Contributing to Documentation

### Documentation Guidelines

**When updating documentation:**
1. **Keep it current:** Update dates and version numbers
2. **Be specific:** Include code examples and file paths
3. **Link between docs:** Reference related sections
4. **Test examples:** Ensure code examples work
5. **Use consistent formatting:** Follow existing patterns

### Documentation Standards

**File Structure:**
- Start with metadata (last updated, version)
- Include table of contents for long documents
- Use clear heading hierarchy
- Include code examples with syntax highlighting
- Add cross-references to related documentation

**Writing Style:**
- Use active voice
- Be concise but thorough
- Provide examples for complex concepts
- Use diagrams where helpful
- Include "when to use" guidance

### Updating Documentation

**Process:**
1. Make changes to relevant `.md` files
2. Update "Last Updated" date
3. Increment version if major changes
4. Update this overview if structure changes
5. Test all internal links
6. Run `bun run lint` to ensure no broken links (if available)

**Files to Update:**
- Specific doc file (e.g., `architecture.md`)
- This `overview.md` if navigation changes
- `../CLAUDE.md` if guidelines change

---

## Documentation Checklist

Use this checklist to verify you've read the essential documentation:

### For All Contributors
- [ ] Read this overview
- [ ] Understand the [File System Structure](./file_system_structure.md)
- [ ] Review [Commands -> Quick Start](./commands.md#quick-start)
- [ ] Read `../CLAUDE.md` for development guidelines
- [ ] Review `../CONTRIBUTING.md` for contribution process

### For Frontend Developers
- [ ] [Architecture -> UI Components](./architecture.md#ui-component-architecture)
- [ ] [Architecture -> State Management](./architecture.md#state-management)
- [ ] [File System -> Web App Structure](./file_system_structure.md#appsweb---main-web-application)
- [ ] [Architecture -> Data Flow](./architecture.md#data-flow-patterns)

### For Backend Developers
- [ ] [Architecture -> Real-Time Database](./architecture.md#real-time-database-architecture)
- [ ] [Architecture -> Authentication](./architecture.md#authentication--authorization)
- [ ] [File System -> Backend Structure](./file_system_structure.md#packagesbackend---convex-backend)
- [ ] [Architecture -> API Patterns](./architecture.md#api-design-patterns)

### For Full Documentation Coverage
- [ ] Complete [File System Structure](./file_system_structure.md)
- [ ] Complete [Architecture](./architecture.md)
- [ ] Complete [Commands](./commands.md)
- [ ] Review all `context/` files
- [ ] Read `../README.md`

---

## Quick Reference Card

### Most Common Tasks

```bash
# Start development
bun run dev

# Build for production
bun run build

# Run linting
bun run lint

# Format code
bun run format

# Update dependencies
bun run update

# Clean everything
bun run clean:all
```

### Most Referenced Documentation Sections

1. [Commands -> Quick Start](./commands.md#quick-start)
2. [Architecture -> Authentication Flow](./architecture.md#authentication--authorization)
3. [Architecture -> Real-Time Database](./architecture.md#real-time-database-architecture)
4. [File System -> Backend Structure](./file_system_structure.md#packagesbackend---convex-backend)
5. [Commands -> Troubleshooting](./commands.md#troubleshooting)

### Emergency Links

| Issue | Documentation |
|-------|---------------|
| Can't start dev server | [Commands -> Troubleshooting](./commands.md#troubleshooting) |
| Build failing | [Commands -> Build Commands](./commands.md#build-commands) |
| Convex connection issues | [Commands -> Backend](./commands.md#backend-commands) |
| Module not found | [Commands -> Troubleshooting](./commands.md#module-not-found-errors) |
| Port already in use | [Commands -> Troubleshooting](./commands.md#port-already-in-use) |

---

## Documentation Versions

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-10-29 | Initial comprehensive documentation release |

---

## Need Help?

**Can't find what you're looking for?**

1. **Search within docs:** Use `Ctrl+F` (or `Cmd+F`) to search current page
2. **Check related docs:** Use the navigation links above
3. **Review CLAUDE.md:** `../CLAUDE.md` has additional development guidelines
4. **Check external docs:** Links in [External Resources](#external-resources)
5. **Ask the team:** Discord, GitHub Issues, or team chat

**Found an issue in the documentation?**
- Open a GitHub issue
- Submit a PR with corrections
- Contact the documentation maintainer

---

## Summary

BuzzTrip's documentation is structured to help you quickly find what you need:

- **[File System Structure](./file_system_structure.md)** - Where everything lives
- **[Architecture](./architecture.md)** - How everything works
- **[Commands](./commands.md)** - What to run and when

Use the [Quick Navigation](#quick-navigation) section to jump to specific topics, or follow the [Getting Started Guides](#getting-started-guides) for comprehensive walkthroughs.

**Happy coding!**
