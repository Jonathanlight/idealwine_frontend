import clsx from "clsx";
import { RefinementListItem } from "instantsearch.js/es/connectors/refinement-list/connectRefinementList";
import { useInstantSearch, useRange, useRefinementList } from "react-instantsearch-hooks-web";

import Button from "@/components/atoms/Button/Button";
import Input from "@/components/atoms/Input/Input";
import AlgoliaPriceRangeForm from "@/components/organisms/PLP/AlgoliaPriceRangeForm";
import {
  findNewReleasesFilterStartValue,
  PLPIndexName,
  refinementsTranslationKeys,
} from "@/hooks/useAlgoliaRefinements";
import { useCurrentCurrency } from "@/hooks/useCurrentCurrency";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import AlgoliaRangeForm from "../AlgoliaRangeForm";
import { FilterBox } from "./FilterBox";
import { FilterContent } from "./FilterContent";
import contentStyles from "./FilterContent.module.scss";
import styles from "./Filters.module.scss";

type Props = {
  refinementList: {
    biologicProfile: ReturnType<typeof useRefinementList>;
    color: ReturnType<typeof useRefinementList>;
    bottleSize: ReturnType<typeof useRefinementList>;
    isDirectPurchase: ReturnType<typeof useRefinementList>;
    unitPrice: ReturnType<typeof useRange>;
    alcoholLevel: ReturnType<typeof useRange>;
    country: ReturnType<typeof useRefinementList>;
    region: ReturnType<typeof useRefinementList>;
    subregion: ReturnType<typeof useRefinementList>;
    domainName: ReturnType<typeof useRefinementList>;
    vintage: ReturnType<typeof useRefinementList>;
    grapeVariety: ReturnType<typeof useRefinementList>;
    intensity: ReturnType<typeof useRefinementList>;
    mainAroma: ReturnType<typeof useRefinementList>;
    tastingOccasion: ReturnType<typeof useRefinementList>;
    status: ReturnType<typeof useRefinementList>;
    peak: ReturnType<typeof useRefinementList>;
    productCategory: ReturnType<typeof useRefinementList>;
    bottleCount: ReturnType<typeof useRefinementList>;
    ownerName: ReturnType<typeof useRefinementList>;
    hasBids: ReturnType<typeof useRefinementList>;
    hasReservePrice: ReturnType<typeof useRefinementList>;
    liquidLevels: ReturnType<typeof useRefinementList>;
    bottleObservations: ReturnType<typeof useRefinementList>;
    woodenCase: ReturnType<typeof useRefinementList>;
    refundableVat: ReturnType<typeof useRefinementList>;
    hasLotDiscount: ReturnType<typeof useRefinementList>;
    hasDiscount: ReturnType<typeof useRefinementList>;
    quintessenceSale: ReturnType<typeof useRefinementList>;
    tags: ReturnType<typeof useRefinementList>;
    auctionCatalogStartDate: ReturnType<typeof useRange>;
  };
  className?: string;
};

