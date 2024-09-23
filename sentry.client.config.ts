// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  ignoreErrors: [
    "OnetrustActiveGroups is not defined",
    "Can't find variable: OnetrustActiveGroups",
    "Load failed",
    "Failed to fetch",
    "pa is not defined",
    "Can't find variable: pa",
    "Can't find variable: paPrivacy",
    "document.querySelectorAl is not a function",
    "Registration failed - permission denied",
    "User neither granted or denied notification permission",
    "The operation is insecure.",
    "User denied notification permission",
    "The operation is not supported.",
    "Illegal invocation",
  ],

  sampleRate: 0.1,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 0.01,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  integrations: [Sentry.browserTracingIntegration({ enableInp: true })],
});
