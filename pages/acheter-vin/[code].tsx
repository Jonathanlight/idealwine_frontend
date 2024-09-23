import { sendGTMEvent } from "@next/third-parties/google";
import { useMountEffect } from "@react-hookz/web";
import { isAxiosError } from "axios";
import clsx from "clsx";
import { GetStaticPaths } from "next";
import getT from "next-translate/getT";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { ProductPageBreadcrumb } from "@/components/organisms/Breadcrumb/ProductPageBreadcrumb";
import OrderPanel from "@/components/organisms/PDP/OrderPanel/OrderPanel";
import ProductVariantAssuranceBanner from "@/components/organisms/PDP/ProductVariantAssuranceBanner";
import ProductVariantCarousel from "@/components/organisms/PDP/ProductVariantCarousel/ProductVariantCarousel";
import ProductVariantDescriptionTabs from "@/components/organisms/PDP/ProductVariantDescriptionTabs";
import ProductVariantMainDescription from "@/components/organisms/PDP/ProductVariantMainDescription";
import ProductVariantSignalMailTo from "@/components/organisms/PDP/ProductVariantSignalMailTo";
import ProductVintageAssessments from "@/components/organisms/PDP/ProductVintageAssessments";
import ProductVintageDetailedInformation from "@/components/organisms/PDP/ProductVintageDetailedInformation";
import ProductVintageNotes from "@/components/organisms/PDP/ProductVintageNotes";
import ProductVintageRatingBlock from "@/components/organisms/PDP/ProductVintageRatingBlock";
import { ProductPageSeo } from "@/components/organisms/SEO/ProductPageSeo";
import { useAuthenticatedUserContext } from "@/context/AuthenticatedUserContext";
import { getVariantVintageTitle, useGetVariantDescription } from "@/domain/productVariant";
import { PdpDataLayer } from "@/hooks/usePdpDataLayer";
import { useUrlCurrencyAndCountry } from "@/hooks/useUrlCurrencyAndCountry";
import { ProductVintageRatingInfoDTOJsonldShopProductVintageRatingInfoDtoRead } from "@/networking/sylius-api-client/.ts.schemas";
import {
  getAuctionItemDTOItem,
  getGetAuctionItemDTOItemQueryKey,
} from "@/networking/sylius-api-client/auction-item-dt-o/auction-item-dt-o";
import {
  getCustomsFeeRateCollection,
  getGetCustomsFeeRateCollectionQueryKey,
} from "@/networking/sylius-api-client/customs-fee-rate/customs-fee-rate";
import {
  getShopGetProductVariantItemQueryKey,
  shopGetProductVariantItem,
  useShopGetProductVariantItem,
} from "@/networking/sylius-api-client/product-variant/product-variant";
import {
  getGetProductVintageRatingInfoDTOItemQueryKey,
  getProductVintageRatingInfoDTOItem,
} from "@/networking/sylius-api-client/product-vintage-rating-info-dt-o/product-vintage-rating-info-dt-o";
import { generateUrl, isLocale, LOCALES } from "@/urls/linksTranslation";
import { parseCodeFromParams } from "@/urls/parsePDPcode";
import {
  CACHE_DURATIONS_IN_SECONDS,
  encodedQueryParamsSeparator,
  STALE_TIME_MINUTE,
} from "@/utils/constants";
import { useGenerateRatingUrlFromVariant } from "@/utils/generateRatingUrlUtils";
import { DecoratedGetStaticProps, withCommonPagePropsDecorator } from "@/utils/getCommonPageProps";
import { buildPdpUrl } from "@/utils/getPdpUrl";
import { productVariantImageFiltersParameter } from "@/utils/imageFilters";
import { nextLangToSyliusLocale } from "@/utils/locale";
import { useTranslation } from "@/utils/next-utils";
import { getProductVariantCarouselImages } from "@/utils/productVariantImage";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import styles from "./index.module.scss";

