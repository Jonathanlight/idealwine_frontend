import { PrismicNextImage } from "@prismicio/next";
import { PrismicRichText } from "@prismicio/react";

import {
  PlpbioDocument,
  PlpcepageDocument,
  PlpcountryDocument,
  PlpquintessenceDocument,
  PlpregionDocument,
  PlptagDocument,
} from "@/.slicemachine/prismicio";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import styles from "./TopBannerPrismic.module.scss";

interface Props {
  document:
    | PlpregionDocument
    | PlpcountryDocument
    | PlpcepageDocument
    | PlptagDocument
    | PlpbioDocument
    | PlpquintessenceDocument;
}

const TopBannerPrismic = ({ document }: Props) => {
  return (
    <article
      className={styles.content}
      style={{
        color: document.data.top_block_text_color ?? styles.black,
      }}
    >
      <div
        className={styles.background}
        style={{
          backgroundColor: !document.data.is_top_background_image_or_color
            ? document.data.top_block_background_color ?? styles.white
            : "",
          backgroundImage: document.data.is_top_background_image_or_color
            ? `url(${document.data.top_block_background_image.url ?? ""})`
            : "none",
        }}
      ></div>
      <div className={styles.imageDiv}>
        {isNotNullNorUndefined(document.data.top_block_left_image.url) && (
          <PrismicNextImage
            field={document.data.top_block_left_image}
            fill
            imgixParams={{ auto: ["format"] }}
          />
        )}
      </div>
      <div className={styles.writtenContent}>
        <h2 className={styles.title}>{document.data.toptitle}</h2>
        <PrismicRichText field={document.data.top_block_description} />
      </div>
    </article>
  );
};

export default TopBannerPrismic;
