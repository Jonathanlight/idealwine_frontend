import React from "react";

import Price from "@/components/molecules/Price";
import { ProductVariantJsonldShopProductVintageRatingInfoDtoRead } from "@/networking/sylius-api-client/.ts.schemas";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import styles from "./LastAdjudicationsTable.module.scss";

export const LastAdjudicationsTable = ({
  lastAdjudications,
  vintageYear,
}: {
  lastAdjudications: ProductVariantJsonldShopProductVintageRatingInfoDtoRead[];
  vintageYear: number | string;
}): JSX.Element => {
  const { t } = useTranslation("prix-vin");

  return (
    <>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <tbody>
            {lastAdjudications.map(({ id, soldAt, historicPrice }) => {
              return (
                <tr key={id}>
                  <td>
                    {isNotNullNorUndefined(soldAt) ? new Date(soldAt).toLocaleDateString("fr") : ""}
                  </td>
                  <td>
                    <Price price={historicPrice ?? 0} size="small" dontDisplayCents />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className={styles.text}>{t("doYouHaveOneToSell", { year: vintageYear })}</p>
    </>
  );
};

export default LastAdjudicationsTable;
