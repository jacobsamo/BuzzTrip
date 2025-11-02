# BuzzTrip Admin Dashboard - Implementation Plan

## Core Requirements
✅ **Read-only** - No data mutation, only queries
✅ **Admin-only access** - Clerk `publicMetadata.role === "admin"`
✅ **Proper auth flow** - Redirect to sign-in if not authenticated
✅ **Unauthorized page** - Block non-admin users with clear error
✅ **Tailwind v4** - CSS-first config (no tailwind.config.js)
✅ **Design system** - Use shadcn color variables (primary, secondary, accent, etc.)
✅ **Clean code** - Best React practices, simple, readable

---

## Technology Stack
- **Next.js 15** with App Router + Turbopack
- **Convex** (read-only queries via `useQuery`)
- **Clerk** with role-based middleware
- **TailwindCSS v4** with `@tailwindcss/postcss` (CSS-only config)
- **shadcn/ui** from `@buzztrip/ui`
- **Recharts** for charts
- **TanStack Table v8** for tables
- **TypeScript 5.9+**
- **date-fns** for date formatting

---

## Route Structure
```
/              → Dashboard overview (redirect to /sign-in if not auth)
/users         → All users table
/users/[id]    → User detail view
/maps          → All maps table
/maps/[id]     → Map detail view
/unauthorized  → Non-admin error page
```

---

## Phase 1: Project Foundation

### 1.1 Directory Structure
```
apps/admin/
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # Root layout with auth
│   │   ├── page.tsx                      # Dashboard overview
│   │   ├── unauthorized/
│   │   │   └── page.tsx                  # Non-admin error page
│   │   ├── users/
│   │   │   ├── page.tsx                  # Users table (read-only)
│   │   │   └── [id]/
│   │   │       └── page.tsx              # User detail (read-only)
│   │   └── maps/
│   │       ├── page.tsx                  # Maps table (read-only)
│   │       └── [id]/
│   │           └── page.tsx              # Map detail (read-only)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── admin-sidebar.tsx         # Navigation sidebar
│   │   │   └── breadcrumbs.tsx           # Route breadcrumbs
│   │   ├── dashboard/
│   │   │   ├── stat-card.tsx             # KPI stat cards
│   │   │   └── growth-indicator.tsx      # Week-over-week indicator
│   │   ├── charts/
│   │   │   ├── maps-chart.tsx            # Maps created chart
│   │   │   └── markers-chart.tsx         # Markers created chart
│   │   └── tables/
│   │       ├── users-table.tsx           # Users data table
│   │       ├── maps-table.tsx            # Maps data table
│   │       └── data-table.tsx            # Generic table wrapper
│   ├── lib/
│   │   ├── auth.ts                       # Convex auth helpers
│   │   ├── styles/
│   │   │   └── globals.css               # Tailwind v4 config + theme
│   │   └── utils/
│   │       ├── date-helpers.ts           # Date formatting
│   │       └── format-number.ts          # Number formatting
│   └── middleware.ts                     # Admin role enforcement
├── env.ts                                # Environment validation
├── next.config.ts                        # Next.js config
├── postcss.config.mjs                    # PostCSS with @tailwindcss/postcss
├── package.json
└── tsconfig.json
```

---

### 1.2 Configuration Files

#### **package.json**
```json
{
  "name": "@buzztrip/admin",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --port 5176 --turbopack",
    "build": "next build",
    "start": "next start --port 5176",
    "lint": "next lint"
  },
  "dependencies": {
    "@buzztrip/backend": "workspace:*",
    "@buzztrip/ui": "workspace:*",
    "@clerk/nextjs": "^6.32.0",
    "@t3-oss/env-nextjs": "^0.13.8",
    "@tailwindcss/postcss": "^4.1.13",
    "@tanstack/react-table": "^8.20.5",
    "convex": "^1.27.0",
    "date-fns": "^4.1.0",
    "lucide-react": "^0.544.0",
    "next": "^15.5.3",
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
        "recharts": "2.15.1",
    "zod": "3.25.76"
  },
  "devDependencies": {
    "@buzztrip/tsconfig": "workspace:*",
    "@types/node": "^24.3.3",
    "@types/react": "^19.1.13",
    "@types/react-dom": "^19.1.9",
    "eslint": "^9.35.0",
    "eslint-config-next": "^15.5.3",
    "postcss": "^8.5.6",
    "tailwindcss": "^4.1.13",
    "typescript": "^5.9.2"
  }
}
```

#### **next.config.ts**
```typescript
import type { NextConfig } from "next";
import "./env";

const nextConfig: NextConfig = {
  transpilePackages: ["@buzztrip/backend", "@buzztrip/ui"],
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
```

#### **postcss.config.mjs** (Tailwind v4)
```javascript
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};

export default config;
```

#### **env.ts** (Reuse web app env vars)
```typescript
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    CLERK_SECRET_KEY: z.string(),
  },
  client: {
    NEXT_PUBLIC_CONVEX_URL: z.string(),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().default("/sign-in"),
  },
  runtimeEnv: {
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
  },
});
```

#### **src/lib/styles/globals.css** (Tailwind v4 CSS-first config)
```css
@import "tailwindcss";

/* Tailwind v4 plugin imports */
@plugin "tailwindcss-animate";

/* Dark mode variant */
@custom-variant dark (&:is(.dark *));

/* shadcn/ui Design Tokens - Light Mode */
:root {
  --background: hsl(0 0% 100%);
  --foreground: hsl(240 10% 3.9%);
  --card: hsl(0 0% 100%);
  --card-foreground: hsl(240 10% 3.9%);
  --popover: hsl(0 0% 100%);
  --popover-foreground: hsl(240 10% 3.9%);
  --primary: hsl(176, 46%, 32%);
  --primary-foreground: hsl(355.7 100% 97.3%);
  --secondary: hsl(240 4.8% 95.9%);
  --secondary-foreground: hsl(240 5.9% 10%);
  --muted: hsl(240 4.8% 95.9%);
  --muted-foreground: hsl(240 3.8% 46.1%);
  --accent: hsl(240 4.8% 95.9%);
  --accent-foreground: hsl(240 5.9% 10%);
  --destructive: hsl(0 84.2% 60.2%);
  --destructive-foreground: hsl(0 0% 98%);
  --border: hsl(240 5.9% 90%);
  --input: hsl(240 5.9% 90%);
  --ring: hsl(142.1 76.2% 36.3%);
  --radius: 0.5rem;
  --chart-1: hsl(12 76% 61%);
  --chart-2: hsl(173 58% 39%);
  --chart-3: hsl(197 37% 24%);
  --chart-4: hsl(43 74% 66%);
  --chart-5: hsl(27 87% 67%);
  --sidebar-background: hsl(0 0% 98%);
  --sidebar-foreground: hsl(240 5.3% 26.1%);
  --sidebar-primary: hsl(240 5.9% 10%);
  --sidebar-primary-foreground: hsl(0 0% 98%);
  --sidebar-accent: hsl(240 4.8% 95.9%);
  --sidebar-accent-foreground: hsl(240 5.9% 10%);
  --sidebar-border: hsl(220 13% 91%);
  --sidebar-ring: hsl(217.2 91.2% 59.8%);
}

/* Dark Mode */
.dark {
  --background: hsl(20 14.3% 4.1%);
  --foreground: hsl(0 0% 95%);
  --card: hsl(24 9.8% 10%);
  --card-foreground: hsl(0 0% 95%);
  --popover: hsl(0 0% 9%);
  --popover-foreground: hsl(0 0% 95%);
  --primary: hsl(176, 46%, 32%);
  --primary-foreground: hsl(144.9 80.4% 10%);
  --secondary: hsl(240 3.7% 15.9%);
  --secondary-foreground: hsl(0 0% 98%);
  --muted: hsl(0 0% 15%);
  --muted-foreground: hsl(240 5% 64.9%);
  --accent: hsl(12 6.5% 15.1%);
  --accent-foreground: hsl(0 0% 98%);
  --destructive: hsl(0 62.8% 30.6%);
  --destructive-foreground: hsl(0 85.7% 97.3%);
  --border: hsl(240 3.7% 15.9%);
  --input: hsl(240 3.7% 15.9%);
  --ring: hsl(142.4 71.8% 29.2%);
  --chart-1: hsl(220 70% 50%);
  --chart-2: hsl(160 60% 45%);
  --chart-3: hsl(30 80% 55%);
  --chart-4: hsl(280 65% 60%);
  --chart-5: hsl(340 75% 55%);
  --sidebar-background: hsl(240 5.9% 10%);
  --sidebar-foreground: hsl(240 4.8% 95.9%);
  --sidebar-primary: hsl(224.3 76.3% 48%);
  --sidebar-primary-foreground: hsl(0 0% 100%);
  --sidebar-accent: hsl(240 3.7% 15.9%);
  --sidebar-accent-foreground: hsl(240 4.8% 95.9%);
  --sidebar-border: hsl(240 3.7% 15.9%);
  --sidebar-ring: hsl(217.2 91.2% 59.8%);
}

/* Tailwind v4 theme mapping */
@theme inline {
  --radius-lg: var(--radius);
  --radius-md: calc(var(--radius) - 2px);
  --radius-sm: calc(var(--radius) - 4px);

  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);

  --animate-accordion-down: accordion-down 0.2s ease-out;
  --animate-accordion-up: accordion-up 0.2s ease-out;

  @keyframes accordion-down {
    from { height: 0; }
    to { height: var(--radix-accordion-content-height); }
  }

  @keyframes accordion-up {
    from { height: var(--radix-accordion-content-height); }
    to { height: 0; }
  }
}

/* Border compatibility for Tailwind v4 */
@layer base {
  *, ::after, ::before, ::backdrop, ::file-selector-button {
    border-color: var(--color-border);
  }

  body {
    @apply bg-background text-foreground;
  }
}
```

