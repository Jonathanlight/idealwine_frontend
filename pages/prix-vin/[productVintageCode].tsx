import { sendGTMEvent } from "@next/third-parties/google";
import { useMountEffect } from "@react-hookz/web";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { GetStaticPaths } from "next";
import { NextSeo } from "next-seo";
import { Translate } from "next-translate";
import getT from "next-translate/getT";
import { useState } from "react";

import CurrentRatingContainer from "@/components/organisms/CurrentRatingContainer";
import ProductInformation from "@/components/organisms/ProductInformation";
import ProductRatingsInDetail from "@/components/organisms/ProductRatingsInDetail";
import ProductVariantSuggestions from "@/components/organisms/ProductVariantSuggestions";
import TastingNotesAndComments from "@/components/organisms/TastingNotesAndComments";
import WinePerformanceAndAnalysis from "@/components/organisms/WinePerformanceAndAnalysis";
import { useAuthenticatedUserContext } from "@/context/AuthenticatedUserContext";
import { ProductVintageJsonldShopProductVintageRatingInfoDtoRead } from "@/networking/sylius-api-client/.ts.schemas";
import {
  getGetProductVintageRatingInfoDTOItemQueryKey,
  getProductVintageRatingInfoDTOItem,
  useGetProductVintageRatingInfoDTOItem,
} from "@/networking/sylius-api-client/product-vintage-rating-info-dt-o/product-vintage-rating-info-dt-o";
import { isLocale, Locale, LOCALES } from "@/urls/linksTranslation";
import { parseVintageCodeFromParams } from "@/urls/parseVintageCode";
import { STALE_TIME_MINUTE } from "@/utils/constants";
import { generateRatingUrlUtils } from "@/utils/generateRatingUrlUtils";
import { DecoratedGetStaticProps, withCommonPagePropsDecorator } from "@/utils/getCommonPageProps";
import { nextLangToSyliusLocale } from "@/utils/locale";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import { getEstateRatingsQueryParams } from "../acheter-du-vin/[[...slug]]";

