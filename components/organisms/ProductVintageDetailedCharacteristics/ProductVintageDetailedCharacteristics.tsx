import { BiologicProfileCharacteristic } from "@/components/organisms/DetailedCharacteristics/BiologicProfileCharacteristic";
import { WineVarietiesCharacteristic } from "@/components/organisms/DetailedCharacteristics/WineVarietiesCharacteristic";
import { ProductJsonldShopProductVintageRatingInfoDtoRead } from "@/networking/sylius-api-client/.ts.schemas";
import { useTranslation } from "@/utils/next-utils";
import { lowerCaseFirstLetterIfNotAcronym } from "@/utils/stringUtils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import { DefaultCharacteristic } from "../DetailedCharacteristics/DefaultCharacteristic";
import { WineDishPairingsCharacteristic } from "../DetailedCharacteristics/WineDishPairingsCharacteristic";
import styles from "./ProductVintageDetailedCharacteristics.module.scss";

export const ProductVintageDetailedCharacteristics = ({
  product,
}: {
  product: ProductJsonldShopProductVintageRatingInfoDtoRead;
}): JSX.Element => {
  const { t } = useTranslation();
  const countryName = product.region?.country?.name;
  const regionName = product.region?.name;
  const regionFormated =
    isNotNullNorUndefined(countryName) && isNotNullNorUndefined(regionName)
      ? countryName !== "FRANCE"
        ? `${t(`enums:country.${String(countryName)}`)} - ${t(`enums:region.${regionName}`)}`
        : t(`enums:region.${regionName}`)
      : isNotNullNorUndefined(regionName)
      ? t(`enums:region.${regionName}`)
      : null;

  const productionUnit = product.productionUnit ?? "UNKNOWN";
  const productionValue =
    typeof product.production === "number" && product.production > 0
      ? t(`acheter-vin:enum.productionUnit.${productionUnit}`, {
          count: product.production,
        })
      : null;

  return (
    <div className={styles.container}>
      <div>
        <DefaultCharacteristic
          name={t(`acheter-vin:detailedInformation.characteristics.region`)}
          value={regionFormated}
        />
        <DefaultCharacteristic
          name={t(`acheter-vin:detailedInformation.characteristics.estate`)}
          value={product.estate?.name ?? null}
        />
        <DefaultCharacteristic
          name={t(`acheter-vin:detailedInformation.characteristics.color`)}
          value={
            typeof product.color === "string"
              ? lowerCaseFirstLetterIfNotAcronym(t(`enums:color.${product.color}`))
              : null
          }
        />
        <DefaultCharacteristic
          name={t(`acheter-vin:detailedInformation.characteristics.yield`)}
          value={productionValue}
        />
        <WineVarietiesCharacteristic product={product} />
        <WineDishPairingsCharacteristic product={product} />
      </div>
      <div>
        <DefaultCharacteristic
          name={t(`acheter-vin:detailedInformation.characteristics.appellation`)}
          value={product.appellation ?? null}
        />
        <DefaultCharacteristic
          name={t(`acheter-vin:detailedInformation.characteristics.classification`)}
          value={
            typeof product.classification === "string"
              ? t(`acheter-vin:enum.classification.${product.classification}`)
              : null
          }
        />
        <DefaultCharacteristic
          name={t(`acheter-vin:detailedInformation.characteristics.owner`)}
          value={product.owner ?? null}
        />
        <DefaultCharacteristic
          name={t(`acheter-vin:detailedInformation.characteristics.surface`)}
          value={
            typeof product.surface === "number" && product.surface > 0
              ? t(`acheter-vin:detailedInformation.characteristics.values.surface`, {
                  count: product.surface,
                })
              : null
          }
        />
        <BiologicProfileCharacteristic product={product} />
        <DefaultCharacteristic
          name={t(`acheter-vin:detailedInformation.characteristics.temperature`)}
          value={typeof product.temperature === "number" ? `${product.temperature}°` : null}
        />
      </div>
    </div>
  );
};

export default ProductVintageDetailedCharacteristics;
