import { PrismicRichText } from "@prismicio/react";

import {
  PlpbioDocument,
  PlpcepageDocument,
  PlpcountryDocument,
  PlpquintessenceDocument,
  PlpregionDocument,
  PlptagDocument,
} from "@/.slicemachine/prismicio";

import styles from "./MiddleBannerPrismic.module.scss";

interface Props {
  document:
    | PlpregionDocument
    | PlpcountryDocument
    | PlpcepageDocument
    | PlptagDocument
    | PlpbioDocument
    | PlpquintessenceDocument;
}

const MiddleBannerPrismic = ({ document }: Props) => {
  return (
    <article className={styles.content}>
      <div className={styles.writtenContent}>
        <h3 className={styles.title}>{document.data.middle_block_title}</h3>
        <PrismicRichText
          field={document.data.middle_block_description}
          components={{
            paragraph: ({ children }) => <p className={styles.paragraph}>{children}</p>,
          }}
        />
      </div>
    </article>
  );
};

export default MiddleBannerPrismic;
