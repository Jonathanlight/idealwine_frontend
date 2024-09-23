import { faArrowDownRight } from "@fortawesome/pro-light-svg-icons/faArrowDownRight";
import { faArrowUpRight } from "@fortawesome/pro-light-svg-icons/faArrowUpRight";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Trans from "next-translate/Trans";

import LinkButton from "@/components/atoms/Button/LinkButton";
import GoldenSeparator from "@/components/atoms/GoldenSeparator";
import { Size } from "@/components/atoms/GoldenSeparator/GoldenSeparator";
import TranslatableLink from "@/components/atoms/TranslatableLink";
import Price from "@/components/molecules/Price";
import VintageRatingsChart from "@/components/organisms/VintageRatingsChart";
import {
  ProductVariantJsonldShopProductVintageRatingInfoDtoRead,
  ProductVintageRatingReadModelJsonldShopProductVintageRatingInfoDtoRead,
} from "@/networking/sylius-api-client/.ts.schemas";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import styles from "./ProductVintageRatingBlock.module.scss";

type Props = {
  blockSubtitle: string;
  sellWineUrl: string;
  productVintageRatings: ProductVintageRatingReadModelJsonldShopProductVintageRatingInfoDtoRead[];
  lastAdjudications: ProductVariantJsonldShopProductVintageRatingInfoDtoRead[];
  pastYearMaxAdjudication: number | null;
  pastYearMinAdjudication: number | null;
};

export const ProductVintageRatingBlock = ({
  blockSubtitle,
  sellWineUrl,
  productVintageRatings,
  lastAdjudications,
  pastYearMaxAdjudication,
  pastYearMinAdjudication,
}: Props): JSX.Element => {
  const { t } = useTranslation("acheter-vin");
  const currentYearValue = productVintageRatings.at(-1)?.value;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t("ProductVintageRatingBlock.title")}</h2>
      <h3 className={styles.subtitle}>{blockSubtitle}</h3>
      <GoldenSeparator size={Size.small} />
      <div className={styles.gridContainer}>
        <div className={styles.leftColumnContainer}>
          <div className={styles.chartContainer}>
            <VintageRatingsChart productVintageRatings={productVintageRatings} />
          </div>
          <div>
            <div>
              <Trans
                ns="acheter-vin"
                i18nKey={"ProductVintageRatingBlock.chart.subtitle"}
                components={{ sup: <sup /> }}
              />
            </div>
            <div className={styles.vintageRatingsChartFormat}>
              {t("ProductVintageRatingBlock.chart.format")}
            </div>
          </div>
        </div>
        <div className={styles.rightColumnContainer}>
          <TranslatableLink dontTranslate className={styles.link} href={sellWineUrl}>
            <div className={styles.title}>
              <Trans
                ns="acheter-vin"
                i18nKey={"ProductVintageRatingBlock.text.title"}
                components={{ sup: <sup /> }}
              />
            </div>
            <div className={styles.subtitle}>{blockSubtitle}</div>
          </TranslatableLink>
          <GoldenSeparator size={Size.extraSmall} />
          <Price
            price={currentYearValue ?? 0}
            size="big"
            className={styles.mainPrice}
            dontDisplayCents
          />
          {pastYearMaxAdjudication !== null && (
            <ExtremumPrice highest price={pastYearMaxAdjudication} />
          )}
          {pastYearMinAdjudication !== null && (
            <ExtremumPrice highest={false} price={pastYearMinAdjudication} />
          )}
          <GoldenSeparator size={Size.extraSmall} />
          <div className={styles.latesstAdjudicationsTitle}>
            {t("ProductVintageRatingBlock.text.latestAdjudications")}
          </div>
          {lastAdjudications.map(adjudication => {
            if (
              !isNotNullNorUndefined(adjudication.soldAt) ||
              !isNotNullNorUndefined(adjudication.historicPrice)
            )
              return null;

            const date = new Date(adjudication.soldAt);
            const formattedDate = date.toLocaleDateString("fr");

            return (
              <div key={adjudication.id} className={styles.adjudication}>
                <div>{formattedDate}</div>
                <div>:</div>
                <Price price={adjudication.historicPrice} size="small" />
              </div>
            );
          })}
          <div className={styles.sameWineText}>{t("ProductVintageRatingBlock.text.sameWine")}</div>
          <LinkButton variant="secondaryBlack" href="SELL_MY_WINES_URL">
            {t("ProductVintageRatingBlock.text.sellButtonLabel")}
          </LinkButton>
        </div>
      </div>
    </div>
  );
};

const ExtremumPrice = ({ highest, price }: { highest: boolean; price: number }): JSX.Element => {
  return (
    <div className={styles.extremumPrice}>
      <FontAwesomeIcon icon={highest ? faArrowUpRight : faArrowDownRight} />
      <Price price={price} size="small" dontDisplayCents />
      <div>
        <Trans
          ns="acheter-vin"
          i18nKey={
            highest
              ? "ProductVintageRatingBlock.text.annualHighest"
              : "ProductVintageRatingBlock.text.annualLowest"
          }
          components={{ sup: <sup /> }}
        />
      </div>
    </div>
  );
};

export default ProductVintageRatingBlock;
