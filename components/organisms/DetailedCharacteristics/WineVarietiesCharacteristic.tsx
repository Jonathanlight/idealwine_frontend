import {
  ProductJsonldShopProductVariantRead,
  ProductJsonldShopProductVintageRatingInfoDtoRead,
  WineVarietyJsonldShopProductVariantReadName,
} from "@/networking/sylius-api-client/.ts.schemas";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import styles from "./DetailedCharacteristics.module.scss";

type Props = {
  product: ProductJsonldShopProductVariantRead | ProductJsonldShopProductVintageRatingInfoDtoRead;
  classNames?: {
    item?: string;
    characteristic?: string;
  };
};

type WineVariety = {
  name: WineVarietyJsonldShopProductVariantReadName;
  proportion: number;
};

const getWineVarietiesFromProduct = (
  product: ProductJsonldShopProductVariantRead | ProductJsonldShopProductVintageRatingInfoDtoRead,
): WineVariety[] | null => {
  const wineVarieties = product.wineVarieties ?? null;
  if (wineVarieties === null) {
    return null;
  }

  return wineVarieties
    .map(wineVariety => ({
      name: wineVariety.wineVariety?.name,
      proportion: wineVariety.proportion ?? 0,
    }))
    .filter(
      (wineVariety): wineVariety is WineVariety =>
        isNotNullNorUndefined(wineVariety) &&
        typeof wineVariety.name === "string" &&
        typeof wineVariety.proportion === "number",
    )
    .sort((varietyA, varietyB) => (varietyA.proportion < varietyB.proportion ? 1 : -1));
};

export const WineVarietiesCharacteristic = ({ product, classNames }: Props): JSX.Element | null => {
  const { t } = useTranslation();

  const wineVarieties = getWineVarietiesFromProduct(product);

  if (wineVarieties === null || wineVarieties.length === 0) {
    return null;
  }

  return (
    <div className={classNames?.item ?? styles.item}>
      <span className={classNames?.characteristic ?? styles.characteristic}>
        {t(`acheter-vin:detailedInformation.characteristics.wineVarieties`)}
      </span>{" "}
      {wineVarieties.length > 0
        ? wineVarieties
            .map<React.ReactNode>(({ name, proportion }) => (
              <span key={name}>
                {proportion !== 0 ? `${proportion}% ` : ""}
                {t(`enums:wineVarieties.${name}`)}
              </span>
            ))
            .reduce<React.ReactNode>(
              (acc, curr) => (acc === null ? [curr] : [acc, ", ", curr]),
              null,
            )
        : null}
    </div>
  );
};
