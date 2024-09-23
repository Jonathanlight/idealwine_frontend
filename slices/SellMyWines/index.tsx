import { Content } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";

import Button from "@/components/atoms/Button";
import TranslatableLink from "@/components/atoms/TranslatableLink";

import styles from "./index.module.scss";

type SellMyWinesProps = Content.SellMyWinesSlice;

const Journal = ({ slice: { primary } }: { slice: SellMyWinesProps }) => {
  return (
    <section>
      <div className={styles.title}>
        <PrismicRichText field={primary.title} />
      </div>
      <PrismicRichText field={primary.description} />
      <div className={styles.button}>
        <Button variant="primaryBlack">
          <TranslatableLink href="SELL_MY_WINES_URL">
            <PrismicRichText field={primary.button} />
          </TranslatableLink>
        </Button>
      </div>
    </section>
  );
};

export default Journal;
