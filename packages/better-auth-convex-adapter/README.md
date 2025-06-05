# Better Auth Convex Adapter
This is a package to integrate [Convex](https://convex.dev/) with [Better Auth](https://github.com/BetterAuth/better-auth). there are already 2 different plugins that do this however they go for a range of different use cases. This package is meant mainly for BuzzTrip's use case and is not meant to be used as a general purpose package.

## Ideas
- setup and use `convex-helpers` package to make it easier to work with Convex
    - handles relational queries more easily
    - has zod support
- allow passing of the convex client to the adapter (need to determine what convex page this would be ConvexHTTP, React, etc)