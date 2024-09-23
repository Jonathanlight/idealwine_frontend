import { BiologicProfileCharacteristic } from "@/components/organisms/DetailedCharacteristics/BiologicProfileCharacteristic";
import { LevelsCharacteristic } from "@/components/organisms/DetailedCharacteristics/LevelsCharacteristic";
import { ObservationsCharacteristic } from "@/components/organisms/DetailedCharacteristics/ObservationsCharacteristic";
import { QuantityCharacteristic } from "@/components/organisms/DetailedCharacteristics/QuantityCharacteristic";
import { WineVarietiesCharacteristic } from "@/components/organisms/DetailedCharacteristics/WineVarietiesCharacteristic";
import { getPeakAdviceTranslationKey } from "@/domain/peakAdviceTranslation";
import { getVariantAlcoolProportion } from "@/domain/productVariant";
import { ProductVariantJsonldShopProductVariantRead } from "@/networking/sylius-api-client/.ts.schemas";
import { useTranslation } from "@/utils/next-utils";
import { lowerCaseFirstLetterIfNotAcronym } from "@/utils/stringUtils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import { DefaultCharacteristic } from "../../DetailedCharacteristics/DefaultCharacteristic";
import styles from "./ProductVariantDetailedCharacteristics.module.scss";

export const ProductVariantDetailedCharacteristics = ({
  productVariant,
}: {
  productVariant: ProductVariantJsonldShopProductVariantRead;
}): JSX.Element => {
  const { t } = useTranslation();

  const alcoolProportion = getVariantAlcoolProportion(productVariant);

  const collection = productVariant.productVintage?.collection;
  const yearStart = productVariant.productVintage?.yearStart;
  const yearEnd = productVariant.productVintage?.yearEnd;
  const product = productVariant.product;
  const peakAdviceTranslationKey = getPeakAdviceTranslationKey(collection, yearStart, yearEnd);

  const countryName = productVariant.product?.region?.country?.name;
  const regionName = productVariant.product?.region?.name;
  const regionFormated =
    isNotNullNorUndefined(countryName) && isNotNullNorUndefined(regionName)
      ? countryName !== "FRANCE"
        ? `${t(`enums:country.${String(countryName)}`)} - ${t(`enums:region.${regionName}`)}`
        : t(`enums:region.${regionName}`)
      : isNotNullNorUndefined(regionName)
      ? t(`enums:region.${regionName}`)
      : null;

  const productionValue =
    typeof productVariant.product?.production === "number" &&
    productVariant.product.production > 0 &&
    typeof productVariant.product.productionUnit === "string"
      ? t(`acheter-vin:enum.productionUnit.${productVariant.product.productionUnit}`, {
          count: productVariant.product.production,
        })
      : null;

  const isVATRecoverableTranslationKey =
    typeof productVariant.VATRecoverable === "boolean"
      ? lowerCaseFirstLetterIfNotAcronym(t(`enums:boolean.${productVariant.VATRecoverable}`))
      : null;

  return (
    <div className={styles.container}>
      <QuantityCharacteristic productVariant={productVariant} />
      <LevelsCharacteristic productVariant={productVariant} />
      <ObservationsCharacteristic productVariant={productVariant} />
      <DefaultCharacteristic
        name={t(`acheter-vin:detailedInformation.characteristics.origin`)}
        value={
          typeof productVariant.origin === "string"
            ? lowerCaseFirstLetterIfNotAcronym(
                t(`acheter-vin:enum.origin.${productVariant.origin}`),
              )
            : null
        }
      />
      <DefaultCharacteristic
        name={t(`acheter-vin:detailedInformation.characteristics.storageType`)}
        value={
          typeof productVariant.storageType === "string"
            ? lowerCaseFirstLetterIfNotAcronym(
                t(`acheter-vin:enum.storageType.${productVariant.storageType}`),
              )
            : null
        }
      />
      <DefaultCharacteristic
        name={t(`acheter-vin:detailedInformation.characteristics.VATRecoverable`)}
        value={isVATRecoverableTranslationKey}
      />
      <DefaultCharacteristic
        name={t(`acheter-vin:detailedInformation.characteristics.hasOriginalWoodenCrate`)}
        value={
          productVariant.hasOriginalWoodenCrate === true
            ? lowerCaseFirstLetterIfNotAcronym(t(`enums:boolean.true`))
            : lowerCaseFirstLetterIfNotAcronym(t(`enums:boolean.false`))
        }
      />
      <DefaultCharacteristic
        name={t(`acheter-vin:detailedInformation.characteristics.CRD`)}
        value={
          productVariant.CRD === true
            ? lowerCaseFirstLetterIfNotAcronym(t(`enums:boolean.true`))
            : lowerCaseFirstLetterIfNotAcronym(t(`enums:boolean.false`))
        }
      />
      <DefaultCharacteristic
        name={t(`acheter-vin:detailedInformation.characteristics.alcoolProportion`)}
        value={
          typeof alcoolProportion === "number" && alcoolProportion > 0
            ? `${alcoolProportion} %`
            : null
        }
      />
      <DefaultCharacteristic
        name={t(`acheter-vin:detailedInformation.characteristics.region`)}
        value={regionFormated}
      />
      <DefaultCharacteristic
        name={t(`acheter-vin:detailedInformation.characteristics.appellation`)}
        value={productVariant.product?.appellation ?? null}
      />
      <DefaultCharacteristic
        name={t(`acheter-vin:detailedInformation.characteristics.classification`)}
        value={
          typeof productVariant.product?.classification === "string"
            ? t(`acheter-vin:enum.classification.${productVariant.product.classification}`)
            : null
        }
      />
      <DefaultCharacteristic
        name={t(`acheter-vin:detailedInformation.characteristics.owner`)}
        value={productVariant.product?.owner ?? null}
      />
      <DefaultCharacteristic
        name={t(`acheter-vin:detailedInformation.characteristics.vintage`)}
        value={productVariant.productVintage?.year?.toString() ?? null}
      />
      <DefaultCharacteristic
        name={t(`acheter-vin:detailedInformation.characteristics.color`)}
        value={
          typeof productVariant.product?.color === "string"
            ? lowerCaseFirstLetterIfNotAcronym(t(`enums:color.${productVariant.product.color}`))
            : null
        }
      />
      <DefaultCharacteristic
        name={t(`acheter-vin:detailedInformation.characteristics.peak`)}
        value={
          peakAdviceTranslationKey !== null
            ? lowerCaseFirstLetterIfNotAcronym(
                t(peakAdviceTranslationKey, { collection, yearStart, yearEnd }),
              )
            : null
        }
      />
      <DefaultCharacteristic
        name={t(`acheter-vin:detailedInformation.characteristics.temperature`)}
        value={
          typeof productVariant.product?.temperature === "number" &&
          productVariant.product.temperature > 0
            ? `${productVariant.product.temperature}°`
            : null
        }
      />
      {isNotNullNorUndefined(product) && <BiologicProfileCharacteristic product={product} />}
      <DefaultCharacteristic
        name={t(`acheter-vin:detailedInformation.characteristics.surface`)}
        value={
          typeof productVariant.product?.surface === "number" && productVariant.product.surface > 0
            ? t(`acheter-vin:detailedInformation.characteristics.values.surface`, {
                count: productVariant.product.surface,
              })
            : null
        }
      />
      <DefaultCharacteristic
        name={t(`acheter-vin:detailedInformation.characteristics.yield`)}
        value={productionValue}
      />
      {isNotNullNorUndefined(productVariant.product?.intensity) && (
        <DefaultCharacteristic
          name={t(`acheter-vin:detailedInformation.characteristics.intensity`)}
          value={
            typeof productVariant.product?.intensity === "string"
              ? lowerCaseFirstLetterIfNotAcronym(
                  t(`enums:intensity.${productVariant.product.intensity}`),
                )
              : null
          }
        />
      )}
      <DefaultCharacteristic
        name={t(`acheter-vin:detailedInformation.characteristics.dominantAroma`)}
        value={
          typeof productVariant.product?.dominantAroma === "string"
            ? lowerCaseFirstLetterIfNotAcronym(
                t(`enums:dominantAroma.${productVariant.product.dominantAroma}`),
              )
            : null
        }
      />
      <DefaultCharacteristic
        name={t(`acheter-vin:detailedInformation.characteristics.tastingOccasion`)}
        value={
          typeof productVariant.product?.tastingOccasion === "string"
            ? lowerCaseFirstLetterIfNotAcronym(
                t(`enums:tastingOccasion.${productVariant.product.tastingOccasion}`),
              )
            : null
        }
      />
      <DefaultCharacteristic
        name={t(`acheter-vin:detailedInformation.characteristics.remark`)}
        value={
          typeof productVariant.remark === "string"
            ? lowerCaseFirstLetterIfNotAcronym(productVariant.remark)
            : null
        }
      />
      <DefaultCharacteristic
        name={t(`acheter-vin:detailedInformation.characteristics.disgorgementYear`)}
        value={productVariant.disgorgementYear?.toString() ?? null}
      />
      {isNotNullNorUndefined(product) && <WineVarietiesCharacteristic product={product} />}
    </div>
  );
};

export default ProductVariantDetailedCharacteristics;
