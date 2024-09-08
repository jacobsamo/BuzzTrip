# BuzzTrip 
An open source mapping app that allows travelers and creators to create and share custom maps with ease.

## Getting Started

### Prerequisites

- Node.js 18.x
- Bun
- Bunx
- [Cloudflare D1](https://developers.cloudflare.com/d1/) account
- [Cloudflare Pages](https://pages.cloudflare.com/) account
- [Cloudflare Wrangler](https://developers.cloudflare.com/workers/wrangler/) Installed

### Setup
1. Clone the repository
2. Install dependencies
```bash
bun install
```
3. Fill in the `wrangler.example.toml` file with your Cloudflare D1 and Pages credentials and rename it to `wrangler.toml`
4. Run the following command to create your d1 database locally:
```bash
cd apps/web && 
bunx wrangler d1 execute BuzzTrip-db --file=./drizzle/migrations/0000_seed.sql --local
```
