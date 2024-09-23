import clsx from "clsx";
import Trans from "next-translate/Trans";
import { useMemo } from "react";

import Button from "@/components/atoms/Button";
import GoldenUnderlineTitle from "@/components/atoms/GoldenUnderlineTitle";
import { useAuthenticatedUserContext } from "@/context/AuthenticatedUserContext";
import { ProductVintageRatingInfoDTOJsonldShopProductVintageRatingInfoDtoRead } from "@/networking/sylius-api-client/.ts.schemas";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import CurrentRatingCard from "../CurrentRatingCard";
import LastAdjudicationsTableCard from "../LastAdjudicationsTableCard";
import VintageRatingsChart from "../VintageRatingsChart";
import styles from "./ProductRatingsInDetail.module.scss";

const ProductRatingsInDetail = ({
  productName,
  vintageYear,
  results,
}: {
  productName: string | undefined;
  vintageYear: string | number;
  results: ProductVintageRatingInfoDTOJsonldShopProductVintageRatingInfoDtoRead | undefined;
}) => {
  const { t } = useTranslation("prix-vin");
  const lastAdjudications = useMemo(
    () =>
      (results?.lastAdjudications ?? []).sort(
        (a, b) => Number(new Date(b.soldAt ?? 0)) - Number(new Date(a.soldAt ?? 0)),
      ),
    [results],
  );
  const { user, setIsLoginModalOpen } = useAuthenticatedUserContext();
  const userIsConnected = isNotNullNorUndefined(user);
  const handleConnect = () => {
    if (!userIsConnected) {
      setIsLoginModalOpen(true);
    }
  };

  return (
    <div className={styles.thirdGridContainer}>
      {!userIsConnected && (
        <div className={styles.loginPanel}>
          <Trans ns="prix-vin" i18nKey="loginPanel.title" components={{ br: <br /> }} />
          <Button variant="primaryGolden" onClick={handleConnect}>
            {t("loginPanel.button")}
          </Button>
        </div>
      )}
      <div className={clsx(styles.gridTitleContainer, !userIsConnected && styles.blur)}>
        <div id="ratingInDetails" className={styles.gridRowTitle}>
          {t("theRatingInDetailsOfTheWine")}{" "}
          <strong>
            {productName} {vintageYear}
          </strong>
        </div>
        <GoldenUnderlineTitle />
      </div>
      <div
        className={clsx(
          styles.vintageRatingsChartCardContainer,
          styles.whiteBoxWithShadow,
          !userIsConnected && styles.blur,
        )}
      >
        <VintageRatingsChart productVintageRatings={results?.productVintageRatings ?? []} />
        <div className={styles.vintageRatingsChartCardContainerSubTitle}>{t("subtitle")}</div>
      </div>
      <div
        className={clsx(
          styles.currentRatingGaugeChartCardContainer,
          styles.whiteBoxWithShadow,
          !userIsConnected && styles.blur,
        )}
      >
        <CurrentRatingCard
          results={results}
          vintageYear={vintageYear}
          lastAdjudications={lastAdjudications}
        />
      </div>
      <div
        className={clsx(
          styles.lastAdjudicationsTableCardContainer,
          styles.whiteBoxWithShadow,
          !userIsConnected && styles.blur,
        )}
      >
        <LastAdjudicationsTableCard
          lastAdjudications={lastAdjudications}
          productName={productName}
          vintageYear={vintageYear}
        />
      </div>
    </div>
  );
};
export default ProductRatingsInDetail;
