# BuzzTrip API
The API for BuzzTrip, we are using [Hono](https://github.com/honojs/hono) for the backend.

## Getting Started

### Prerequisites
- Node.js 18.x
- Bun
- Bunx
- Wrangler



## Clerk Webhook Setup
To setup clerk webhooks you will need to do the following:
1. Install `localtunnel` globally
```bash
npm install -g localtunnel
```
2. Run the following command to start a tunnel to your local dev server
```bash
lt --port 8181 --subdomain buzztrip
```
3. Copy the url from the tunnel and paste it in the webhook url field in your clerk dashboard
4. Copy the `Signing Secret` from the clerk webhook section and paste it in the `.dev.vars` file `CLERK_WEBHOOK_SECRET=<secret>`
