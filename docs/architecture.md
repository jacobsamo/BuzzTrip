# BuzzTrip Architecture

> **Last Updated:** 2025-10-29
> **Version:** 1.0

This document provides a comprehensive overview of BuzzTrip's technical architecture, including core technologies, system design patterns, data flow, and integration strategies.

---


## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Core Technology Stack](#core-technology-stack)
3. [System Architecture](#system-architecture)
4. [Authentication & Authorization](#authentication--authorization)
5. [Real-Time Database Architecture](#real-time-database-architecture)
6. [State Management](#state-management)
7. [Mapping Architecture](#mapping-architecture)
8. [UI Component Architecture](#ui-component-architecture)
9. [Email System](#email-system)
10. [Analytics & Monitoring](#analytics--monitoring)
11. [Payment Integration](#payment-integration)
12. [File Storage](#file-storage)
13. [API Design Patterns](#api-design-patterns)
14. [Data Flow Patterns](#data-flow-patterns)
15. [Security Architecture](#security-architecture)
16. [Development Patterns](#development-patterns)
17. [Deployment Architecture](#deployment-architecture)
18. [Future Considerations](#future-considerations)

---


## Architecture Overview

BuzzTrip is a **full-stack, real-time collaborative mapping platform** built as a Turborepo monorepo. The architecture follows modern patterns with:

- **Real-time backend** powered by Convex

- **Type-safe end-to-end** development with TypeScript

- **Component-driven UI** with React and shadcn/ui

- **Collaborative features** via WebSocket subscriptions

- **Schema-driven development** using Zod validation

- **Monorepo structure** for code sharing and scalability


### High-Level Architecture

```

                        Client Layer
+-----------------------------------------------------------------+
  Web App (Next.js)          Admin Dashboard       Mobile App
  Port: 5173                 Port: 5176            (Expo)
  - User-facing maps         - Admin analytics     - Native
  - Map creation             - User management     - iOS/
  - Collaboration            - Platform insights     Android

                              -> WebSocket + HTTP

                        Backend Layer
+-----------------------------------------------------------------+
                    Convex (Real-time Backend)
  - Queries & Mutations (100+ functions)
  - Real-time subscriptions via WebSocket
  - Database with indexes and search
  - File storage system
  - HTTP endpoints for webhooks


                    Shared Packages Layer
+-----------------------------------------------------------------+
  @buzztrip/backend       @buzztrip/ui    @buzztrip/
  - Convex functions      - Components    transactional
  - Zod schemas           - Hooks         - Email templates
  - Types & helpers       - Utilities


                    External Services
+-----------------------------------------------------------------+
  Clerk          Google Maps    PostHog       Sentry      Resend
  (Auth)         (Mapping)      (Analytics)   (Errors)    (Email)

  Polar/Stripe   Mapbox         Terra Draw
  (Payments)     (Future Map)   (Drawing)

```

---


## Core Technology Stack


### 1. **Convex - Real-Time Database**

**Purpose:** Primary backend and database
**Why:** Real-time synchronization, serverless functions, type-safe queries

Convex is the backbone of BuzzTrip's backend architecture:

- **Real-time updates:** WebSocket-based subscriptions automatically update all connected clients

- **Serverless functions:** Write backend logic as TypeScript functions (queries, mutations, actions)

- **Type generation:** Auto-generates TypeScript types from schema

- **Built-in features:** File storage, full-text search, scheduled functions

- **Development experience:** Hot reload, instant deployment, built-in dashboard

**Key Benefits:**
- No polling required for real-time features
- Collaborative editing works out-of-the-box
- Single source of truth for data
- Automatic optimistic updates
- Built-in caching and performance optimization

**Location:** `packages/backend/convex/`

---


### 2. **shadcn/ui + Radix UI - UI Component Library**

**Purpose:** Component library and design system
**Why:** Accessible, customizable, copy-paste components

**Architecture:**

- **shadcn/ui:** Component patterns and recipes (not an npm package)

- **Radix UI:** Unstyled, accessible component primitives

- **TailwindCSS v4:** Utility-first styling

**Key Components:**
- Form controls (Input, Select, Checkbox, etc.)
- Overlays (Dialog, Sheet, Popover, Tooltip)
- Navigation (Sidebar, Breadcrumb, Pagination)
- Data display (Table, Card, Badge, Avatar)
- Feedback (Alert, Toast via Sonner, Skeleton)

**Customization:**
- Components live in `packages/ui/` as source code
- Fully customizable (not locked to npm package versions)
- Shared across web and admin apps
- Easy to swap Radix for alternatives like BaseUI

**Location:** `packages/ui/src/components/`

---


### 3. **Next.js - Web Framework**

**Purpose:** Frontend framework for web and admin apps
**Why:** App Router, Server Components, SSR, optimal performance

**Features Used:**

- **App Router:** File-based routing with layouts, loading states, error boundaries

- **Server Components:** Default for optimal performance

- **Client Components:** For interactivity and real-time subscriptions

- **API Routes:** For webhooks and custom endpoints

- **Image Optimization:** Automatic image optimization

- **Middleware:** Authentication and authorization checks

**Configuration:**
- Port 5173 for web app
- Port 5176 for admin dashboard
- Turbopack for faster dev builds
- MDX support for blog content

**Location:** `apps/web/`, `apps/admin/`

---


### 4. **Expo - Mobile Framework (Future)**

**Purpose:** Cross-platform mobile development
**Why:** React Native with better DX, shared codebase with web

**Status:** Work in progress, planned for rewrite
**Plan:** Share business logic and components with web app via monorepo packages

**Location:** `apps/mobile/` (to be rewritten)

---


### 5. **React Email - Email Templates**

**Purpose:** Build email templates with React components
**Why:** Type-safe, testable, component-based email design

**Templates:**
- Welcome email (onboarding)
- Magic link authentication
- Contact form confirmation

**Integration:** Emails sent via Resend from Convex backend

**Location:** `packages/transactional/emails/`

---


### 6. **Resend - Email Delivery**

**Purpose:** Transactional email sending
**Why:** Developer-friendly API, reliable delivery, good reputation

**Integration Pattern:**

```typescript
// In Convex function
await resend.sendEmail(ctx, {
  from: "Jacob Samorowski <info@buzztrip.co>",
  to: user.email,
  subject: "Welcome to BuzzTrip",
  react: <WelcomeEmail name={user.name} />,
});

```

**Triggers:**
- User registration (via Clerk webhook)
- Contact form submissions
- Future: Map sharing invitations, notifications

**Location:** `packages/backend/convex/emails.ts`

---


### 7. **Clerk - Authentication**

**Purpose:** User authentication and management
**Why:** Pre-built UI, secure JWT tokens, user management, webhooks

**Features:**
- Sign up / Sign in with email, social providers
- JWT tokens for secure API access
- User profile management
- Webhook integration for user sync
- Role-based access control via metadata

**Integration:**

- **Web App:** `ConvexProviderWithClerk` provides auth token to Convex

- **Admin App:** Middleware checks for admin role

- **Backend:** `auth.config.ts` validates Clerk JWT tokens

**User Sync Flow:**
1. User signs up in Clerk
2. Clerk fires webhook to Convex HTTP endpoint
3. Convex creates user in database
4. User automatically gets "Main map" created
5. JWT token contains user identity for all requests

**Location:** `packages/backend/convex/auth.config.ts`, `apps/*/src/lib/auth.ts`

---


### 8. **Zustand - Global State Management**

**Purpose:** Client-side state management
**Why:** Simple API, TypeScript-friendly, no boilerplate

**State Managed:**

- **Map State:** Current map, markers, collections, paths, labels, routes

- **UI State:** Active location, drawer state, mobile responsive state

- **Drawing State:** Terra Draw instance

- **Search State:** Search value, active search

**Pattern:**

```typescript
const useMapStore = create((set, get) => ({
  map: null,
  markers: [],
  setActiveLocation: (location) => set({ activeLocation: location }),
  getCollectionsForMarker: (markerId) => {
    // Derived state calculation
  },
}));

```

**When to Use:**
- UI state that doesn't need persistence
- Temporary state during user interactions
- Derived/computed state from multiple sources

**Location:** `apps/web/src/lib/stores/`

---


### 9. **PostHog - Product Analytics**

**Purpose:** User behavior analytics and insights
**Why:** Self-hostable, feature flags, session recording, heatmaps

**Features Used:**
- Event tracking (map creation, marker additions, etc.)
- User identification (linked with Clerk ID)
- Session recording (masked sensitive inputs)
- Heatmaps for UI optimization

**Integration:**

```typescript
// In provider
posthog.init(POSTHOG_KEY, {
  api_host: "/_proxy/posthog/ingest",
  person_profiles: "identified_only",
  enable_heatmaps: true,
  session_recording: { maskAllInputs: false, maskInputOptions: { password: true } },
});

// User identification
posthog.identify(session.userId, {
  email: currentUser.email,
  convex_id: currentUser._id,
});

```

**Location:** `apps/web/src/components/providers/posthog.tsx`

---


### 10. **Sentry - Error Tracking**

**Purpose:** Error monitoring and performance tracking
**Why:** Comprehensive error tracking, release tracking, performance insights

**Features:**
- Automatic error capture
- User context attachment
- Release tracking
- Performance monitoring
- Source map support

**Integration:**

```typescript
// In instrumentation.ts
Sentry.init({
  dsn: env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

// User context set alongside PostHog
Sentry.setUser({ id: session.userId, email: user.email });

```

**Location:** `apps/web/src/instrumentation.ts`

---


### 11. **Polar / Stripe - Payment Processing**

**Purpose:** Subscription and payment management
**Why:** Developer-friendly APIs, comprehensive features

**Status:** Prepared for future integration
**Use Cases:**
- Premium subscriptions
- Pro feature access
- Team plans

**Current Integration:**
- Polar SDK included in dependencies (`@polar-sh/sdk`)
- Not yet actively used in current features

---


### 12. **Google Maps - Mapping Platform**

**Purpose:** Primary mapping provider
**Why:** Comprehensive API, Places data, familiarity

**Library:** `@vis.gl/react-google-maps`
**Why vis.gl:** Modern React hooks API, better TypeScript support, performance optimizations

**Features Used:**

- **Maps:** Display with multiple styles (roadmap, satellite, hybrid, terrain)

- **Markers:** Custom marker rendering with place data

- **Places API:** Search and place details

- **Geocoding:** Address to coordinates

- **Drawing:** Via Terra Draw adapter

**Integration:**

```typescript
const GoogleMapsMapView = () => {
  const googleMap = useMap(); // vis.gl hook
  const places = useMapsLibrary("places");

  // Place search
  const service = new places.PlacesService(googleMap);
  service.findPlaceFromQuery({ query: "restaurant" }, callback);
};

```

**Location:** `apps/web/src/components/mapping/google-maps/`

---


### 13. **Turf.js - Geospatial Utilities**

**Purpose:** Geospatial calculations and analysis
**Why:** Comprehensive geospatial operations in JavaScript

**Use Cases:**
- Distance calculations
- Area measurements
- Path simplification
- Bounding box calculations
- GeoJSON manipulation

**Location:** Used throughout mapping components

---


### 14. **Mapbox - Future Mapping Platform**

**Purpose:** Alternative mapping provider (future)
**Why:** Better styling, custom map tiles, offline support

**Status:** Partially implemented, prepared for future expansion
**Plan:** Provide users with choice between Google Maps and Mapbox

**Library:** `react-map-gl` (from vis.gl team)

**Location:** `apps/web/src/components/mapping/mapbox/`

---


### 15. **vis.gl - Mapping React Wrappers**

**Purpose:** React wrappers for Google Maps and Mapbox
**Why:** Modern hooks API, better React integration

**Packages:**
- `@vis.gl/react-google-maps` - Google Maps wrapper
- `react-map-gl` - Mapbox wrapper (future)

**Benefits:**
- Consistent API across map providers
- React-friendly hooks
- Better TypeScript support
- Performance optimizations

---


### 16. **Motion (Framer Motion) - Animations**

**Purpose:** Beautiful UI animations and transitions
**Why:** Declarative animations, gesture support, spring physics

**Use Cases:**
- Page transitions
- Modal/drawer animations
- Hover effects
- Loading states
- Interactive elements

**Pattern:**

```typescript
import { motion } from "motion/react";

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
>
  Content
</motion.div>

```

---


### 17. **Terra Draw - Drawing on Maps**

**Purpose:** Enable drawing shapes on maps
**Why:** Framework-agnostic, extensible, multiple modes

**Features:**
- Drawing modes: Line, Polygon, Rectangle, Circle, Freehand
- Selection and editing
- Style customization
- Validation

**Integration:**

```typescript
// Custom adapter for Google Maps
import { TerraDrawGoogleMapsAdapter } from "terra-draw-google-maps-adapter";

const adapter = new TerraDrawGoogleMapsAdapter(googleMap);
const draw = new TerraDraw({ adapter, modes: [polygon, select] });
draw.start();

```

**Sync Pattern:**
- User draws shape -> Terra Draw captures geometry
- Geometry validated against Zod schema
- Saved to Convex as Path entity
- Real-time synced to other users

**Location:** `apps/web/src/components/mapping/google-maps/drawing/`

---


### 18. **Additional Utilities**

**TanStack Query:**
- Server state management
- Integrated with Convex for caching
- Used via `ConvexQueryClient`

**TanStack Table:**
- Powerful data tables in admin dashboard
- Sorting, filtering, pagination
- Used in Users and Maps management pages

**React Hook Form:**
- Form state management
- Zod validation integration
- Multi-step form support

**Recharts:**
- Chart library for admin analytics
- Area charts, bar charts, line charts

**date-fns:**
- Date formatting and manipulation
- Used throughout for relative dates, formatting

**Zod:**
- Runtime type validation
- Schema-driven development
- Single source of truth for validation

---


## System Architecture


### Architecture Layers

```

                     Presentation Layer
  - Next.js Pages & Layouts
  - React Components
  - shadcn/ui Components
  - Client-side routing


                    Application Layer
  - React Hooks (useQuery, useMutation)
  - Zustand Stores (client state)
  - Form Management (react-hook-form)
  - Event Emitters


                      API/Transport Layer
  - Convex Client (WebSocket + HTTP)
  - Clerk Authentication
  - Next.js API Routes


                      Business Logic Layer
  - Convex Queries (read operations)
  - Convex Mutations (write operations)
  - Convex Actions (external integrations)
  - Helper Functions (RBAC, validation)


                      Data Access Layer
  - Convex Database (ctx.db)
  - Indexes for efficient queries
  - Full-text search
  - File storage (ctx.storage)


                        Data Layer
  - Document database (NoSQL)
  - 13+ tables (maps, markers, places, users, etc.)
  - Relationships via document IDs

```

---


## Authentication & Authorization


### Authentication Architecture

```

    User
,
        1. Sign up/in

   Clerk (Auth)    2. Creates user
  - Pre-built UI   3. Issues JWT token
  - User mgmt      4. Fires webhook
,

       -> 5. JWT Token ->
                                    Convex Backend
                                    - Validates JWT
                                    - Extracts claims
       -> 6. Webhook ->  - Creates user


```


### Authentication Flow

1. **User Signs Up/In:**
   - User visits `/sign-in` or `/sign-up`
   - Clerk's pre-built UI handles authentication
   - Multiple providers: Email, Google, etc.

2. **Clerk Issues JWT:**
   - Upon successful auth, Clerk creates JWT token
   - Token includes user ID, email, metadata
   - Token signed with Clerk's private key

3. **Token Sent to Convex:**
   - `ConvexProviderWithClerk` wrapper handles token injection
   - Every Convex request includes JWT in headers
   - Convex validates token against Clerk's public key

4. **User Sync via Webhook:**
   - Clerk fires webhook on user events (created, updated, deleted)
   - Webhook hits Convex HTTP endpoint: `/clerk-users-webhook`
   - Convex handler:
     ```typescript
     // packages/backend/convex/http.ts
     http.route({
       path: "/clerk-users-webhook",
       method: "POST",
       handler: handleClerkWebhook,
     });
     ```

   - User data extracted and stored in Convex `users` table

5. **User Identity in Functions:**
   ```typescript
   export const getMap = query({
     handler: async (ctx, args) => {
       const identity = await ctx.auth.getUserIdentity();
       // identity.subject = Clerk user ID
       // identity.email = user email
       // identity.public_metadata = custom data
     },
   });
   ```

6. **Helper Functions:**
   ```typescript
   // Auto-inject user into context
   export const authedQuery = customQuery(
     query,
     customCtx(async (ctx) => {
       const identity = await ctx.auth.getUserIdentity();
       const user = await getUserByClerkId(ctx, identity.subject);
       return { user };
     })
   );
   ```


### Authorization Architecture

**Role-Based Access Control (RBAC):**

```

User
Has Role on Map
   Owner     (full access, can delete map)
   Editor    (can modify content)
   Viewer    (read-only)
   Commenter (can comment only)

```

**Permission Model:**

File: `packages/backend/helpers/rbac.ts`

```typescript
| type PermissionEnum = "owner" | "editor" | "viewer" | "commenter"; |

type EntityPermission = `${Entity}:${Action}`;
// Examples:
// - "maps:update"
// - "markers:create"
// - "markers:delete"

const rolePermissions: Record<PermissionEnum, EntityPermission[]> = {
  owner: [
    "maps:update", "maps:delete",
    "markers:create", "markers:update", "markers:delete",
    "collections:create", "collections:update", "collections:delete",
    // ... all permissions
  ],
  editor: [
    "maps:update",
    "markers:create", "markers:update", "markers:delete",
    // ... subset of permissions
  ],
  viewer: [], // Read-only
  commenter: [], // Future: comment permissions
};

```

**Permission Check Pattern:**

```typescript
export const updateMarker = mutation({
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const mapUser = await getMapUser(ctx, args.mapId, user._id);

    if (!hasPermission(mapUser.permission, "markers:update")) {
      throw new Error("Insufficient permissions");
    }

    await ctx.db.patch(args.markerId, { ...args.updates });
  },
});

```

**Admin Authorization:**

```typescript
// Check for admin role in Clerk metadata
export async function requireAdmin(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  const publicMetadata = identity?.public_metadata;

  if (publicMetadata?.role !== "admin") {
    throw new Error("Unauthorized: Admin access required");
  }
}

// Usage in admin functions
export const getOverviewStats = query({
  handler: async (ctx) => {
    await requireAdmin(ctx); // Throws if not admin
    // ... admin logic
  },
});

```

**Middleware Protection (Admin App):**

File: `apps/admin/src/middleware.ts`

```typescript
export default clerkMiddleware(async (auth, req) => {
  const { sessionClaims } = await auth();

  // Check if user has admin role
  if (sessionClaims?.public_metadata?.role !== 'admin') {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  return NextResponse.next();
});

```

---


## Real-Time Database Architecture


### Convex Architecture

```

                      Convex Cloud
+-----------------------------------------------------------------+


     Queries        Mutations        Actions
    (Reads)         (Writes)        (External)
  ,  ,  ,

         <

                      Database
                    - 13+ tables
                    - Indexes
                    - Search



                            -> WebSocket

                      Client Apps
  useQuery() ->-> Real-time subscriptions
  useMutation() -> Write operations

```


### Database Schema

**Tables Overview:**

```

Users Domain:
  - users (Clerk-synced user profiles)

Maps Domain:
  - maps (Map definitions with title, description, visibility)
  - map_users (User permissions on maps)
  - mapViews (View analytics)

Map Content:
  - markers (Points on map linked to places)
  - collections (Grouped sets of markers)
  - collection_links (Many-to-many: markers -> collections)
  - paths (Drawn shapes: lines, polygons, circles)
  - labels (Custom labels for elements)
  - routes (Travel routes with stops)
  - route_stops (Stops along routes)

Places Domain:
  - places (Location data from Google/Mapbox/Foursquare)
  - places_reviews (User reviews of places)
  - place_photos (Photo attachments)

```

**Schema Definition Pattern:**

File: `packages/backend/convex/schema.ts`

```typescript
import { defineSchema, defineTable } from "convex/server";
import { zodToConvex } from "convex-helpers/server/zod";
import { mapsSchema } from "../zod-schemas/maps-schema";

export default defineSchema({
  maps: defineTable(zodToConvex(mapsSchema))
    .index("by_visibility", ["visibility"])
    .index("by_owner_id", ["owner_id"]),

  markers: defineTable(zodToConvex(markersSchema))
    .index("by_map_id", ["map_id"])
    .index("by_place_id", ["place_id"]),

  users: defineTable(zodToConvex(usersSchema))
    .index("by_clerk_id", ["clerkUserId"])
    .searchIndex("search_user", {
      searchField: "display_name",
      filterFields: ["email", "username"],
    }),
});

```


### Query Patterns

**Basic Query:**

```typescript
export const getMap = query({
  args: { mapId: v.id("maps") },
  returns: mapSchema,
  handler: async (ctx, { mapId }) => {
    const map = await ctx.db.get(mapId);
    if (!map) throw new Error("Map not found");
    return map;
  },
});

```

**Indexed Query:**

```typescript
export const getUserMaps = query({
  args: { userId: v.id("users") },
  returns: v.array(mapSchema),
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("maps")
      .withIndex("by_owner_id", q => q.eq("owner_id", userId))
      .order("desc") // By _creationTime
      .collect();
  },
});

```

**Search Query:**

```typescript
export const searchUsers = query({
  args: { searchTerm: v.string() },
  returns: v.array(userSchema),
  handler: async (ctx, { searchTerm }) => {
    return await ctx.db
      .query("users")
      .withSearchIndex("search_user", q => q.search("display_name", searchTerm))
      .take(10);
  },
});

```

**Complex Query with Joins:**

```typescript
export const getMarkersView = query({
  handler: async (ctx, { mapId }) => {
    const markers = await ctx.db
      .query("markers")
      .withIndex("by_map_id", q => q.eq("map_id", mapId))
      .collect();

    // Manual "join" - fetch related places
    const markersWithPlaces = await Promise.all(
      markers.map(async (marker) => {
        const place = await ctx.db.get(marker.place_id);
        return { ...marker, place };
      })
    );

    return markersWithPlaces;
  },
});

```


### Mutation Patterns

**Create:**

```typescript
export const createMarker = mutation({
  args: { marker: markerSchema, userId: v.id("users") },
  returns: v.id("markers"),
  handler: async (ctx, args) => {
    // Check permissions
    await requireMapPermission(ctx, args.marker.map_id, args.userId, "markers:create");

    // Insert
    const markerId = await ctx.db.insert("markers", {
      ...args.marker,
      created_by: args.userId,
    });

    return markerId;
  },
});

```

**Update:**

```typescript
export const updateMarker = mutation({
  args: { markerId: v.id("markers"), updates: markerEditSchema },
  returns: v.null(),
  handler: async (ctx, { markerId, updates }) => {
    await ctx.db.patch(markerId, updates); // Shallow merge
    return null;
  },
});

```

**Delete:**

```typescript
export const deleteMarker = mutation({
  args: { markerId: v.id("markers") },
  returns: v.null(),
  handler: async (ctx, { markerId }) => {
    // Delete related collection links
    const links = await ctx.db
      .query("collection_links")
      .withIndex("by_marker_id", q => q.eq("marker_id", markerId))
      .collect();

    await Promise.all(links.map(link => ctx.db.delete(link._id)));

    // Delete marker
    await ctx.db.delete(markerId);
    return null;
  },
});

```


### Real-Time Subscription Pattern

**Client-side:**

```typescript
import { useQuery, useMutation } from "convex/react";
import { api } from "@buzztrip/backend/api";

function MapView({ mapId }) {
  // Real-time subscription - auto-updates on changes
  const markers = useQuery(api.maps.markers.getMarkersView, { mapId });
  const collections = useQuery(api.maps.collections.getCollectionsForMap, { mapId });

  // Mutation
  const createMarker = useMutation(api.maps.markers.createMarker);

  const handleAddMarker = async (markerData) => {
    await createMarker({ marker: markerData, userId: user._id });
    // UI automatically updates when mutation completes
  };

  return (
    <div>
      {markers?.map(marker => <Marker key={marker._id} {...marker} />)}
    </div>
  );
}

```

**How Real-Time Works:**
1. Client calls `useQuery(api.maps.markers.getMarkersView, { mapId })`
2. Convex establishes WebSocket connection
3. Query runs, returns initial data
4. Client subscribes to changes that affect this query
5. When any user calls `createMarker` mutation:
   - Mutation executes on server
   - Convex detects affected queries (any query reading `markers` table)
   - Convex re-runs affected queries
   - Updated data pushed to all subscribed clients via WebSocket
6. React component re-renders with new data

**No polling, no manual refetching required.**

---


## State Management


### State Architecture

```

                   Application State
+-----------------------------------------------------------------+


    Server State       Client State
    (Convex)           (Zustand)
  $  $
   - Maps             - Active loc
   - Markers          - Drawer state
   - Collections      - Search state
   - Places           - Terra Draw
   - Users            - UI flags



    Scoped State        Form State
    (Context)          (react-hook-
                        form)
  $  $
   - Map form         - Field values
   - Theme            - Validation
   - Providers        - Errors


```


### Zustand (Client State)

**Store Structure:**

File: `apps/web/src/lib/stores/default-state.ts`

```typescript
export type MapStore = {
  // Data (often mirrors Convex data)
| map: Map                  | null; |
| markers: Marker[]         | null; |
| collections: Collection[] | null; |
| labels: Label[]           | null; |
| paths: Path[]             | null; |
| routes: Route[]           | null; |

  // Relationships
| collectionLinks: CollectionLink[] | null; |
| routeStops: RouteStop[]           | null; |
| mapUsers: MapUser[]               | null; |

  // UI State
| activeLocation: Location | null;      |            |
| activeState: "idle"      | "creating" | "editing"; |
| drawerState: "open"      | "closed";  |            |
  uiState: {
    isMobile: boolean;
    searchActive: boolean;
    searchValue: string;
  };

  // Drawing State
| terraDrawInstance: TerraDraw | null; |

  // Actions
| setActiveLocation: (location: Location | null) => void; |
  setMap: (map: Map) => void;
  setMarkers: (markers: Marker[]) => void;

  // Computed/Derived
  getCollectionsForMarker: (markerId: Id<"markers">) => Collection[];
  getMarkersInCollection: (collectionId: Id<"collections">) => Marker[];
};

```

**Usage Pattern:**

```typescript
// Component
function MapView() {
  const {
    markers,
    activeLocation,
    setActiveLocation
  } = useMapStore(state => ({
    markers: state.markers,
    activeLocation: state.activeLocation,
    setActiveLocation: state.setActiveLocation,
  }));

  // Or with selector for performance
  const markers = useMapStore(state => state.markers);
}

```

**When to Use Zustand:**
- Transient UI state (drawer open/closed, active selection)
- State that doesn't need persistence
- Temporary state during user interactions
- Performance-critical state (avoid context re-renders)


### Convex (Server State)

**Query Hook:**

```typescript
// Real-time reactive data
const maps = useQuery(api.maps.getUserMaps, { userId: user._id });

// Loading state
if (maps === undefined) return <Skeleton />;

// Error state (query throws)
// Handled by ErrorBoundary

// Success state
return <div>{maps.map(map => <MapCard {...map} />)}</div>;

```

**Mutation Hook:**

```typescript
const createMap = useMutation(api.maps.createMap);

const handleCreate = async (data) => {
  try {
    const mapId = await createMap({ map: data, userId: user._id });
    router.push(`/app/map/${mapId}`);
  } catch (error) {
    toast.error("Failed to create map");
  }
};

```

**Optimistic Updates:**

```typescript
// Convex handles optimistically
const updateMarker = useMutation(api.maps.markers.updateMarker);

// Client sees update immediately
// If server fails, Convex rolls back
await updateMarker({ markerId, updates: { title: "New Title" } });

```


### React Context (Scoped State)

**Map Form Context:**

File: `apps/web/src/components/map-form/provider.tsx`

```typescript
export type MapFormContextValue = {
  users: User[];
  labels: Label[];
  onUserChange: (event: UserEvent) => void;
  onLabelChange: (event: LabelEvent) => void;
};

export const MapFormProvider = ({ children, onSubmit, initialUsers }) => {
  const [users, setUsers] = useState(initialUsers);
  const [labels, setLabels] = useState([]);

  const handleUserChange = (event) => {
    if (event.event === "user:added") {
      setUsers([...users, event.user]);
    } else if (event.event === "user:removed") {
      setUsers(users.filter(u => u.id !== event.userId));
    }
  };

  return (
    <MapFormContext.Provider value={{ users, labels, onUserChange, onLabelChange }}>
      {children}
    </MapFormContext.Provider>
  );
};

```

**Usage:**

```typescript
<MapFormProvider onSubmit={handleCreateMap} initialUsers={[]}>
  <MapStepper />
</MapFormProvider>

```

**When to Use Context:**
- Scoped state (form wizard, theme, etc.)
- Avoiding prop drilling
- Provider pattern for dependencies


### React Hook Form (Form State)

**Form with Validation:**

```typescript
const form = useForm({
  resolver: zodResolver(mapsEditSchema),
  defaultValues: {
    title: "",
    description: "",
    visibility: "private",
    icon: "Map",
  },
});

<Form {...form}>
  <form onSubmit={form.handleSubmit(handleSubmit)}>
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Title</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>

```

**When to Use React Hook Form:**
- Complex forms with validation
- Multi-step forms
- Forms with many fields
- Need granular validation

---


## Mapping Architecture


### Google Maps Integration

**Component Structure:**

```

GoogleMapsMapView
   Map (from @vis.gl/react-google-maps)
   DisplayMarkers (custom marker rendering)
   DisplayPaths (drawn shapes)
   ActiveLocationMarker (selected place)
   MapSearch (place search)
   TerraDrawIntegration (drawing tools)

```

**Main Component:**

File: `apps/web/src/components/mapping/google-maps/index.tsx`

```typescript
export const GoogleMapsMapView = () => {
  const googleMap = useMap(); // vis.gl hook
  const places = useMapsLibrary("places");
  const { markers, map, setActiveLocation } = useMapStore();

  // Initialize Places Service
  useEffect(() => {
| if (!places |  | !googleMap) return; |
    const service = new places.PlacesService(googleMap);
    setPlacesService(service);
  }, [places, googleMap]);

  // Save map position on unload
  useEffect(() => {
    const handleUnload = () => {
      const center = googleMap.getCenter();
      const bounds = googleMap.getBounds();

      navigator.sendBeacon(`/api/map/${map._id}/update-map-location`,
        JSON.stringify({ lat: center.lat(), lng: center.lng(), bounds: bounds.toJSON() })
      );
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [googleMap, map._id]);

  return (
    <Map
      mapId={env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID}
      defaultCenter={{ lat: map.lat, lng: map.lng }}
      defaultZoom={map.zoom}
      mapTypeId={map.mapTypeId}
    >
      {markers?.map(marker => (
        <DisplayMarker key={marker._id} marker={marker} />
      ))}

      <TerraDrawComponent />
    </Map>
  );
};

```


### Terra Draw Integration

**Drawing Component:**

File: `apps/web/src/components/mapping/google-maps/drawing/index.tsx`

```typescript
export const TerraDrawComponent = () => {
  const googleMap = useMap();
  const { terraDrawInstance, setTerraDrawInstance } = useMapStore();

  useEffect(() => {
    if (!googleMap) return;

    // Create adapter
    const adapter = new TerraDrawGoogleMapsAdapter({ map: googleMap });

    // Create drawing instance
    const draw = new TerraDraw({
      adapter,
      modes: [
        new TerraDrawSelectMode(),
        new TerraDrawLineStringMode(),
        new TerraDrawPolygonMode(),
        new TerraDrawRectangleMode(),
        new TerraDrawCircleMode(),
      ],
    });

    draw.start();
    setTerraDrawInstance(draw);

    return () => {
      draw.stop();
      draw.clear();
    };
  }, [googleMap]);

  // Sync drawings to Convex
  useTerraDrawSync(terraDrawInstance);

  return null; // No UI, just drawing controls
};

```

**Sync Hook:**

File: `apps/web/src/components/mapping/google-maps/drawing/use-terra-draw-sync.ts`

```typescript
| export const useTerraDrawSync = (terraDrawInstance: TerraDraw | null) => { |
  const createPath = useMutation(api.maps.paths.createPath);
  const updatePath = useMutation(api.maps.paths.updatePath);
  const { mapId } = useMapStore();

  useEffect(() => {
    if (!terraDrawInstance) return;

    const handleFinish = async (event: TerraDrawFinishEvent) => {
      const geometry = event.geometry;

      // Validate geometry against Zod schema
      const result = pathGeometrySchema.safeParse(geometry);
      if (!result.success) {
        toast.error("Invalid geometry");
        return;
      }

      // Save to Convex
      await createPath({
        path: {
          map_id: mapId,
          geometry: result.data,
          styles: event.styles,
        },
      });
    };

    terraDrawInstance.on("finish", handleFinish);

    return () => {
      terraDrawInstance.off("finish", handleFinish);
    };
  }, [terraDrawInstance, mapId]);
};

```


### Place Search

**Search Component:**

File: `apps/web/src/components/mapping/google-maps/search.tsx`

```typescript
export const MapSearch = () => {
  const [searchValue, setSearchValue] = useState("");
  const placesService = useMapStore(state => state.placesService);
  const { setActiveLocation } = useMapStore();

  const handleSearch = useCallback(async (query: string) => {
    if (!placesService) return;

    // Text search
    const request = {
      query,
      fields: ["name", "geometry", "place_id", "formatted_address"],
    };

    placesService.textSearch(request, (results, status) => {
      if (status === "OK" && results?.length > 0) {
        const place = results[0];
        setActiveLocation({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          name: place.name,
          place_id: place.place_id,
        });
      }
    });
  }, [placesService, setActiveLocation]);

  return (
    <Command>
      <CommandInput
        value={searchValue}
        onValueChange={setSearchValue}
        onSubmit={() => handleSearch(searchValue)}
      />
    </Command>
  );
};

```


### Mapbox (Future)

**Prepared Component:**

File: `apps/web/src/components/mapping/mapbox/map.tsx`

```typescript
import Map, { Marker, NavigationControl } from "react-map-gl";

export const MapboxMapView = () => {
  const { markers, map } = useMapStore();

  return (
    <Map
      mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_TOKEN}
      initialViewState={{
        latitude: map.lat,
        longitude: map.lng,
        zoom: map.zoom,
      }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
    >
      <NavigationControl />

      {markers?.map(marker => (
        <Marker
          key={marker._id}
          latitude={marker.lat}
          longitude={marker.lng}
        />
      ))}
    </Map>
  );
};

```

---


## UI Component Architecture


### Component Library Structure

```

@buzztrip/ui (packages/ui)
   Primitives (Radix UI)
      Accessible
      Unstyled
      Composable

   Styled Components (TailwindCSS)
      Base styles
      Variants (CVA)
      Theme variables

   Exports (Modular)
       Individual components
       Hooks
       Utilities

```


### Component Pattern

**Example: Button Component**

File: `packages/ui/src/components/button.tsx`

```typescript
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

```

**Usage in Apps:**

```typescript
import { Button } from "@buzztrip/ui/components/button";

<Button variant="default" size="lg">
  Create Map
</Button>

<Button variant="outline" size="sm">
  Cancel
</Button>

<Button variant="destructive" asChild>
  <Link href="/delete">Delete</Link>
</Button>

```


### Application Component Patterns

**Layout Component Example:**

File: `apps/web/src/components/layouts/map-view/index.tsx`

```typescript
export const MapViewLayout = ({ mapId }: { mapId: Id<"maps"> }) => {
  const map = useQuery(api.maps.getMap, { mapId });
  const markers = useQuery(api.maps.markers.getMarkersView, { mapId });
  const collections = useQuery(api.maps.collections.getCollectionsForMap, { mapId });

  // Sync to Zustand for easier access
  useEffect(() => {
    if (map) setMap(map);
    if (markers) setMarkers(markers);
    if (collections) setCollections(collections);
  }, [map, markers, collections]);

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <MapSidebar />

      {/* Main Map */}
      <div className="flex-1">
        <GoogleMapsMapView />
      </div>

      {/* Drawer */}
      <MapDrawer />

      {/* Modals */}
      <MainModal />
    </div>
  );
};

```

**Form Component Example:**

File: `apps/web/src/components/forms/marker-create-edit-form.tsx`

```typescript
export const MarkerCreateEditForm = ({ marker, onSubmit }: Props) => {
  const form = useForm({
    resolver: zodResolver(markerEditSchema),
| defaultValues: marker |  | { |
      title: "",
      description: "",
      icon: "MapPin",
      color: "#000000",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="My favorite restaurant" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon</FormLabel>
              <FormControl>
                <IconPicker value={field.value} onChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit">Save Marker</Button>
      </form>
    </Form>
  );
};

```

---


## Email System


### Architecture

```

User Action (Sign up, Contact, etc.)
Trigger (Clerk webhook, Server Action)
Convex Function (emails.ts)
Resend Component (@convex-dev/resend)
React Email Template (JSX -> HTML)
Resend API (Email delivery)
User's Inbox

```


### Email Templates

**Template Example:**

File: `packages/transactional/emails/welcome-email.tsx`

```typescript
import { Html, Head, Body, Container, Text, Button } from "react-email";

export const WelcomeEmail = ({ firstName }: { firstName?: string }) => {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: "#f6f9fc" }}>
        <Container style={{ backgroundColor: "#ffffff", padding: "20px" }}>
          <Text style={{ fontSize: "24px", fontWeight: "bold" }}>
            Welcome to BuzzTrip{firstName ? `, ${firstName}` : ""}!
          </Text>

          <Text>
            We're excited to have you on board. Here's what you can do:
          </Text>

          <ul>
            <li>Create custom maps</li>
            <li>Add markers and collections</li>
            <li>Collaborate with others</li>
            <li>Share your maps</li>
          </ul>

          <Button
            href="https://buzztrip.co/app"
            style={{
              backgroundColor: "#007bff",
              color: "#ffffff",
              padding: "12px 20px",
              borderRadius: "5px",
            }}
          >
            Get Started
          </Button>
        </Container>
      </Body>
    </Html>
  );
};

```


### Sending Emails

**Convex Function:**

File: `packages/backend/convex/emails.ts`

```typescript
import { Resend } from "@convex-dev/resend";
import { components } from "./_generated/api";

const resend = new Resend(components.resend);

export const sendWelcomeEmail = internalMutation({
  args: { firstName: v.optional(v.string()), email: v.string() },
  returns: v.null(),
  handler: async (ctx, { firstName, email }) => {
    await resend.sendEmail(ctx, {
      from: "Jacob Samorowski <info@buzztrip.co>",
      to: email,
      subject: "Welcome to BuzzTrip",
      react: <WelcomeEmail firstName={firstName} />,
    });
    return null;
  },
});

```

**Trigger from User Creation:**

File: `packages/backend/convex/users.ts`

```typescript
export const createUser = internalMutation({
  handler: async (ctx, args) => {
    const userId = await ctx.db.insert("users", {
      clerkUserId: args.clerkUserId,
      email: args.email,
      display_name: args.firstName + " " + args.lastName,
    });

    // Send welcome email
    await ctx.scheduler.runAfter(0, internal.emails.sendWelcomeEmail, {
      firstName: args.firstName,
      email: args.email,
    });

    // Create default map
    await createDefaultMap(ctx, userId);

    return userId;
  },
});

```

---


## Analytics & Monitoring


### PostHog Integration

**Initialization:**

File: `apps/web/src/components/providers/posthog.tsx`

```typescript
"use client";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

export function PHProvider({ children }: { children: React.ReactNode }) {
  if (typeof window !== "undefined") {
    posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: "/_proxy/posthog/ingest",
      ui_host: env.NEXT_PUBLIC_POSTHOG_HOST,
      person_profiles: "identified_only",
      capture_pageview: true,
      capture_pageleave: true,
      enable_heatmaps: true,
      session_recording: {
        maskAllInputs: false,
        maskInputOptions: { password: true },
      },
    });
  }

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}

```

**User Identification:**

File: `apps/web/src/components/providers/convex-client-provider.tsx`

```typescript
const UserIdentifier = () => {
  const { session } = useAuth();
  const currentUser = useQuery(api.users.getCurrentUser);

  useEffect(() => {
    if (session?.userId && currentUser) {
      // PostHog
      posthog.identify(session.userId, {
        email: currentUser.email,
        convex_id: currentUser._id,
        name: currentUser.display_name,
      });

      // Sentry
      Sentry.setUser({
        id: session.userId,
        email: currentUser.email,
      });
    }
  }, [session, currentUser]);

  return null;
};

```

**Event Tracking:**

```typescript
// Automatic page views
posthog.capture("$pageview");

// Custom events
posthog.capture("map_created", {
  map_id: mapId,
  visibility: "private",
});

posthog.capture("marker_added", {
  map_id: mapId,
  place_type: "restaurant",
});

```


### Sentry Error Tracking

**Initialization:**

File: `apps/web/src/instrumentation.ts`

```typescript
import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./instrumentation.node");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./instrumentation.edge");
  }
}

// instrumentation.node.ts
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: false,
});

```

**Error Capture:**

```typescript
try {
  await createMap(data);
} catch (error) {
  Sentry.captureException(error, {
    tags: { feature: "map_creation" },
    extra: { mapData: data },
  });
  toast.error("Failed to create map");
}

```


### Admin Analytics Dashboard

**Overview Stats:**

File: `packages/backend/convex/admin/stats.ts`

```typescript
export const getOverviewStats = query({
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

export const getGrowthMetrics = query({
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const now = Date.now();
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const twoWeeksAgo = now - 14 * 24 * 60 * 60 * 1000;

    const [thisWeek, lastWeek] = await Promise.all([
      ctx.db.query("users").filter(q => q.gte(q.field("_creationTime"), oneWeekAgo)).collect(),
      ctx.db.query("users").filter(q =>
        q.and(
          q.gte(q.field("_creationTime"), twoWeeksAgo),
          q.lt(q.field("_creationTime"), oneWeekAgo)
        )
      ).collect(),
    ]);

    const growth = ((thisWeek.length - lastWeek.length) / lastWeek.length) * 100;

    return { usersThisWeek: thisWeek.length, growth };
  },
});

```

**Chart Data:**

File: `packages/backend/convex/admin/charts.ts`

```typescript
export const getDailyCreationStats = query({
  args: { startDate: v.number(), endDate: v.number() },
  handler: async (ctx, { startDate, endDate }) => {
    await requireAdmin(ctx);

    const maps = await ctx.db
      .query("maps")
      .filter(q =>
        q.and(
          q.gte(q.field("_creationTime"), startDate),
          q.lte(q.field("_creationTime"), endDate)
        )
      )
      .collect();

    // Group by date
    const dailyStats = maps.reduce((acc, map) => {
      const date = new Date(map._creationTime).toISOString().split("T")[0];
| acc[date] = (acc[date] |  | 0) + 1; |
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(dailyStats).map(([date, count]) => ({
      date,
      count,
    }));
  },
});

```

---


## Payment Integration


### Polar (Future)

**Current Status:**
- Polar SDK installed (`@polar-sh/sdk`)
- Version locked in root package.json
- Not yet actively integrated

**Planned Integration:**
- Subscription tiers (Free, Pro, Team)
- Payment flow for premium features
- Webhook handling for subscription events
- Usage-based billing for advanced features

**Pattern (Planned):**

```typescript
// Convex function
export const createCheckoutSession = action({
  handler: async (ctx, { userId, priceId }) => {
    const polar = new Polar(env.POLAR_API_KEY);

    const session = await polar.checkouts.create({
      product_price_id: priceId,
      success_url: "https://buzztrip.co/success",
      customer_email: user.email,
    });

    return session.url;
  },
});

```

---


## File Storage


### Convex Storage

**Upload Pattern:**

```typescript
// Hook
export const useFileUpload = () => {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const upload = async (file: File) => {
    // Get upload URL
    const uploadUrl = await generateUploadUrl();

    // Upload file
    const result = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });

    const { storageId } = await result.json();
    return storageId;
  };

  return { upload };
};

```

**Convex Function:**

```typescript
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const getFileUrl = query({
  args: { storageId: v.id("_storage") },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx, { storageId }) => {
    return await ctx.storage.getUrl(storageId);
  },
});

```

**Usage:**

```typescript
// Upload
const { upload } = useFileUpload();
const storageId = await upload(file);

// Save reference
await createPlace({
  name: "Restaurant",
  imageStorageId: storageId,
});

// Retrieve
const imageUrl = useQuery(api.files.getFileUrl, { storageId });
<img src={imageUrl} alt="Place" />

```

---


## API Design Patterns


### Convex Function Organization

**File Structure:**

```

convex/
 maps/
    index.ts        -> api.maps.*
    markers.ts      -> api.maps.markers.*
    collections.ts  -> api.maps.collections.*
    labels.ts       -> api.maps.labels.*
    paths.ts        -> api.maps.paths.*
 admin/
    stats.ts        -> api.admin.stats.*
    charts.ts       -> api.admin.charts.*
 users.ts            -> api.users.*
 places.ts           -> api.places.*

```

**Function Naming:**

```typescript
// File: convex/maps/index.ts
export const list = query(...);          // api.maps.list
export const get = query(...);           // api.maps.get
export const create = mutation(...);     // api.maps.create
export const update = mutation(...);     // api.maps.update
export const remove = mutation(...);     // api.maps.remove

// File: convex/maps/markers.ts
export const list = query(...);          // api.maps.markers.list
export const create = mutation(...);     // api.maps.markers.create

```


### Type-Safe API Calls

**Client Usage:**

```typescript
import { api } from "@buzztrip/backend/api";

// Queries - real-time reactive
const maps = useQuery(api.maps.list, { userId });
const map = useQuery(api.maps.get, { mapId });

// Mutations - write operations
const createMap = useMutation(api.maps.create);
const updateMap = useMutation(api.maps.update);

// Call mutation
await createMap({ map: { title: "New Map" }, userId });

```

**Type Inference:**

```typescript
// TypeScript knows the exact argument types
const maps = useQuery(api.maps.list, {
  userId // Type: Id<"users"> (inferred from validator)
});

// TypeScript knows the return type
| // maps: Map[] | undefined (undefined = loading) |

```


### HTTP Endpoints

**Router Pattern:**

File: `packages/backend/convex/http.ts`

```typescript
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const payload = await req.json();
    const headers = req.headers;

    // Verify webhook signature
    const verified = await verifyWebhook(payload, headers);
    if (!verified) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Handle event
    if (payload.type === "user.created") {
      await ctx.runMutation(internal.users.createUser, payload.data);
    }

    return new Response("OK", { status: 200 });
  }),
});

export default http;

```

---


## Data Flow Patterns


### Create Map Flow

```

1. User fills out map creation form
2. Form state managed by react-hook-form
3. Validation via Zod schema (mapsEditSchema)
4. User clicks "Create"
5. useMutation(api.maps.create) called
6. Convex mutation executes:
   - Validates args with Zod
   - Checks user authentication
   - Inserts map document
   - Creates map_users entry (owner permission)
   - Creates default collection
   - Returns new map ID
7. Mutation completes
8. Router navigates to /app/map/[mapId]
9. MapView component loads
10. useQuery(api.maps.get) subscribes to map
11. Map renders with Google Maps

```


### Real-Time Collaboration Flow

```

User A: Creates marker
useMutation(api.maps.markers.create)
Convex mutation executes
Marker inserted into database
Convex detects query dependencies
All queries reading "markers" table re-run
Updated data pushed via WebSocket
User B's useQuery auto-updates
User B sees new marker (no page refresh)

```


### Authentication Flow

```

User clicks "Sign In"
Redirected to /sign-in (Clerk UI)
User authenticates (email/social)
Clerk creates session + JWT token
Clerk fires webhook to Convex
Convex creates user in database
JWT token stored in browser
ConvexProviderWithClerk injects token
All Convex requests include token
Convex validates token
ctx.auth.getUserIdentity() available
User data accessible in all functions

```

---


## Security Architecture


### Authentication Security

- **JWT Tokens:** Signed by Clerk, validated by Convex

- **Token Expiry:** Short-lived tokens, automatic refresh

- **HTTPS Only:** All production traffic encrypted

- **Session Management:** Clerk handles session lifecycle


### Authorization Security

- **RBAC:** Granular permissions (owner, editor, viewer, commenter)

- **Permission Checks:** Every mutation validates permissions

- **Admin Protection:** Middleware + Convex checks for admin routes


### Data Security

- **Validated Input:** All user input validated with Zod

- **SQL Injection:** N/A (NoSQL document database)

- **XSS Protection:** React auto-escapes by default

- **CSRF Protection:** SameSite cookies, HTTPS


### API Security

- **Webhook Verification:** Signatures validated (Clerk, Svix)

- **Rate Limiting:** Convex built-in rate limiting

- **Authentication Required:** Most functions require auth

---


## Development Patterns


### Monorepo Workflow

```

Developer writes code in apps/web
Imports component from @buzztrip/ui
Imports Convex function from @buzztrip/backend/api
Bun resolves workspace dependencies
Turborepo orchestrates builds
Hot reload on change

```


### Type Safety Flow

```

1. Define Zod schema (packages/backend/zod-schemas/)
2. Convert to Convex validator (zodToConvex)
3. Infer TypeScript type (z.infer<typeof schema>)
4. Convex generates API types (_generated/api.d.ts)
5. Apps import types (@buzztrip/backend/types)
6. End-to-end type safety (schema -> API -> UI)

```


### Validation Pattern

```typescript
// 1. Define schema
export const mapSchema = z.object({
  title: z.string().min(1).max(100),
  visibility: z.enum(["private", "public", "unlisted"]),
});

// 2. Use in Convex
defineTable(zodToConvex(mapSchema));

export const create = mutation({
  args: { map: zodToConvex(mapSchema) },
  // ...
});

// 3. Use in forms
const form = useForm({
  resolver: zodResolver(mapSchema),
});

// 4. Use in TypeScript
type Map = z.infer<typeof mapSchema>;

```

---


## Deployment Architecture


### Current Deployment

```

Frontend:
 apps/web -> Vercel (Next.js)
 apps/admin -> Vercel (Next.js)
 apps/mobile -> Expo (future)

Backend:
 packages/backend -> Convex Cloud

External Services:
 Clerk -> Authentication
 Google Maps -> Mapping
 PostHog -> Analytics
 Sentry -> Error Tracking
 Resend -> Email Delivery

```


### Environment Variables

**Web App (.env.local):**

```

NEXT_PUBLIC_CONVEX_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
SENTRY_DSN=
RESEND_API_KEY=
POLAR_API_KEY=

```

**Backend (Convex Dashboard):**

```

CLERK_WEBHOOK_SECRET=
RESEND_API_KEY=

```

---


## Future Considerations


### Planned Features

1. **Mobile App:** Rewrite with Expo, shared logic with web

1. **Mapbox Integration:** Offer choice between Google Maps and Mapbox

1. **Payment System:** Polar/Stripe integration for subscriptions

1. **Offline Support:** Service Worker + IndexedDB

1. **Real-time Chat:** Comments and discussions on maps

1. **Advanced Analytics:** Heatmaps, usage patterns

1. **API for Third-Party:** Public API for integrations

1. **Webhooks:** Notify external systems of events


### Technical Debt

1. **Test Coverage:** Add comprehensive test suite

1. **Performance Monitoring:** More granular performance tracking

1. **Error Handling:** Standardized error handling patterns

1. **Documentation:** API documentation, component storybook

---


## Summary

BuzzTrip's architecture is designed for:

- **Real-Time Collaboration:** Convex WebSocket subscriptions

- **Type Safety:** End-to-end TypeScript with Zod validation

- **Developer Experience:** Hot reload, auto-generated types, monorepo benefits

- **Scalability:** Serverless backend, component-driven frontend

- **Maintainability:** Schema-driven development, clear patterns

- **Security:** JWT authentication, RBAC, validated input

- **Performance:** Optimistic updates, caching, code splitting

The architecture supports rapid development while maintaining code quality, type safety, and a great user experience.

---

**Related Documentation:**
- `docs/file_system_structure.md` - File organization
- `docs/commands.md` - Development commands
- `docs/overview.md` - Project overview
- `CLAUDE.md` - Development guidelines
