import SimilarWinesButton from "@/components/molecules/SimilarWinesButton";
import { useSimilarProductVariantsUrl } from "@/components/molecules/SimilarWinesButton/SimilarWinesButton";
import {
  AuctionItemDTOJsonldShopAuctionItemDtoRead,
  ProductVariantJsonldShopProductVariantRead,
} from "@/networking/sylius-api-client/.ts.schemas";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import styles from "./AuctionPrice.module.scss";

interface Props {
  productVariant: ProductVariantJsonldShopProductVariantRead;
  auctionItem: AuctionItemDTOJsonldShopAuctionItemDtoRead;
}

export const FinishedAuctionSection = ({ productVariant, auctionItem }: Props) => {
  const { t } = useTranslation();
  const url = useSimilarProductVariantsUrl(
    productVariant.product?.region?.name,
    productVariant.product?.appellation,
    productVariant.product?.owner,
  );

  return (
    <>
      {isNotNullNorUndefined(auctionItem.highestBid) && (
        <span className={styles.mobileSold}>{t("acheter-vin:sold")}</span>
      )}
      {url !== null && (
        <SimilarWinesButton
          text={t("acheter-vin:identicalWinesOnSale")}
          className={styles.auctionButton}
          url={url}
        />
      )}
    </>
  );
};
