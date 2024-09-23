import { Translate } from "next-translate";

import { SecondHandCharacteristic } from "@/components/organisms/PDP/SecondHandCharacteristic/SecondHandCharacteristic";
import { ProductVariantJsonldShopProductVariantRead } from "@/networking/sylius-api-client/.ts.schemas";
import { isNonEmptyString } from "@/utils/ts-utils";

export type DetailedCharacteristic =
  | {
      getName: (
        productVariant?: ProductVariantJsonldShopProductVariantRead,
        t?: Translate,
      ) => string;
      getValue: (
        productVariant: ProductVariantJsonldShopProductVariantRead,
        t?: Translate,
      ) => string | null;
    }
  | {
      getComponent: (
        productVariant: ProductVariantJsonldShopProductVariantRead,
      ) => JSX.Element | null;
    };

export const getComponentFromCharacteristic = (
  characteristic: DetailedCharacteristic,
  productVariant: ProductVariantJsonldShopProductVariantRead,
  t: Translate,
): JSX.Element | null => {
  if ("getComponent" in characteristic) {
    return characteristic.getComponent(productVariant);
  }

  const name = characteristic.getName(productVariant, t);
  const value = characteristic.getValue(productVariant, t);

  if (isNonEmptyString(name) && isNonEmptyString(value)) {
    return <SecondHandCharacteristic name={name} value={value} />;
  }

  return null;
};
