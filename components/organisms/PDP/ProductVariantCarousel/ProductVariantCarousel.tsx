import clsx from "clsx";
import { useKeenSlider } from "keen-slider/react";
import { useState } from "react";

import ImageMagnifier from "@/components/atoms/ImageMagnifier/ImageMagnifier";
import FullScreenProductVariantCarousel from "@/components/organisms/PDP/ProductVariantCarousel/FullScreenProductVariantCarousel/FullScreenProductVariantCarousel";
import ProductVariantCarouselDesktopThumbnails from "@/components/organisms/PDP/ProductVariantCarousel/ProductVariantCarouselDesktopThumbnails/ProductVariantCarouselDesktopThumbnails";
import ProductVariantCarouselMobileThumbnails from "@/components/organisms/PDP/ProductVariantCarousel/ProductVariantCarouselMobileThumbnails/ProductVariantCarouselMobileThumbnails";
import { breakpointSmall } from "@/styles/breakpoints";
import { ProductVariantCarouselImage } from "@/utils/productVariantImage";

import styles from "./ProductVariantCarousel.module.scss";
import { RESERVED_KEEN_SLIDER_CLASSNAMES } from "./utils";

const MAGNIFIER_SIZE = 300;
const ZOOM_LEVEL = 2.5;

type Props = {
  images: ProductVariantCarouselImage[];
  description: string | null;
};

const ProductVariantCarousel = ({ images, description }: Props) => {
  const [fullScreen, setFullScreen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slideChanged: slider => {
      setCurrentSlide(slider.track.details.rel);
    },
    slides: {
      origin: "auto",
      spacing: 15,
    },
  });

  const paths = images.map(({ path }) => path.product_variant_medium);
  const fullScreenPaths = images.map(({ path }) => path.product_variant_large);

  return (
    <div className={styles.container}>
      {fullScreen ? (
        <FullScreenProductVariantCarousel
          paths={fullScreenPaths}
          onClose={() => setFullScreen(false)}
          description={description}
        />
      ) : null}
      <div ref={sliderRef} className={clsx(RESERVED_KEEN_SLIDER_CLASSNAMES["keen-slider"])}>
        {fullScreenPaths.map((path, index) => (
          <div
            key={path}
            className={clsx(
              RESERVED_KEEN_SLIDER_CLASSNAMES["keen-slider__slide"],
              styles.imageContainer,
            )}
          >
            <ImageMagnifier
              unoptimized
              onClick={() => setFullScreen(true)}
              fill
              src={path}
              sizes={`(max-width: ${breakpointSmall}) 100vw, 33vw`}
              alt={`product image ${index}`}
              magnifierSize={MAGNIFIER_SIZE}
              zoomLevel={ZOOM_LEVEL}
              priority={index === 0}
              className={styles.image}
            />
          </div>
        ))}
      </div>

      <div className={styles.showOnMobile}>
        <ProductVariantCarouselMobileThumbnails
          sliderRef={instanceRef}
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
          images={paths}
        />
      </div>
      <div className={styles.showOnDesktop}>
        <ProductVariantCarouselDesktopThumbnails sliderRef={instanceRef} images={paths} />
      </div>
    </div>
  );
};

export default ProductVariantCarousel;
