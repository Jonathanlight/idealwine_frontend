import { isAxiosError } from "axios";
import { GetStaticPaths } from "next";

import MostExpensiveWines from "@/components/molecules/MostExpensiveWines/MostExpensiveWines";
import RankedRatings from "@/components/molecules/RankedRatings/RankedRatings";
import RankingAdjudicatedPageTitle from "@/components/molecules/RankingAdjudicatedPageTitle/RankingAdjudicatedPageTitle";
import RatingRankingByYearAndRegionPageTitle from "@/components/molecules/RatingRankingByYearAndRegionPageTitle/RatingRankingByYearAndRegionPageTitle";
import { Top50Breadcrumb } from "@/components/organisms/Breadcrumb/Top50Breadcrumb";
import { ratingRankingSearchFormRegionChoices } from "@/components/organisms/RatingRankingSearchForm/enum";
import {
  AuctionItemReadModelJsonldShopAuctionItemReadModelTopAdjudicationsRead,
  GetAuctionItemReadModelCollection200,
  ProductVintageRatingReadModelJsonldShopProductVintageRatingForEstateRead,
  RankingProductVintageRatingReadModelCollection200,
} from "@/networking/sylius-api-client/.ts.schemas";
import {
  getAuctionItemReadModelCollection,
  getGetAuctionItemReadModelCollectionQueryKey,
} from "@/networking/sylius-api-client/auction-item-read-model/auction-item-read-model";
import {
  getRankingProductVintageRatingReadModelCollectionQueryKey,
  rankingProductVintageRatingReadModelCollection,
} from "@/networking/sylius-api-client/product-vintage-rating-read-model/product-vintage-rating-read-model";
import { DecoratedGetStaticProps, withCommonPagePropsDecorator } from "@/utils/getCommonPageProps";
import { getRankingPageToDisplay, RankingPageToDisplay } from "@/utils/getRankingPageToDisplay";
import { getRegionAndYearFromSlug, RatingsSearchParamType } from "@/utils/getRegionAndYearFromSlug";
import { nextLangToSyliusLocale } from "@/utils/locale";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import styles from "./index.module.scss";

type Props = {
  fetchedResults:
    | RankingProductVintageRatingReadModelCollection200
    | GetAuctionItemReadModelCollection200;
  searchParams: RatingsSearchParamType;
  rankingPageToDisplay: RankingPageToDisplay;
};

const STARTING_RATING_YEAR = "1900";
const STARTING_TOP_ADJUDICATIONS_YEAR = "2013";

const Page = ({ fetchedResults, searchParams, rankingPageToDisplay }: Props) => {
  const { t } = useTranslation("prix-vin");

  const regionString = isNotNullNorUndefined(searchParams.region)
    ? t(`regionSelect.${searchParams.region}`)
    : "";
  if (rankingPageToDisplay === RankingPageToDisplay.BEST_WINES_BY_VINTAGE) {
    return (
      <div className={styles.page}>
        <div className={styles.breadcrumb}>
          <Top50Breadcrumb
            top50tab={t("winesRankedBy", {
              region: regionString,
              year: searchParams.year ?? "",
            })}
          />
        </div>
        <div className={styles.container}>
          <RatingRankingByYearAndRegionPageTitle ratingRankingSearchParams={searchParams} />
          <div className={styles.rankingContainer}>
            {fetchedResults["hydra:member"].map(
              (
                rating: ProductVintageRatingReadModelJsonldShopProductVintageRatingForEstateRead,
                index: number,
              ) => (
                <RankedRatings
                  key={rating.productVintage?.code}
                  index={index}
                  ratingRankingSearchParams={searchParams}
                  rating={rating}
                />
              ),
            )}
          </div>
        </div>
      </div>
    );
  }

  if (rankingPageToDisplay === RankingPageToDisplay.MOST_EXPENSIVE_WINES) {
    return (
      <div className={styles.page}>
        <div className={styles.breadcrumb}>
          <Top50Breadcrumb top50tab={t("mostExpensiveWinesIn", { year: searchParams.year })} />
        </div>
        <div className={styles.container}>
          <RankingAdjudicatedPageTitle searchParams={searchParams} />
          <div className={styles.content}>
            <div className={styles.rankingContainer}>
              {fetchedResults["hydra:member"].map(
                (
                  wine: AuctionItemReadModelJsonldShopAuctionItemReadModelTopAdjudicationsRead,
                  index: number,
                ) => (
                  <MostExpensiveWines
                    key={wine.productVariantInAuctionCatalog?.productVariant?.code}
                    index={index}
                    wine={wine}
                  />
                ),
              )}
            </div>
            <p className={styles.legend}>{t("mostExpensiveWine.title")}</p>
            <p className={styles.legend}>{t("mostExpensiveWine.underTitle")}</p>
          </div>
        </div>
      </div>
    );
  }
};

const getStaticPageProps: DecoratedGetStaticProps = async ({ params, locale, queryClient }) => {
  try {
    const slug = params?.slug?.toString();

    if (slug == null) {
      throw new Error("No slug provided");
    }

    const rankingPageToDisplay = getRankingPageToDisplay(slug);

    const searchParams = getRegionAndYearFromSlug(slug);

    const isYearBetweenTargetYearAndCurrentYear = (targetYear: string, yearToCheck: string) => {
      const currentYear = new Date().getFullYear();

      return Number(yearToCheck) >= Number(targetYear) && Number(yearToCheck) <= currentYear;
    };

    const isRegionValid = (region: string) => {
      return ratingRankingSearchFormRegionChoices.some(rating => rating.name === region);
    };

    let fetchedResults = null;

    switch (rankingPageToDisplay) {
      case RankingPageToDisplay.BEST_WINES_BY_VINTAGE:
        if (
          (searchParams.year == null && searchParams.region == null) ||
          (typeof searchParams.year === "string" &&
            !isYearBetweenTargetYearAndCurrentYear(STARTING_RATING_YEAR, searchParams.year)) ||
          (typeof searchParams.region === "string" && !isRegionValid(searchParams.region))
        ) {
          return {
            redirect: {
              destination: "/404",
              permanent: false,
            },
          };
        }
        fetchedResults = await queryClient.fetchQuery({
          queryKey: getRankingProductVintageRatingReadModelCollectionQueryKey(searchParams),
          queryFn: () =>
            rankingProductVintageRatingReadModelCollection(searchParams, {
              headers: { "Accept-Language": nextLangToSyliusLocale(locale) },
            }),
        });
        break;
      case RankingPageToDisplay.MOST_EXPENSIVE_WINES:
        if (
          searchParams.year == null ||
          (typeof searchParams.year === "string" &&
            !isYearBetweenTargetYearAndCurrentYear(
              STARTING_TOP_ADJUDICATIONS_YEAR,
              searchParams.year,
            ))
        ) {
          return {
            redirect: {
              destination: "/404",
              permanent: false,
            },
          };
        }
        fetchedResults = await queryClient.fetchQuery({
          queryKey: getGetAuctionItemReadModelCollectionQueryKey(searchParams),
          queryFn: () =>
            getAuctionItemReadModelCollection(searchParams, {
              headers: { "Accept-Language": nextLangToSyliusLocale(locale) },
            }),
        });
        break;
      default:
        fetchedResults = null;
        break;
    }
    if (rankingPageToDisplay === RankingPageToDisplay.NONE) {
      return {
        redirect: {
          destination: "/404",
          permanent: false,
        },
      };
    }

    return {
      props: {
        fetchedResults,
        rankingPageToDisplay,
        searchParams,
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

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps = withCommonPagePropsDecorator(getStaticPageProps);
export default Page;
