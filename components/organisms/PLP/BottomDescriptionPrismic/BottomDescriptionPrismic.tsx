import { PrismicRichText } from "@prismicio/react";

import {
  PlpbioDocument,
  PlpcepageDocument,
  PlpcountryDocument,
  PlpquintessenceDocument,
  PlpregionDocument,
  PlptagDocument,
} from "@/.slicemachine/prismicio";

import styles from "./BottomDescriptionPrismic.module.scss";

interface Props {
  document:
    | PlpregionDocument
    | PlpcountryDocument
    | PlpcepageDocument
    | PlptagDocument
    | PlpbioDocument
    | PlpquintessenceDocument;
}

const BottomDescriptionPrismic = ({ document }: Props) => {
  return (
    <article className={styles.content}>
      <PrismicRichText
        field={document.data.bottom_block_description}
        components={{
          paragraph: ({ children }) => <p className={styles.paragraph}>{children}</p>,
        }}
      />
    </article>
  );
};

export default BottomDescriptionPrismic;
