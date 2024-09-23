import clsx from "clsx";
import { KeenSliderInstance, useKeenSlider } from "keen-slider/react";
import Image from "next/image";
import { MutableRefObject } from "react";

import ThumbnailPlugin from "@/components/organisms/PDP/ProductVariantCarousel/ThumbnailPlugin";
import { RESERVED_KEEN_SLIDER_CLASSNAMES } from "@/components/organisms/PDP/ProductVariantCarousel/utils";
import { breakpointSmall } from "@/styles/breakpoints";

import styles from "./ProductVariantCarouselDesktopThumbnails.module.scss";

type Props = {
  images: string[];
  sliderRef: MutableRefObject<KeenSliderInstance | null>;
};

const ProductVariantCarouselDesktopThumbnails = ({ sliderRef, images }: Props): JSX.Element => {
  const imagesPerView = images.length < 3 ? images.length : 3;
  const [thumbnailRef] = useKeenSlider<HTMLDivElement>(
    {
      initial: 0,
      slides: {
        perView: imagesPerView,
        spacing: 5,
      },
      vertical: true,
      loop: images.length > imagesPerView,
    },
    [ThumbnailPlugin(sliderRef)],
  );

  return (
    <div className={styles.thumbnailsOuterContainer}>
      <div
        ref={thumbnailRef}
        className={clsx(
          RESERVED_KEEN_SLIDER_CLASSNAMES["keen-slider"],
          RESERVED_KEEN_SLIDER_CLASSNAMES["thumbnail"],
          styles.thumbnailsContainer,
          {
            [styles.singleThumbnail]: images.length === 1,
            [styles.twoThumbnails]: images.length === 2,
          },
        )}
      >
        {images.map((src, index) => (
          <div
            key={src}
            className={clsx(
              RESERVED_KEEN_SLIDER_CLASSNAMES["keen-slider__slide"],
              styles.thumbnailImageContainer,
            )}
          >
            <Image
              unoptimized
              fill
              src={src}
              alt={`product thumbnail ${index}`}
              className={styles.image}
              sizes={`(max-width: ${breakpointSmall}) 25vw, 10vw`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductVariantCarouselDesktopThumbnails;
