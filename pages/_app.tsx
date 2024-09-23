import "@/styles/global.scss";
// https://fontawesome.com/docs/web/use-with/react/use-with#getting-font-awesome-css-to-work
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
import { GoogleTagManager } from "@next/third-parties/google";
import { PrismicPreview } from "@prismicio/next";
import { PrismicProvider } from "@prismicio/react";
import { useUpdateEffect } from "@react-hookz/web";
import { Hydrate, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { isAxiosError } from "axios";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

import TranslatableLink from "@/components/atoms/TranslatableLink/TranslatableLink";
import "react-toastify/dist/ReactToastify.min.css";
import PageLoader, { useIsRouteChanging } from "@/components/organisms/GeneralLayout/PageLoader";
import Layout from "@/components/organisms/Layout";
import { GlobalSeo } from "@/components/organisms/SEO/GlobalSeo";
import AlgoliaInstantSearchProvider, {
  InstantSearchProviderProps,
} from "@/context/AlgoliaInstantSearchProvider";
import AuthenticatedUserContextProviderAndLoginModal from "@/context/AuthenticatedUserContext/AuthenticatedUserContext";
import FullPageLoaderContext from "@/context/FullPageLoaderContext/FullPageLoaderContext";
import { DataLayer } from "@/hooks/useDataLayer";
import { PageViewTracking } from "@/hooks/usePageViewTracking";
import { RegisterAxiosInterceptors } from "@/networking/mutator/axios-hooks";
import { futuraPtFont } from "@/styles/fonts";
import { HrefLangs } from "@/types/HrefLangs";
import { CommonPageProps } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";

import { repositoryName } from "../prismicio";
import "keen-slider/keen-slider.min.css";

if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
  void import("@axe-core/react").then(({ default: reactAxe }) => {
    const ACCESSIBILITY_CHECK_DELAY = 1000;

    return reactAxe(React, ReactDOM, ACCESSIBILITY_CHECK_DELAY);
  });
}

const isUnderMaintenance = process.env.NEXT_PUBLIC_IS_UNDER_MAINTENANCE === "true";
type Props = { isOnPLP?: boolean; hrefLangs?: HrefLangs; isOnHome?: boolean };

const MyApp = ({
  Component,
  pageProps,
}: AppProps<
  {
    dehydratedState: unknown;
  } & InstantSearchProviderProps &
    Props &
    CommonPageProps
>): JSX.Element => {
  // disable prefetch to improve performance https://stackoverflow.com/a/76550549
  const router = useRouter();
  useEffect(() => {
    router.prefetch = async () => {};
  }, [router]);

  // https://tanstack.com/query/v4/docs/react/guides/ssr#using-hydration
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: (failureCount, error) => {
              if (
                isAxiosError(error) &&
                error.response &&
                [401, 404].includes(error.response.status)
              ) {
                return false;
              }

              return failureCount < 2;
            },
          },
        },
      }),
  );

  const { lang } = useTranslation();

  useUpdateEffect(() => {
    void queryClient.invalidateQueries();
  }, [queryClient, lang]);

  const { isRouteChanging, loadingKey } = useIsRouteChanging();

  const {
    isOnPLP,
    hrefLangs,
    isOnHome,
    dehydratedState,
    serverState,
    serverUrl,
    ...pagePropsToForward
  } = pageProps;

  const gtmId = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID;
  const enableGtm = gtmId !== undefined && gtmId !== "";

  if (isUnderMaintenance) {
    return <h1 style={{ textAlign: "center", margin: "10px" }}>Website is under maintenance</h1>;
  }

  const isIphone = typeof window !== "undefined" && window.navigator.userAgent.includes("iPhone");

  return (
    <>
      <Head>
        <meta
          name="viewport"
          // https://weblog.west-wind.com/posts/2023/Apr/17/Preventing-iOS-Safari-Textbox-Zooming
          content={`width=device-width, initial-scale=1${isIphone ? ", maximum-scale=1" : ""}`}
        />
      </Head>
      {enableGtm && (
        <noscript>
          {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
      )}
      {enableGtm && <GoogleTagManager gtmId={gtmId} />}
      <PageLoader isRouteChanging={isRouteChanging} key={loadingKey} />
      <PrismicProvider internalLinkComponent={props => <TranslatableLink {...props} />}>
        <PrismicPreview repositoryName={repositoryName}>
          <QueryClientProvider client={queryClient}>
            {/** By default, React Query Devtools are only included in bundles when process.env.NODE_ENV === 'development', so you don't need to worry about excluding them during a production build. */}
            <ReactQueryDevtools initialIsOpen={false} />
            <Hydrate state={dehydratedState}>
              <AuthenticatedUserContextProviderAndLoginModal>
                <RegisterAxiosInterceptors />
                {enableGtm && <DataLayer />}
                {enableGtm && <PageViewTracking />}
                <AlgoliaInstantSearchProvider
                  serverUrl={serverUrl}
                  serverState={serverState}
                  isOnPLP={isOnPLP}
                  lang={lang}
                >
                  <GlobalSeo isOnPLP={isOnPLP} hrefLangs={hrefLangs} />
                  <FullPageLoaderContext>
                    <Layout
                      isOnPLP={isOnPLP}
                      hrefLangs={hrefLangs}
                      isOnHome={isOnHome}
                      dynamicMenuTab={pageProps.dynamicMenuTab}
                      pageDynamicMenuPromotionBanner={pageProps.pageDynamicMenuPromotionBanner}
                      className={futuraPtFont.variable}
                    >
                      <Component {...pagePropsToForward} />
                    </Layout>
                  </FullPageLoaderContext>
                </AlgoliaInstantSearchProvider>
              </AuthenticatedUserContextProviderAndLoginModal>
            </Hydrate>
          </QueryClientProvider>
        </PrismicPreview>
      </PrismicProvider>
    </>
  );
};

export default MyApp;
