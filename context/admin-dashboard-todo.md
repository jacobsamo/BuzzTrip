# BuzzTrip Admin Dashboard - Implementation TODO

## Phase 1: Project Setup & Foundation

### 1.1 Create Admin App Structure
- [ ] Create `apps/admin` directory
- [ ] Create `apps/admin/src` directory structure
- [ ] Create `apps/admin/src/app` directory
- [ ] Create `apps/admin/src/components` directory
- [ ] Create `apps/admin/src/lib` directory

### 1.2 Configuration Files
- [ ] Create `apps/admin/package.json` with dependencies
- [ ] Create `apps/admin/next.config.ts`
- [ ] Create `apps/admin/postcss.config.mjs`
- [ ] Create `apps/admin/tsconfig.json` (extend from `@buzztrip/tsconfig`)
- [ ] Create `apps/admin/env.ts` with environment validation
- [ ] Create `apps/admin/.env.local` (copy from web app)

### 1.3 Tailwind v4 Setup (CSS-first)
- [ ] Create `apps/admin/src/lib/styles` directory
- [ ] Create `apps/admin/src/lib/styles/globals.css` with Tailwind v4 imports
- [ ] Add shadcn color variables to globals.css (`:root` and `.dark`)
- [ ] Add `@theme inline` section for Tailwind v4
- [ ] Add border compatibility layer
- [ ] Add keyframe animations

### 1.4 Authentication & Middleware
- [ ] Create `apps/admin/src/middleware.ts`
- [ ] Implement `isPublicRoute` matcher for `/sign-in` and `/unauthorized`
- [ ] Implement `isAdminRoute` matcher for all other routes
- [ ] Add admin role check logic (`publicMetadata.role === "admin"`)
- [ ] Add redirect to sign-in if not authenticated
- [ ] Add redirect to unauthorized if not admin
- [ ] Create `apps/admin/src/lib/auth.ts` with Convex helpers
- [ ] Implement `getAuthToken()` function
- [ ] Implement `convexNextjsOptions()` function

### 1.5 Unauthorized Error Page
- [ ] Create `apps/admin/src/app/unauthorized` directory
- [ ] Create `apps/admin/src/app/unauthorized/page.tsx`
- [ ] Add ShieldAlert icon and error message
- [ ] Add SignOutButton from Clerk
- [ ] Add "Return to BuzzTrip" link
- [ ] Style with shadcn components

---

## Phase 2: Backend - Convex Admin Queries

### 2.1 Admin Helper Functions
- [ ] Create `packages/backend/helpers/admin-helpers.ts`
- [ ] Implement `isUserAdmin(ctx: QueryCtx)` function
- [ ] Implement `requireAdmin(ctx: QueryCtx)` function
- [ ] Update `packages/backend/helpers/index.ts` to export admin helpers

### 2.2 Admin Stats Queries
- [ ] Create `packages/backend/convex/admin` directory
- [ ] Create `packages/backend/convex/admin/stats.ts`
- [ ] Implement `getOverviewStats` query (users, maps, markers, places counts)
- [ ] Implement `getGrowthMetrics` query (week-over-week growth)
- [ ] Add `requireAdmin()` checks to all queries
- [ ] Add proper return type validators

### 2.3 Admin Users Queries
- [ ] Create `packages/backend/convex/admin/users.ts`
- [ ] Implement `getAllUsersWithStats` query
- [ ] Implement `getUserDetailStats` query (maps, markers, collections, collaborations)
- [ ] Add parallel data fetching with Promise.all
- [ ] Add `requireAdmin()` checks to all queries

### 2.4 Admin Maps Queries
- [ ] Create `packages/backend/convex/admin/maps.ts`
- [ ] Implement `getAllMapsWithStats` query
- [ ] Implement `getMapDetailStats` query (markers, collections, paths, labels, routes, collaborators)
- [ ] Add owner and collaborator aggregation
- [ ] Add `requireAdmin()` checks to all queries

### 2.5 Admin Charts Queries
- [ ] Create `packages/backend/convex/admin/charts.ts`
- [ ] Implement `getMapsCreatedByMonth` query
- [ ] Implement `getMarkersCreatedByMonth` query
- [ ] Add month initialization logic (last N months)
- [ ] Add grouping and counting logic
- [ ] Add `requireAdmin()` checks to all queries

---

## Phase 3: Frontend - Root Layout & Providers

