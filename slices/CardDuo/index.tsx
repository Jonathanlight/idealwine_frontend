import type { Content } from "@prismicio/client";

import styles from "./CardDuo.module.scss";

type CardDuoProps = Content.OfferSlice;

const CardDuo = ({ slice: { primary } }: { slice: CardDuoProps }): JSX.Element => (
  <div className={styles.sliceContainer}>
    <div className={styles.offerContainer}>
      <h2 className={styles.title}>{primary.title1}</h2>
    </div>
    <div className={styles.offerContainer}>
      <h2 className={styles.title}>{primary.title2}</h2>
    </div>
  </div>
);

export default CardDuo;