---

### 1.3 Authentication & Middleware

#### **src/middleware.ts** (Admin role enforcement)
```typescript
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/unauthorized']);
const isAdminRoute = createRouteMatcher(['/((?!sign-in|unauthorized).*)']);

export default clerkMiddleware(async (auth, req) => {
  // Allow public routes (sign-in, unauthorized)
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Protect admin routes
  if (isAdminRoute(req)) {
    const { userId, sessionClaims, redirectToSignIn } = await auth();

    // Not signed in → redirect to sign-in
    if (!userId) {
      return redirectToSignIn();
    }

    // Signed in but not admin → redirect to unauthorized
    const role = sessionClaims?.publicMetadata?.role as string | undefined;
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
```

#### **src/lib/auth.ts** (Convex server auth helpers)
```typescript
import { auth } from "@clerk/nextjs/server";
import { type NextjsOptions } from "convex/nextjs";
import { env } from "../env";

/**
 * Get Clerk JWT token for Convex authentication
 */
export async function getAuthToken() {
  const session = await auth();
  const token = await session.getToken({ template: "convex" });
  return token ?? undefined;
}

/**
 * Get Convex options with authentication for server components
 */
export async function convexNextjsOptions(): Promise<NextjsOptions> {
  const token = await getAuthToken();
  return {
    url: env.NEXT_PUBLIC_CONVEX_URL,
    token,
  };
}
```

#### **src/app/unauthorized/page.tsx** (Error page for non-admins)
```tsx
import { SignOutButton } from "@clerk/nextjs";
import { Button } from "@buzztrip/ui/components/button";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-6">
            <ShieldAlert className="h-16 w-16 text-destructive" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Access Denied
          </h1>
          <p className="text-muted-foreground">
            You don't have permission to access the admin dashboard.
            Only authorized administrators can view this page.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <SignOutButton>
            <Button variant="default" className="w-full">
              Sign Out
            </Button>
          </SignOutButton>

          <Link href="https://buzztrip.co">
            <Button variant="outline" className="w-full">
              Return to BuzzTrip
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
```

---

## Phase 2: Backend - Convex Admin Queries (Read-Only)

### 2.1 Admin Helper Functions

**Location:** `packages/backend/helpers/admin-helpers.ts`
```typescript
import { QueryCtx } from "../convex/_generated/server";

/**
 * Check if the current user has admin role in Clerk metadata
 */
export async function isUserAdmin(ctx: QueryCtx): Promise<boolean> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return false;

  const metadata = identity.publicMetadata as { role?: string };
  return metadata?.role === "admin";
}

/**
 * Require admin role or throw error (for read-only queries)
 */
export async function requireAdmin(ctx: QueryCtx): Promise<void> {
  if (!(await isUserAdmin(ctx))) {
    throw new Error("Unauthorized: Admin access required");
  }
}
```

**Update:** `packages/backend/helpers/index.ts`
```typescript
export * from './rbac';
export * from './admin-helpers';

export const uppercaseFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
```

---

### 2.2 Admin Queries (Read-Only)

#### **packages/backend/convex/admin/stats.ts**

Overview statistics and growth metrics for dashboard KPI cards.

