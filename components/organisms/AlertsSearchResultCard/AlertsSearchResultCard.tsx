import CustomColorCircleIcon from "@/components/atoms/CustomColorCircleIcon";
import { ProductJsonldShopProductRead } from "@/networking/sylius-api-client/.ts.schemas";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import styles from "./AlertsSearchResultCard.module.scss";

type AlertsSearchResultCardProps = {
  product: ProductJsonldShopProductRead;
  setOpen: (open: boolean) => void;
  setSelectedProduct: (product: ProductJsonldShopProductRead) => void;
};
export const AlertsSearchResultCard = ({
  product,
  setOpen,
  setSelectedProduct,
}: AlertsSearchResultCardProps) => {
  const { t } = useTranslation("enums");
  const onClickAlert = () => {
    setSelectedProduct(product);
    setOpen(true);
  };
  const productName = isNotNullNorUndefined(product.name) ? product.name : "";
  const productColorCase = product.color;
  const productColor =
    typeof productColorCase === "string" ? ` (${t(`enums:color.${productColorCase}`)})` : "";

  const appelationIfBordeaux = isNotNullNorUndefined(product.appelationIfBordeaux)
    ? ` ${product.appelationIfBordeaux}`
    : "";

  return (
    <div className={styles.card}>
      <button className={styles.productContainer} onClick={onClickAlert}>
        <CustomColorCircleIcon colorVariant={product.color} />
        <span
          className={styles.wineName}
        >{`${productName}${appelationIfBordeaux}${productColor}`}</span>
      </button>
    </div>
  );
};
