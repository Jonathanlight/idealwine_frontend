import { faSpinnerThird } from "@fortawesome/pro-light-svg-icons/faSpinnerThird";
import { faPlus } from "@fortawesome/pro-solid-svg-icons/faPlus";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { KeenSliderInstance } from "keen-slider";
import { useKeenSlider } from "keen-slider/react";
import React, { useEffect, useState } from "react";

import Button from "@/components/atoms/Button";
import LinkButton from "@/components/atoms/Button/LinkButton";
import HomePageProductCard from "@/components/organisms/HomePageProductCard";
import { RESERVED_KEEN_SLIDER_CLASSNAMES } from "@/components/organisms/PDP/ProductVariantCarousel/utils";
import { getPlpUrl } from "@/context/AlgoliaInstantSearchProvider";
import { useCurrentDeliveryCountry } from "@/hooks/useCurrentDeliveryCountry";
import {
  getShopGetNewReleasesProductVariantCollectionQueryKey,
  shopGetNewReleasesProductVariantCollection,
} from "@/networking/sylius-api-client/product-variant/product-variant";
import { breakpointMedium, isDesktop } from "@/styles/breakpoints";
import { STALE_TIME_MINUTE } from "@/utils/constants";
import { ImageFilters } from "@/utils/imageFilters";
import { nextLangToSyliusLocale } from "@/utils/locale";
import { useTranslation } from "@/utils/next-utils";

import styles from "./index.module.scss";

export type RegionEnum = "bordeaux" | "bourgogne" | "rhone" | "autre"; // TODO : get the type of the parameter from the API Orval hook
export const newReleasesRegions = ["bordeaux", "bourgogne", "rhone", "autre"] as RegionEnum[]; // TODO : factorize with the above type
export const firstVisibleReleaseRegion = newReleasesRegions[0];
const newReleasesRegionToAlgoliaRegion = {
  bordeaux: "BORDEAUX",
  bourgogne: "BOURGOGNE",
  rhone: "VALLEE_DU_RHONE",
};

/**
 * @typedef {import("@prismicio/client").Content.NewReleasesSlice} NewReleasesSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<NewReleasesSlice>} NewReleasesProps
 * @param { NewReleasesProps }
 */
const NewReleases = () => {
  const { t, lang } = useTranslation("home");
  const { currentDeliveryCountry: countryCode } = useCurrentDeliveryCountry();

  const [selectedRegion, setSelectedRegion] = useState<RegionEnum>("bordeaux");

  const { data, isLoading } = useQuery(getNewReleasesQueryParams(lang, selectedRegion));

  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const NewReleaseDataLength = data?.["hydra:member"]?.length ?? 0;
  const itemsPerView = NewReleaseDataLength === 1 ? 1 : isDesktop ? 5 : 2;
  const bulletPointsNumbers = Math.ceil(NewReleaseDataLength - itemsPerView + 1);
  const maxIndex = NewReleaseDataLength - itemsPerView;
  const bulletPoints =
    bulletPointsNumbers > 0
      ? Array.from(Array(bulletPointsNumbers).keys()).map(index => Math.min(index, maxIndex))
      : [];
  const breakpointKey = `(max-width: ${breakpointMedium})`;
  const options = {
    slides: {
      perView: 5,
      spacing: 1,
    },
    created: () => {
      setLoaded(true);
    },
    slideChanged: (slider: KeenSliderInstance) => {
      setCurrentSlide(slider.track.details.rel);
    },
    breakpoints: {
      [breakpointKey]: {
        slides: {
          perView: itemsPerView,
          spacing: 1,
        },
      },
    },
  };

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(options);

  useEffect(() => {
    instanceRef.current?.update(options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, options]);

  return (
    <section className={styles.newReleasesContainer}>
      <h2 className={styles.newReleasesTitle}>{t("home:newReleasesTitle")}</h2>
      <div className={styles.buttonsContainer}>
        {newReleasesRegions.map(region => (
          <Button
            key={region}
            onClick={() => {
              setSelectedRegion(region);
            }}
            variant="secondaryWhite"
            className={clsx(
              styles.regionSelectionButton,
              selectedRegion === region && styles.selected,
            )}
          >
            {t(`regionEnum.${region}`)}
          </Button>
        ))}
      </div>
      {isLoading && (
        <FontAwesomeIcon className={styles.loader} icon={faSpinnerThird} spin size="2xl" />
      )}
      <div
        ref={sliderRef}
        className={clsx(
          RESERVED_KEEN_SLIDER_CLASSNAMES["keen-slider"],
          styles.newReleasesContainer,
        )}
      >
        <div className={styles.cardsContainer}>
          {data?.["hydra:member"].map(productVariant => {
            const url = productVariant.firstImage?.path?.[
              // @ts-expect-error path property is badly typed by Orval because we enrich it from a custom normalizer which isn't taken into account by Orval
              ImageFilters.HOMEPAGE_CARD
            ] as string | undefined;
            const price = productVariant.priceByCountry?.[countryCode] ?? 0;

            return (
              <div
                key={productVariant["@id"]}
                className={clsx(
                  RESERVED_KEEN_SLIDER_CLASSNAMES["keen-slider__slide"],
                  styles.cardContainer,
                )}
              >
                <HomePageProductCard
                  variant={productVariant}
                  imageUrl={url}
                  name={productVariant.name ?? ""}
                  auction={productVariant.auction}
                  price={price}
                  preloadPicture={false}
                />
              </div>
            );
          })}
        </div>
      </div>
      {loaded && instanceRef.current && (
        <div className={styles.dots}>
          {bulletPoints.map(idx => {
            return (
              <button
                key={idx}
                onClick={() => {
                  instanceRef.current?.moveToIdx(idx);
                  setCurrentSlide(idx);
                }}
                className={clsx(styles.dot, currentSlide === idx && styles.active)}
              ></button>
            );
          })}
        </div>
      )}
      <LinkButton
        href={getPlpUrl(
          {
            auctionCatalogStartDate: ["true"],
            ...(selectedRegion !== "autre" && {
              region: [newReleasesRegionToAlgoliaRegion[selectedRegion]],
            }),
          },
          lang,
        )}
        variant="primaryBlack"
        className={styles.seeMoreButton}
        dontTranslate
      >
        <FontAwesomeIcon icon={faPlus} /> {t("seeMoreNewReleases")}{" "}
        {t(`regionEnum.${selectedRegion}`)}
      </LinkButton>
    </section>
  );
};

export const getNewReleasesQueryParams = (locale: string | undefined, region: RegionEnum) => ({
  staleTime: STALE_TIME_MINUTE,
  queryKey: getShopGetNewReleasesProductVariantCollectionQueryKey(region),
  queryFn: () =>
    shopGetNewReleasesProductVariantCollection(
      region,
      { filter: [ImageFilters.HOMEPAGE_CARD] },
      { headers: { "Accept-Language": nextLangToSyliusLocale(locale) } },
    ),
});

export default NewReleases;