```typescript
import { query } from "../_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "../../helpers/admin-helpers";

/**
 * Get overview statistics for dashboard
 * READ-ONLY
 */
export const getOverviewStats = query({
  args: {},
  returns: v.object({
    totalUsers: v.number(),
    totalMaps: v.number(),
    totalMarkers: v.number(),
    totalPlaces: v.number(),
  }),
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const [users, maps, markers, places] = await Promise.all([
      ctx.db.query("users").collect(),
      ctx.db.query("maps").collect(),
      ctx.db.query("markers").collect(),
      ctx.db.query("places").collect(),
    ]);

    return {
      totalUsers: users.length,
      totalMaps: maps.length,
      totalMarkers: markers.length,
      totalPlaces: places.length,
    };
  },
});

/**
 * Get growth metrics for specified period
 * READ-ONLY
 */
export const getGrowthMetrics = query({
  args: { days: v.number() },
  returns: v.object({
    usersGrowth: v.number(),
    mapsGrowth: v.number(),
    markersGrowth: v.number(),
    placesGrowth: v.number(),
  }),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const now = Date.now();
    const periodMs = args.days * 24 * 60 * 60 * 1000;
    const currentPeriodStart = now - periodMs;
    const previousPeriodStart = now - (periodMs * 2);

    // Get counts for current period
    const currentUsers = (await ctx.db
      .query("users")
      .filter(q => q.gte(q.field("_creationTime"), currentPeriodStart))
      .collect()).length;

    const currentMaps = (await ctx.db
      .query("maps")
      .filter(q => q.gte(q.field("_creationTime"), currentPeriodStart))
      .collect()).length;

    const currentMarkers = (await ctx.db
      .query("markers")
      .filter(q => q.gte(q.field("_creationTime"), currentPeriodStart))
      .collect()).length;

    const currentPlaces = (await ctx.db
      .query("places")
      .filter(q => q.gte(q.field("_creationTime"), currentPeriodStart))
      .collect()).length;

    // Get counts for previous period
    const previousUsers = (await ctx.db
      .query("users")
      .filter(q =>
        q.and(
          q.gte(q.field("_creationTime"), previousPeriodStart),
          q.lt(q.field("_creationTime"), currentPeriodStart)
        )
      )
      .collect()).length;

    const previousMaps = (await ctx.db
      .query("maps")
      .filter(q =>
        q.and(
          q.gte(q.field("_creationTime"), previousPeriodStart),
          q.lt(q.field("_creationTime"), currentPeriodStart)
        )
      )
      .collect()).length;

    const previousMarkers = (await ctx.db
      .query("markers")
      .filter(q =>
        q.and(
          q.gte(q.field("_creationTime"), previousPeriodStart),
          q.lt(q.field("_creationTime"), currentPeriodStart)
        )
      )
      .collect()).length;

    const previousPlaces = (await ctx.db
      .query("places")
      .filter(q =>
        q.and(
          q.gte(q.field("_creationTime"), previousPeriodStart),
          q.lt(q.field("_creationTime"), currentPeriodStart)
        )
      )
      .collect()).length;

    // Calculate growth percentages
    const calculateGrowth = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    return {
      usersGrowth: calculateGrowth(currentUsers, previousUsers),
      mapsGrowth: calculateGrowth(currentMaps, previousMaps),
      markersGrowth: calculateGrowth(currentMarkers, previousMarkers),
      placesGrowth: calculateGrowth(currentPlaces, previousPlaces),
    };
  },
});
```

#### **packages/backend/convex/admin/users.ts**

User management queries with aggregated statistics.

