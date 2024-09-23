import type { Content } from "@prismicio/client";
import { asLink } from "@prismicio/helpers";
import { PrismicNextImage } from "@prismicio/next";
import { PrismicRichText } from "@prismicio/react";

import TranslatableLink from "@/components/atoms/TranslatableLink";

import styles from "./index.module.scss";
type BannerAllOurWinesDesktopProps = Content.BannerAllOurWinesDesktopSlice;

const BannerAllOurWinesDesktop = ({
  slice: { primary },
}: {
  slice: BannerAllOurWinesDesktopProps;
}): JSX.Element => {
  return (
    <section className={styles.section}>
      <div className={styles.content}>
        <div className={styles.imageDiv}>
          <PrismicNextImage
            field={primary.image}
            fill
            className={styles.image}
            imgixParams={{ auto: ["format"] }}
          />
        </div>
        <div className={styles.textContent}>
          <div className={styles.text}>
            <PrismicRichText field={primary.text} />
          </div>
          <TranslatableLink
            className={styles.decorationNoneHover}
            href={asLink(primary.linkbutton) ?? "/"}
            dontTranslate={true}
          >
            <button className={styles.button}>{primary.textbutton}</button>
          </TranslatableLink>
        </div>
      </div>
    </section>
  );
};

export default BannerAllOurWinesDesktop;
