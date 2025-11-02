# BuzzTrip File System Structure

> **Last Updated:** 2025-10-29
> **Version:** 1.0

This document provides a comprehensive overview of the BuzzTrip monorepo file system structure, explaining what lives where and how everything connects together.

---

## Table of Contents

1. [Monorepo Overview](#monorepo-overview)
2. [Root Level Structure](#root-level-structure)
3. [Apps Directory](#apps-directory)
   - [apps/web - Main Web Application](#appsweb---main-web-application)
   - [apps/admin - Admin Dashboard](#appsadmin---admin-dashboard)
   - [apps/mobile - Mobile Application](#appsmobile---mobile-application)
4. [Packages Directory](#packages-directory)
   - [packages/backend - Convex Backend](#packagesbackend---convex-backend)
   - [packages/ui - Shared UI Components](#packagesui---shared-ui-components)
   - [packages/transactional - Email Templates](#packagestransactional---email-templates)
   - [packages/tsconfig - TypeScript Configs](#packagestsconfig---typescript-configs)
5. [Key Organizational Patterns](#key-organizational-patterns)
6. [How It All Works Together](#how-it-all-works-together)

---

## Monorepo Overview

BuzzTrip is a **Turborepo monorepo** that provides a custom mapping platform with features for creating maps, managing places, markers, collections, and collaborative mapping.

### Architecture at a Glance

```
BuzzTrip/
 apps/              # Application frontends
    web/          # Main Next.js web app (Port 5173)
    admin/        # Admin dashboard (Port 5176)
    mobile/       # React Native Expo app (WIP)

 packages/         # Shared code packages
    backend/     # Convex serverless backend
    ui/          # Shared component library
    transactional/ # Email templates
    tsconfig/    # Shared TypeScript configs

 context/         # Design & implementation context
 docs/            # Documentation (you are here)
 .github/         # CI/CD workflows
```

### Tech Stack Summary

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript
- **Backend:** Convex (real-time serverless database)
- **Authentication:** Clerk
- **Styling:** TailwindCSS v4
- **UI Components:** Radix UI + shadcn/ui patterns
- **Maps:** Google Maps API, Mapbox GL, Terra Draw
- **Package Manager:** Bun
- **Monorepo Tool:** Turborepo

---

## Root Level Structure

### Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Root workspace configuration with Bun workspaces |
| `turbo.json` | Turborepo task orchestration and caching config |
| `bun.lock` | Dependency lock file for Bun package manager |
| `prettier.config.js` | Code formatting configuration (applies globally) |
| `.npmrc` | NPM registry settings |
| `.nvmrc` | Node.js version specification |
| `.gitignore` | Git ignore patterns |
| `.prettierignore` | Files to exclude from formatting |
| `.mcp.json` | MCP (Model Context Protocol) configuration |

### Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Project overview and setup instructions |
| `CLAUDE.md` | AI assistant guidelines and conventions |
| `CONTRIBUTING.md` | Contribution guidelines for developers |
| `LICENCE` | GNU AFFERO GENERAL PUBLIC LICENSE |

### Important Directories

```
/apps              # Frontend applications
/packages          # Shared backend and UI packages
/context           # Design principles and implementation context
/docs              # Project documentation
/.github           # GitHub Actions workflows
/.turbo            # Turborepo build cache (gitignored)
```

---

## Apps Directory

The `apps/` directory contains all user-facing applications in the BuzzTrip ecosystem.

---

### apps/web - Main Web Application

**Port:** 5173
**Framework:** Next.js 15 with App Router
**Purpose:** Primary user-facing mapping platform

#### Root Configuration

```
apps/web/
 package.json              # Dependencies and scripts
 next.config.ts           # Next.js configuration
 tsconfig.json            # TypeScript config (extends @buzztrip/tsconfig)
 env.ts                   # Environment variable validation (t3-oss/env-nextjs)
 components.json          # shadcn/ui component configuration
 postcss.config.mjs       # PostCSS for Tailwind
 tailwind.config.ts       # Tailwind CSS configuration
 next-env.d.ts            # Next.js type definitions
```

#### Directory Structure

##### `src/app/` - Next.js App Router

The app directory uses Next.js 15's App Router with file-based routing:

```
src/app/
 layout.tsx                   # Root layout with providers
 page.tsx                     # Home/landing page
 global-error.tsx             # Global error boundary
 manifest.ts                  # PWA manifest generation
 robots.ts                    # robots.txt generation
 sitemap.ts                   # Sitemap generation

 (auth)/                      # Auth route group
    sign-in/[[...sign-in]]/  # Clerk sign-in (catch-all route)
    sign-up/[[...sign-up]]/  # Clerk sign-up

 api/                         # API routes
    map/[mapId]/update-map-location/
        route.ts

 app/                         # Authenticated app section
    page.tsx                 # Maps dashboard/list
    map/[mapId]/             # Individual map viewer
        page.tsx
        loading.tsx

 blog/                        # Blog section
    page.tsx                 # Blog index
    [slug]/                  # Individual blog post
       page.tsx
    posts/                   # Blog content (MDX files)
        welcome.mdx
        ...

 legal/                       # Legal pages
    page.tsx                 # Legal index
    privacy/
       page.tsx
    terms/
        page.tsx

 about/page.tsx               # About page
 contact/page.tsx             # Contact form
 help/page.tsx                # Help/documentation
 pricing/page.tsx             # Pricing information
 roadmap/page.tsx             # Product roadmap
```

**Key Routing Patterns:**
- **Route Groups:** `(auth)` - groups routes without affecting URL structure
- **Dynamic Routes:** `[mapId]`, `[slug]` - parameter-based routing
- **Catch-all Routes:** `[[...sign-in]]` - optional catch-all for Clerk integration
- **Special Files:** `layout.tsx`, `loading.tsx`, `error.tsx` - convention-based

##### `src/components/` - React Components

Components are organized by feature domain and complexity:

```
src/components/
 layouts/                     # Major layout components
    map-view/               # Map viewer layout
       index.tsx           # Main map view container
       components/         # Map view sub-components
           active-location.tsx
           close-button.tsx
           display-marker.tsx
           display-path.tsx
           main-modal.tsx
           map-drawer.tsx
           map-sidebar.tsx
           markers-collections.tsx
           tree-view.tsx
   
    user-maps/              # Maps list layout
        index.tsx
        map-card.tsx

 mapping/                    # Map library integrations
    google-maps/
       index.tsx           # Google Maps component
       search.tsx          # Place search
       marker-info-box.tsx
       helpers.ts          # Map utilities
       actions/            # Map actions
          add-marker.tsx
          change-map-styles.tsx
       drawing/            # Terra Draw integration
           index.tsx
           terra-draw-google-maps-adapter.ts
           use-terra-draw-sync.ts
   
    mapbox/
        map.tsx             # Mapbox GL component
        search.tsx
        display-data.tsx
        components/
            collapisable-example.tsx

 map-form/                   # Map creation/editing forms
    map-stepper.tsx         # Multi-step wizard
    map-tab-form.tsx        # Tab-based form
    details.tsx             # Map details
    location.tsx            # Location selection
    labels.tsx              # Label management
    label-form.tsx
    share.tsx               # Sharing settings
    provider.tsx            # Form state context

 forms/                      # Domain-specific forms
    collection-create-edit-form.tsx
    marker-create-edit-form.tsx
    paths-create-edit-form.tsx

 modals/                     # Modal dialogs
    create_map_modal.tsx
    edit_map_modal.tsx
    color-picker-modal.tsx
    icon-picker-modal.tsx
    image-upload-modal.tsx
    open-collection-modal.tsx

 providers/                  # React Context providers
    index.tsx
    convex-client-provider.tsx
    map-state-provider.tsx
    posthog.tsx             # Analytics provider

 icons/                      # Custom SVG icons
    paths.tsx
    social/
        blue-sky.tsx
        github.tsx
        instagram.tsx
        linkedIn.tsx
        X.tsx

 loading/
    map-loader.tsx          # Map loading skeleton

 cta/                        # Call-to-action components
    index.tsx
    development.tsx

 navbar.tsx                  # Main navigation
 footer.tsx                  # Site footer
 blog-card.tsx               # Blog post preview
 color-picker.tsx            # Color selection UI
 icon-picker.tsx             # Icon selection UI
 marker-pin.tsx              # Map marker component
 show-path-icon.tsx          # Path visualization icon
 social-links.tsx            # Social media links
 mdx.tsx                     # MDX component wrapper
```

**Component Organization Principles:**
- **Feature-based:** Groups by domain (mapping, map-form, modals)
- **Layouts:** Complex page-level layouts have dedicated folders
- **Co-location:** Related components live in sub-folders
- **Shared UI:** Generic components from `@buzztrip/ui` package

##### `src/hooks/` - Custom React Hooks

```
src/hooks/
 use-file-upload.ts          # File upload with progress
 use-mobile.ts               # Mobile viewport detection
```

##### `src/lib/` - Utilities and Business Logic

```
src/lib/
 auth.ts                     # Clerk authentication helpers
 blog.ts                     # Blog post utilities
 data.ts                     # Data fetching utilities
 image.ts                    # Image processing
 generateOTP.ts              # One-time password generation

 events/
    map-event-emitter.ts    # Event emitter for map updates

 geojson/
    index.ts
    calculate-measurements.ts  # Distance/area calculations

 stores/
    index.ts                # Zustand store exports
    default-state.ts        # Initial state definitions

 utils/
     index.ts                # General utilities
```

##### `src/actions/` - Server Actions

```
src/actions/
 safe-action.ts              # Server action wrapper with validation
 send-contact-email.ts       # Contact form submission
```

##### Other Important Files

```
src/
 instrumentation.ts          # Sentry initialization
 middleware.ts               # Next.js middleware (if present)
 styles/
     globals.css             # Global styles (if present)
```

#### Key Dependencies

**Core Framework:**
- `next@15.5.4` - React framework
- `react@19` - UI library
- `typescript@^5` - Type safety

**Authentication:**
- `@clerk/nextjs` - User authentication

**Backend/Database:**
- `convex` - Real-time serverless database

**Maps:**
- `@vis.gl/react-google-maps` - Google Maps React components
- `mapbox-gl` - Mapbox mapping library
- `terra-draw` - Drawing tools on maps

**State Management:**
- `zustand` - Client state
- `@tanstack/react-query` - Server state
- `react-hook-form` - Form state

**UI Components:**
- `@radix-ui/*` - Primitive components
- `lucide-react` - Icons
- `sonner` - Toast notifications
- `recharts` - Charts/visualizations

**Utilities:**
- `clsx`, `tailwind-merge` - Class name utilities
- `date-fns` - Date formatting
- `zod` - Runtime validation

**Developer Experience:**
- `@sentry/nextjs` - Error tracking
- `posthog-js` - Product analytics

---

### apps/admin - Admin Dashboard

**Port:** 5176
**Framework:** Next.js 15 with App Router
**Purpose:** Internal admin dashboard for managing users, maps, and viewing analytics

#### Root Configuration

```
apps/admin/
 package.json              # Dependencies and scripts
 next.config.ts           # Minimal Next.js config
 tsconfig.json            # TypeScript config
 env.ts                   # Environment variables
 components.json          # shadcn/ui config
 postcss.config.mjs
 tailwind.config.ts
```

#### Directory Structure

```
src/
 app/
    layout.tsx               # Root layout with ClerkProvider
    page.tsx                 # Dashboard home with stats
    unauthorized/page.tsx    # Unauthorized access page
   
    sign-in/[[...sign-in]]/  # Admin sign-in
       page.tsx
   
    maps/                    # Maps management
       page.tsx             # Maps table/list
       [id]/
           page.tsx
           map-detail-content.tsx
   
    users/                   # User management
        page.tsx             # Users table
        [id]/
            page.tsx
            user-detail-content.tsx

 components/
    layout/
       admin-layout.tsx     # Main layout wrapper
       admin-sidebar.tsx    # Navigation sidebar
   
    tables/
       maps-table.tsx       # Maps data table (TanStack Table)
       users-table.tsx      # Users data table
   
    shared/
       maps-list-table.tsx  # Reusable maps table component
   
    charts/
       maps-chart.tsx       # Maps creation over time
       markers-chart.tsx    # Markers creation chart
       markers-maps-chart.tsx
   
    dashboard/
       stat-card.tsx        # KPI stat card component
   
    dashboard-layout.tsx
    analytics-chart-with-date-picker.tsx
    date-range-picker.tsx    # Date range selection
    convex-client-provider.tsx

 lib/
    auth.ts                  # Admin authorization (RBAC)
    mock-data.ts             # Development mock data
    utils/

 middleware.ts                # Route protection middleware
```

#### Key Features

1. **Dashboard Overview** (`src/app/page.tsx`)
   - KPI stat cards (Users, Maps, Markers, Places)
   - Week-over-week growth percentages
   - 6-month trend charts
   - Date range filtering

2. **Users Management** (`src/app/users/`)
   - Sortable data table with TanStack Table v8
   - User profile cards
   - Activity tracking
   - Links to user's maps and markers

3. **Maps Management** (`src/app/maps/`)
   - Maps list with sortable columns
   - Visibility status badges
   - Owner information
   - Map detail views with statistics

4. **Authorization**
   - Clerk authentication integration
   - Role-based access control (RBAC)
   - Middleware route protection
   - Unauthorized page redirect

#### Key Dependencies

- `next@15.5.4`, `react@19`
- `@clerk/nextjs` - Authentication
- `convex` - Backend database
- `@tanstack/react-table` - Data tables
- `recharts` - Analytics charts
- `date-fns` - Date utilities
- `@buzztrip/ui` - Shared components

---

### apps/mobile - Mobile Application

**Status:** Work in Progress (WIP) - Scheduled for rewrite
**Framework:** React Native with Expo
**Purpose:** Native mobile experience for iOS and Android

This app is not currently in active development and will be rewritten in the near future to match the current architecture and feature set of the web application.

---

## Packages Directory

The `packages/` directory contains shared code that multiple apps can import and use.

---

### packages/backend - Convex Backend

**Purpose:** Shared serverless backend with real-time database, queries, mutations, and business logic

#### Root Files

```
packages/backend/
 package.json              # Backend dependencies and exports
 generateId.ts             # Utility for generating unique IDs
 convex.ts                 # Convex client setup (implied)
```

#### Directory Structure

##### `convex/` - Convex Serverless Functions

```
convex/
 schema.ts                 # Database schema definition (Zod + zodToConvex)
 auth.config.ts            # Clerk authentication configuration
 convex.config.ts          # Convex project configuration
 helpers.ts                # Shared helper utilities
 emails.ts                 # Email sending functions
 http.ts                   # HTTP endpoint definitions
 migrations.ts             # Database migration scripts
 places.ts                 # Places queries/mutations
 users.ts                  # User queries/mutations

 maps/                     # Maps feature domain
    index.ts              # Map CRUD operations
    markers.ts            # Marker management
    collections.ts        # Collections management
    labels.ts             # Labels management
    paths.ts              # Path/drawing management
    mapUsers.ts           # Map user permissions

 admin/                    # Admin-specific functions
    stats.ts              # Platform statistics
    maps.ts               # Admin map queries
    users.ts              # Admin user queries
    charts.ts             # Chart data generation

 _generated/               # Auto-generated by Convex
     api.d.ts              # Type-safe API exports
     dataModel.d.ts        # Database type definitions
     server.d.ts           # Server-side types
```

**Convex Function Organization:**
- **By Domain:** Functions grouped by feature (maps, admin, places, users)
- **Naming Convention:** File names match domain concepts
- **Exports:** Auto-generated in `_generated/api.d.ts` with file-based routing
- **Type Safety:** Full TypeScript support from schema to client

##### `zod-schemas/` - Validation Schemas

```
zod-schemas/
 index.ts                  # Exports all schemas
 shared-schemas.ts         # Reusable field definitions
 auth-schema.ts            # User/authentication schemas
 maps-schema.ts            # Maps and related entities
 paths-schema.ts           # Path/drawing schemas
 places-schema.ts          # Places/location schemas
 analytics-schema.ts       # Analytics schemas
```

**Schema Pattern:**
```typescript
// Define Zod schema
export const mapSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  visibility: z.enum(["public", "private", "unlisted"]),
  // ... more fields
});

// Convert to Convex validator
export const mapValidator = zodToConvex(mapSchema);

// Infer TypeScript type
export type Map = z.infer<typeof mapSchema>;
```

##### `types/` - TypeScript Type Definitions

```
types/
 index.ts                  # Main type exports
 icons.ts                  # Icon type definitions
```

##### `helpers/` - Utility Functions

```
helpers/
 index.ts                  # Helper exports
 rbac.ts                   # Role-based access control
 admin-helpers.ts          # Admin-specific utilities
```

#### Database Schema

The Convex database uses the following tables (defined in `schema.ts`):

**Maps Domain:**
```
maps              # Map documents with title, description, visibility
mapViews          # Analytics for map views
markers           # Markers on maps linked to places
collections       # Grouped collections of markers
collection_links  # Many-to-many: markers -> collections
labels            # Custom labels for map elements
paths             # Drawing paths/polygons on maps
routes            # Travel routes
route_stops       # Stops along routes
map_users         # User access permissions for maps
```

**Places Domain:**
```
places            # Location data with multiple provider IDs
                  # (Google, Mapbox, Foursquare)
places_reviews    # User reviews for places
place_photos      # Photo attachments for places
```

**Users Domain:**
```
users             # User profiles synced with Clerk
                  # Includes display name, email, avatar, metadata
```

**Schema Features:**
- **Zod-based validation** using `zodToConvex` helper
- **Indexed fields** for efficient queries
- **Document relationships** via `Id<"tableName">` references
- **Discriminated unions** for polymorphic types
- **Full-text search** on user fields

#### Convex Function Patterns

**Query Example:**
```typescript
// File: convex/maps/index.ts
export const listUserMaps = query({
  args: { userId: v.id("users") },
  returns: v.array(mapValidator),
  handler: async (ctx, args) => {
    const maps = await ctx.db
      .query("maps")
      .filter(q => q.eq(q.field("ownerId"), args.userId))
      .collect();
    return maps;
  },
});
```

**Mutation Example:**
```typescript
export const createMap = mutation({
  args: mapValidator,
  returns: v.id("maps"),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const mapId = await ctx.db.insert("maps", {
      ...args,
      ownerId: identity.subject,
      createdAt: Date.now(),
    });
    return mapId;
  },
});
```

**Key Convex Guidelines:**
- Always use `args` and `returns` validators
- Use `query`, `mutation`, `action` for public functions
- Use `internalQuery`, `internalMutation`, `internalAction` for internal functions
- All functions must include `returns` validator (use `v.null()` if no return)

---

### packages/ui - Shared UI Components

**Purpose:** Reusable UI component library following shadcn/ui patterns with Radix UI primitives

#### Structure

```
packages/ui/
 src/
    components/               # Individual UI components
       accordion.tsx
       alert-dialog.tsx
       alert.tsx
       avatar.tsx
       badge.tsx
       breadcrumb.tsx
       button.tsx
       button-group.tsx
       calendar.tsx
       card.tsx
       carousel.tsx
       chart.tsx
       checkbox.tsx
       collapsible.tsx
       command.tsx
       context-menu.tsx
       dialog.tsx
       drawer.tsx
       dropdown-menu.tsx
       empty.tsx
       field.tsx
       form.tsx
       hover-card.tsx
       icon.tsx
       input.tsx
       input-group.tsx
       input-otp.tsx
       item.tsx
       kbd.tsx
       label.tsx
       menubar.tsx
       navigation-menu.tsx
       pagination.tsx
       popover.tsx
       progress.tsx
       radio-group.tsx
       resizable.tsx
       scroll-area.tsx
       select.tsx
       separator.tsx
       sheet.tsx
       sidebar.tsx
       skeleton.tsx
       skeletons/
          sidebar-skeleton.tsx
          tabs-skeleton.tsx
       slider.tsx
       sonner.tsx
       spinner.tsx
       stepper.tsx
       switch.tsx
       table.tsx
       tabs.tsx
       textarea.tsx
       toggle.tsx
       toggle-group.tsx
       tooltip.tsx
       tree.tsx
   
    hooks/
       use-mobile.ts         # Mobile viewport detection
   
    lib/
       utils.ts              # cn() utility for class merging
   
    styles/
        globals.css           # Global TailwindCSS v4 styles

 components.json               # shadcn/ui configuration
 package.json                  # Exports components modularly
 tsconfig.json                 # React library TypeScript config
 postcss.config.mjs
 tailwind.config.ts
```

#### Package Exports

The UI package uses modular exports defined in `package.json`:

```json
{
  "exports": {
    "./components/*": "./src/components/*.tsx",
    "./hooks/*": "./src/hooks/*.ts",
    "./lib/*": "./src/lib/*.ts",
    "./globals.css": "./src/styles/globals.css"
  }
}
```

#### Usage Example

```typescript
// In apps/web or apps/admin:
import { Button } from "@buzztrip/ui/components/button";
import { Dialog } from "@buzztrip/ui/components/dialog";
import { cn } from "@buzztrip/ui/lib/utils";
import "@buzztrip/ui/globals.css";
```

#### Component Characteristics

- **Radix UI Primitives:** Accessible, unstyled component foundations
- **TailwindCSS v4:** Utility-first styling
- **CVA (class-variance-authority):** Variant management
- **Fully Typed:** Complete TypeScript support
- **Composable:** Build complex UIs from simple primitives

---

### packages/transactional - Email Templates

**Purpose:** Transactional email templates using React Email

#### Structure

```
packages/transactional/
 emails/
    welcome-email.tsx         # Welcome email template
    magic-link.tsx            # Magic link authentication email
    contact-us.tsx            # Contact form response email

 helpers/
    index.ts
    send.ts                   # Email sending utilities (Resend API)

 package.json                  # React Email dependencies
 tsconfig.json
```

#### Key Dependencies

- `react-email@4.2.11` - Email template framework
- `resend` - Email delivery API (via Convex integration)

#### Usage Pattern

```typescript
// In Convex backend:
import { WelcomeEmail } from "@buzztrip/transactional/emails/welcome-email";
import { sendEmail } from "@buzztrip/transactional/helpers/send";

// Send email
await sendEmail({
  to: user.email,
  subject: "Welcome to BuzzTrip!",
  react: <WelcomeEmail name={user.name} />,
});
```

---

### packages/tsconfig - TypeScript Configs

**Purpose:** Shared TypeScript configuration files to ensure consistency

#### Structure

```
packages/tsconfig/
 base.json                     # Base TypeScript configuration
 nextjs.json                   # Next.js specific config (extends base.json)
 react-library.json            # React library config
 package.json                  # Export configurations
```

#### Configuration Hierarchy

```
base.json
 nextjs.json      # Used by apps/web and apps/admin
 react-library.json  # Used by packages/ui
```

#### Usage Example

```json
// In apps/web/tsconfig.json:
{
  "extends": "@buzztrip/tsconfig/nextjs.json",
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

#### Shared Compiler Options

- **Strict mode enabled** - Maximum type safety
- **Module resolution:** Bundler
- **JSX:** react-jsx (automatic React 17+ transform)
- **Path aliases:** Configured per project
- **Incremental builds:** Enabled for performance

---

## Key Organizational Patterns

### 1. Monorepo Package Management

**Workspace Pattern:**
```json
// Root package.json
{
  "workspaces": ["apps/*", "packages/*"]
}
```

**Import Pattern:**
```typescript
// Apps can import from packages using workspace aliases
import { api } from "@buzztrip/backend";
import { Button } from "@buzztrip/ui/components/button";
```

**Benefits:**
- Single `bun install` installs all dependencies
- Shared dependencies deduplicated
- Type safety across package boundaries
- Hot reload works across packages in dev mode

---

### 2. Convex Backend Organization

**Feature-Based Structure:**
```
convex/
 maps/           # All map-related functions
    index.ts    # Main map CRUD
    markers.ts  # Marker operations
    labels.ts   # Label operations
 admin/          # Admin-specific functions
 users.ts        # User operations
```

**Function Naming:**
```typescript
// File: convex/maps/index.ts
export const create = mutation({ ... });  // maps.create
export const update = mutation({ ... });  // maps.update
export const list = query({ ... });       // maps.list

// File: convex/maps/markers.ts
export const create = mutation({ ... });  // maps.markers.create
export const listByMap = query({ ... }); // maps.markers.listByMap
```

**Client Usage:**
```typescript
import { api } from "@buzztrip/backend";

// In React component:
const maps = useQuery(api.maps.list, { userId: user.id });
const createMap = useMutation(api.maps.create);
```

---

### 3. Next.js App Router Structure

**Route Groups:**
```
app/
 (auth)/         # Grouped without affecting URL
    sign-in/    # URL: /sign-in
    sign-up/    # URL: /sign-up
 app/            # URL: /app/*
     map/[mapId]/  # URL: /app/map/123
```

**Special Files:**
- `layout.tsx` - Wraps all child pages
- `loading.tsx` - Streaming loading UI
- `error.tsx` - Error boundary
- `not-found.tsx` - 404 page
- `page.tsx` - Actual page content

**Data Fetching:**
```typescript
// Server Component (default)
export default async function Page() {
  const data = await fetchData(); // Server-side
  return <div>{data}</div>;
}

// Client Component
'use client';
export default function Page() {
  const data = useQuery(api.maps.list); // Client-side Convex
  return <div>{data}</div>;
}
```

---

### 4. Component Organization

**By Feature Domain:**
```
components/
 mapping/           # Map-specific components
 map-form/          # Map creation/editing
 forms/             # Domain forms
 modals/            # Modal dialogs
```

**By Complexity:**
```
components/layouts/
 map-view/
     index.tsx          # Main component
     components/        # Sub-components
         sidebar.tsx
         drawer.tsx
```

**Import Priority:**
1. **Shared UI:** `@buzztrip/ui/components/*` for generic components
2. **App Components:** `@/components/*` for app-specific components
3. **Feature Components:** Co-located in feature folders

---

### 5. Type Management

**Schema -> Types Flow:**
```
1. Define Zod schema in packages/backend/zod-schemas/
2. Convert to Convex validator with zodToConvex
3. Infer TypeScript type with z.infer<typeof schema>
4. Export from packages/backend/types/
5. Import in apps using @buzztrip/backend/types
```

**Example:**
```typescript
// packages/backend/zod-schemas/maps-schema.ts
export const mapSchema = z.object({
  title: z.string(),
  // ...
});
export type Map = z.infer<typeof mapSchema>;

// packages/backend/types/index.ts
export type { Map } from "../zod-schemas/maps-schema";

// apps/web/src/components/map-card.tsx
import type { Map } from "@buzztrip/backend/types";
```

---

### 6. Styling System

**TailwindCSS v4 Pattern:**
```typescript
// Use cn() utility for conditional classes
import { cn } from "@buzztrip/ui/lib/utils";

<div className={cn(
  "base-classes",
  condition && "conditional-classes",
  variant === "primary" && "primary-variant-classes"
)} />
```

**Component Variants (CVA):**
```typescript
import { cva } from "class-variance-authority";

const buttonVariants = cva("base-button-classes", {
  variants: {
    variant: {
      primary: "bg-primary text-primary-foreground",
      secondary: "bg-secondary text-secondary-foreground",
    },
    size: {
      sm: "h-8 px-3",
      lg: "h-12 px-6",
    },
  },
});
```

---

### 7. State Management

**Zustand (Client State):**
```typescript
// packages/backend/lib/stores/map-store.ts
import { create } from 'zustand';

export const useMapStore = create((set) => ({
  selectedMarkerId: null,
  setSelectedMarker: (id) => set({ selectedMarkerId: id }),
}));
```

**Convex (Server State):**
```typescript
// Real-time reactive queries
const maps = useQuery(api.maps.list);  // Auto-updates on DB changes
const createMap = useMutation(api.maps.create);
```

**React Context (Scoped State):**
```typescript
// For form state, theme, etc.
<MapFormProvider>
  <MapForm />
</MapFormProvider>
```

---

### 8. Environment Variables

**Validation Pattern:**
```typescript
// apps/web/env.ts
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    RESEND_API_KEY: z.string(),
  },
  client: {
    NEXT_PUBLIC_CONVEX_URL: z.string().url(),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
  },
  runtimeEnv: {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
    // ...
  },
});
```

**Usage:**
```typescript
import { env } from "@/env";

const apiUrl = env.NEXT_PUBLIC_CONVEX_URL;  // Type-safe, validated
```

---

## How It All Works Together

### Request Flow: Creating a Map

Let's trace how creating a new map flows through the system:

```
1. User clicks "Create Map" in apps/web
2. components/modals/create_map_modal.tsx opens
3. components/map-form/map-stepper.tsx handles form
4. User fills out details, location, labels
5. Form submits -> useMutation(api.maps.create)
6. Request sent to packages/backend/convex/maps/index.ts
7. Convex mutation:
   - Validates args with Zod schema
   - Checks user authentication via Clerk
   - Inserts into "maps" table
   - Returns new map ID
8. apps/web receives map ID
9. Router navigates to /app/map/[mapId]
10. components/layouts/map-view/index.tsx renders
11. components/mapping/google-maps/index.tsx shows map
12. useQuery(api.maps.get) fetches map data reactively
13. User sees their new map!
```

---

### Data Flow: Real-Time Updates

When a map is edited by one user, all viewers see the update:

```
User A edits marker
useMutation(api.maps.markers.update)
Convex database updates
Convex broadcasts change to all subscribers
User B's useQuery(api.maps.markers.listByMap) auto-updates
User B sees marker move in real-time
```

**No polling required** - Convex handles WebSocket connections automatically.

---

### Package Import Flow

```
apps/web/src/components/map-card.tsx
 import { Button } from "@buzztrip/ui/components/button"
    packages/ui/src/components/button.tsx

 import { api } from "@buzztrip/backend"
    packages/backend/convex/_generated/api.d.ts

 import type { Map } from "@buzztrip/backend/types"
    packages/backend/types/index.ts

 import { useQuery } from "convex/react"
     node_modules/convex/react
```

All imports are type-safe and resolved at build time by Turborepo.

---

### Build Process

```
bun run dev
Turborepo orchestrates parallel builds:
     packages/backend -> Convex dev server (port 3000)
     packages/ui -> Watch mode (no build needed in dev)
     apps/web -> Next.js dev server (port 5173)
     apps/admin -> Next.js dev server (port 5176)
```

**Hot Reload:**
- Change in `packages/ui` -> apps rebuild automatically
- Change in Convex schema -> `_generated` updates -> apps reload
- Change in app code -> Fast Refresh updates UI

**Production Build:**
```
bun run build
1. packages/backend -> bun run deploy (Convex production)
2. packages/ui -> No build needed (consumed by apps)
3. apps/web -> next build (static + server)
4. apps/admin -> next build
```

---

### Authentication Flow

```
1. User visits apps/web
2. Clerk detects no session
3. Redirects to /sign-in
4. User authenticates with Clerk
5. Clerk JWT token created
6. Token passed to Convex via convex/auth.config.ts
7. Convex validates token
8. ctx.auth.getUserIdentity() returns user info
9. Queries/mutations can access user data
10. User synced to "users" table in Convex
```

**Admin Authorization:**
```
1. User signs in via apps/admin/sign-in
2. middleware.ts checks Clerk session
3. Clerk metadata checked for admin role
4. If not admin -> redirect to /unauthorized
5. If admin -> allow access to dashboard
```

---

### Analytics Flow

```
User action (e.g., view map)
PostHog event captured (apps/web/components/providers/posthog.tsx)
Event sent to PostHog servers
Admin views dashboard (apps/admin/page.tsx)
Convex query aggregates data (packages/backend/convex/admin/stats.ts)
Charts rendered with Recharts (apps/admin/components/charts/*)
```

---

## Summary

BuzzTrip's file system structure is designed for:

1. **Modularity** - Shared packages eliminate code duplication
2. **Type Safety** - End-to-end TypeScript from database to UI
3. **Scalability** - Monorepo structure supports multiple apps
4. **Developer Experience** - Hot reload, type generation, consistent tooling
5. **Real-Time** - Convex enables live collaborative features
6. **Maintainability** - Feature-based organization and clear patterns

### Key Concepts

- **Monorepo with Turborepo** - Multiple apps share code efficiently
- **Convex Backend** - Real-time serverless database with type-safe API
- **Zod Schemas** - Single source of truth for validation and types
- **shadcn/ui Pattern** - Copy-paste components, not npm packages
- **Workspace Packages** - `@buzztrip/*` imports across the monorepo
- **App Router** - Modern Next.js file-based routing
- **Feature Organization** - Code grouped by domain, not layer

### Quick Reference

| Need to... | Look in... |
|------------|------------|
| Add a new page | `apps/web/src/app/` or `apps/admin/src/app/` |
| Create a backend function | `packages/backend/convex/` |
| Add a shared UI component | `packages/ui/src/components/` |
| Define database schema | `packages/backend/convex/schema.ts` |
| Add validation | `packages/backend/zod-schemas/` |
| Create an email template | `packages/transactional/emails/` |
| Update TypeScript config | `packages/tsconfig/` |
| Check design guidelines | `context/design-principles.md` |
| View brand guidelines | `context/style-guide.md` |

---

**Need more details?** Check these other documentation files:
- `docs/overview.md` - High-level project overview
- `docs/architecture.md` - Technical architecture decisions
- `docs/commands.md` - Development commands reference
- `CLAUDE.md` - Development guidelines and conventions
