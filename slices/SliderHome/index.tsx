import { Content } from "@prismicio/client";
import clsx from "clsx";
import { KeenSliderInstance, useKeenSlider } from "keen-slider/react";
import React from "react";

import Card from "@/components/molecules/Card";
import { RESERVED_KEEN_SLIDER_CLASSNAMES } from "@/components/organisms/PDP/ProductVariantCarousel/utils";
import { useTranslation } from "@/utils/next-utils";

import styles from "./index.module.scss";

const SliderHomeAuction = ({ slice }: { slice: Content.SliderHomeSlice }) => {
  const auctionCards = slice.items.filter(card => card.auction);
  const directCards = slice.items.filter(card => !card.auction);
  const DirectCardShouldLoop = (): boolean => {
    return directCards.length > 1;
  };

  const AuctionCardShouldLoop = (): boolean => {
    return auctionCards.length > 1;
  };
  const configureKeenSlider = (slider: KeenSliderInstance) => {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let mouseOver = false;

    const clearNextTimeout = (): void => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };

    const nextTimeout = (): void => {
      clearNextTimeout();
      if (mouseOver) return;

      timeout = setTimeout(() => {
        slider.next();
      }, 3000);
    };

    slider.on("created", () => {
      slider.container.addEventListener("mouseover", () => {
        mouseOver = true;
        clearNextTimeout();
      });

      slider.container.addEventListener("mouseout", () => {
        mouseOver = false;
        nextTimeout();
      });

      nextTimeout();
    });

    slider.on("dragStarted", clearNextTimeout);
    slider.on("animationEnded", nextTimeout);
    slider.on("updated", nextTimeout);
  };

  const [sliderRef1] = useKeenSlider<HTMLDivElement>(
    {
      loop: AuctionCardShouldLoop(),
    },
    [slider => configureKeenSlider(slider)],
  );

  const [sliderRef2] = useKeenSlider<HTMLDivElement>(
    {
      loop: DirectCardShouldLoop(),
    },
    [slider => configureKeenSlider(slider)],
  );
  const { t } = useTranslation("home");

  return (
    <div className={styles.sliceContainer}>
      <div className={styles.offerContainer}>
        <h2 className={styles.title}>{t("sliderAuctionTitle")}</h2>
        <div ref={sliderRef1} className={clsx(RESERVED_KEEN_SLIDER_CLASSNAMES["keen-slider"])}>
          {auctionCards.map((card, index: number) => (
            <div
              key={index}
              className={clsx(RESERVED_KEEN_SLIDER_CLASSNAMES["keen-slider__slide"], styles.slider)}
            >
              <Card
                header={card.date ?? undefined}
                image={card.image}
                imageLabel={card.imagelabel ?? undefined}
                linkLabel={card.link1label ?? undefined}
                link={card.link1}
                secondLinkLabel={card.link2label ?? undefined}
                secondLink={card.link2}
                title={card.title}
                buttonColor="primaryBlack"
              />
            </div>
          ))}
        </div>
      </div>
      <div className={styles.offerContainer}>
        <h2 className={styles.title}>{t("sliderDirectPurchaseTitle")}</h2>
        <div ref={sliderRef2} className={RESERVED_KEEN_SLIDER_CLASSNAMES["keen-slider"]}>
          {directCards.map((card, index: number) => (
            <div
              key={index}
              className={clsx(RESERVED_KEEN_SLIDER_CLASSNAMES["keen-slider__slide"], styles.slider)}
            >
              <Card
                header={card.date ?? undefined}
                image={card.image}
                imageLabel={card.imagelabel ?? undefined}
                linkLabel={card.link1label ?? undefined}
                link={card.link1}
                secondLinkLabel={card.link2label ?? undefined}
                secondLink={card.link2}
                title={card.title}
                buttonColor="primaryGolden"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SliderHomeAuction;
