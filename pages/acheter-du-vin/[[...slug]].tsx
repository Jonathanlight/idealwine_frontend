import { sendGTMEvent } from "@next/third-parties/google";
import { asText } from "@prismicio/helpers";
import { QueryClient, useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { Translate } from "next-translate";
import { useRouter } from "next/router";
import { memo, useEffect, useMemo, useState } from "react";
import { renderToString } from "react-dom/server";
import { getServerState } from "react-instantsearch-hooks-server";
import { useHits } from "react-instantsearch-hooks-web";

import Button from "@/components/atoms/Button/Button";
import Input from "@/components/atoms/Input/Input";
import SelectCustom from "@/components/atoms/Select";
import Drawer from "@/components/molecules/Drawer";
import AlgoliaPagination from "@/components/molecules/Pagination/AlgoliaPagination";
import AlgoliaHit from "@/components/organisms/PLP/AlgoliaHit";
import { AlgoliaHitType } from "@/components/organisms/PLP/AlgoliaHit/AlgoliaHitType";
import BottomDescriptionPrismic from "@/components/organisms/PLP/BottomDescriptionPrismic/BottomDescriptionPrismic";
import Filters from "@/components/organisms/PLP/Filters";
import MiddleBannerPrismic from "@/components/organisms/PLP/MiddleBannerPrismic/MiddleBannerPrismic";
import NoResultsAlgoliaSearch from "@/components/organisms/PLP/NoResultsAlgoliaSearch";
import TopBannerPrismic from "@/components/organisms/PLP/TopBannerPrismic/TopBannerPrismic";
import TopBannerVintageSaga from "@/components/organisms/PLP/TopBannerVintageSaga/TopBannerVintageSaga";
import EstateBannerImages from "@/components/organisms/PlpEstate/EstateBannerImages";
import EstateNotesAndDescriptions from "@/components/organisms/PlpEstate/EstateNotesAndDescriptions";
import EstateRatings from "@/components/organisms/PlpEstate/EstateRatings";
import WeeklyEstate from "@/components/organisms/PlpEstate/WeeklyEstate";
import { PlpSeo } from "@/components/organisms/SEO/PlpSeo";
import AlgoliaInstantSearchProvider, {
  InstantSearchProviderProps,
} from "@/context/AlgoliaInstantSearchProvider";
import { refinementsTranslationKeys, useAlgoliaRefinements } from "@/hooks/useAlgoliaRefinements";
import { getInverseLinkMapping } from "@/hooks/useVintageSagaNotes";
import {
  getEstateItem,
  getGetEstateItemQueryKey,
} from "@/networking/sylius-api-client/estate/estate";
import {
  getGetProductVintageRatingReadModelCollectionQueryKey,
  getProductVintageRatingReadModelCollection,
} from "@/networking/sylius-api-client/product-vintage-rating-read-model/product-vintage-rating-read-model";
import {
  getGetPlpVintageSagaCollectionQueryKey,
  getPlpVintageSagaCollection,
} from "@/networking/sylius-api-client/vintage-saga/vintage-saga";
import { generateUrl, Locale, LOCALES } from "@/urls/linksTranslation";
import {
  getSelectedCountry,
  getSelectedRegion,
  getSelectedVintage,
  getSingleSelectedEstate,
} from "@/utils/algoliaFiltersUtils";
import {
  AlgoliaRoute,
  createRouteFromUrl,
  createUrlFromRoute,
  getPlpFiltersSlug,
} from "@/utils/algoliaUrls";
import {
  BIO_VALUES,
  CACHE_DURATIONS_IN_SECONDS,
  SEARCH_QUERY_VALUES,
  STALE_TIME_FIVE_MINUTES,
  STALE_TIME_HOUR,
  TRIPLE_A_VALUES,
} from "@/utils/constants";
import {
  DecoratedGetServerSideProps,
  prismicClient,
  withCommonPagePropsDecorator,
} from "@/utils/getCommonPageProps";
import { nextLangToSyliusLocale } from "@/utils/locale";
import { getAbsoluteUrl, useTranslation } from "@/utils/next-utils";
import { localeToPrismicLocale } from "@/utils/prismicUtils";
import {
  isNonEmptyArray,
  isNonEmptyString,
  isNotNullNorUndefined,
  isNullOrUndefined,
  isValueInArray,
  ObjectKeys,
} from "@/utils/ts-utils";

import styles from "./index.module.scss";

const NUMBERS_OF_PICTURE_TO_PRELOAD = 5;

const filtersToDisplayInH1 = {
  isDirectPurchase: 0,
  country: 1,
  region: 2,
  subregion: 3,
  domainName: 4,
  grapeVariety: 5,
  color: 6,
  vintage: 7,
};

type MetaTagsContent =
  | { translationKey: "default" | "withQuery"; params?: Record<string, string> }
  | {
      translationKey: "withFilters";
      params: {
        regions: string[] | null;
        appellations: string[] | null;
        colors: string[] | null;
        vintages: string[] | null;
      };
      isDirectPurchase?: string | null;
    };

type Props = {
  shouldBeIndexed: boolean;
  metaTagsContent: MetaTagsContent;
};

const computePlpH1 = (filters: AlgoliaRoute, searchQuery: string | undefined, t: Translate) => {
  const isFilterToDisplayInH1 = (key: string) => {
    return key in filtersToDisplayInH1;
  };

  return (
    (Object.keys(filters) as Array<keyof typeof filtersToDisplayInH1>)
      .filter(isFilterToDisplayInH1)
      // Sort filters by order of filtersToTranslate
      .sort((keyA, keyB) => filtersToDisplayInH1[keyA] - filtersToDisplayInH1[keyB])
      .map(key => {
        const values = filters[key] ?? [];
        if (isNotNullNorUndefined(refinementsTranslationKeys[key])) {
          return values
            .map(refinement => t(`${refinementsTranslationKeys[key] ?? ""}.${refinement}`))
            .join(" ");
        }

        return values.map(refinement => refinement).join(" ");
      })
      .join(" ")
      .concat(" ", searchQuery ?? "")
  );
};

const getPagePropertyForGTM = (isDirectPurchase: string[] | undefined) => {
  if (isDirectPurchase?.includes("true") && isDirectPurchase.includes("false")) {
    return "ecaviste_enchere";
  } else if (isDirectPurchase?.includes("false")) {
    return "enchere";
  } else if (isDirectPurchase?.includes("true")) {
    return "ecaviste";
  }

  return "ecaviste_enchere";
};

const getChapter2PropertyForGTM = (
  quintessenceSale: string[] | undefined,
  domainName: string[] | undefined,
) => {
  if (quintessenceSale) {
    return "cave_quintessence";
  } else if (domainName) {
    return "domaine";
  }

  return "";
};

const Page = ({ shouldBeIndexed, metaTagsContent }: Props): JSX.Element => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { t, lang } = useTranslation();
  const { results, hits } = useHits<AlgoliaHitType>();
  const { asPath } = useRouter();
  const slug = getPlpFiltersSlug(asPath);
  const firstTwentyHits = hits.slice(0, 20);
  const remainingHits = hits.slice(20);

  const filters = useMemo(() => createRouteFromUrl(slug, lang), [slug, lang]);

  const searchQuery = results?.query;
  const filtersH1 = computePlpH1(filters, searchQuery, t);

  const { refinementList, sortBy } = useAlgoliaRefinements();

  const hideSold = refinementList.availableQuantity.items.some(item => item.label === "-0");

  const oneFilterContentToFetch = useMemo(() => getCmsContentFilterTypeAndName(filters), [filters]);

  const { data: onlyOneFilterDocument } = useQuery({
    ...getPlpCmsContentQueryParams(
      oneFilterContentToFetch?.filterType ?? "",
      oneFilterContentToFetch?.filter ?? "",
      lang,
    ),
    enabled: oneFilterContentToFetch !== undefined,
  });

  const prismicContentToShow = oneFilterContentToFetch !== undefined ? onlyOneFilterDocument : null;

  const estateName = useMemo(
    () => getSingleSelectedEstate(refinementList, searchQuery),
    [refinementList, searchQuery],
  );
  const region = useMemo(
    () => getSelectedRegion(refinementList, searchQuery),
    [refinementList, searchQuery],
  );
  const country = useMemo(
    () => getSelectedCountry(refinementList, searchQuery),
    [refinementList, searchQuery],
  );
  const vintage = useMemo(
    () => getSelectedVintage(refinementList, searchQuery),
    [refinementList, searchQuery],
  );

  const { data: estate } = useQuery({
    ...getEstateQueryParams(estateName ?? "", lang),
    enabled: estateName !== undefined,
  });
  const estateId = estate?.id;
  const { data: estateRatings } = useQuery(getEstateRatingsQueryParams(estateId, lang));
  const { inverseLinkMapping } = getInverseLinkMapping();
  const hasSelectedAVintageSaga =
    vintage !== undefined && (region !== undefined || country !== undefined);

  const vintageSagaRegion =
    country !== undefined && country in inverseLinkMapping
      ? inverseLinkMapping[country].value
      : region !== undefined && region in inverseLinkMapping
      ? inverseLinkMapping[region].value
      : undefined;

  const { data: vintageSaga } = useQuery({
    ...getVintageSagaQueryParams(vintageSagaRegion ?? [], Number(vintage ?? 0), lang),
    enabled: hasSelectedAVintageSaga && vintageSagaRegion !== undefined,
  });

  const hasVintageSaga =
    isNotNullNorUndefined(vintageSaga) && vintageSaga["hydra:member"].length > 0;

  useEffect(() => {
    sendGTMEvent({
      page: getPagePropertyForGTM(filters.isDirectPurchase),
      pageChapter1: "boutique",
      pageChapter2: getChapter2PropertyForGTM(filters.quintessenceSale, filters.domainName),
    });
  }, [filters.isDirectPurchase, filters.quintessenceSale, filters.domainName]);

  return (
    <div className={styles.pageContainer}>
      <PlpSeo shouldBeIndexed={shouldBeIndexed} metaTagsContent={metaTagsContent} />
      <Button
        variant="secondaryWhite"
        onClick={() => setIsDrawerOpen(true)}
        className={styles.dontShowOnTabletOrDesktop}
      >
        {t("acheter-du-vin:advancedSearch")}
      </Button>
      <Filters refinementList={refinementList} className={styles.dontShowOnMobile} />
      <div className={styles.resultsViewport}>
        <>
          <div className={styles.resultBar}>
            <div className={clsx(styles.dontShowOnMobileOrTablet, styles.resultBarLeftText)}>
              <h1 className={styles.pageTitle}>
                {t("acheter-du-vin:winesOnSale")} {filtersH1}
              </h1>
              <div className={styles.numberResults}>
                {filtersH1.length > 1 && "| "}
                {t("acheter-du-vin:numberResults", { count: results?.nbHits })}
              </div>
            </div>
            <SelectCustom
              className={styles.sortDropdown}
              value={sortBy.currentRefinement}
              onValueChange={sortBy.refine}
              options={{
                groups: [
                  {
                    key: t("acheter-du-vin:sortingStrategy"),
                    options: sortBy.options.map(({ label, value }) => ({
                      label: t(label),
                      value,
                    })),
                  },
                ],
              }}
            />
            <div className={clsx(styles.hideSoldCheckbox, styles.dontShowOnMobileOrTablet)}>
              <Input
                type="checkbox"
                label={<span className={styles.hideSoldLabel}>{t("acheter-du-vin:hideSold")}</span>}
                onChange={() => refinementList.availableQuantity.refine("-0")}
                checked={hideSold}
              />
            </div>
          </div>
          {estate ? (
            estate.weeklyEstate ? (
              <WeeklyEstate estate={estate} />
            ) : (
              <EstateBannerImages estate={estate} displayShortDescription={true} />
            )
          ) : null}
          {prismicContentToShow && <TopBannerPrismic document={prismicContentToShow} />}
          {hasVintageSaga && (
            <TopBannerVintageSaga
              vintageSagas={vintageSaga["hydra:member"]}
              region={vintageSagaRegion ?? []}
              vintage={vintage ?? ""}
            />
          )}

          <div className={styles.results}>
            {results?.nbHits === 0 ? (
              <NoResultsAlgoliaSearch query={results.query} />
            ) : (
              <div className={styles.hitsList}>
                {firstTwentyHits.map((hit, index) => (
                  <AlgoliaHit
                    key={hit.objectID}
                    hit={hit}
                    preloadPicture={index < NUMBERS_OF_PICTURE_TO_PRELOAD}
                  />
                ))}
              </div>
            )}
            {estate?.weeklyEstate && (
              <EstateBannerImages estate={estate} displayShortDescription={false} />
            )}
            {prismicContentToShow &&
              asText(prismicContentToShow.data.middle_block_description) !== "" && (
                <MiddleBannerPrismic document={prismicContentToShow} />
              )}
            {results?.nbHits !== 0 && (
              <>
                <div className={styles.hitsList}>
                  {remainingHits.map(hit => (
                    <AlgoliaHit key={hit.objectID} hit={hit} preloadPicture={false} />
                  ))}
                </div>
                <AlgoliaPagination filters={{ ...filters, sortBy: [sortBy.currentRefinement] }} />
              </>
            )}
            {estate && isNotNullNorUndefined(estateName) && (
              <div id="estateRatings" className={styles.estateInformationsContainer}>
                {estateRatings?.["hydra:member"] && (
                  <EstateRatings estateRatings={estateRatings} estateName={estateName} />
                )}
                <EstateNotesAndDescriptions estate={estate} />
              </div>
            )}
            {prismicContentToShow &&
              asText(prismicContentToShow.data.bottom_block_description) !== "" && (
                <BottomDescriptionPrismic document={prismicContentToShow} />
              )}
          </div>
        </>
      </div>
      <Drawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <Filters refinementList={refinementList} />
      </Drawer>
    </div>
  );
};

