import Image from "next/image";

import PdpLink from "@/components/molecules/PdpLink";
import Price from "@/components/molecules/Price";
import StockHistoricalFilter from "@/components/molecules/StockHistoricalFilter/StockHistoricalFilter";
import { getVariantFullTitle } from "@/domain/productVariant";
import { StoredItemDTOJsonldShopCustomerProductVariantRead } from "@/networking/sylius-api-client/.ts.schemas";
import { getFormatDateWithoutTime } from "@/utils/datesHandler";
import { useTranslation } from "@/utils/next-utils";
import { isNotBlank, isNotNullNorUndefined } from "@/utils/ts-utils";

import { ProductVariantStatus } from "../ProductVariantsInStock/types";
import styles from "./StockHistoricalBoard.module.scss";

type Props = {
  storedItems: StoredItemDTOJsonldShopCustomerProductVariantRead[];
  setStatus?: (status: ProductVariantStatus[]) => void;
  status: ProductVariantStatus[];
};

const StockHistoricalBoard = ({ storedItems, setStatus, status }: Props): JSX.Element => {
  const { t, lang } = useTranslation("lots-en-stock");

  const getShortCode = (code: string): string => {
    const uuidRegex = /([a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12})/;
    if (uuidRegex.test(code)) {
      return code.split("-")[0].toUpperCase();
    }

    return code;
  };

  return (
    <div className={styles.boardContainer}>
      <StockHistoricalFilter setStatus={setStatus} status={status} />

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t("numLot")}</th>
              <th>{t("description")}</th>
              <th>{t("quantity")}</th>
              <th>{t("purchasePrice")}</th>
              <th>{t("storageStartDate")}</th>
              <th>{t("storageEndDate")}</th>
              <th>{t("status")}</th>
            </tr>
          </thead>
          <tbody>
            {storedItems.map((storedItem: StoredItemDTOJsonldShopCustomerProductVariantRead) => {
              const numberOfBottlesWithFormat = t(`common:enum.format.${storedItem.format ?? ""}`, {
                count: storedItem.numberOfBottles,
              });
              const description = getVariantFullTitle(
                numberOfBottlesWithFormat,
                storedItem.fullName,
                storedItem.additionalObservations,
              );

              return (
                <tr key={storedItem.id}>
                  <td>
                    {isNotNullNorUndefined(storedItem.code) ? getShortCode(storedItem.code) : "-"}
                  </td>
                  <td className={styles.descriptionAndMiniature}>
                    <Image
                      unoptimized
                      className={styles.imageMiniature}
                      src={
                        isNotBlank(storedItem.productVariantImage)
                          ? storedItem.productVariantImage
                          : `/_no_picture_${lang}.jpg`
                      }
                      alt={storedItem.fullName ?? ""}
                      width={80}
                      height={80}
                    />
                    {storedItem.hasProductDetailPage === true ? (
                      <PdpLink variant={storedItem}>{description}</PdpLink>
                    ) : (
                      <p>{description}</p>
                    )}
                  </td>
                  <td>{storedItem.quantity}</td>
                  {/* Price is in cents, we want it in € */}
                  <td>
                    {isNotNullNorUndefined(storedItem.replacementAmount) &&
                    storedItem.replacementAmount !== 0 ? (
                      <Price size="small" price={storedItem.replacementAmount} />
                    ) : (
                      isNotNullNorUndefined(storedItem.purchasePrice) && (
                        <Price size="small" price={storedItem.purchasePrice} />
                      )
                    )}
                  </td>
                  <td>{getFormatDateWithoutTime(storedItem.storageStartDate, "fr")}</td>
                  <td>{getFormatDateWithoutTime(storedItem.storageEndDate, "fr")}</td>
                  <td>{t(`productStatus.${storedItem.stockSaleStatus}`)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockHistoricalBoard;
