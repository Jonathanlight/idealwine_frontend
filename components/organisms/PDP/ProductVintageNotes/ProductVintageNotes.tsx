import clsx from "clsx";
import { useKeenSlider } from "keen-slider/react";
import { useState } from "react";

import { RESERVED_KEEN_SLIDER_CLASSNAMES } from "@/components/organisms/PDP/ProductVariantCarousel/utils";
import ProductVintageNoteCard from "@/components/organisms/PDP/ProductVintageNoteCard";
import { ProductVintageJsonldShopProductVariantRead } from "@/networking/sylius-api-client/.ts.schemas";
import { isExtraLargeDesktop } from "@/styles/breakpoints";
import { useClientOnlyValue } from "@/utils/ClientOnly";
import { isValidNote } from "@/utils/productVintageNotesUtils";

import styles from "./ProductVintageNotes.module.scss";

export const ProductVintageNotes = ({
  productVintage,
}: {
  productVintage: ProductVintageJsonldShopProductVariantRead;
}): JSX.Element => {
  const notes = Object.entries(productVintage).filter(isValidNote);
  const clientIsExtraLargeDesktop = useClientOnlyValue(isExtraLargeDesktop, true);
  const slidesPerView = notes.length === 1 ? notes.length : !clientIsExtraLargeDesktop ? 2 : 4;
  const dotsCount = Math.ceil(notes.length / slidesPerView);
  const maxIndex = notes.length - slidesPerView;
  const indexes = Array.from(Array(dotsCount).keys()).map(idx =>
    Math.min(idx * slidesPerView, maxIndex),
  );

  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slides: {
      perView: slidesPerView,
      spacing: 15,
    },
    slideChanged: slider => setCurrentSlide(slider.track.details.rel),
  });

  if (notes.length === 0) return <></>;

  return (
    <div className={clsx(styles.container, { [styles.singleNote]: notes.length === 1 })}>
      <div
        ref={sliderRef}
        className={clsx(RESERVED_KEEN_SLIDER_CLASSNAMES["keen-slider"], styles.innerContainer, {
          [styles.singleNote]: notes.length === 1,
        })}
      >
        {notes.map(note => (
          <div
            key={note[0]}
            className={clsx(
              RESERVED_KEEN_SLIDER_CLASSNAMES["keen-slider__slide"],
              styles.noteContainer,
            )}
            style={{ minWidth: "0", maxWidth: "none" }}
          >
            <ProductVintageNoteCard note={note} />
          </div>
        ))}
      </div>
      <div className={styles.dots}>
        {indexes.map(idx => {
          return (
            <button
              key={idx}
              onClick={() => instanceRef.current?.moveToIdx(idx)}
              className={clsx(styles.dotContainer, { [styles.active]: currentSlide === idx })}
            >
              <div className={styles.dot} />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProductVintageNotes;