const getPrismicDocumentTypeFromFilter = (filterType: string) => {
  if (filterType === "region") return "plpregion";
  else if (filterType === "country") return "plpcountry";
  else if (filterType === "grapeVariety") return "plpcepage";
  else if (filterType === "tags") return "plptag";
  else if (filterType === "quintessenceSale") return "plpquintessence";
  else if (filterType === "biologicProfile") return "plpbio";
  else return "plpregion"; // this default case is used for example when the filter is a search query (eg: /fr/acheter-vin/recherche-whisky)
};

const normalizeFilter = (filter: string) =>
  filter
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/\s+/g, "-"); // replace spaces with -

const getPlpCmsContentQueryParams = (filterType: string, filter: string, lang?: Locale) => {
  const normalizedUid = normalizeFilter(filter);

  return {
    staleTime: STALE_TIME_HOUR,
    queryKey: [getPrismicDocumentTypeFromFilter(filterType), filter, lang],
    queryFn: () =>
      prismicClient.getByUID(getPrismicDocumentTypeFromFilter(filterType), normalizedUid, {
        lang: localeToPrismicLocale(lang),
      }),
  };
};

export const exactlyContainsFilterValues = (filtersValues: string[], values: string[]) => {
  return (
    filtersValues.length === values.length &&
    filtersValues.every(filterValue => values.includes(filterValue))
  );
};

