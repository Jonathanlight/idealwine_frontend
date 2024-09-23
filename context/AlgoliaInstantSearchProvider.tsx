import algoliasearch from "algoliasearch/lite";
import { BrowserHistoryArgs } from "instantsearch.js/es/lib/routers/history";
import singletonRouter from "next/router";
import { parse, stringify } from "qs";
import { PropsWithChildren } from "react";
import { createInstantSearchRouterNext } from "react-instantsearch-hooks-router-nextjs";
import {
  Configure,
  InstantSearch,
  InstantSearchServerState,
  InstantSearchSSRProvider,
  usePagination,
  useSearchBox,
} from "react-instantsearch-hooks-web";

import {
  findNewReleasesFilterStartValue,
  PLPIndexName,
  useAlgoliaRefinements,
} from "@/hooks/useAlgoliaRefinements";
import { generateUrl, Locale } from "@/urls/linksTranslation";
import {
  AlgoliaRoute,
  createRouteFromUrl,
  createUrlFromRoute,
  formatPriceRangeTowardsState,
  formatPriceRangeTowardsUrl,
  formatRangeTowardsState,
  formatRangeTowardsUrl,
  getPlpBaseUrl,
  getPlpFiltersSlug,
  sortRefinementValues,
  translateCodeTowardsParams,
  translateParamsTowardsCode,
} from "@/utils/algoliaUrls";
import { codeToTranslated, RefinementType } from "@/utils/algoliaUrlsDataGenerator";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import { AuthenticatedUser, useAuthenticatedUserContext } from "./AuthenticatedUserContext";

export const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? "",
  process.env.NEXT_PUBLIC_ALGOLIA_API_KEY ?? "",
);

export type InstantSearchProviderProps = {
  serverState?: InstantSearchServerState;
  serverUrl?: string;
  isOnPLP?: boolean;
  lang: Locale;
};

type AlgoliaState = {
  [PLPIndexName: string]: {
    refinementList?: AlgoliaRoute;
    query?: string;
    page?: number;
    sortBy?: string;
    range?: {
      [attribute: string]: string;
    };
  };
};

type createURLProps = {
  routeState: AlgoliaRoute;
  location: Location;
  qsModule: qs;
};

export type qs = Parameters<BrowserHistoryArgs<AlgoliaRoute>["parseURL"]>[0]["qsModule"];

type parseURLProps = {
  location: Location;
  qsModule: qs;
};

// This component is needed to get filtered results on the first render server side
const VirtualWidgets = () => {
  useSearchBox();
  const { priceRefinementName } = useAlgoliaRefinements();
  CurrentLangAndPriceFilterNameRef.priceRefinementName = priceRefinementName;
  usePagination({ padding: 2 });

  return null;
};

export const createUrlParamsPart = (
  routeState: AlgoliaRoute,
  qsModule: qs,
  lang: Locale,
  locationSearch = "?",
) => {
  let url = "";
  const paramsPath = createUrlFromRoute(routeState, lang);

  if (paramsPath.length > 0) url += `/${paramsPath}`;

  const existingQuery = qsModule.parse(locationSearch.slice(1));
  const sortByKeys = Object.values(codeToTranslated["sortBy"].translatedKey);
  for (const key of sortByKeys) delete existingQuery[key];

  url += qsModule.stringify(
    {
      ...(routeState.sortBy !== undefined
        ? translateCodeTowardsParams(routeState.sortBy[0], lang)
        : {}),
      ...existingQuery,
    },
    { addQueryPrefix: true, arrayFormat: "repeat" },
  );

  return url;
};

export const createURL = ({ routeState, location, qsModule }: createURLProps): string => {
  const lang = CurrentLangAndPriceFilterNameRef.lang;
  let url = getPlpBaseUrl(location.pathname);

  url += createUrlParamsPart(routeState, qsModule, lang, location.search);
  url += location.hash;

  return url;
};

export const parseURLParamsPart = (
  location: Location | { pathname: string; search: string },
  qsModule: qs,
  lang: Locale,
): AlgoliaRoute => {
  let paramsRoute: AlgoliaRoute = {};

  const filtersSlug = getPlpFiltersSlug(location.pathname);
  if (filtersSlug.length > 0) paramsRoute = createRouteFromUrl(filtersSlug, lang);

  const queryParams = qsModule.parse(location.search.slice(1));
  const filterName = translateParamsTowardsCode(queryParams);

  if (isNotNullNorUndefined(filterName)) paramsRoute.sortBy = [filterName];

  return paramsRoute;
};

export const parseURL = ({ qsModule, location }: parseURLProps): AlgoliaRoute => {
  return parseURLParamsPart(location, qsModule, CurrentLangAndPriceFilterNameRef.lang);
};

export const stateToRoute = (algoliaState: AlgoliaState): AlgoliaRoute => {
  if (!(PLPIndexName in algoliaState)) return {};

  const priceRefinementName = CurrentLangAndPriceFilterNameRef.priceRefinementName;
  const lang = CurrentLangAndPriceFilterNameRef.lang;

  const refinementList = algoliaState[PLPIndexName].refinementList;

  let sortedRefinementList;
  if (refinementList) {
    sortedRefinementList = Object.keys(refinementList).reduce((acc: AlgoliaRoute, key: string) => {
      const typedKey = key as RefinementType;
      const type = codeToTranslated[typedKey].type;
      const values = refinementList[typedKey];
      if (values !== undefined) {
        acc[typedKey] = sortRefinementValues(values, typedKey, type, lang);
      } else {
        acc[typedKey] = refinementList[typedKey];
      }

      return acc;
    }, {});
  }

  const query = algoliaState[PLPIndexName].query;
  const page = algoliaState[PLPIndexName].page?.toString();
  const sortBy = algoliaState[PLPIndexName].sortBy;
  const alcoholLevel = algoliaState[PLPIndexName].range?.alcoholLevel;
  const unitPrice = algoliaState[PLPIndexName].range?.[priceRefinementName];
  const auctionCatalogStartDate = algoliaState[PLPIndexName].range?.auctionCatalogStartDate;

  const algoliaRefinementList = {
    ...(isNotNullNorUndefined(sortedRefinementList) ? sortedRefinementList : {}),
    ...(isNotNullNorUndefined(query) ? { query: [query] } : {}),
    ...(isNotNullNorUndefined(page) ? { page: [page] } : {}),
    ...(isNotNullNorUndefined(sortBy) ? { sortBy: [sortBy] } : {}),
    ...(isNotNullNorUndefined(alcoholLevel)
      ? { alcoholLevel: [formatRangeTowardsUrl(alcoholLevel)] }
      : {}),
    ...(isNotNullNorUndefined(unitPrice)
      ? { unitPrice: [formatPriceRangeTowardsUrl(unitPrice)] }
      : {}),
    ...(isNotNullNorUndefined(auctionCatalogStartDate)
      ? { auctionCatalogStartDate: ["true"] }
      : {}),
  };

  return algoliaRefinementList;
};

export const routeToState = (algoliaRoute: AlgoliaRoute): AlgoliaState => {
  const { page, query, sortBy, unitPrice, alcoholLevel, auctionCatalogStartDate, ...refinements } =
    algoliaRoute;
  const priceRefinementName = CurrentLangAndPriceFilterNameRef.priceRefinementName;

  const returnState = {
    [PLPIndexName]: {
      refinementList: refinements,
      ...(query ? { query: query[0] } : {}),
      ...(page ? { page: parseInt(page[0]) } : {}),
      ...(isNotNullNorUndefined(sortBy) ? { sortBy: sortBy[0] } : {}),
      ...(isNotNullNorUndefined(unitPrice) ||
      isNotNullNorUndefined(alcoholLevel) ||
      isNotNullNorUndefined(auctionCatalogStartDate)
        ? {
            range: {
              ...(isNotNullNorUndefined(unitPrice)
                ? { [priceRefinementName]: formatPriceRangeTowardsState(unitPrice[0]) }
                : {}),
              ...(isNotNullNorUndefined(alcoholLevel)
                ? { alcoholLevel: formatRangeTowardsState(alcoholLevel[0]) }
                : {}),
              ...(isNotNullNorUndefined(auctionCatalogStartDate)
                ? { auctionCatalogStartDate: `${findNewReleasesFilterStartValue()}:` }
                : {}),
            },
          }
        : {}),
    },
  };

  return returnState;
};

/* Generate a relative url to the plp */
export const getPlpUrl = (params: object, lang: Locale) => {
  const paramsPart = createUrlParamsPart(params, { parse, stringify }, lang);

  return generateUrl("BUY_WINE_URL", lang) + paramsPart;
};

export const getDefaultAlgoliaFilter = (user?: AuthenticatedUser | null) => {
  const currentTimeStamp = Math.round(Date.now() / 1000 / 60) * 60; // round to the closest minute to avoid multiple requests to algolia
  const maxAuctionCatalogStartDate = currentTimeStamp + 30; // add 30 seconds to max startDate to avoid missing products due to round to the closest minute
  const minBidEndDate = currentTimeStamp - 30; // remove 30 seconds from min endDate to avoid missing products due to round to the closest minute
  const shouldHideQuintessenceSales = user === undefined || user?.loyaltyProgram !== "QUINTESSENCE";

  return (
    `(technicalNumericalIsDirectPurchase > 0 OR auctionCatalogStartDate < ${maxAuctionCatalogStartDate}) AND (technicalNumericalIsDirectPurchase > 0 OR bidEndDate > ${minBidEndDate}) AND offlineSale < 1` +
    (shouldHideQuintessenceSales ? " AND quintessenceSale < 1" : "")
  );
};

export const defaultAttributesToRetrieve = ["*", "-technicalNumericalIsDirectPurchase"];

// this ref is needed because algolia instantSearch seems to memoize the first createURL function
const CurrentLangAndPriceFilterNameRef = {
  lang: "fr" as Locale,
  priceRefinementName: "unitPriceByCountry.FR",
};

const AlgoliaInstantSearchProvider = ({
  serverState,
  serverUrl,
  isOnPLP,
  children,
  lang,
}: InstantSearchProviderProps & PropsWithChildren) => {
  const { user } = useAuthenticatedUserContext();

  CurrentLangAndPriceFilterNameRef.lang = lang;

  return isOnPLP ? (
    <InstantSearchSSRProvider {...serverState}>
      <InstantSearch
        searchClient={searchClient}
        indexName={PLPIndexName}
        routing={
          serverUrl !== undefined
            ? {
                router: createInstantSearchRouterNext({
                  singletonRouter,
                  serverUrl,
                  routerOptions: { createURL, parseURL },
                }),
                stateMapping: { routeToState, stateToRoute },
              }
            : undefined
        }
      >
        <Configure
          filters={getDefaultAlgoliaFilter(user)}
          attributesToRetrieve={defaultAttributesToRetrieve}
        />
        <VirtualWidgets />
        {children}
      </InstantSearch>
    </InstantSearchSSRProvider>
  ) : (
    <>{children}</>
  );
};

export default AlgoliaInstantSearchProvider;
