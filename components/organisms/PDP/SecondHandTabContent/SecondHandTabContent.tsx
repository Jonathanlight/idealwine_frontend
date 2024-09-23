import { Fragment } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { LevelsCharacteristic } from "@/components/organisms/DetailedCharacteristics/LevelsCharacteristic";
import { ObservationsCharacteristic } from "@/components/organisms/DetailedCharacteristics/ObservationsCharacteristic";
import { RemarkCharacteristic } from "@/components/organisms/DetailedCharacteristics/RemarkCharacteristic";
import {
  DetailedCharacteristic,
  getComponentFromCharacteristic,
} from "@/components/organisms/PDP/SecondHandCharacteristic/getComponentFromCharacteristic";
import { ProductVariantJsonldShopProductVariantRead } from "@/networking/sylius-api-client/.ts.schemas";
import { useTranslation } from "@/utils/next-utils";
import { lowerCaseFirstLetterIfNotAcronym } from "@/utils/stringUtils";

import styles from "./SecondHandTabContent.module.scss";

const isVariantWithQuantity = (
  variant: ProductVariantJsonldShopProductVariantRead,
): variant is ProductVariantJsonldShopProductVariantRead & {
  numberOfBottles: number;
} => typeof variant.numberOfBottles === "number";

const getIsChildNull = (children: JSX.Element | null) => {
  return children === null || renderToStaticMarkup(children) === "";
};

export const SecondHandTabContent = ({
  productVariant,
}: {
  productVariant: ProductVariantJsonldShopProductVariantRead;
}): JSX.Element => {
  const { t } = useTranslation();

  const characteristics: DetailedCharacteristic[] = [
    {
      getName: () => t("acheter-vin:detailedInformation.characteristics.quantity"),
      getValue: variant =>
        isVariantWithQuantity(variant)
          ? t(`common:enum.format.${variant.format ?? "BOUTEILLE"}`, {
              count: variant.numberOfBottles,
            })
          : null,
    },
    {
      getComponent: variant => (
        <ObservationsCharacteristic
          productVariant={variant}
          limit={4}
          classNames={{
            item: styles.secondHandTabItem,
            characteristic: styles.secondHandTabCharacteristic,
          }}
        />
      ),
    },
    {
      getComponent: variant => (
        <LevelsCharacteristic
          productVariant={variant}
          limit={4}
          classNames={{
            item: styles.secondHandTabItem,
            characteristic: styles.secondHandTabCharacteristic,
          }}
        />
      ),
    },
    {
      getName: () => t(`acheter-vin:detailedInformation.characteristics.origin`),
      getValue: variant =>
        typeof variant.origin === "string"
          ? lowerCaseFirstLetterIfNotAcronym(t(`acheter-vin:enum.origin.${variant.origin}`))
          : null,
    },
    {
      getName: () => t(`acheter-vin:detailedInformation.characteristics.VATRecoverable`),
      getValue: variant =>
        typeof variant.VATRecoverable === "boolean"
          ? lowerCaseFirstLetterIfNotAcronym(t(`enums:boolean.${variant.VATRecoverable}`))
          : null,
    },
    {
      getName: () => t(`acheter-vin:detailedInformation.characteristics.region`),
      getValue: variant =>
        typeof variant.product?.region?.name === "string"
          ? t(`enums:region.${variant.product.region.name}`)
          : null,
    },
    {
      getName: () => t(`acheter-vin:detailedInformation.characteristics.appellation`),
      getValue: variant => variant.product?.appellation ?? null,
    },
    {
      getName: () => t(`acheter-vin:detailedInformation.characteristics.classification`),
      getValue: variant =>
        typeof variant.product?.classification === "string"
          ? t(`acheter-vin:enum.classification.${variant.product.classification}`)
          : null,
    },
    {
      getName: () => t(`acheter-vin:detailedInformation.characteristics.owner`),
      getValue: variant => variant.product?.owner ?? null,
    },
    {
      getComponent: variant => (
        <RemarkCharacteristic
          productVariant={variant}
          classNames={{
            item: styles.secondHandTabItem,
            characteristic: styles.secondHandTabCharacteristic,
          }}
        />
      ),
    },
  ];

  const characteristicsComponents = characteristics
    .map(characteristic => getComponentFromCharacteristic(characteristic, productVariant, t))
    .filter(elem => elem !== null);

  return (
    <>
      <div className={styles.container}>
        {characteristicsComponents.map((elem, index) => {
          const isFirstChild = index === 0;
          const isChildNull = getIsChildNull(elem);

          return (
            <Fragment key={index}>
              {!isFirstChild && !isChildNull ? <span className={styles.separator} /> : null}
              {elem}
            </Fragment>
          );
        })}
      </div>
      <a href="#detailed-informations-section" className={styles.link}>
        {t(`common:common.learnMore`)}
      </a>
    </>
  );
};

export default SecondHandTabContent;