export const Page = ({
  code,
  isOfflineSale,
  isQuintessenceSale,
  productVintageRatings,
}: {
  code: string;
  isOfflineSale: boolean;
  isQuintessenceSale: boolean;
  productVintageRatings: ProductVintageRatingInfoDTOJsonldShopProductVintageRatingInfoDtoRead;
}): JSX.Element => {
  const { lang } = useTranslation();
  const { user } = useAuthenticatedUserContext();
  const { replace } = useRouter();
  useUrlCurrencyAndCountry();

  const isImpersonatingUser = user?.adminEmailImpersonatingUser !== undefined;
  const isUserQuintessence = user?.loyaltyProgram === "QUINTESSENCE";
  const enableQuery = isOfflineSale
    ? isImpersonatingUser
    : isQuintessenceSale
    ? isUserQuintessence
    : true;

  useEffect(() => {
    if (!enableQuery && user !== null) {
      void replace(generateUrl("BUY_WINE_URL", lang));
    }
  }, [enableQuery, user, lang, replace]);

  const { data: productVariant } = useShopGetProductVariantItem(
    code,
    productVariantImageFiltersParameter,
    {
      query: {
        staleTime: STALE_TIME_MINUTE,
        enabled: enableQuery,
        queryKey: getShopGetProductVariantItemQueryKey(code, productVariantImageFiltersParameter),
      },
    },
  );

  const variantDescription = useGetVariantDescription(productVariant);

  const { generateRatingUrlFromVariant } = useGenerateRatingUrlFromVariant();

  useMountEffect(() => {
    sendGTMEvent({
      page: productVariant?.name,
      pageChapter1: "produit",
      pageChapter2: productVariant?.auction ? "enchere" : "ecaviste",
    });
  });

  if (productVariant === undefined) {
    return <></>;
  }

  const region = productVariant.product?.region?.name ?? "UNSPECIFIED";

  const images = getProductVariantCarouselImages(productVariant.publicProductVariantImages, lang);

  return (
    <>
      <ProductPageSeo productVariant={productVariant} images={images} />
      {isNotNullNorUndefined(productVariant) && <PdpDataLayer variant={productVariant} />}
      <div className={styles.pageContainer}>
        <div className={styles.content}>
          {variantDescription !== null && (
            <ProductPageBreadcrumb variantName={variantDescription} region={region} />
          )}
          <div className={styles.firstBlock}>
            <div className={clsx(styles.carouselGridPosition, styles.order2)}>
              <ProductVariantCarousel images={images} description={variantDescription} />
            </div>
            <div
              className={clsx(styles.descriptionContainer, styles.titleGridPosition, styles.order1)}
            >
              <ProductVariantMainDescription productVariant={productVariant} />
            </div>
            <div
              className={clsx(styles.descriptionContainer, styles.tabsGridPosition, styles.order3)}
            >
              <ProductVariantDescriptionTabs productVariant={productVariant} />
              {isNotNullNorUndefined(productVariant.productVintage) ? (
                <ProductVintageNotes productVintage={productVariant.productVintage} />
              ) : null}
            </div>
          </div>

          <ProductVariantAssuranceBanner productVariant={productVariant} />
          {isNotNullNorUndefined(productVariant.productVintage) ? (
            <ProductVintageAssessments productVintage={productVariant.productVintage} />
          ) : null}

          <ProductVintageDetailedInformation productVariant={productVariant} />

          <ProductVariantSignalMailTo productVariant={productVariant} />

          {productVariant.auction &&
            productVintageRatings.productVintageRatings &&
            productVintageRatings.productVintageRatings.length > 0 && (
              <ProductVintageRatingBlock
                blockSubtitle={getVariantVintageTitle(productVariant) ?? ""}
                sellWineUrl={generateRatingUrlFromVariant(productVariant)}
                productVintageRatings={productVintageRatings.productVintageRatings}
                lastAdjudications={productVintageRatings.lastAdjudications ?? []}
                pastYearMaxAdjudication={productVintageRatings.pastYearMaxAdjudication ?? null}
                pastYearMinAdjudication={productVintageRatings.pastYearMinAdjudication ?? null}
              />
            )}

          <div id="anchor" />
        </div>
        <OrderPanel productVariant={productVariant} />
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

const getStaticPageProps: DecoratedGetStaticProps = async ({ params, locale, queryClient }) => {
  const t = await getT(locale, ["common", "enums"]);

  try {
    const requestSlugWithEncodedQueryParams = params?.code?.toString();
    const [requestSlug, encodedQueryParams] = (requestSlugWithEncodedQueryParams?.split(
      encodedQueryParamsSeparator,
    ) ?? []) as (string | undefined)[];

    let isOfflineSale = false;
    let isQuintessenceSale = false;

    if (requestSlug === undefined) {
      throw new Error("No code provided");
    }

    const code = parseCodeFromParams(requestSlug);

    /** We use fetchQuery instead of prefetchQuery because prefetchQuery does not throw in case of error */
    const [{ variant, productVintageRatings }] = await Promise.all([
      (async () => {
        const _variant = await queryClient.fetchQuery({
          queryKey: getShopGetProductVariantItemQueryKey(code, productVariantImageFiltersParameter),
          queryFn: () =>
            shopGetProductVariantItem(code, productVariantImageFiltersParameter, {
              headers: { "Accept-Language": nextLangToSyliusLocale(locale) },
            }),
        });

        if (_variant.offlineSale === true) {
          queryClient.removeQueries(
            getShopGetProductVariantItemQueryKey(code, productVariantImageFiltersParameter),
          );
          isOfflineSale = true;
        }
        if (_variant.quintessenceSale === true) {
          queryClient.removeQueries(
            getShopGetProductVariantItemQueryKey(code, productVariantImageFiltersParameter),
          );
          isQuintessenceSale = true;
        }

        const vintageCode = _variant.productVintage?.code ?? "";

        const defaultRating = { productVintageCode: vintageCode };

        const [_productVintageRatings] = _variant.auction
          ? await Promise.all([
              /** we don't display the rating graph for non auction variants, so we don't need to fetch it */
              queryClient.fetchQuery({
                queryKey: getGetProductVintageRatingInfoDTOItemQueryKey(vintageCode),
                queryFn: async () => {
                  try {
                    const ratings = await getProductVintageRatingInfoDTOItem(
                      vintageCode,
                      productVariantImageFiltersParameter,
                      { headers: { "Accept-Language": nextLangToSyliusLocale(locale) } },
                    );

                    return ratings;
                  } catch (e) {
                    if (isAxiosError(e) && e.response?.status === 404) {
                      return defaultRating;
                    }

                    throw e;
                  }
                },
              }),
              queryClient.fetchQuery({
                queryKey: getGetAuctionItemDTOItemQueryKey(code),
                queryFn: () =>
                  getAuctionItemDTOItem(code).then(
                    // remove serverTimeMilliseconds from the response to avoid countdown blinking
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    ({ serverTimeMilliseconds, ...auctionItem }) => auctionItem,
                  ),
              }),
            ])
          : [defaultRating];

        return { variant: _variant, productVintageRatings: _productVintageRatings };
      })(),

      queryClient.fetchQuery({
        queryKey: getGetCustomsFeeRateCollectionQueryKey(),
        queryFn: () => getCustomsFeeRateCollection(),
      }),
    ]);

    if (isLocale(locale)) {
      const { url, slugWithCode } = buildPdpUrl(variant, t, locale);

      if (requestSlug !== slugWithCode) {
        const redirectionUrl = url;

        const queryParamsString =
          encodedQueryParams !== undefined
            ? `?${Buffer.from(encodedQueryParams, "base64").toString()}`
            : "";

        return {
          redirect: {
            destination: `${redirectionUrl}${queryParamsString}`,
            statusCode: 301,
          },
        };
      }
    }

    const tByLocale = await Promise.all(LOCALES.map(lang => getT(lang, ["common", "enums"])));

    const hrefLangs = LOCALES.map((lang, index) => {
      return {
        locale: lang,
        hrefLang: buildPdpUrl(variant, tByLocale[index], lang).url,
      };
    });

    return {
      props: {
        code,
        isOfflineSale,
        isQuintessenceSale,
        productVintageRatings,
        hrefLangs,
      },
      /**
       * Next.js will attempt to re-generate the page:
       * - When a request comes in
       * - At most once every 5 seconds
       */
      revalidate: CACHE_DURATIONS_IN_SECONDS.FIVE_SECONDS,
    };
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return { notFound: true };
    } else {
      throw error;
    }
  }
};

export const getStaticProps = withCommonPagePropsDecorator(getStaticPageProps);

export default Page;
