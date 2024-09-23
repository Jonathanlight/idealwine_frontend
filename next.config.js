const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.DEV_ANALYZE_BUNDLE === "true",
});
const { withSentryConfig } = require("@sentry/nextjs");
const nextTranslate = require("next-translate-plugin");

const redirects = require("./redirects.js");

const isTypeCheckingDisabled = process.env.DISABLE_TYPE_CHECKING === "true" ? true : false;

const isEslintDisabled = process.env.DISABLE_LINTING === "true" ? true : false;

const contentSecurityPolicy = process.env.CONTENT_SECURITY_POLICY
  ? process.env.CONTENT_SECURITY_POLICY
  : null;

const defaultSecurityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
  {
    // This header will prevent any use of user's plugins on your website
    // If you need some permissions, change the parameter of the right permission
    key: "Permissions-Policy",
    value:
      "accelerometer=(), geolocation=(), fullscreen=(), ambient-light-sensor=(), autoplay=(), battery=(), camera=(), display-capture=()",
  },
];

if (process.env.CONTENT_SECURITY_POLICY) {
  defaultSecurityHeaders.push({
    key: "Content-Security-Policy",
    value: contentSecurityPolicy,
  });
}

const productionOnlySecurityHeaders = [
  {
    /** We disable this header in development to enable the slice machine server to create an iframe using the next server */
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
];

const localImageDomaines = process.env.NODE_ENV === "production" ? [] : ["localhost"];

const securityHeaders = [
  ...defaultSecurityHeaders,
  ...(process.env.NODE_ENV === "production" ? productionOnlySecurityHeaders : []),
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Automatically leverage output traces to reduce image size
  // https://nextjs.org/docs/advanced-features/output-file-tracing
  output: "standalone",
  compiler: {
    styledComponents: true,
  },
  swcMinify: true,
  typescript: { ignoreBuildErrors: isTypeCheckingDisabled },
  eslint: { ignoreDuringBuilds: isEslintDisabled },
  images: {
    domains: [
      "images.unsplash.com",
      "images.prismic.io",
      process.env.NEXT_PUBLIC_API_BASE_URL.replace("https://", ""),
      "storage.googleapis.com",
      "media.idealwine.com",
      "v2-backend.idealwine.com",
      "www.idealwine.net",
      "www.idealwine.info",
      ...localImageDomaines,
    ],
  },
  headers: async () => {
    return [
      {
        source: "/:path*.(gif|ico|jpg|mp4|pdf|png|svg|webmanifest|xlsx|xml|webp|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400", // 1 day
          },
        ],
      },
      {
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Apply these headers to all routes in your application.
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  redirects: async () => redirects,
  experimental: {
    scrollRestoration: true,
  },
};

module.exports = () => withBundleAnalyzer(nextTranslate(nextConfig));

// Injected content via Sentry wizard below
module.exports = withSentryConfig(
  module.exports,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,
  },
);
