import { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";

import { futuraPtFont } from "@/styles/fonts";
import { useTranslation } from "@/utils/next-utils";

const showOneTrustCookies = process.env.NEXT_PUBLIC_SHOW_ONE_TRUST_COOKIES === "true";
const wonderPushApiKey = process.env.WONDERPUSH_API_KEY ?? "";

const Document = (): JSX.Element => {
  const { lang } = useTranslation();

  return (
    <Html lang={lang}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        {/* OneTrust Cookies Consent Notice start for idealwine.com */}
        {showOneTrustCookies ? (
          <Script
            src="https://cdn.cookielaw.org/scripttemplates/otSDKStub.js"
            data-domain-script="d7665d16-fd40-41df-be61-af2bd052e3f9"
            strategy="afterInteractive"
          />
        ) : null}
        {showOneTrustCookies ? (
          <Script
            id="onetrust-cookies-consent"
            strategy="afterInteractive"
          >{`function OptanonWrapper() {}`}</Script>
        ) : null}
        {/* AB Tasty script */}
        <Script
          id="abtasty-script"
          strategy="afterInteractive"
          src="//try.abtasty.com/be592cb7b8608b3f4de27abe854c3b3f.js"
        />
        <Script
          src="https://cdn.by.wonderpush.com/sdk/1.1/wonderpush-loader.min.js"
          strategy="afterInteractive"
          id="wonderpush-script"
        />
        <Script strategy="afterInteractive" id="wonderpush-init">
          {`
            window.WonderPush = window.WonderPush || [];
            WonderPush.push(["init", {
              webKey: "${wonderPushApiKey}",
            }]);
            WonderPush.push(function() {
              WonderPush.subscribeToNotifications();
            })
          `}
        </Script>
        {/* Favicons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffc0c0" />
      </Head>
      <body className={futuraPtFont.className}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
