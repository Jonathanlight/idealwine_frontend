import type { Content } from "@prismicio/client";
import { asLink } from "@prismicio/helpers";
import { PrismicNextImage } from "@prismicio/next";

import TranslatableLink from "@/components/atoms/TranslatableLink";

import styles from "./index.module.scss";

type StandardBannerProps = Content.BannerSlice;

const StandardBanner = ({ slice: { primary } }: { slice: StandardBannerProps }): JSX.Element => (
  <section className={styles.section}>
    <div className={styles.content}>
      <TranslatableLink
        className={styles.link}
        href={asLink(primary.imagelink) ?? "/"}
        dontTranslate={true}
      >
        <div className={styles.imageDiv}>
          <PrismicNextImage
            field={primary.image}
            fill
            className={styles.image}
            imgixParams={{ auto: ["format"] }}
          />
        </div>
        <p className={styles.text}>{primary.text}</p>
      </TranslatableLink>
    </div>
  </section>
);

export default StandardBanner;
