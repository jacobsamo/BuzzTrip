# BuzzTrip API
The API for BuzzTrip, we are using [Hono](https://github.com/honojs/hono) for the backend.

## Getting Started

### Prerequisites
- Node.js 18.x
- Bun
- Bunx
- Wrangler

### Setup 
We are using the workers `populate-env` command to set the environment variables for the workers, allowing us to use `proccess.env` to access the environment variables.

For runtime variables accessible via `c.env` you can use `.dev.vars` or access the bindings.
