import TranslatableLink from "@/components/atoms/TranslatableLink/TranslatableLink";
import {
  ProductJsonldShopProductVariantRead,
  ProductJsonldShopProductVintageRatingInfoDtoRead,
} from "@/networking/sylius-api-client/.ts.schemas";
import { useTranslation } from "@/utils/next-utils";
import { lowerCaseFirstLetterIfNotAcronym } from "@/utils/stringUtils";

import styles from "./DetailedCharacteristics.module.scss";

export const BiologicProfileCharacteristic = ({
  product,
  classNames,
}: {
  product: ProductJsonldShopProductVariantRead | ProductJsonldShopProductVintageRatingInfoDtoRead;
  classNames?: {
    item?: string;
    characteristic?: string;
  };
}): JSX.Element => {
  const { t } = useTranslation();

  const value =
    typeof product.biologicProfile === "string"
      ? t(`enums:biologicProfile.${product.biologicProfile}`)
      : null;

  if (value === null) {
    return <></>;
  }

  return (
    <div className={classNames?.item ?? styles.item}>
      <span className={classNames?.characteristic ?? styles.characteristic}>
        {t(`acheter-vin:detailedInformation.characteristics.biologicProfile`)}
      </span>{" "}
      <span>{lowerCaseFirstLetterIfNotAcronym(value)}</span>{" "}
      <TranslatableLink href="BIOLOGIC_PROFILE_URL" className={styles.link}>
        {t(`common:common.learnMore`)}
      </TranslatableLink>
    </div>
  );
};