```typescript
import { query } from "../_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "../../helpers/admin-helpers";

/**
 * Get all users with aggregated statistics
 * READ-ONLY
 */
export const getAllUsersWithStats = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("users"),
    _creationTime: v.number(),
    name: v.string(),
    email: v.string(),
    image: v.string(),
    username: v.optional(v.string()),
    mapsCount: v.number(),
    markersCount: v.number(),
  })),
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const users = await ctx.db.query("users").collect();

    return await Promise.all(users.map(async (user) => {
      const [ownedMaps, createdMarkers] = await Promise.all([
        ctx.db
          .query("map_users")
          .withIndex("by_user_id", q => q.eq("user_id", user._id))
          .filter(q => q.eq(q.field("permission"), "owner"))
          .collect(),
        ctx.db
          .query("markers")
          .filter(q => q.eq(q.field("created_by"), user._id))
          .collect(),
      ]);

      return {
        _id: user._id,
        _creationTime: user._creationTime,
        name: user.name,
        email: user.email,
        image: user.image,
        username: user.username,
        mapsCount: ownedMaps.length,
        markersCount: createdMarkers.length,
      };
    }));
  },
});

/**
 * Get detailed statistics for a specific user
 * READ-ONLY
 */
export const getUserDetailStats = query({
  args: { userId: v.id("users") },
  returns: v.object({
    totalMaps: v.number(),
    totalMarkers: v.number(),
    totalCollections: v.number(),
    collaborations: v.number(),
  }),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const [ownedMaps, allMapUsers, markers, collections] = await Promise.all([
      ctx.db
        .query("map_users")
        .withIndex("by_user_id", q => q.eq("user_id", args.userId))
        .filter(q => q.eq(q.field("permission"), "owner"))
        .collect(),
      ctx.db
        .query("map_users")
        .withIndex("by_user_id", q => q.eq("user_id", args.userId))
        .collect(),
      ctx.db
        .query("markers")
        .filter(q => q.eq(q.field("created_by"), args.userId))
        .collect(),
      ctx.db
        .query("collections")
        .filter(q => q.eq(q.field("created_by"), args.userId))
        .collect(),
    ]);

    return {
      totalMaps: ownedMaps.length,
      totalMarkers: markers.length,
      totalCollections: collections.length,
      collaborations: allMapUsers.length - ownedMaps.length,
    };
  },
});
```

#### **packages/backend/convex/admin/maps.ts**

Map management queries with aggregated statistics.

```typescript
import { query } from "../_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "../../helpers/admin-helpers";

/**
 * Get all maps with aggregated statistics
 * READ-ONLY
 */
export const getAllMapsWithStats = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const maps = await ctx.db.query("maps").collect();

    return await Promise.all(maps.map(async (map) => {
      const [owner, markers, collaborators] = await Promise.all([
        ctx.db.get(map.owner_id),
        ctx.db
          .query("markers")
          .withIndex("by_map_id", q => q.eq("map_id", map._id))
          .collect(),
        ctx.db
          .query("map_users")
          .withIndex("by_map_id", q => q.eq("map_id", map._id))
          .collect(),
      ]);

      return {
        ...map,
        owner,
        markersCount: markers.length,
        collaboratorsCount: collaborators.length,
      };
    }));
  },
});

/**
 * Get detailed statistics for a specific map
 * READ-ONLY
 */
export const getMapDetailStats = query({
  args: { mapId: v.id("maps") },
  returns: v.object({
    markersCount: v.number(),
    collectionsCount: v.number(),
    pathsCount: v.number(),
    labelsCount: v.number(),
    routesCount: v.number(),
    collaboratorsCount: v.number(),
  }),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const [markers, collections, paths, labels, routes, collaborators] = await Promise.all([
      ctx.db.query("markers").withIndex("by_map_id", q => q.eq("map_id", args.mapId)).collect(),
      ctx.db.query("collections").withIndex("by_map_id", q => q.eq("map_id", args.mapId)).collect(),
      ctx.db.query("paths").withIndex("byMapId", q => q.eq("mapId", args.mapId)).collect(),
      ctx.db.query("labels").withIndex("by_map_id", q => q.eq("map_id", args.mapId)).collect(),
      ctx.db.query("routes").withIndex("by_map_id", q => q.eq("map_id", args.mapId)).collect(),
      ctx.db.query("map_users").withIndex("by_map_id", q => q.eq("map_id", args.mapId)).collect(),
    ]);

    return {
      markersCount: markers.length,
      collectionsCount: collections.length,
      pathsCount: paths.length,
      labelsCount: labels.length,
      routesCount: routes.length,
      collaboratorsCount: collaborators.length,
    };
  },
});
```

#### **packages/backend/convex/admin/charts.ts**

Chart data queries for visualization.