const Page = ({
  productVintageCode,
  estateId,
  sameEstateRatedVintages,
  color,
}: {
  productVintageCode: string;
  estateId?: number;
  sameEstateRatedVintages: ProductVintageJsonldShopProductVintageRatingInfoDtoRead[];
  color: string;
}) => {
  const { t, lang } = useTranslation("prix-vin");
  const { data: results } = useGetProductVintageRatingInfoDTOItem(productVintageCode, undefined, {
    query: { staleTime: STALE_TIME_MINUTE },
  });

  const { data: estateRatings } = useQuery(getEstateRatingsQueryParams(estateId, lang));
  const vintageYear = isNotNullNorUndefined(results?.productVintage?.year)
    ? (results?.productVintage?.year as number)
    : t("noVintageYear");
  const ratedVintages = results?.sameProductRatedProductVintages;
  const currentYearRating = results?.currentYearRating;
  const productId = results?.productVintage?.product?.id;
  const image = results?.mainImage;
  const productImagePath = isNotNullNorUndefined(image) ? image : `/_no_picture_${lang}.jpg`;
  const productName = results?.productName;
  const year =
    typeof results?.productVintage?.year === "number" ? results.productVintage.year.toString() : "";
  const region =
    typeof results?.productVintage?.product?.region?.name === "string"
      ? t(`enums:region.${results.productVintage.product.region.name}`)
      : "";
  const title = t("seo.title", {
    name: results?.productVintage?.product?.name,
    year,
    region,
    color,
  });

  const appellation =
    typeof results?.productVintage?.product?.appellation === "string"
      ? t("seo.appellation", { appellation: results.productVintage.product.appellation })
      : "";
  const vintage = typeof year === "string" ? t("seo.vintage", { year: year.trim() }) : "";

  const regionInDescription =
    typeof region === "string" ? t("seo.regionInDescription", { region: region.trim() }) : "";

  const description = t("seo.description", {
    name: results?.productVintage?.product?.name,
    color,
    vintage,
    appellation,
    regionInDescription,
  });

  const { user } = useAuthenticatedUserContext();
  const userIsConnected = isNotNullNorUndefined(user);
  const [numberOfSuggestions, setNumberOfSuggestions] = useState(0);

  useMountEffect(() => {
    sendGTMEvent({
      page: "page_produit",
      pageChapter1: "cotation_des_vins",
      pageChapter2: "",
    });
  });

  return (
    <>
      <NextSeo title={title} description={description} />
      {isNotNullNorUndefined(ratedVintages) && (
        <>
          <CurrentRatingContainer
            vintageYear={vintageYear}
            ratedVintages={ratedVintages}
            currentYearRating={currentYearRating}
            productName={productName}
            productImagePath={productImagePath}
            numberOfSuggestions={numberOfSuggestions}
            results={results}
          />
          {isNotNullNorUndefined(productId) && (
            <ProductVariantSuggestions
              productId={productId}
              productName={productName}
              numberOfSuggestions={numberOfSuggestions}
              setNumberOfSuggestions={setNumberOfSuggestions}
              region={results?.productVintage?.product?.region?.name}
            />
          )}
          <ProductInformation
            productName={productName}
            productImagePath={productImagePath}
            results={results}
            estateRatings={estateRatings}
            sameEstateRatedVintages={sameEstateRatedVintages}
            vintageYear={results?.productVintage?.year}
          />
          <ProductRatingsInDetail
            productName={productName}
            vintageYear={vintageYear}
            results={results}
          />
          {userIsConnected && (
            <>
              <WinePerformanceAndAnalysis
                productName={productName}
                vintageYear={vintageYear}
                results={results}
              />
              <TastingNotesAndComments
                vintageYear={vintageYear}
                productName={productName}
                results={results}
              />
            </>
          )}
        </>
      )}
    </>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

const buildRatingUrl = (
  productVintage: ProductVintageJsonldShopProductVintageRatingInfoDtoRead,
  t: Translate,
  locale: Locale,
) => {
  const productVintageCode = productVintage.code;
  const format = t("enums:formatWithoutCount.BOUTEILLE");
  const regionName =
    productVintage.product?.region?.name !== undefined
      ? t(`enums:region.${productVintage.product.region.name}`)
      : "";
  const productAppellation = productVintage.product?.appellation;
  const estateName = productVintage.product?.estate?.name;
  const color =
    typeof productVintage.product?.color === "string"
      ? t(`enums:color.${productVintage.product.color}`).toLocaleLowerCase()
      : "";

  return generateRatingUrlUtils(
    productVintageCode ?? "",
    format,
    regionName,
    productAppellation?.toString() ?? "",
    estateName?.toString() ?? "",
    color,
    locale,
  );
};

const getStaticPageProps: DecoratedGetStaticProps = async ({ params, locale, queryClient }) => {
  const t = await getT(locale, ["common", "enums"]);

  try {
    const slug = params?.productVintageCode?.toString();

    if (slug == null) {
      throw new Error("No productVintageCode provided");
    }

    const productVintageCode = parseVintageCodeFromParams(slug);

    const results = await queryClient.fetchQuery({
      queryKey: getGetProductVintageRatingInfoDTOItemQueryKey(productVintageCode),
      queryFn: () =>
        getProductVintageRatingInfoDTOItem(productVintageCode, undefined, {
          headers: { "Accept-Language": nextLangToSyliusLocale(locale) },
        }),
    });
    const sameEstateRatedVintages = results.sameEstateRatedVintages;

    const estateId = results.productVintage?.product?.estate?.id;

    const productVintage =
      results.productVintage as ProductVintageJsonldShopProductVintageRatingInfoDtoRead;
    const color =
      typeof productVintage.product?.color === "string"
        ? t(`enums:color.${productVintage.product.color}`).toLocaleLowerCase()
        : "";
    const currentLocale = isLocale(locale) ? locale : "fr";

    const { normalizedSlug, completeUrl } = buildRatingUrl(productVintage, t, currentLocale);

    if (slug !== normalizedSlug) {
      return {
        redirect: {
          destination: completeUrl,
          statusCode: 301,
        },
      };
    }

    if (estateId !== undefined) await queryClient.fetchQuery(getEstateRatingsQueryParams(estateId));

    const tByLocale = await Promise.all(LOCALES.map(lang => getT(lang, ["common", "enums"])));

    const hrefLangs = LOCALES.map((lang, index) => {
      const { completeUrl: hrefLang } = buildRatingUrl(productVintage, tByLocale[index], lang);

      return {
        locale: lang,
        hrefLang,
      };
    });

    return {
      props: {
        sameEstateRatedVintages,
        productVintageCode,
        color,
        hrefLangs,
        ...(estateId !== undefined ? { estateId } : {}),
      },
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