### 3.1 Root Layout
- [ ] Create `apps/admin/src/app/layout.tsx`
- [ ] Add ClerkProvider wrapper
- [ ] Add ConvexProviderWithClerk (no TanStack Query)
- [ ] Add SidebarProvider from shadcn
- [ ] Import globals.css
- [ ] Add metadata (title, description)
- [ ] Add suppressHydrationWarning for dark mode

### 3.2 Layout Components Directory
- [ ] Create `apps/admin/src/components/layout` directory
- [ ] Create placeholder files for sidebar and breadcrumbs

---

## Phase 4: Frontend - Dashboard Overview

### 4.1 Dashboard Page
- [ ] Create `apps/admin/src/app/page.tsx` (server component)
- [ ] Fetch overview stats with `fetchQuery`
- [ ] Fetch growth metrics with `fetchQuery`
- [ ] Add page header (title + description)
- [ ] Create stat cards grid (4 columns)
- [ ] Create charts grid (2 columns)

### 4.2 Stat Card Component
- [ ] Create `apps/admin/src/components/dashboard` directory
- [ ] Create `apps/admin/src/components/dashboard/stat-card.tsx`
- [ ] Add Card wrapper with icon in header
- [ ] Add large value display
- [ ] Add growth indicator with TrendingUp/Down icons
- [ ] Add color coding (green for positive, red for negative)
- [ ] Use shadcn color variables

### 4.3 Charts Directory
- [ ] Create `apps/admin/src/components/charts` directory
- [ ] Create placeholder files for maps and markers charts

### 4.4 Maps Chart Component
- [ ] Create `apps/admin/src/components/charts/maps-chart.tsx` (client component)
- [ ] Add "use client" directive
- [ ] Use `useQuery` to fetch monthly data
- [ ] Add Card wrapper with title and description
- [ ] Implement ResponsiveContainer with AreaChart
- [ ] Add gradient fill using chart-1 color variable
- [ ] Style with shadcn color variables (border, muted-foreground)
- [ ] Add loading state

### 4.5 Markers Chart Component
- [ ] Create `apps/admin/src/components/charts/markers-chart.tsx` (client component)
- [ ] Add "use client" directive
- [ ] Use `useQuery` to fetch monthly data
- [ ] Add Card wrapper with title and description
- [ ] Implement ResponsiveContainer with BarChart
- [ ] Use chart-2 color variable
- [ ] Style with shadcn color variables
- [ ] Add loading state

---

## Phase 5: Frontend - Users Pages

### 5.1 Users Table Page
- [ ] Create `apps/admin/src/app/users` directory
- [ ] Create `apps/admin/src/app/users/page.tsx` (client component)
- [ ] Add "use client" directive
- [ ] Use `useQuery` to fetch users with stats
- [ ] Add page header
- [ ] Add Card wrapper
- [ ] Render UsersTable component
- [ ] Add loading state

### 5.2 Users Table Component
- [ ] Create `apps/admin/src/components/tables` directory
- [ ] Create `apps/admin/src/components/tables/users-table.tsx`
- [ ] Define column definitions with TanStack Table
- [ ] Add User column (avatar + name + email)
- [ ] Add Username column with badge
- [ ] Add Joined column with date formatting
- [ ] Add Maps count column (sortable)
- [ ] Add Markers count column (sortable)
- [ ] Add Actions column with "View Details" button
- [ ] Implement table with sorting
- [ ] Add row click navigation to user detail
- [ ] Add empty state

### 5.3 User Detail Page
- [ ] Create `apps/admin/src/app/users/[id]` directory
- [ ] Create `apps/admin/src/app/users/[id]/page.tsx` (server component)
- [ ] Fetch user data with `fetchQuery`
- [ ] Fetch user stats with `fetchQuery`
- [ ] Preload user maps with `preloadQuery`
- [ ] Add notFound() handling
- [ ] Create user info card (avatar, name, email, username badge)
- [ ] Add stats grid (joined date, maps, markers, collaborations)
- [ ] Add user's maps card with table

### 5.4 User Maps Table Component
- [ ] Create `apps/admin/src/components/tables/user-maps-table.tsx`
- [ ] Use `usePreloadedQuery` for maps data
- [ ] Define columns (title, visibility badge, created, updated, markers, collaborators)
- [ ] Add sorting
- [ ] Add row click navigation to map detail
- [ ] Style with shadcn components

---

## Phase 6: Frontend - Maps Pages

### 6.1 Maps Table Page
- [ ] Create `apps/admin/src/app/maps` directory
- [ ] Create `apps/admin/src/app/maps/page.tsx` (client component)
- [ ] Add "use client" directive
- [ ] Use `useQuery` to fetch maps with stats
- [ ] Add page header
- [ ] Add Card wrapper
- [ ] Render MapsTable component
- [ ] Add loading state

### 6.2 Maps Table Component
- [ ] Create `apps/admin/src/components/tables/maps-table.tsx`
- [ ] Define column definitions
- [ ] Add Map column (title with link)
- [ ] Add Owner column (name with link to user)
- [ ] Add Visibility column (badge)
- [ ] Add Created column (formatted date)
- [ ] Add Updated column (formatted date)
- [ ] Add Markers count column (sortable)
- [ ] Add Collaborators count column (sortable)
- [ ] Add Location column
- [ ] Add Actions column with "View Details" button
- [ ] Implement sorting and filtering
- [ ] Add row click navigation to map detail

### 6.3 Map Detail Page
- [ ] Create `apps/admin/src/app/maps/[id]` directory
- [ ] Create `apps/admin/src/app/maps/[id]/page.tsx` (server component)
- [ ] Fetch map data with `fetchQuery`
- [ ] Fetch map stats with `fetchQuery`
- [ ] Preload markers, collections, paths, labels, collaborators
- [ ] Add notFound() handling
- [ ] Create map info card (title, description, owner, visibility, location, dates)
- [ ] Add stats grid (markers, collections, paths, labels, routes, collaborators)
- [ ] Add Tabs component for different sections

### 6.4 Map Detail Tabs
- [ ] Create Collaborators tab (table with user, permission, date)
- [ ] Create Markers tab (reuse existing markers table)
- [ ] Create Collections tab (card grid or table)
- [ ] Create Paths tab (table with type, measurements, style)
- [ ] Create Labels tab (grid with icon preview)
- [ ] Create Routes tab (table with stops count)
- [ ] Use `usePreloadedQuery` for all data
- [ ] Style with shadcn components

---

## Phase 7: Frontend - Navigation & Layout

### 7.1 Admin Sidebar Component
- [ ] Create `apps/admin/src/components/layout/admin-sidebar.tsx` (client component)
- [ ] Add "use client" directive
- [ ] Use Sidebar components from shadcn
- [ ] Add sidebar header with "BuzzTrip Admin" title
- [ ] Create navigation items array (Dashboard, Users, Maps)
- [ ] Use `usePathname` for active state
- [ ] Add SidebarMenuItem with Link for each nav item
- [ ] Add icons (LayoutDashboard, Users, Map)
- [ ] Add sidebar footer with user info (avatar, name, "Admin" badge)
- [ ] Add SignOutButton
- [ ] Style with shadcn components

### 7.2 Breadcrumbs Component (Optional)
- [ ] Create `apps/admin/src/components/layout/breadcrumbs.tsx`
- [ ] Use `usePathname` to generate breadcrumbs
- [ ] Add Breadcrumb components from shadcn
- [ ] Add dynamic breadcrumb generation
- [ ] Style with shadcn components

---

## Phase 8: Utilities & Helpers

### 8.1 Date Helpers
- [ ] Create `apps/admin/src/lib/utils` directory
- [ ] Create `apps/admin/src/lib/utils/date-helpers.ts`
- [ ] Add `formatDate` function using date-fns
- [ ] Add `formatRelative` function
- [ ] Export all utilities

### 8.2 Number Formatting
- [ ] Create `apps/admin/src/lib/utils/format-number.ts`
- [ ] Add `formatNumber` function with locale
- [ ] Add `formatPercentage` function
- [ ] Export all utilities

---

## Phase 9: Testing & Polish

### 9.1 Authentication Flow Testing
- [ ] Test: Not signed in → redirects to sign-in page
- [ ] Test: Signed in without admin role → shows unauthorized page
- [ ] Test: Signed in with admin role → accesses dashboard
- [ ] Test: Unauthorized page SignOut button works
- [ ] Test: All protected routes require admin role

### 9.2 Query Testing
- [ ] Test: All admin queries check for admin role
- [ ] Test: Non-admin receives "Unauthorized" error
- [ ] Test: Admin receives correct data
- [ ] Test: Growth metrics calculate correctly
- [ ] Test: Chart data groups by month correctly
- [ ] Verify all queries are read-only (no mutations)

### 9.3 UI/UX Testing
- [ ] Test: Dashboard loads with correct stats
- [ ] Test: Charts render and display data
- [ ] Test: Tables sort correctly
- [ ] Test: Tables filter correctly
- [ ] Test: Navigation between pages works
- [ ] Test: User detail page shows correct data
- [ ] Test: Map detail page shows correct data
- [ ] Test: All links navigate correctly
- [ ] Test: Loading states display properly
- [ ] Test: Empty states display properly