```typescript
import { query } from "../_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "../../helpers/admin-helpers";

/**
 * Get maps created by month for charts
 * READ-ONLY
 */
export const getMapsCreatedByMonth = query({
  args: { months: v.number() },
  returns: v.array(v.object({
    month: v.string(),
    count: v.number(),
  })),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const maps = await ctx.db.query("maps").collect();

    // Group by month
    const monthCounts: Record<string, number> = {};
    const now = new Date();

    // Initialize last N months
    for (let i = args.months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthCounts[key] = 0;
    }

    // Count maps per month
    maps.forEach(map => {
      const date = new Date(map._creationTime);
      const key = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (key in monthCounts) {
        monthCounts[key]++;
      }
    });

    return Object.entries(monthCounts).map(([month, count]) => ({
      month,
      count,
    }));
  },
});

/**
 * Get markers created by month for charts
 * READ-ONLY
 */
export const getMarkersCreatedByMonth = query({
  args: { months: v.number() },
  returns: v.array(v.object({
    month: v.string(),
    count: v.number(),
  })),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const markers = await ctx.db.query("markers").collect();

    // Same grouping logic as maps
    const monthCounts: Record<string, number> = {};
    const now = new Date();

    for (let i = args.months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthCounts[key] = 0;
    }

    markers.forEach(marker => {
      const date = new Date(marker._creationTime);
      const key = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (key in monthCounts) {
        monthCounts[key]++;
      }
    });

    return Object.entries(monthCounts).map(([month, count]) => ({
      month,
      count,
    }));
  },
});
```

---

## Phase 3: Frontend Components

### 3.1 Component Specifications

All components follow these principles:
- **Clean code**: Simple, readable, single responsibility
- **Type safety**: Full TypeScript coverage
- **Reusability**: Generic where applicable
- **Design system**: Use shadcn color variables
- **Responsive**: Mobile-first approach

### 3.2 Key Component Examples

See full implementations in the detailed plan above for:
- `StatCard` - KPI cards with growth indicators
- `MapsChart` / `MarkersChart` - Recharts integration
- `UsersTable` - TanStack Table with sorting
- `AdminSidebar` - Navigation with user info
- Layout components for each page

---

## Implementation Checklist

### Phase 1: Setup
- [ ] Create `apps/admin` directory structure
- [ ] Configure `package.json` with dependencies
- [ ] Set up `next.config.ts` and `postcss.config.mjs`
- [ ] Create `env.ts` with validation
- [ ] Set up Tailwind v4 in `globals.css` (no config file)
- [ ] Implement middleware with admin role check
- [ ] Create unauthorized error page
- [ ] Add auth helpers (`src/lib/auth.ts`)

### Phase 2: Backend
- [ ] Create `admin-helpers.ts` with `requireAdmin`
- [ ] Implement `admin/stats.ts` queries
- [ ] Implement `admin/users.ts` queries
- [ ] Implement `admin/maps.ts` queries
- [ ] Implement `admin/charts.ts` queries
- [ ] Test all queries with admin role

### Phase 3: Frontend - Dashboard
- [ ] Create root layout with providers
- [ ] Build dashboard overview page
- [ ] Implement `StatCard` component
- [ ] Implement `MapsChart` component
- [ ] Implement `MarkersChart` component
- [ ] Add growth indicators

### Phase 4: Frontend - Users
- [ ] Build users table page
- [ ] Implement `UsersTable` with TanStack Table
- [ ] Build user detail page
- [ ] Implement user stats display
- [ ] Add user's maps table

### Phase 5: Frontend - Maps
- [ ] Build maps table page
- [ ] Implement `MapsTable` with TanStack Table
- [ ] Build map detail page
- [ ] Implement map stats display
- [ ] Add tabbed sections (markers, collections, etc.)

### Phase 6: Layout & Navigation
- [ ] Implement `AdminSidebar` component
- [ ] Add breadcrumbs navigation
- [ ] Ensure responsive mobile layout
- [ ] Test sidebar collapse on mobile

### Phase 7: Testing & Polish
- [ ] Test authentication flow (not signed in → sign-in)
- [ ] Test authorization (signed in, not admin → unauthorized)
- [ ] Test admin access to all routes
- [ ] Verify all queries are read-only
- [ ] Test responsive design on mobile
- [ ] Verify design system consistency
- [ ] Performance check with Lighthouse
- [ ] Add to Turbo pipeline

---

## Testing Strategy

### Authentication Tests
1. Not signed in → should redirect to sign-in
2. Signed in without admin role → should show unauthorized page
3. Signed in with admin role → should access dashboard

### Query Tests
1. All queries should check admin role
2. Non-admin should receive error
3. Admin should receive data

### UI Tests
1. Dashboard loads with stats
2. Charts render correctly
3. Tables sort and filter
4. Navigation works
5. Mobile responsive
6. Dark mode support

---

## Success Criteria

- ✅ Admin-only access enforced
- ✅ Proper auth redirects
- ✅ All operations read-only
- ✅ Tailwind v4 CSS-first config
- ✅ shadcn design system compliance
- ✅ Clean, maintainable code
- ✅ Mobile responsive
- ✅ Type-safe throughout
- ✅ Production ready
