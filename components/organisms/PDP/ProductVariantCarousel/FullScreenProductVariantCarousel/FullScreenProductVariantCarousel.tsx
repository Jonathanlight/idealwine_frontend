import { useKeyboardEvent } from "@react-hookz/web";
import clsx from "clsx";
import { useKeenSlider } from "keen-slider/react";
import Image from "next/image";

import FullScreenImage from "@/components/molecules/FullScreenImage";
import ProductVariantCarouselDesktopThumbnails from "@/components/organisms/PDP/ProductVariantCarousel/ProductVariantCarouselDesktopThumbnails/ProductVariantCarouselDesktopThumbnails";
import { RESERVED_KEEN_SLIDER_CLASSNAMES } from "@/components/organisms/PDP/ProductVariantCarousel/utils";

import styles from "./FullScreenProductVariantCarousel.module.scss";

type Props = {
  paths: string[];
  onClose: () => void;
  description: string | null;
};

const FullScreenProductVariantCarousel = ({ paths, onClose, description }: Props) => {
  useKeyboardEvent((event: KeyboardEvent) => event.key === "Escape", onClose);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slides: {
      origin: "center",
      spacing: 15,
    },
  });

  return (
    <FullScreenImage onClose={onClose}>
      <div className={styles.fullScreenCarousel}>
        <div
          ref={sliderRef}
          className={clsx(
            RESERVED_KEEN_SLIDER_CLASSNAMES["keen-slider"],
            styles.fullScreenSliderGridPosition,
          )}
        >
          {paths.map((path, index) => (
            <div
              key={path}
              className={clsx(
                RESERVED_KEEN_SLIDER_CLASSNAMES["keen-slider__slide"],
                styles.imageContainer,
              )}
            >
              <Image
                unoptimized
                fill
                src={path}
                alt={`product image ${index}`}
                className={styles.image}
                sizes={`40vw`}
              />
            </div>
          ))}
        </div>
        <ProductVariantCarouselDesktopThumbnails sliderRef={instanceRef} images={paths} />
        <div className={styles.fullScreenDescriptionGridPosition}>
          {description !== null ? <p className={styles.description}>{description}</p> : null}
        </div>
      </div>
    </FullScreenImage>
  );
};

export default FullScreenProductVariantCarousel;
