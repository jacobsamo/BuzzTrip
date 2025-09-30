# BuzzTrip Admin Portal Development Specifications

## Phase 1: Project Setup & Architecture
- [x] Create admin app structure under `/apps/admin` with Next.js 15
- [x] Configure package.json with required dependencies:
  - [x] @tanstack/react-query, @tanstack/react-table
  - [x] @buzztrip/backend (shared package)
  - [x] @clerk/nextjs & @clerk/backend (for admin SDK)
  - [x] recharts for visualizations
  - [x] shadcn/ui components (via shared @buzztrip/ui package)
  - [x] posthog-js for analytics integration
- [x] Setup Clerk + Convex authentication following official guide:
  - [x] Create JWT template named "convex" in Clerk dashboard (pending real Clerk setup)
  - [x] Configure `convex/auth.config.ts` with Clerk issuer domain (pending backend setup)
  - [x] Setup `ConvexProviderWithClerk` wrapper component
  - [x] Implement admin-only middleware using Clerk roles/metadata
- [x] Environment configuration: Extend existing env setup for admin-specific variables
- [x] Run `tsc` and `lint` after initial setup
- [x] Configure turborepo integration for admin app (shared components moved to packages)

## Phase 2: Authentication & Security Infrastructure
- [ ] Admin Role Verification:
  - [ ] Use Clerk's user metadata/roles to restrict access to BuzzTrip admins only
  - [ ] Create middleware to check admin permissions before accessing any admin routes
  - [ ] Implement secure admin authentication flow with proper error handling
- [ ] Convex Integration:
  - [ ] Leverage existing `@buzztrip/backend` package for data access
  - [ ] Create admin-specific Convex queries for aggregated metrics
  - [ ] Ensure proper authentication context throughout admin app
- [ ] Run `tsc` and `lint` after authentication setup
- [ ] Test authentication flows using playwright if needed

## Phase 3: Data Layer & Analytics Integration
- [x] Convex Analytics Queries: Create new admin queries in backend package:
  - [x] `getUserStats()` - Total users, growth metrics, registration trends
  - [x] `getMapStats()` - Maps per user, activity patterns, complexity metrics
  - [x] `getActivityMetrics()` - User engagement, session data, feature usage
  - [x] `getGlobalStats()` - Places, reviews, photos aggregation
- [x] Clerk Admin SDK Integration:
  - [x] Use Clerk's admin APIs to fetch user management data
  - [x] Sync user activity data between Clerk and Convex
  - [x] Get advanced user insights and authentication metrics
- [ ] PostHog Analytics Integration:
  - [ ] Setup PostHog client for admin dashboard
  - [ ] Create enriched event tracking combining Clerk user data
  - [ ] Build custom analytics views for admin insights
  - [ ] Track admin dashboard usage and performance
- [x] Run `tsc` and `lint` after data layer implementation
- [x] Use ref and context7 tools for API documentation research

## Phase 4: Core Dashboard Components
- [x] Main Dashboard Layout:
  - [x] Overview metrics cards (users, maps, activity) using data from all sources
  - [x] Growth charts using recharts with Convex + Clerk + PostHog data
  - [x] Recent activity feed combining platform activities
- [x] TanStack Table Implementation:
  - [x] Users table with advanced filtering/sorting using @tanstack/react-table
  - [x] Maps table showing comprehensive metrics (markers, collections, paths)
  - [x] Activity/engagement table with drill-down capabilities
- [x] Navigation & Layout:
  - [x] Responsive admin panel following existing BuzzTrip design patterns
  - [x] Sidebar navigation with role-based menu items
- [x] Run `tsc` and `lint` after component implementation
- [x] Use context7 for TanStack Table implementation examples
- [x] Test UI components using playwright

## Phase 5: Advanced Analytics & Visualizations
- [x] User Analytics Dashboard:
  - [x] User growth trends (Clerk registration data + Convex activity)
  - [x] Geographic distribution and usage patterns (PostHog + Convex data)
  - [x] User lifecycle and engagement metrics
- [x] Map & Content Analytics:
  - [x] Most popular maps and collaboration patterns
  - [x] Content creation trends (markers, collections, paths)
  - [x] Geographic insights from place data
- [x] Platform Health Metrics:
  - [x] System performance and usage statistics
  - [x] Error rates and user experience metrics
  - [x] Feature adoption and usage analytics
- [x] Run `tsc` and `lint` after analytics implementation
- [x] Use exa search for best practices in data visualization
- [x] Use ref for recharts documentation

## Phase 6: Detailed Management Views
- [x] User Management Interface:
  - [x] Individual user profiles with complete activity history
  - [x] User maps and collaboration data from Convex
  - [x] Admin actions (user management, role assignment via Clerk)
- [x] Map Management Dashboard:
  - [x] Detailed map views with all components visualization
  - [x] Collaboration and sharing analytics
  - [x] Content moderation and management tools
- [x] Global Data Management:
  - [x] Places, reviews, and photos administration
  - [x] Content quality and moderation tools
  - [x] Geographic data insights and management
- [x] Run `tsc` and `lint` after management views implementation
- [x] Test management interfaces using playwright

## Phase 7: Security & Performance Optimization
- [ ] Enhanced Security:
  - [ ] Multi-layer admin verification (Clerk + custom checks)
  - [ ] Audit logging for all admin actions
  - [ ] Rate limiting and security monitoring
- [ ] Performance Optimization:
  - [ ] Efficient data caching with TanStack Query
  - [ ] Lazy loading for large datasets
  - [ ] Optimized Convex queries for admin metrics
- [ ] Error Handling & Monitoring:
  - [ ] Comprehensive error boundaries
  - [ ] Admin action logging and audit trails
  - [ ] Performance monitoring integration
- [ ] Run `tsc` and `lint` after security implementation
- [ ] Use exa search for security best practices
- [ ] Test security measures using playwright

## Phase 8: Testing & Deployment
- [ ] Testing Strategy:
  - [ ] Unit tests for data aggregation functions
  - [ ] Integration tests for Clerk + Convex + PostHog flows
  - [ ] Admin authentication and authorization testing
- [ ] Performance Testing:
  - [ ] Large dataset handling verification
  - [ ] Dashboard load time optimization
  - [ ] Analytics query performance validation
- [ ] Deployment Configuration:
  - [ ] Add admin app to turbo.json build pipeline
  - [ ] Configure CI/CD for admin-specific deployments
  - [ ] Environment-specific admin configurations
- [ ] Final `tsc` and `lint` validation
- [ ] Comprehensive playwright testing of all features
- [ ] Use exa search for deployment best practices

## Key Technical Implementation Details:

### Clerk + Convex Authentication Setup:
```typescript
// convex/auth.config.ts
export default {
  providers: [{
    domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
    applicationID: "convex",
  }]
};

// Admin middleware with Clerk role checking
const adminUsers = ['admin@buzztrip.co']; // Or use Clerk metadata
```

### TanStack Table Integration:
- [ ] Use stable references with `useMemo` for columns
- [ ] Implement server-side filtering and pagination for large datasets
- [ ] Advanced filtering with PostHog and Convex data integration

### Multi-Source Data Aggregation:
- [ ] Combine Clerk user management data
- [ ] Convex database analytics and metrics
- [ ] PostHog user behavior and analytics data
- [ ] Create unified dashboard views with data from all sources

### Technology Stack Summary:
- **Framework**: Next.js 15 with App Router
- **Authentication**: Clerk (admin SDK + regular auth)
- **Database/Backend**: Convex via @buzztrip/backend
- **Analytics**: PostHog integration with Clerk data enrichment
- **Tables**: @tanstack/react-table with advanced features
- **Charts**: Recharts for visualizations
- **UI**: shadcn/ui (consistent with existing apps)
- **State Management**: TanStack Query for server state

## Development Guidelines:
- [ ] Always run `tsc` before committing changes
- [ ] Always run `lint` before committing changes
- [ ] Use turborepo commands for efficient builds across workspace
- [ ] Use MCP tools for research and validation:
  - [ ] **exa search** for better web searches and best practices
  - [ ] **ref** for official documentation searches
  - [ ] **context7** for code examples and implementation snippets
  - [ ] **playwright** for UI testing and validation
- [ ] Follow existing BuzzTrip code patterns and conventions
- [ ] Maintain consistent TypeScript strict typing throughout
- [ ] Implement proper error handling and loading states
- [ ] Ensure responsive design for all admin interfaces