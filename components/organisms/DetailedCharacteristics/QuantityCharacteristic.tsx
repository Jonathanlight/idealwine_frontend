import { DefaultCharacteristic } from "@/components/organisms/DetailedCharacteristics/DefaultCharacteristic";
import { ProductVariantJsonldShopProductVariantRead } from "@/networking/sylius-api-client/.ts.schemas";
import { useTranslation } from "@/utils/next-utils";

export const QuantityCharacteristic = ({
  productVariant,
}: {
  productVariant: ProductVariantJsonldShopProductVariantRead;
}): JSX.Element => {
  const { t } = useTranslation();

  return (
    <DefaultCharacteristic
      name={t("acheter-vin:detailedInformation.characteristics.quantity")}
      value={
        typeof productVariant.numberOfBottles === "number" &&
        typeof productVariant.format === "string"
          ? t(`common:enum.format.${productVariant.format}`, {
              count: productVariant.numberOfBottles,
            })
          : null
      }
    />
  );
};
