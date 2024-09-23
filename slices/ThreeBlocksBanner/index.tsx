import type { Content } from "@prismicio/client";
import { asLink } from "@prismicio/helpers";
import { PrismicNextImage } from "@prismicio/next";

import TranslatableLink from "@/components/atoms/TranslatableLink";

import styles from "./index.module.scss";

type ThreeBlocksBannerProps = Content.ThreeBlocksBannerSlice;

const ThreeBlocksBanner = ({
  slice: { primary },
}: {
  slice: ThreeBlocksBannerProps;
}): JSX.Element => (
  <section className={styles.content}>
    <p className={styles.title}>{primary.title}</p>
    <div className={styles.banner}>
      <div className={styles.imageDiv}>
        <TranslatableLink href={asLink(primary.linkimage1) ?? "/"} dontTranslate={true}>
          <PrismicNextImage
            field={primary.image1}
            fill
            className={styles.image}
            imgixParams={{ auto: ["format"] }}
          />
        </TranslatableLink>
      </div>
      <div className={styles.imageDiv}>
        <TranslatableLink href={asLink(primary.linkimage2) ?? "/"} dontTranslate={true}>
          <PrismicNextImage
            field={primary.image2}
            fill
            className={styles.image}
            imgixParams={{ auto: ["format"] }}
          />
        </TranslatableLink>
      </div>
      <div className={styles.imageDiv}>
        <TranslatableLink href={asLink(primary.linkimage3) ?? "/"} dontTranslate={true}>
          <PrismicNextImage
            field={primary.image3}
            fill
            className={styles.image}
            imgixParams={{ auto: ["format"] }}
          />
        </TranslatableLink>
      </div>
    </div>
  </section>
);

export default ThreeBlocksBanner;
