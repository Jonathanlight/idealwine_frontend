import clsx from "clsx";
import DOMPurify from "isomorphic-dompurify";
import { ReactNode } from "react";

import Tabs from "@/components/molecules/Tabs/Tabs";
import SecondHandTabContent from "@/components/organisms/PDP/SecondHandTabContent";
import { getPeakAdviceTranslationKey } from "@/domain/peakAdviceTranslation";
import { getVariantTitle } from "@/domain/productVariant";
import { ProductVariantJsonldShopProductVariantRead } from "@/networking/sylius-api-client/.ts.schemas";
import { useTranslation } from "@/utils/next-utils";
import { lowerCaseFirstLetterIfNotAcronym } from "@/utils/stringUtils";

import styles from "./ProductVariantDescriptionTabs.module.scss";

type AdviceTabContentParams = {
  name: string | null;
  temperature: number | null;
  wineDishPairings: string[];
  sagaRating: number | null;
};

const getAdviceTabContentParams = (
  productVariant: ProductVariantJsonldShopProductVariantRead,
): AdviceTabContentParams | null => {
  const name = getVariantTitle(productVariant.product?.name, productVariant.additionalObservations);

  return {
    name: name ?? null,
    temperature: productVariant.product?.temperature ?? null,
    wineDishPairings: productVariant.product?.wineDishPairings ?? [],
    sagaRating: productVariant.sagaRating ?? null,
  };
};

export const ProductVariantDescriptionTabs = ({
  productVariant,
}: {
  productVariant: ProductVariantJsonldShopProductVariantRead;
}): JSX.Element => {
  const { t } = useTranslation();
  const adviceTabContentParams = getAdviceTabContentParams(productVariant);

  if (adviceTabContentParams === null) {
    return <></>;
  }

  const hasWineDishPairings = adviceTabContentParams.wineDishPairings.length > 0;

  const collection = productVariant.productVintage?.collection;
  const yearStart = productVariant.productVintage?.yearStart;
  const yearEnd = productVariant.productVintage?.yearEnd;

  const peakAdviceTranslationKey = getPeakAdviceTranslationKey(collection, yearStart, yearEnd);

  const VintageTabContent: ReactNode =
    productVariant.secondHand === false ? (
      <p
        className={styles.justifiedText}
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(productVariant.product?.description ?? ""),
        }}
      />
    ) : (
      <SecondHandTabContent productVariant={productVariant} />
    );

  const AdviceTabContent: ReactNode = (
    <div className={styles.justifiedText}>
      <p>
        {adviceTabContentParams.name !== null && adviceTabContentParams.temperature !== null && (
          <>
            <span className={styles.tabImportantText}>{adviceTabContentParams.name}</span>{" "}
            {t(`acheter-vin:tabs.advice.temperature`, {
              temperature: adviceTabContentParams.temperature,
            })}{" "}
          </>
        )}
        {hasWineDishPairings && (
          <>
            {t(`acheter-vin:tabs.advice.dishes`, {
              count: adviceTabContentParams.wineDishPairings.length,
            })}{" "}
            {adviceTabContentParams.wineDishPairings.join(", ")}.
          </>
        )}
      </p>
      {peakAdviceTranslationKey !== null && (
        <p>
          {t(`acheter-vin:detailedInformation.characteristics.peak`)} :{" "}
          <span className={styles.tabImportantText}>
            {lowerCaseFirstLetterIfNotAcronym(
              t(peakAdviceTranslationKey, { collection, yearStart, yearEnd }),
            )}
          </span>
        </p>
      )}
      {adviceTabContentParams.sagaRating !== null ? (
        <p className={styles.sagaRating}>
          {t(`acheter-vin:tabs.advice.sagaRating`)}{" "}
          <a href="#anchor" className={clsx(styles.tabImportantText, styles.link)}>
            {adviceTabContentParams.sagaRating}/20.
          </a>
        </p>
      ) : null}
    </div>
  );

  return (
    <Tabs
      label={t("acheter-vin:tabsLabel")}
      tabs={[
        {
          title:
            productVariant.secondHand === true
              ? t("acheter-vin:tabs.vintage.title.secondHand")
              : t("acheter-vin:tabs.vintage.title.new"),
          content: VintageTabContent,
          key: "description",
        },
        {
          title: t("acheter-vin:tabs.advice.title"),
          content: AdviceTabContent,
          key: "advice",
        },
      ]}
    />
  );
};

export default ProductVariantDescriptionTabs;
