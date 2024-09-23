import { ProductVariantJsonldShopProductVariantRead } from "@/networking/sylius-api-client/.ts.schemas";
import { useTranslation } from "@/utils/next-utils";
import { lowerCaseFirstLetterIfNotAcronym } from "@/utils/stringUtils";

type Props = {
  productVariant: ProductVariantJsonldShopProductVariantRead;
  limit?: number;
  classNames?: {
    item?: string;
    characteristic?: string;
  };
};

export const RemarkCharacteristic = ({ productVariant }: Props): JSX.Element | null => {
  const { t } = useTranslation();

  if (productVariant.remark === null) {
    return null;
  }

  return (
    <span>
      {t(`acheter-vin:detailedInformation.characteristics.remark`)} :{" "}
      {typeof productVariant.remark === "string"
        ? lowerCaseFirstLetterIfNotAcronym(productVariant.remark)
        : null}
    </span>
  );
};