### 9.4 Responsive Design Testing
- [ ] Test: Dashboard layout on mobile (320px)
- [ ] Test: Dashboard layout on tablet (768px)
- [ ] Test: Dashboard layout on desktop (1440px)
- [ ] Test: Sidebar collapses on mobile
- [ ] Test: Tables scroll horizontally on mobile
- [ ] Test: Charts resize responsively
- [ ] Test: Stat cards stack on mobile
- [ ] Test: Touch interactions work on mobile

### 9.5 Design System Compliance
- [ ] Verify all components use shadcn color variables
- [ ] Verify consistent spacing (using Tailwind spacing scale)
- [ ] Verify consistent typography
- [ ] Verify consistent border radius (using --radius variable)
- [ ] Check dark mode support
- [ ] Check color contrast for accessibility
- [ ] Verify focus states are visible

### 9.6 Performance Testing
- [ ] Run Lighthouse audit (target: 90+ performance score)
- [ ] Check page load times (target: < 2s)
- [ ] Check table rendering performance with large datasets
- [ ] Check chart rendering performance
- [ ] Optimize images if needed
- [ ] Check bundle size

---

## Phase 10: Build & Deployment

### 10.1 Build Configuration
- [ ] Update root `turbo.json` to include admin app
- [ ] Add admin app to workspace builds
- [ ] Test `bun run build` from root
- [ ] Test `bun run dev` from root
- [ ] Verify hot reload works in development

### 10.2 Environment Variables
- [ ] Document required environment variables
- [ ] Create `.env.example` file
- [ ] Verify all env vars are validated in `env.ts`
- [ ] Test with missing env vars (should error clearly)

### 10.3 Deployment Prep
- [ ] Add admin app to Vercel/deployment platform
- [ ] Configure environment variables in deployment
- [ ] Set up admin role in Clerk for test user
- [ ] Test production build locally
- [ ] Deploy to staging environment
- [ ] Test authentication flow in staging
- [ ] Deploy to production

---

## Phase 11: Documentation

### 11.1 Code Documentation
- [ ] Add JSDoc comments to all utility functions
- [ ] Add comments to complex logic
- [ ] Document component props with TypeScript
- [ ] Add README.md to apps/admin directory

### 11.2 Usage Documentation
- [ ] Document how to grant admin access (Clerk metadata)
- [ ] Document available routes and features
- [ ] Document how to run locally
- [ ] Document how to deploy
- [ ] Add troubleshooting section

---

## Completion Checklist

### Core Features
- [ ] ✅ Admin-only access enforced
- [ ] ✅ Proper auth redirects (sign-in, unauthorized)
- [ ] ✅ All operations read-only (no mutations)
- [ ] ✅ Dashboard with KPI cards and growth indicators
- [ ] ✅ Users table with sorting and stats
- [ ] ✅ User detail page with maps
- [ ] ✅ Maps table with sorting and stats
- [ ] ✅ Map detail page with all related data
- [ ] ✅ Charts for maps and markers created over time

### Technical Requirements
- [ ] ✅ Tailwind v4 CSS-first config (no tailwind.config.js)
- [ ] ✅ shadcn design system compliance
- [ ] ✅ Clean, maintainable code
- [ ] ✅ Type-safe throughout
- [ ] ✅ Mobile responsive
- [ ] ✅ Accessible (keyboard nav, screen readers)
- [ ] ✅ Production ready

### Testing
- [ ] ✅ Authentication tested
- [ ] ✅ Authorization tested
- [ ] ✅ All queries tested
- [ ] ✅ UI/UX tested
- [ ] ✅ Responsive design tested
- [ ] ✅ Performance tested

### Documentation
- [ ] ✅ Code documented
- [ ] ✅ Usage documented
- [ ] ✅ Deployment documented

---

## Implementation Notes

- **Estimated time:** 3-5 days for full implementation
- **Priority order:** Follow phases 1-11 in sequence
- **Dependencies:** Ensure backend queries are complete before building frontend pages
- **Testing:** Test each phase before moving to the next
- **Code review:** Review code quality after each major phase

## Success Metrics

- All admin-only routes protected
- All queries enforce admin role
- No mutation operations (read-only)
- Mobile responsive on all pages
- < 2s page load time
- 90+ Lighthouse score
- Zero TypeScript errors
- Zero accessibility violations
