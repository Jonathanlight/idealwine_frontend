import Button from "@/components/atoms/Button";
import GoldenUnderlineTitle from "@/components/atoms/GoldenUnderlineTitle";
import TranslatableLink from "@/components/atoms/TranslatableLink";
import { ProductVariantJsonldShopProductVintageRatingInfoDtoRead } from "@/networking/sylius-api-client/.ts.schemas";
import { useTranslation } from "@/utils/next-utils";

import { LastAdjudicationsTable } from "./LastAdjudicationsTable/LastAdjudicationsTable";
import styles from "./LastAdjudicationsTableCard.module.scss";

export const LastAdjudicationsTableCard = ({
  lastAdjudications,
  productName,
  vintageYear,
}: {
  lastAdjudications: ProductVariantJsonldShopProductVintageRatingInfoDtoRead[];
  productName: string | undefined;
  vintageYear: number | string;
}): JSX.Element => {
  const { t } = useTranslation("prix-vin");

  return (
    <>
      <div className={styles.header}>
        <div className={styles.blockTitle}>
          {t("auctionHistory", { productName: productName ?? "", year: vintageYear })}{" "}
        </div>
        <GoldenUnderlineTitle />
      </div>
      <LastAdjudicationsTable lastAdjudications={lastAdjudications} vintageYear={vintageYear} />
      <TranslatableLink href="SELL_MY_WINES_URL" className={styles.buttonContainer}>
        <Button>{t("sellIt")}</Button>
      </TranslatableLink>
    </>
  );
};

export default LastAdjudicationsTableCard;
