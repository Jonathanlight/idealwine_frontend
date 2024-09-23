import clsx from "clsx";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useState } from "react";

import Slide from "@/components/molecules/Slide/Slide";
import { RESERVED_KEEN_SLIDER_CLASSNAMES } from "@/components/organisms/PDP/ProductVariantCarousel/utils";
import { SlideToCarousel } from "@/components/organisms/SlidingCarousel/utils";

import styles from "./SlidingCarousel.module.scss";

type SlidingCarouselProps = {
  slides: SlideToCarousel[];
  width: number;
  height: number;
};

const SlidingCarousel = ({ slides, width, height }: SlidingCarouselProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slideChanged: slider => {
      setCurrentSlide(slider.track.details.rel);
    },
    created: () => {
      setLoaded(true);
    },
    loop: true,
  });

  return (
    <>
      <div ref={sliderRef} className={RESERVED_KEEN_SLIDER_CLASSNAMES["keen-slider"]}>
        {slides.map(slide => {
          return <Slide key={slide.src} slide={slide} width={width} height={height} />;
        })}
        {loaded && instanceRef.current && (
          <>
            <Arrow left onClick={() => instanceRef.current?.prev()} />
            <Arrow onClick={() => instanceRef.current?.next()} />
          </>
        )}
      </div>
      {loaded && instanceRef.current && (
        <div className={styles.dots}>
          {Array.from({ length: instanceRef.current.track.details.slides.length }).map(
            (_, idx: number) => (
              <button
                key={idx}
                onClick={() => {
                  instanceRef.current?.moveToIdx(idx);
                }}
                className={clsx(currentSlide === idx && styles.dotActive, styles.dot)}
              ></button>
            ),
          )}
        </div>
      )}
    </>
  );
};

const Arrow = (props: { left?: boolean; onClick: (e: React.MouseEvent) => void }) => {
  return (
    <svg
      onClick={props.onClick}
      className={clsx(
        styles.arrow,
        props.left && styles.arrowLeft,
        !props.left && styles.arrowRight,
      )}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      {props.left && (
        <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z" />
      )}
      {!props.left && <path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />}
    </svg>
  );
};

export default SlidingCarousel;