const getCmsContentFilterTypeAndName = (filters: AlgoliaRoute) => {
  let oneFilter;

  if (ObjectKeys(filters).length !== 1) return;

  const query = filters.query?.[0].toLowerCase().trim();

  if (filters.region?.length === 1) oneFilter = filters.region[0];
  else if (filters.country?.length === 1) oneFilter = filters.country[0];
  else if (filters.grapeVariety?.length === 1) oneFilter = filters.grapeVariety[0];
  else if (filters.tags?.length === 1) oneFilter = filters.tags[0];
  else if (filters.quintessenceSale?.length === 1) oneFilter = filters.quintessenceSale[0];
  else if (
    filters.biologicProfile &&
    exactlyContainsFilterValues(filters.biologicProfile, BIO_VALUES)
  )
    oneFilter = "BIO";
  else if (
    filters.biologicProfile &&
    exactlyContainsFilterValues(filters.biologicProfile, TRIPLE_A_VALUES)
  )
    oneFilter = "TRIPLE_A";
  else if (query !== undefined && query in SEARCH_QUERY_VALUES) oneFilter = query;
  else return;

  return {
    filterType: ObjectKeys(filters)[0],
    filter: oneFilter,
  };
};

const cachePlpCmsContent = async (
  queryClient: QueryClient,
  filters: AlgoliaRoute,
  lang?: Locale,
) => {
  const oneFilter = getCmsContentFilterTypeAndName(filters);
  if (isNullOrUndefined(oneFilter)) return;

  try {
    await queryClient.fetchQuery(
      getPlpCmsContentQueryParams(oneFilter.filterType, oneFilter.filter, lang),
    );
  } catch (error) {
    // do nothing, we don't want to block the page if the content cannot be fetched from prismic
  }
};

const getEstateQueryParams = (estateName: string, lang?: Locale) => ({
  staleTime: STALE_TIME_FIVE_MINUTES,
  queryKey: getGetEstateItemQueryKey(estateName),
  queryFn: () =>
    getEstateItem(encodeURIComponent(estateName), {
      headers: { "Accept-Language": nextLangToSyliusLocale(lang) },
    }),
});

export const getEstateRatingsQueryParams = (estateId?: number, lang?: Locale) => ({
  staleTime: STALE_TIME_HOUR,
  queryKey: getGetProductVintageRatingReadModelCollectionQueryKey({ estateId }),
  queryFn: () =>
    getProductVintageRatingReadModelCollection(
      { estateId },
      { headers: { "Accept-Language": nextLangToSyliusLocale(lang) } },
    ),
  enabled: estateId !== undefined,
});

const cacheSingleEstateInfoAndRatings = async (
  queryClient: QueryClient,
  filters: AlgoliaRoute,
  lang?: Locale,
) => {
  const estateName = filters.domainName?.[0];

  if (ObjectKeys(filters).length === 1 && isNonEmptyString(estateName)) {
    try {
      const estate = await queryClient.fetchQuery(getEstateQueryParams(estateName, lang));
      const estateId = estate.id;
      if (isNotNullNorUndefined(estateId)) {
        await queryClient.fetchQuery(getEstateRatingsQueryParams(estateId));
      }
    } catch (error) {
      // an error occurred, the react query cache is not warmed up
    }
  }
};

const getVintageSagaQueryParams = (regions: string[], vintage: number, lang?: Locale) => ({
  staleTime: STALE_TIME_HOUR,
  queryKey: getGetPlpVintageSagaCollectionQueryKey({ "region[]": regions, year: vintage }),
  queryFn: () =>
    getPlpVintageSagaCollection(
      { "region[]": regions, year: vintage },
      { headers: { "Accept-Language": nextLangToSyliusLocale(lang) } },
    ),
});

const cacheVintageSagas = async (
  queryClient: QueryClient,
  filters: AlgoliaRoute,
  lang?: Locale,
) => {
  const vintages = filters.vintage;
  const regions = filters.region;
  if (ObjectKeys(filters).length !== 2) return;
  if (isNullOrUndefined(vintages) || isNullOrUndefined(regions)) return;
  if (vintages.length !== 1 || regions.length !== 1) return;

  try {
    await queryClient.fetchQuery(getVintageSagaQueryParams(regions, parseInt(vintages[0]), lang));
  } catch {
    // an error occurred, the react query cache is not warmed up
  }
};

const getShouldBeIndexed = (filters: AlgoliaRoute): boolean => {
  return !Object.values(filters).some(filterValues => filterValues.length > 1);
};

const getMetaTagsContent = (filters: AlgoliaRoute): MetaTagsContent => {
  if (filters.query) {
    return {
      translationKey: "withQuery",
      params: { query: filters.query[0] },
    };
  }

  const metaTagFilters = {
    regions: filters.region ?? null,
    appellations: filters.subregion ?? null,
    colors: filters.color ?? null,
    vintages: filters.vintage ?? null,
  };

  if (Object.values(metaTagFilters).some(isNonEmptyArray)) {
    return {
      translationKey: "withFilters",
      params: metaTagFilters,
      isDirectPurchase: filters.isDirectPurchase?.[0] ?? null,
    };
  }

  return { translationKey: "default" };
};

const getServerSidePageProps: DecoratedGetServerSideProps<InstantSearchProviderProps> = async ({
  params,
  req,
  res,
  locale,
  queryClient,
}) => {
  const serverUrl = getAbsoluteUrl(req);
  const lang = isValueInArray(locale, LOCALES) ? locale : "fr";
  const currentSlug = params?.slug !== undefined ? params.slug[0] : "";
  const cleanCurrentSlug = currentSlug.replace(".jsp", "");
  const filters = createRouteFromUrl(cleanCurrentSlug, lang);
  const regeneratedSlug = createUrlFromRoute(filters, lang);

  if (currentSlug !== decodeURIComponent(regeneratedSlug)) {
    let destination = generateUrl("BUY_WINE_URL", lang);
    if (regeneratedSlug !== "") {
      destination += `/${regeneratedSlug}`;
    }

    return {
      redirect: {
        destination,
        statusCode: 301,
      },
    };
  }

  const [serverState] = await Promise.all([
    getServerState(<AlgoliaInstantSearchProvider serverUrl={serverUrl} lang={lang} isOnPLP />, {
      renderToString,
    }),
    cachePlpCmsContent(queryClient, filters, lang),
    cacheSingleEstateInfoAndRatings(queryClient, filters, lang),
    cacheVintageSagas(queryClient, filters, lang),
  ]);

  const shouldBeIndexed = getShouldBeIndexed(filters);

  const metaTagsContent = getMetaTagsContent(filters);

  res.setHeader(
    "CDN-Cache-Control",
    `max-age=${CACHE_DURATIONS_IN_SECONDS.FIVE_MINUTES}, stale-while-revalidate=${CACHE_DURATIONS_IN_SECONDS.ONE_DAY}`,
  );

  return {
    props: { serverState, serverUrl, lang, isOnPLP: true, shouldBeIndexed, metaTagsContent },
  };
};

export const getServerSideProps = withCommonPagePropsDecorator(getServerSidePageProps);

export default memo(Page);
