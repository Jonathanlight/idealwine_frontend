import Image from "next/image";

import Button from "@/components/atoms/Button";
import PdpLink from "@/components/molecules/PdpLink";
import Price from "@/components/molecules/Price";
import { getVariantFullTitle } from "@/domain/productVariant";
import {
  ProductVariantSaleDTOJsonldShopProductVariantDtoSaleRead,
  ProductVariantSaleDTOJsonldShopProductVariantDtoSaleReadStatus as Status,
} from "@/networking/sylius-api-client/.ts.schemas";
import { getFormatDate } from "@/utils/datesHandler";
import { useTranslation } from "@/utils/next-utils";
import { isNotBlank, isNotNullNorUndefined } from "@/utils/ts-utils";

import styles from "./SellerBoard.module.scss";

type Props = {
  isHistorical?: boolean;
  setOpenLowerReserveBidDialog: (value: boolean) => void;
  setProductVariantCodeToUpdate: (value: string) => void;
  productVariant: ProductVariantSaleDTOJsonldShopProductVariantDtoSaleRead;
  index: number;
};

const SellerBoardRow = ({
  isHistorical,
  setOpenLowerReserveBidDialog,
  setProductVariantCodeToUpdate,
  productVariant,
  index,
}: Props) => {
  const { t, lang } = useTranslation();

  const format = typeof productVariant.format === "string" ? productVariant.format : "INCONNU";

  const numberOfBottlesWithFormat = t(`common:enum.format.${format}`, {
    count: productVariant.numberOfBottle,
  });

  const description = getVariantFullTitle(
    numberOfBottlesWithFormat,
    productVariant.fullName,
    productVariant.additionalObservations,
    productVariant.productVintageYear,
  );

  const emptyPrice = isHistorical
    ? t("section-vendeur:notSold")
    : t("section-vendeur:noOngoingBid");

  const toSell = productVariant.status === Status.TO_SELL;

  return (
    <tr key={index}>
      <td className={styles.descriptionAndMiniature}>
        <Image
          unoptimized
          className={styles.imageMiniature}
          src={
            isNotBlank(productVariant.productVariantImage)
              ? productVariant.productVariantImage
              : `/_no_picture_${lang}.jpg`
          }
          alt={productVariant.fullName ?? ""}
          width={80}
          height={80}
        />
        <PdpLink variant={productVariant}>{description}</PdpLink>
      </td>
      <td>{productVariant.id}</td>
      {/* Price is in cents, we want it in € */}
      <td>
        <Price size="small" price={productVariant.reserveBid ?? 0} doNotConvertPrice />
      </td>
      <td>
        <Price size="small" price={productVariant.averageEstimate ?? 0} doNotConvertPrice />
      </td>
      <td>{productVariant.numberSaleWatcher ?? 0}</td>
      <td>
        {isNotNullNorUndefined(productVariant.currentPrice) ? (
          <Price size="small" price={productVariant.currentPrice} doNotConvertPrice />
        ) : (
          emptyPrice
        )}
      </td>
      <td>{getFormatDate(productVariant.auctionCatalogEndDate, "fr")}</td>
      {isHistorical && (
        <td>
          <Button
            onClick={() => {
              setProductVariantCodeToUpdate(productVariant.code ?? "");
              setOpenLowerReserveBidDialog(true);
            }}
            disabled={!toSell}
          >
            {t("section-vendeur:lowerReserveBid")}
          </Button>
        </td>
      )}
    </tr>
  );
};

export default SellerBoardRow;
