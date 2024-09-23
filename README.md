This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

# Installing the Front locally

## On Mac

### Dependencies

In order to go through with the installation, we need to install the following at the root of your computer (or your project):

- [Install brew with the CLI](https://brew.sh/)

- Install Yarn `brew install yarn`

- Install Nvm `brew install nvm`

- Install Node 18 `nvm install 18 (installed v18.16.0)`

- Install pnpm (like npm but lighter) `brew install pnpm`

## On Linux

- Install Node 18 `curl -s https://deb.nodesource.com/setup_18.x | sudo bash - && sudo apt-get install -y nodejs`
- Install Yarn `npm install -g yarn`
- Install Nvm `npm install -g nvm`

### Installation

In order to go through with the Front installation, we need:

- Clone the app: `git clone git@github.com:idealwine/webapp-2.0.git`

- `cd webapp-2.0`

- Use Node 18: `nvm use 18`

- Install the app dependancies: `pnpm install`

- Install version pnpm globally: `pnpm install -g pnpm@^8.0.0`

- Create a `.env.local` file next to the `.env` file with the same content but change the Backend URL to match your backend URL. (Should be 8001)

```bash
#.env.local#

NEXT_PUBLIC_API_BASE_URL=http://localhost:8001
NEXT_PUBLIC_SENTRY_DSN=
```

### Getting Started

Launch the app:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# Update environment variables

The environment variables are resolved in the following order of priority:

- [Vercel environment variables](https://vercel.com/idealwine/idw-v2-webapp/settings/environment-variables)
- `.env` file

# Update Api Client with Orval

- `make generate-openapi-docs` (BACK)
- `pnpm api-client:generate` (FRONT)
