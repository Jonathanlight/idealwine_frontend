import { dehydrate, QueryClient } from "@tanstack/react-query";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
  PreviewData,
} from "next";
import { ParsedUrlQuery } from "querystring";

import {
  AllourwinesmenudesktopDocument,
  DynamicMenuTabDocumentData,
} from "@/.slicemachine/prismicio";
import {
  getShopGetCountryCollectionQueryKey,
  shopGetCountryCollection,
} from "@/networking/sylius-api-client/country/country";
import {
  getShopGetCurrencyCollectionQueryKey,
  shopGetCurrencyCollection,
} from "@/networking/sylius-api-client/currency/currency";
import {
  getShopGetExchangeRateCollectionQueryKey,
  shopGetExchangeRateCollection,
} from "@/networking/sylius-api-client/exchange-rate/exchange-rate";
import { createClient } from "@/prismicio";

import { CACHE_DURATIONS_IN_SECONDS } from "./constants";
import { nextLangToSyliusLocale } from "./locale";
import { localeToPrismicLocale } from "./prismicUtils";

export const prismicClient = createClient();

export type CommonPageProps = {
  dynamicMenuTab: DynamicMenuTabDocumentData | null;
  pageDynamicMenuPromotionBanner: AllourwinesmenudesktopDocument;
};

type CustomGetPagePropsContext = { queryClient: QueryClient };

export type DecoratedGetStaticProps<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Props extends { [key: string]: any } = { [key: string]: any },
  Params extends ParsedUrlQuery = ParsedUrlQuery,
  Preview extends PreviewData = PreviewData,
> = (
  context: GetStaticPropsContext<Params, Preview> & CustomGetPagePropsContext,
) => Promise<GetStaticPropsResult<Props>> | GetStaticPropsResult<Props>;

export type DecoratedGetServerSideProps<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Props extends { [key: string]: any } = { [key: string]: any },
  Params extends ParsedUrlQuery = ParsedUrlQuery,
  Preview extends PreviewData = PreviewData,
> = (
  context: GetServerSidePropsContext<Params, Preview> & CustomGetPagePropsContext,
) => Promise<GetServerSidePropsResult<Props>>;

const getEnabledCountries = (queryClient: QueryClient, locale?: string) =>
  queryClient.fetchQuery({
    queryKey: getShopGetCountryCollectionQueryKey({ enabled: true }),
    queryFn: () =>
      shopGetCountryCollection(
        { enabled: true },
        { headers: { "Accept-Language": nextLangToSyliusLocale(locale) } },
      ),
  });

const getCurrencies = (queryClient: QueryClient, locale?: string) =>
  queryClient.fetchQuery({
    queryKey: getShopGetCurrencyCollectionQueryKey(),
    queryFn: () =>
      shopGetCurrencyCollection({
        headers: { "Accept-Language": nextLangToSyliusLocale(locale) },
      }),
  });

const getExchangeRates = (queryClient: QueryClient) =>
  queryClient.fetchQuery({
    queryKey: getShopGetExchangeRateCollectionQueryKey(),
    queryFn: () => shopGetExchangeRateCollection(),
  });

export const getDynamicMenuPromotionBanner = async (
  locale?: string,
): Promise<AllourwinesmenudesktopDocument | null> => {
  const pageDynamicMenuPromotionBanner = await prismicClient.getSingle("allourwinesmenudesktop", {
    lang: localeToPrismicLocale(locale),
  });

  return pageDynamicMenuPromotionBanner;
};

export const getDynamicMenuTab = async (
  locale?: string,
): Promise<DynamicMenuTabDocumentData | null> => {
  try {
    const { data: dynamicMenuTab } = await prismicClient.getSingle("DynamicMenuTab", {
      lang: localeToPrismicLocale(locale),
    });

    return dynamicMenuTab;
  } catch {
    return null;
  }
};

export function withCommonPagePropsDecorator(
  propsProvider: DecoratedGetServerSideProps,
): GetServerSideProps;
export function withCommonPagePropsDecorator(
  propsProvider: DecoratedGetStaticProps,
): GetStaticProps;

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function withCommonPagePropsDecorator(
  propsProviderFn: DecoratedGetServerSideProps | DecoratedGetStaticProps,
): GetServerSideProps | GetStaticProps {
  return async (
    pageProps: Omit<Parameters<typeof propsProviderFn>[0], keyof CustomGetPagePropsContext>,
  ) => {
    const { locale } = pageProps;

    const queryClient = new QueryClient();

    const [pageDynamicMenuPromotionBanner, dynamicMenuTab] = await Promise.all([
      getDynamicMenuPromotionBanner(locale),
      getDynamicMenuTab(locale),
      // we trigger the query to put the following calls in the cache but we don't directly use the result, thus the calls must stay at the end of the array
      // TODO: do the same for the other calls
      getEnabledCountries(queryClient, locale),
      getCurrencies(queryClient, locale),
      getExchangeRates(queryClient),
    ]);
    // @ts-expect-error TODO: fix this
    const originalResult = await propsProviderFn({ ...pageProps, queryClient });
    const originalProps = "props" in originalResult ? originalResult.props : {};

    const dehydratedState = dehydrate(queryClient);

    return {
      ...originalResult,
      props: {
        ...originalProps,
        dehydratedState,
        dynamicMenuTab,
        pageDynamicMenuPromotionBanner,
      },
    };
  };
}

export const getCommonPageStaticProps: GetStaticProps = withCommonPagePropsDecorator(() => {
  return {
    revalidate: CACHE_DURATIONS_IN_SECONDS.ONE_HOUR,
    props: {},
  };
});

export const getCommonPageServerSideProps: DecoratedGetServerSideProps =
  withCommonPagePropsDecorator(
    // eslint-disable-next-line @typescript-eslint/require-await
    async () => {
      return {
        props: {},
      };
    },
  );
