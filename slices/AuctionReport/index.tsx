import { Content } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";

import TranslatableLink from "@/components/atoms/TranslatableLink";

import styles from "./index.module.scss";

type ReportProps = Content.AuctionReportSlice;

const AuctionReport = ({ slice: { primary } }: { slice: ReportProps }) => {
  return (
    <section>
      <div className={styles.title}>
        <PrismicRichText field={primary.title} />
      </div>
      <PrismicRichText field={primary.descriptiontext} />
      <div className={styles.link}>
        <PrismicRichText field={primary.lastreport} />
      </div>
      <TranslatableLink href="AUCTION_REPORT_MONTHLY">
        <PrismicRichText field={primary.morereports} />
      </TranslatableLink>
    </section>
  );
};

export default AuctionReport;
