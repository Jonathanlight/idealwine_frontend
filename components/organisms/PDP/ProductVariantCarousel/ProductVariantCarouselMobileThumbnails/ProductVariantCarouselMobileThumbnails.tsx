import clsx from "clsx";
import { KeenSliderInstance, useKeenSlider } from "keen-slider/react";
import { MutableRefObject } from "react";

import ThumbnailPlugin from "@/components/organisms/PDP/ProductVariantCarousel/ThumbnailPlugin";
import { RESERVED_KEEN_SLIDER_CLASSNAMES } from "@/components/organisms/PDP/ProductVariantCarousel/utils";

import styles from "./ProductVariantCarouselMobileThumbnails.module.scss";

type Props = {
  images: string[];
  sliderRef: MutableRefObject<KeenSliderInstance | null>;
  currentSlide: number;
  setCurrentSlide: (slide: number) => void;
};

const ProductVariantCarouselMobileThumbnails = ({
  sliderRef,
  currentSlide,
  setCurrentSlide,
  images,
}: Props): JSX.Element => {
  const [thumbnailRef] = useKeenSlider<HTMLDivElement>(
    {
      initial: 0,
      slides: {
        perView: images.length,
      },
    },
    [ThumbnailPlugin(sliderRef)],
  );

  return (
    <div
      className={clsx(styles.thumbnailsOuterContainer, {
        [styles.singleThumbnail]: images.length === 1,
        [styles.twoThumbnails]: images.length === 2,
        [styles.threeThumbnails]: images.length === 3,
      })}
    >
      <div
        ref={thumbnailRef}
        className={clsx(
          RESERVED_KEEN_SLIDER_CLASSNAMES["keen-slider"],
          RESERVED_KEEN_SLIDER_CLASSNAMES["thumbnail"],
          styles.thumbnailsContainer,
        )}
      >
        {images.map((src, idx) => (
          <button
            key={src}
            className={clsx(
              RESERVED_KEEN_SLIDER_CLASSNAMES["keen-slider__slide"],
              styles.mobileThumbnail,
            )}
            onClick={() => setCurrentSlide(idx)}
          >
            <div className={clsx(styles.dot, { [styles.active]: currentSlide === idx })}></div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductVariantCarouselMobileThumbnails;
