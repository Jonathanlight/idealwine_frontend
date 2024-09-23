import { useState } from "react";

import SellerBoardRow from "@/components/organisms/SellerBoard/SellerBoardRow";
import { ProductVariantSaleDTOJsonldShopProductVariantDtoSaleRead } from "@/networking/sylius-api-client/.ts.schemas";
import { useTranslation } from "@/utils/next-utils";

import LowerReserveBidDialog from "./LowerReserveBidDialog";
import styles from "./SellerBoard.module.scss";

type Props = {
  productVariants: ProductVariantSaleDTOJsonldShopProductVariantDtoSaleRead[];
  isHistorical?: boolean;
};

const SellerBoard = ({ productVariants, isHistorical }: Props): JSX.Element => {
  const { t } = useTranslation();

  const [openLowerReserveBidDialog, setOpenLowerReserveBidDialog] = useState(false);
  const [productVariantCodeToUpdate, setProductVariantCodeToUpdate] = useState("");

  const currentReserveBid = productVariants.find(
    productVariant => productVariant.code === productVariantCodeToUpdate,
  )?.reserveBid;

  return (
    <div className={styles.boardContainer}>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t("section-vendeur:description")}</th>
              <th>{t("section-vendeur:lotNumber")}</th>
              <th>{t("section-vendeur:reservePrice")}</th>
              <th>{t("section-vendeur:estimate")}</th>
              <th>{t("section-vendeur:numberSaleWatcher")}</th>
              <th>
                {isHistorical ? t("section-vendeur:finalPrice") : t("section-vendeur:actualPrice")}
              </th>
              <th>{t("section-vendeur:endDate")}</th>
              {isHistorical && <th>{t("section-vendeur:priceDrop")}</th>}
            </tr>
          </thead>
          <tbody>
            {productVariants.map((productVariant, index) => (
              <SellerBoardRow
                key={productVariant.code}
                isHistorical={isHistorical}
                setOpenLowerReserveBidDialog={setOpenLowerReserveBidDialog}
                setProductVariantCodeToUpdate={setProductVariantCodeToUpdate}
                productVariant={productVariant}
                index={index}
              />
            ))}
          </tbody>
        </table>
        <LowerReserveBidDialog
          open={openLowerReserveBidDialog}
          setOpen={setOpenLowerReserveBidDialog}
          initialReserveBid={currentReserveBid ?? undefined}
          productVariantCode={productVariantCodeToUpdate}
        />
      </div>
    </div>
  );
};

export default SellerBoard;
