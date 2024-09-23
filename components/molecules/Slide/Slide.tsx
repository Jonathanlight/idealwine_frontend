import clsx from "clsx";
import Image from "next/image";

import EmbededYoutubeVideo from "@/components/molecules/EmbededYoutubeVideo/EmbededYoutubeVideo";
import { RESERVED_KEEN_SLIDER_CLASSNAMES } from "@/components/organisms/PDP/ProductVariantCarousel/utils";
import { CarrouselSlideType, SlideToCarousel } from "@/components/organisms/SlidingCarousel/utils";

import styles from "./Slide.module.scss";

type SlideProps = {
  slide: SlideToCarousel;
  width: number;
  height: number;
};

const Slide = ({ slide, width, height }: SlideProps) => {
  return (
    <div
      className={clsx(RESERVED_KEEN_SLIDER_CLASSNAMES["keen-slider__slide"], styles["allSlides"])}
    >
      {slide.type === CarrouselSlideType.youtubeVideo && (
        <EmbededYoutubeVideo width={width} height={height} embedId={slide.src} />
      )}
      {slide.type === CarrouselSlideType.image && (
        <Image
          src={slide.src}
          alt={
            slide.description !== undefined
              ? slide.description
              : "Nos services haute en couture en vidéo"
          }
          width={width}
          height={height}
        />
      )}
      {slide.type === CarrouselSlideType.video && (
        /* eslint-disable jsx-a11y/media-has-caption */
        <video
          className={styles.basicVideo}
          controls={true}
          poster={slide.poster !== undefined ? slide.poster : undefined}
          width={`${width}px`}
        >
          <source src={slide.src} type="video/mp4" />
        </video>
      )}
      {slide.description !== undefined && <p className={styles.description}>{slide.description}</p>}
    </div>
  );
};

export default Slide;