const Filters = ({ refinementList, className }: Props): JSX.Element => {
  const { t } = useTranslation("acheter-du-vin");
  const { setIndexUiState, uiState } = useInstantSearch();
  const { currentCurrencyLogo } = useCurrentCurrency();

  const priceFilterRefinedCount =
    (isFinite(refinementList.unitPrice.start[0] ?? -Infinity) ? 1 : 0) +
    (isFinite(refinementList.unitPrice.start[1] ?? Infinity) ? 1 : 0);

  const alcoholLevelFilterRefinedCount =
    (isFinite(refinementList.alcoholLevel.start[0] ?? -Infinity) ? 1 : 0) +
    (isFinite(refinementList.alcoholLevel.start[1] ?? Infinity) ? 1 : 0);

  const auctionCatalogStartDateRefined =
    isFinite(refinementList.auctionCatalogStartDate.start[0] ?? -Infinity) ||
    isFinite(refinementList.auctionCatalogStartDate.start[1] ?? Infinity)
      ? 1
      : 0;

  const onClearFilters = () => {
    setIndexUiState(prevUiState => ({
      ...prevUiState,
      query: undefined,
      refinementList: {},
      numericMenu: {},
      range: {},
    }));
  };

  // This fixes a very specific usecase : if the customer has no sort seected AND has not selected any direct purchase filtre, we should set the sort by price desc
  const auctionSelectedCallback = (item: RefinementListItem) => {
    const hasOneSortActivated = isNotNullNorUndefined(uiState[PLPIndexName].sortBy);

    if (hasOneSortActivated || item.value !== "false") {
      refinementList.isDirectPurchase.refine(item.value);

      return;
    }

    // If number refined is strictly superior to 0, either we are removing the auction filter, or we already have a filter on direct purchase
    // Therefore, there is nothing to do here
    if (numberRefined(refinementList.isDirectPurchase.items) > 0) {
      refinementList.isDirectPurchase.refine(item.value);

      return;
    }

    setIndexUiState(prevUiState => {
      const newUiState = { ...prevUiState, sortBy: `${PLPIndexName}_price_desc` };

      // This is what refinementList.isDirectPurchase.refine(item.value) usually does, but we need to do it manually here.
      // Otherwise we would have two networks call to Algolia: one for the refine, and one for the sort
      newUiState.refinementList = {
        ...newUiState.refinementList,
        isDirectPurchase: [item.value],
      };

      return newUiState;
    });
  };

  return (
    <div className={clsx(styles.filters, className)}>
      <Button variant="inline" onClick={onClearFilters} className={styles.clearFiltersButton}>
        {t("clearRefinments")}
      </Button>
      <FilterBox
        title={t("filters.isDirectPurchase")}
        filtersSelected={numberRefined(refinementList.isDirectPurchase.items)}
        initiallyOpen={true}
      >
        <ul>
          {refinementList.isDirectPurchase.items.map(item => {
            return (
              <li key={item.value} className={contentStyles.filterItem}>
                <Input
                  label={`${t(refinementsTranslationKeys.isDirectPurchase + "." + item.value)} (${
                    item.count
                  })`}
                  type="checkbox"
                  onChange={() => auctionSelectedCallback(item)}
                  checked={item.isRefined}
                />
              </li>
            );
          })}
        </ul>
      </FilterBox>
      <FilterBox
        title={t("filters.color")}
        filtersSelected={numberRefined(refinementList.color.items)}
        initiallyOpen={true}
      >
        <FilterContent
          algoliaList={refinementList.color}
          translationLabel={refinementsTranslationKeys.color}
        />
      </FilterBox>
      <FilterBox
        title={t("filters.region")}
        filtersSelected={numberRefined(refinementList.region.items)}
        initiallyOpen={false}
      >
        <FilterContent
          algoliaList={refinementList.region}
          translationLabel={refinementsTranslationKeys.region}
        />
      </FilterBox>
      <FilterBox
        title={t("filters.country")}
        filtersSelected={numberRefined(refinementList.country.items)}
        initiallyOpen={true}
      >
        <FilterContent
          algoliaList={refinementList.country}
          translationLabel={refinementsTranslationKeys.country}
        />
      </FilterBox>
      <FilterBox
        title={t("filters.subregion")}
        filtersSelected={numberRefined(refinementList.subregion.items)}
        initiallyOpen={false}
      >
        <FilterContent
          algoliaList={refinementList.subregion}
          translationLabel={refinementsTranslationKeys.subregion}
        />
      </FilterBox>
      <FilterBox
        title={t("filters.domainName")}
        filtersSelected={numberRefined(refinementList.domainName.items)}
        initiallyOpen={false}
      >
        <FilterContent
          algoliaList={refinementList.domainName}
          translationLabel={refinementsTranslationKeys.domainName}
        />
      </FilterBox>
      <FilterBox
        title={t("filters.vintage")}
        filtersSelected={numberRefined(refinementList.vintage.items)}
        initiallyOpen={false}
      >
        <FilterContent
          algoliaList={refinementList.vintage}
          translationLabel={refinementsTranslationKeys.vintage}
        />
      </FilterBox>
      <FilterBox
        title={t("filters.priceFilter")}
        filtersSelected={priceFilterRefinedCount}
        initiallyOpen={false}
      >
        <AlgoliaPriceRangeForm
          rangeState={refinementList.unitPrice}
          minLabel={t("filters.minPriceRange", { currency: currentCurrencyLogo })}
          maxLabel={t("filters.maxPriceRange", { currency: currentCurrencyLogo })}
        />
      </FilterBox>
      <FilterBox
        title={t("filters.wineStyle")}
        filtersSelected={
          numberRefined(refinementList.biologicProfile.items) +
          numberRefined(refinementList.intensity.items) +
          numberRefined(refinementList.mainAroma.items) +
          numberRefined(refinementList.tastingOccasion.items) +
          numberRefined(refinementList.status.items) +
          numberRefined(refinementList.peak.items) +
          numberRefined(refinementList.productCategory.items)
        }
        initiallyOpen={false}
      >
        <>
          <FilterContent
            algoliaList={refinementList.biologicProfile}
            name={t("filters.biologicProfile")}
            translationLabel={refinementsTranslationKeys.biologicProfile}
          />
          <FilterContent
            algoliaList={refinementList.intensity}
            name={t("filters.intensity")}
            translationLabel={refinementsTranslationKeys.intensity}
          />
          <FilterContent
            algoliaList={refinementList.mainAroma}
            name={t("filters.mainAroma")}
            translationLabel={refinementsTranslationKeys.mainAroma}
          />
          <FilterContent
            algoliaList={refinementList.tastingOccasion}
            name={t("filters.tastingOccasion")}
            translationLabel={refinementsTranslationKeys.tastingOccasion}
          />
          <FilterContent
            algoliaList={refinementList.status}
            name={t("filters.status")}
            translationLabel={refinementsTranslationKeys.status}
          />
          <FilterContent
            algoliaList={refinementList.peak}
            name={t("filters.peak")}
            translationLabel={refinementsTranslationKeys.peak}
          />
          <FilterContent
            algoliaList={refinementList.productCategory}
            name={t("filters.productCategory")}
            translationLabel={refinementsTranslationKeys.productCategory}
          />
        </>
      </FilterBox>
      <FilterBox
        title={t("filters.grapeVariety")}
        filtersSelected={numberRefined(refinementList.grapeVariety.items)}
        initiallyOpen={false}
      >
        <FilterContent
          algoliaList={refinementList.grapeVariety}
          translationLabel={refinementsTranslationKeys.grapeVariety}
        />
      </FilterBox>
      <FilterBox
        title={t("filters.tags")}
        filtersSelected={numberRefined(refinementList.tags.items)}
        initiallyOpen={false}
      >
        <FilterContent algoliaList={refinementList.tags} />
      </FilterBox>
      <FilterBox
        title={t("filters.alcoholPorcentageLevel")}
        filtersSelected={alcoholLevelFilterRefinedCount}
      >
        <AlgoliaRangeForm
          rangeState={refinementList.alcoholLevel}
          minLabel={t("filters.minAlcoholLevelRange")}
          maxLabel={t("filters.maxAlcoholLevelRange")}
          step="0.1"
        />
      </FilterBox>
      <FilterBox
        title={t("filters.bottleSize")}
        filtersSelected={numberRefined(refinementList.bottleSize.items)}
        initiallyOpen={false}
      >
        <FilterContent
          algoliaList={refinementList.bottleSize}
          translationLabel={refinementsTranslationKeys.bottleSize}
        />
      </FilterBox>
      <FilterBox
        title={t("filters.bottleCount")}
        filtersSelected={numberRefined(refinementList.bottleCount.items)}
        initiallyOpen={false}
      >
        <FilterContent
          algoliaList={refinementList.bottleCount}
          translationLabel={refinementsTranslationKeys.bottleCount}
        />
      </FilterBox>
      <FilterBox
        title={t("filters.advancedSearch")}
        filtersSelected={
          numberRefined(refinementList.ownerName.items) +
          numberRefined(refinementList.hasBids.items) +
          numberRefined(refinementList.hasReservePrice.items) +
          auctionCatalogStartDateRefined +
          numberRefined(refinementList.liquidLevels.items) +
          numberRefined(refinementList.bottleObservations.items) +
          numberRefined(refinementList.woodenCase.items) +
          numberRefined(refinementList.refundableVat.items) +
          numberRefined(refinementList.hasLotDiscount.items) +
          numberRefined(refinementList.hasDiscount.items) +
          numberRefined(refinementList.quintessenceSale.items)
        }
        initiallyOpen={false}
      >
        <>
          <FilterContent algoliaList={refinementList.ownerName} name={t("filters.ownerName")} />
          <div className={contentStyles.filterSubTitle}>{t("filters.hasBids")}</div>
          <ul>
            {refinementList.hasBids.items.map(item => {
              return (
                <li key={item.value} className={contentStyles.filterItem}>
                  <Input
                    label={`${t(refinementsTranslationKeys.hasBids + "." + item.value)} (${
                      item.count
                    })`}
                    type="checkbox"
                    onChange={() => refinementList.hasBids.refine(item.value)}
                    checked={item.isRefined}
                  />
                </li>
              );
            })}
            {refinementList.hasReservePrice.items.map(item => {
              if (item.value === "false") {
                return (
                  <li key={item.value} className={contentStyles.filterItem}>
                    <Input
                      label={`${t(
                        refinementsTranslationKeys.hasReservePrice + "." + item.value,
                      )} (${item.count})`}
                      type="checkbox"
                      onChange={() => refinementList.hasReservePrice.refine(item.value)}
                      checked={item.isRefined}
                    />
                  </li>
                );
              }
            })}
          </ul>
          <div className={contentStyles.filterSubTitle}>{t("filters.newReleases")}</div>
          <ul>
            <li className={contentStyles.filterItem}>
              <Input
                label={t("filters.newReleasesValue")}
                type="checkbox"
                onChange={() => {
                  if (auctionCatalogStartDateRefined > 0) {
                    refinementList.auctionCatalogStartDate.refine([undefined, undefined]);
                  } else {
                    // We use setIndexUiState instead of refinementList.auctionCatalogStartDate.refine because we want to be sure to filter the elements that have no auctionCatalogStartDate
                    // Using refine with a range hook has the following behavior : if you refine outside the range, it will not filter the elements that have no value for the range
                    // Therefore, if all the elements having a value for auctionCatalogStartDate are newer than 10 days, clicking the button wouldn't do anything,
                    // instead of filtering the elements that have no value for auctionCatalogStartDate
                    setIndexUiState(prevUiState => ({
                      ...prevUiState,
                      range: {
                        ...prevUiState.range,
                        auctionCatalogStartDate: `${findNewReleasesFilterStartValue()}:`,
                      },
                    }));
                  }
                }}
                checked={auctionCatalogStartDateRefined > 0}
              />
            </li>
          </ul>
          <FilterContent
            algoliaList={refinementList.liquidLevels}
            name={t("filters.liquidLevel")}
            translationLabel={refinementsTranslationKeys.liquidLevels}
          />
          <FilterContent
            algoliaList={refinementList.bottleObservations}
            name={t("filters.bottleObservations")}
            translationLabel={refinementsTranslationKeys.bottleObservations}
          />
          <FilterContent
            algoliaList={refinementList.woodenCase}
            name={t("filters.woodenCase")}
            translationLabel={refinementsTranslationKeys.woodenCase}
          />
          <FilterContent
            algoliaList={refinementList.refundableVat}
            name={t("filters.refundableVat")}
            translationLabel={refinementsTranslationKeys.refundableVat}
          />
          <FilterContent
            algoliaList={refinementList.hasDiscount}
            name={t("filters.hasDiscount")}
            translationLabel={refinementsTranslationKeys.hasDiscount}
          />
          <FilterContent
            algoliaList={refinementList.hasLotDiscount}
            name={t("filters.hasLotDiscount")}
            translationLabel={refinementsTranslationKeys.hasLotDiscount}
          />
        </>
      </FilterBox>
    </div>
  );
};

const numberRefined = (refinement: { isRefined: boolean }[]) =>
  refinement.filter(item => item.isRefined).length;

export default Filters;
