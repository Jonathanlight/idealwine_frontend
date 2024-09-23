import type { Content } from "@prismicio/client";
import { asLink } from "@prismicio/helpers";

import TranslatableLink from "@/components/atoms/TranslatableLink";

import styles from "./index.module.scss";

type HeroBlockProps = Content.HeroBlockSlice;

const HeroBlock = ({ slice: { primary } }: { slice: HeroBlockProps }): JSX.Element => (
  <section className={styles.heroblockSection}>
    <div className={styles.content}>
      <h4 className={styles.mainTitle}>{primary.mainTitle}</h4>
      <p className={styles.subtitle}>{primary.subtitle}</p>
      <TranslatableLink
        dontTranslate={true}
        className={styles.button}
        href={asLink(primary.button_link) ?? "/"}
      >
        <button>{primary.buttonText}</button>
      </TranslatableLink>
    </div>
  </section>
);

export default HeroBlock;
