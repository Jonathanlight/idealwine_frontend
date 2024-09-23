import type { Content } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { PrismicRichText } from "@prismicio/react";
import { ImageField, RichTextField } from "@prismicio/types";
import clsx from "clsx";

import styles from "./index.module.scss";

type ReinsuranceBannerProps = Content.ReinsuranceBannerSlice;

type BlockProps = {
  image: ImageField;
  text: RichTextField;
  secondLineBlock?: boolean;
};

const BlockReinsurranceBanner = ({ image, text, secondLineBlock }: BlockProps) => {
  return (
    <div className={clsx(styles.bannerBlock, secondLineBlock && styles.secondLineBlocks)}>
      <div className={styles.imageDiv}>
        <PrismicNextImage
          field={image}
          width={38}
          height={38}
          className={styles.image}
          imgixParams={{ auto: ["format"] }}
        />
      </div>
      <div className={styles.text}>
        <PrismicRichText field={text} />
      </div>
    </div>
  );
};

const ReinsuranceBanner = ({
  slice: { primary },
}: {
  slice: ReinsuranceBannerProps;
}): JSX.Element => (
  <section className={styles.section}>
    <div className={styles.content}>
      <BlockReinsurranceBanner image={primary.icon1} text={primary.text1} />
      <BlockReinsurranceBanner image={primary.icon2} text={primary.text2} />
      <BlockReinsurranceBanner image={primary.icon3} text={primary.text3} />
      <BlockReinsurranceBanner image={primary.icon4} text={primary.text4} secondLineBlock={true} />
      <BlockReinsurranceBanner image={primary.icon5} text={primary.text5} secondLineBlock={true} />
    </div>
  </section>
);

export default ReinsuranceBanner;
