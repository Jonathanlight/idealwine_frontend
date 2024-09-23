import { faCircleCheck } from "@fortawesome/pro-light-svg-icons/faCircleCheck";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ProductVariantJsonldShopProductVariantRead } from "@/networking/sylius-api-client/.ts.schemas";
import { useTranslation } from "@/utils/next-utils";

import styles from "./ProductVariantAssuranceBanner.module.scss";

export const ProductVariantAssuranceBanner = ({
  productVariant,
}: {
  productVariant: ProductVariantJsonldShopProductVariantRead;
}): JSX.Element => {
  const { t } = useTranslation();

  const getAssuranceText = (variant: ProductVariantJsonldShopProductVariantRead): string => {
    if (!variant.secondHand) {
      return t(`acheter-vin:assurance.new`);
    }

    if (variant.appraisedBy?.name === undefined) {
      return t(`acheter-vin:assurance.secondHand.withoutExpert`);
    }

    const nameParts = variant.appraisedBy.name.split(" ");
    nameParts.pop();

    return t(`acheter-vin:assurance.secondHand.withExpert`, {
      name: nameParts.join("-"),
    });
  };

  const assurance = getAssuranceText(productVariant);

  return (
    <div className={styles.banner}>
      <span className={styles.icon}>
        <FontAwesomeIcon icon={faCircleCheck} />
      </span>
      {assurance}
    </div>
  );
};

export default ProductVariantAssuranceBanner;
