# BuzzTrip 
An open source mapping app that allows travelers and creators to create and share custom maps with ease.

## Getting Started

### Prerequisites

- Node.js 18.x
- Bun
- Bunx


### Setup
1. Clone the repository
2. Install dependencies
```bash
bun install
```


### Clerk Webhook Setup
To setup clerk webhooks you will need to do the following:
1. Install `localtunnel` globally
```bash
npm install -g localtunnel
```
2. Run the following command to start a tunnel to your local dev server
```bash
lt --port 5173 --subdomain buzztrip
```
3. Copy the url from the tunnel and paste it in the webhook url field in your clerk dashboard