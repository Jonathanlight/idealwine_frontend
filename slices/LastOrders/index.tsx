import { faPlus } from "@fortawesome/pro-solid-svg-icons/faPlus";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { KeenSliderInstance } from "keen-slider";
import { useKeenSlider } from "keen-slider/react";
import React, { useEffect, useState } from "react";

import LinkButton from "@/components/atoms/Button/LinkButton";
import HomePageProductCard from "@/components/organisms/HomePageProductCard";
import { RESERVED_KEEN_SLIDER_CLASSNAMES } from "@/components/organisms/PDP/ProductVariantCarousel/utils";
import { useCurrentDeliveryCountry } from "@/hooks/useCurrentDeliveryCountry";
import { OrderEventHistoryJsonldShopOrderEventHistoryRead } from "@/networking/sylius-api-client/.ts.schemas";
import {
  getGetOrderEventHistoryCollectionQueryKey,
  getOrderEventHistoryCollection,
} from "@/networking/sylius-api-client/order-event-history/order-event-history";
import { breakpointMedium, isDesktop } from "@/styles/breakpoints";
import { STALE_TIME_MINUTE } from "@/utils/constants";
import { nextLangToSyliusLocale } from "@/utils/locale";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import styles from "./index.module.scss";

const LastOrders = () => {
  const { t, lang } = useTranslation();
  const { currentDeliveryCountry: countryCode } = useCurrentDeliveryCountry();

  const { data: lastOrdersData } = useQuery(getLastOrdersQueryParams(lang));
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const lastOrderDataLength = lastOrdersData?.["hydra:member"]?.length ?? 0;
  const itemsPerView = lastOrderDataLength === 1 ? 1 : isDesktop ? 5 : 2;
  const bulletPointsNumbers = Math.ceil(lastOrderDataLength - itemsPerView + 1);
  const maxIndex = lastOrderDataLength - itemsPerView;
  const bulletPoints = Array.from(Array(bulletPointsNumbers).keys()).map(index =>
    Math.min(index, maxIndex),
  );
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
  }, [lastOrdersData, options]);

  return (
    <div
      ref={sliderRef}
      className={clsx(RESERVED_KEEN_SLIDER_CLASSNAMES["keen-slider"], styles.lastOrdersContainer)}
    >
      <h2 className={styles.lastOrdersTitle}>{t("home:lastOrdersTitle")}</h2>
      <div className={styles.cardsContainer}>
        {lastOrdersData?.["hydra:member"].map(
          (orderEvent: OrderEventHistoryJsonldShopOrderEventHistoryRead) => {
            const imageUrl =
              isNotNullNorUndefined(orderEvent.imageUrl) && orderEvent.imageUrl !== ""
                ? orderEvent.imageUrl
                : `/_no_picture_${lang}.jpg`;
            const currentCountryPrice = orderEvent.priceByCountry?.[countryCode];

            return (
              <div
                key={orderEvent["@id"]}
                className={clsx(
                  RESERVED_KEEN_SLIDER_CLASSNAMES["keen-slider__slide"],
                  styles.cardContainer,
                )}
              >
                <HomePageProductCard
                  variant={orderEvent}
                  imageUrl={imageUrl}
                  name={orderEvent.variantName}
                  auction={orderEvent.auction}
                  price={currentCountryPrice}
                  preloadPicture={false}
                />
              </div>
            );
          },
        )}
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
      <LinkButton href="LAST_ORDER_URL" variant="primaryBlack" className={styles.seeMoreButton}>
        {t("home:seeMore")} <FontAwesomeIcon icon={faPlus} />
      </LinkButton>
    </div>
  );
};

export const getLastOrdersQueryParams = (locale: string | undefined) => ({
  staleTime: STALE_TIME_MINUTE,
  queryKey: getGetOrderEventHistoryCollectionQueryKey({ itemsPerPage: 12 }),
  queryFn: () =>
    getOrderEventHistoryCollection(
      { itemsPerPage: 12 },
      { headers: { "Accept-Language": nextLangToSyliusLocale(locale) } },
    ),
});

export default LastOrders;
